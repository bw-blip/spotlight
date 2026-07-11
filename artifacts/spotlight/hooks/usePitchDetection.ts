import { useEffect, useRef, useState, useCallback } from "react";
import { Platform } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export interface PitchResult {
  note: string | null;
  octave: number | null;
  frequency: number | null;
  fullNote: string | null;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function frequencyToNote(frequency: number): { note: string; octave: number } | null {
  if (frequency <= 60 || frequency > 2000) return null;
  const midiNum = 12 * Math.log2(frequency / 440) + 69;
  const rounded = Math.round(midiNum);
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = Math.floor(rounded / 12) - 1;
  if (octave < 1 || octave > 7) return null;
  return { note: NOTE_NAMES[noteIndex], octave };
}

function autocorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);

  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  let best_offset = -1;
  let best_correlation = 0;
  let last_correlation = 1;
  let found = false;

  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    correlation = 1 - correlation / MAX_SAMPLES;

    if (correlation > 0.9 && correlation > last_correlation) {
      found = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (found) {
      const shift =
        (last_correlation - correlation) /
        (2 * (last_correlation - 2 * best_correlation + correlation));
      return sampleRate / (best_offset + shift);
    }
    last_correlation = correlation;
  }

  if (best_correlation > 0.01 && best_offset > 0) {
    return sampleRate / best_offset;
  }
  return -1;
}

const B64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const B64_LOOKUP: Record<string, number> = {};
for (let i = 0; i < B64_CHARS.length; i++) B64_LOOKUP[B64_CHARS[i]] = i;

function decodeBase64(base64: string): string {
  const clean = base64.replace(/[^A-Za-z0-9+/]/g, "");
  const parts: string[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const c0 = B64_LOOKUP[clean[i]] ?? 0;
    const c1 = B64_LOOKUP[clean[i + 1]] ?? 0;
    const c2 = B64_LOOKUP[clean[i + 2]] ?? 0;
    const c3 = B64_LOOKUP[clean[i + 3]] ?? 0;
    parts.push(
      String.fromCharCode(
        (c0 << 2) | (c1 >> 4),
        ((c1 & 0xf) << 4) | (c2 >> 2),
        ((c2 & 0x3) << 6) | c3
      )
    );
  }
  const full = parts.join("");
  const padCount = (base64.match(/=+$/) ?? [""])[0].length;
  return padCount > 0 ? full.slice(0, full.length - padCount) : full;
}

function readUint16LE(data: string, offset: number): number {
  return data.charCodeAt(offset) | (data.charCodeAt(offset + 1) << 8);
}

function readUint32LE(data: string, offset: number): number {
  return (
    data.charCodeAt(offset) |
    (data.charCodeAt(offset + 1) << 8) |
    (data.charCodeAt(offset + 2) << 16) |
    (data.charCodeAt(offset + 3) << 24)
  );
}

function findChunk(binary: string, name: string): { dataOffset: number; size: number } | null {
  for (let i = 12; i < Math.min(binary.length - 8, 512); i++) {
    if (binary.slice(i, i + 4) === name) {
      return { dataOffset: i + 8, size: readUint32LE(binary, i + 4) };
    }
  }
  return null;
}

async function analyzeWavFile(uri: string): Promise<number> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const binary = decodeBase64(base64);

  if (binary.length < 44 || binary.slice(0, 4) !== "RIFF") return -1;

  const fmt = findChunk(binary, "fmt ");
  if (!fmt) return -1;
  const sampleRate = readUint32LE(binary, fmt.dataOffset + 4);
  const bitsPerSample = readUint16LE(binary, fmt.dataOffset + 14);
  if (bitsPerSample !== 16) return -1;

  const data = findChunk(binary, "data");
  if (!data) return -1;

  const numSamples = Math.floor((binary.length - data.dataOffset) / 2);
  if (numSamples < 256) return -1;

  const useCount = Math.min(numSamples, 4096);
  const samples = new Float32Array(useCount);
  for (let i = 0; i < useCount; i++) {
    let s = readUint16LE(binary, data.dataOffset + i * 2);
    if (s >= 32768) s -= 65536;
    samples[i] = s / 32768;
  }

  return autocorrelate(samples, sampleRate);
}

const IOS_PCM_OPTIONS: Audio.RecordingOptions = {
  ios: {
    extension: ".wav",
    outputFormat: Audio.IOSOutputFormat.LINEARPCM,
    audioQuality: Audio.IOSAudioQuality.MAX,
    sampleRate: 22050,
    numberOfChannels: 1,
    bitRate: 705600,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  android: {
    extension: ".3gp",
    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
    sampleRate: 22050,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  web: { mimeType: "audio/webm", bitsPerSecond: 128000 },
};

const CHUNK_MS = 250;

async function nativePitchLoop(
  onResult: (pitch: PitchResult) => void,
  onError: (msg: string) => void,
  onPermission: (granted: boolean) => void,
  cancelledRef: React.MutableRefObject<boolean>
): Promise<void> {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    if (cancelledRef.current) return;
    if (status !== "granted") {
      onPermission(false);
      onError("Microphone access was denied. Please allow mic access in Settings.");
      return;
    }
    onPermission(true);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  } catch (err: unknown) {
    if (!cancelledRef.current) {
      onPermission(false);
      onError(err instanceof Error ? err.message : "Could not start microphone");
    }
    return;
  }

  while (!cancelledRef.current) {
    let recording: Audio.Recording | null = null;
    try {
      const { recording: rec } = await Audio.Recording.createAsync(IOS_PCM_OPTIONS);
      recording = rec;
      await new Promise<void>((res) => setTimeout(res, CHUNK_MS));

      if (cancelledRef.current) {
        await recording.stopAndUnloadAsync();
        break;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recording = null;

      if (uri) {
        const freq = await analyzeWavFile(uri);
        await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});

        if (!cancelledRef.current) {
          if (freq > 0) {
            const noteInfo = frequencyToNote(freq);
            onResult(
              noteInfo
                ? {
                    note: noteInfo.note,
                    octave: noteInfo.octave,
                    frequency: Math.round(freq),
                    fullNote: `${noteInfo.note}${noteInfo.octave}`,
                  }
                : { note: null, octave: null, frequency: null, fullNote: null }
            );
          } else {
            onResult({ note: null, octave: null, frequency: null, fullNote: null });
          }
        }
      }
    } catch {
      if (recording !== null) {
        try {
          await recording.stopAndUnloadAsync();
        } catch {
        }
      }
      onResult({ note: null, octave: null, frequency: null, fullNote: null });
      await new Promise<void>((res) => setTimeout(res, 300));
    }
  }
}

function webPitchLoop(
  onResult: (pitch: PitchResult) => void,
  onError: (msg: string) => void,
  onPermission: (granted: boolean) => void,
  cancelledRef: React.MutableRefObject<boolean>
): () => void {
  let stream: MediaStream | null = null;
  let audioCtx: AudioContext | null = null;
  let rafId: number | null = null;

  function cleanup() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    stream?.getTracks().forEach((t) => t.stop());
    audioCtx?.close().catch(() => {});
  }

  (async () => {
    try {
      if (!navigator?.mediaDevices) {
        onError("Microphone not supported in this browser");
        onPermission(false);
        return;
      }
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      if (cancelledRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      onPermission(true);

      const AudioCtxClass =
        window.AudioContext ??
        ((window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
      if (!AudioCtxClass) {
        onError("AudioContext not available");
        return;
      }

      audioCtx = new AudioCtxClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      audioCtx.createMediaStreamSource(stream).connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);

      function tick() {
        if (cancelledRef.current) return;
        rafId = requestAnimationFrame(tick);
        analyser.getFloatTimeDomainData(buffer);
        const freq = autocorrelate(buffer, audioCtx!.sampleRate);
        if (freq > 0) {
          const noteInfo = frequencyToNote(freq);
          onResult(
            noteInfo
              ? {
                  note: noteInfo.note,
                  octave: noteInfo.octave,
                  frequency: Math.round(freq),
                  fullNote: `${noteInfo.note}${noteInfo.octave}`,
                }
              : { note: null, octave: null, frequency: null, fullNote: null }
          );
        } else {
          onResult({ note: null, octave: null, frequency: null, fullNote: null });
        }
      }
      tick();
    } catch (err: unknown) {
      if (!cancelledRef.current) {
        onPermission(false);
        onError(err instanceof Error ? err.message : "Microphone access denied");
      }
    }
  })();

  return cleanup;
}

const EMPTY_PITCH: PitchResult = {
  note: null,
  octave: null,
  frequency: null,
  fullNote: null,
};

export type PitchPlatformSupport = "full" | "unsupported";

export function getPitchPlatformSupport(): PitchPlatformSupport {
  if (Platform.OS === "web" || Platform.OS === "ios") return "full";
  return "unsupported";
}

export function usePitchDetection(active: boolean) {
  const [pitch, setPitch] = useState<PitchResult>(EMPTY_PITCH);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const cancelledRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  useEffect(() => {
    if (!active) {
      stop();
      setPitch(EMPTY_PITCH);
      return;
    }

    cancelledRef.current = false;

    if (Platform.OS === "web") {
      const cleanup = webPitchLoop(
        (p) => { if (!cancelledRef.current) setPitch(p); },
        (msg) => { if (!cancelledRef.current) setError(msg); },
        (granted) => { if (!cancelledRef.current) setHasPermission(granted); },
        cancelledRef
      );
      cleanupRef.current = cleanup;
    } else if (Platform.OS === "ios") {
      setHasPermission(null);
      setError(null);
      nativePitchLoop(
        (p) => { if (!cancelledRef.current) setPitch(p); },
        (msg) => { if (!cancelledRef.current) setError(msg); },
        (granted) => { if (!cancelledRef.current) setHasPermission(granted); },
        cancelledRef
      ).catch((err: unknown) => {
        if (!cancelledRef.current)
          setError(err instanceof Error ? err.message : "Microphone error");
      });
    }

    return () => stop();
  }, [active, stop]);

  return { pitch, error, hasPermission };
}
