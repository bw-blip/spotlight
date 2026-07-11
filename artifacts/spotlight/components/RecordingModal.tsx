import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import type { Exercise } from "@/services/curriculum";
import type { CameraView } from "expo-camera";
import type { Audio, Video, ResizeMode } from "expo-av";

interface RecordingResult {
  score: number;
  tips: string[];
}

interface RecordingModalProps {
  visible: boolean;
  exercise: Exercise | null;
  categoryColor: string;
  grade: string;
  onClose: () => void;
  onSaveResult: (result: RecordingResult) => void;
}

type RecordingState = "idle" | "recording" | "processing" | "result";
type RecordingMode = "audio" | "video";

type AudioRecording = InstanceType<typeof Audio.Recording>;

type CameraHandle = Pick<CameraView, "recordAsync" | "stopRecording">;

const VIDEO_CATEGORIES = ["movement", "acting"];

export function RecordingModal({
  visible,
  exercise,
  categoryColor,
  grade,
  onClose,
  onSaveResult,
}: RecordingModalProps) {
  const colors = useColors();
  const [state, setState] = useState<RecordingState>("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [result, setResult] = useState<RecordingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<RecordingMode>("audio");
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const audioRecordingRef = useRef<AudioRecording | null>(null);
  const cameraRef = useRef<CameraHandle | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) {
      resetState();
    } else if (exercise) {
      const defaultMode: RecordingMode = VIDEO_CATEGORIES.includes(exercise.categoryId)
        ? "video"
        : "audio";
      setMode(defaultMode);
    }
  }, [visible, exercise]);

  useEffect(() => {
    if (mode === "video" && visible && Platform.OS !== "web") {
      requestCameraPermission();
    }
  }, [mode, visible]);

  async function requestCameraPermission() {
    try {
      const { Camera } = await import("expo-camera");
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    } catch {
      setCameraPermission(false);
    }
  }

  function resetState() {
    setState("idle");
    setRecordingSeconds(0);
    setResult(null);
    setErrorMsg(null);
    setVideoUri(null);
    setIsCameraReady(false);
    if (timerRef.current) clearInterval(timerRef.current);
    audioRecordingRef.current = null;
  }

  function startTimer() {
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  }

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function startRecording() {
    try {
      if (Platform.OS === "web") {
        startWebRecording();
        return;
      }
      if (mode === "video") {
        await startVideoRecording();
      } else {
        await startAudioRecording();
      }
    } catch {
      setErrorMsg("Could not start recording. Try again.");
    }
  }

  async function startAudioRecording() {
    const { Audio: AV } = await import("expo-av");
    const permission = await AV.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Microphone needed",
        "Please allow microphone access to record your performance."
      );
      return;
    }
    await AV.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording } = await AV.Recording.createAsync(
      AV.RecordingOptionsPresets.HIGH_QUALITY
    );
    audioRecordingRef.current = recording;
    setState("recording");
    startTimer();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  async function startVideoRecording() {
    if (!cameraRef.current || !isCameraReady) {
      setErrorMsg("Camera not ready. Try again.");
      return;
    }
    if (cameraPermission === false) {
      Alert.alert("Camera needed", "Please allow camera access to record video.");
      return;
    }

    const { Audio: AV } = await import("expo-av");
    const micPermission = await AV.requestPermissionsAsync();
    if (!micPermission.granted) {
      Alert.alert(
        "Microphone needed",
        "Please allow microphone access so your video includes audio for coaching feedback."
      );
      return;
    }
    await AV.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    setState("recording");
    startTimer();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let capturedUri: string | null = null;
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 120 });
      capturedUri = video?.uri ?? null;
    } catch {
      // recording was stopped or failed — capturedUri stays null
    }

    clearTimer();
    setVideoUri(capturedUri);

    await finishVideoSession(capturedUri);
  }

  function startWebRecording() {
    setState("recording");
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
  }

  async function stopRecording() {
    if (mode === "video" && Platform.OS !== "web") {
      clearTimer();
      setState("processing");
      try {
        cameraRef.current?.stopRecording();
      } catch {
        // ignore — startVideoRecording() handles the post-stop flow
      }
      return;
    }

    clearTimer();
    setState("processing");
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await finishAudioRecording();
  }

  async function finishVideoSession(uri: string | null) {
    let videoBase64 = "";
    if (uri) {
      try {
        const FileSystem = await import("expo-file-system");
        videoBase64 = await FileSystem.readAsStringAsync(uri, {
          encoding: "base64",
        });
      } catch {
        // proceed without video base64; server will score without a transcript
      }
    }
    await sendForScoring(videoBase64, "video");
  }

  async function finishAudioRecording() {
    let audioBase64 = "";
    try {
      if (audioRecordingRef.current) {
        await audioRecordingRef.current.stopAndUnloadAsync();
        const uri = audioRecordingRef.current.getURI();
        if (uri) {
          const FileSystem = await import("expo-file-system");
          audioBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: "base64",
          });
        }
        audioRecordingRef.current = null;
      }
    } catch {
      // proceed without audio
    }
    await sendForScoring(audioBase64, "audio");
  }

  async function sendForScoring(mediaBase64: string, mediaType: "audio" | "video") {
    if (!exercise) return;

    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const url = domain
        ? `https://${domain}/api/coaching/score`
        : "/api/coaching/score";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64: mediaType === "audio" ? mediaBase64 : "",
          videoBase64: mediaType === "video" ? mediaBase64 : "",
          mediaType,
          category: exercise.categoryId,
          grade,
          exerciseName: exercise.name,
          exercisePrompt: exercise.assessmentPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data: RecordingResult = await response.json();
      setResult(data);
      setState("result");
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      setErrorMsg("Couldn't get AI feedback. Check your connection and try again.");
      setState("idle");
    }
  }

  function handleSave() {
    if (result) {
      onSaveResult(result);
      onClose();
    }
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function toggleMode() {
    if (state !== "idle") return;
    const next: RecordingMode = mode === "audio" ? "video" : "audio";
    setMode(next);
    setVideoUri(null);
    setErrorMsg(null);
  }

  if (!exercise) return null;

  const isVideoMode = mode === "video" && Platform.OS !== "web";

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.handleBar}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            Practice Session
          </Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.exerciseInfo,
              { backgroundColor: categoryColor + "15", borderRadius: colors.radius },
            ]}
          >
            <Text
              style={[
                styles.exerciseName,
                { color: categoryColor, fontFamily: "Poppins_700Bold" },
              ]}
            >
              {exercise.name}
            </Text>
            <Text
              style={[
                styles.exerciseInstructions,
                { color: colors.foreground, fontFamily: "Poppins_400Regular" },
              ]}
            >
              {exercise.instructions}
            </Text>
          </View>

          {(state === "idle" || state === "recording") && (
            <View style={styles.recordSection}>
              {state === "idle" && (
                <View style={styles.modeToggle}>
                  <TouchableOpacity
                    onPress={() => mode !== "audio" && toggleMode()}
                    style={[
                      styles.modeBtn,
                      mode === "audio" && { backgroundColor: categoryColor },
                      mode !== "audio" && {
                        backgroundColor: colors.card,
                        borderWidth: 1,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="mic"
                      size={16}
                      color={mode === "audio" ? "#fff" : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.modeBtnText,
                        {
                          color: mode === "audio" ? "#fff" : colors.mutedForeground,
                          fontFamily: "Poppins_600SemiBold",
                        },
                      ]}
                    >
                      Audio
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => mode !== "video" && toggleMode()}
                    style={[
                      styles.modeBtn,
                      mode === "video" && { backgroundColor: categoryColor },
                      mode !== "video" && {
                        backgroundColor: colors.card,
                        borderWidth: 1,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name="videocam"
                      size={16}
                      color={mode === "video" ? "#fff" : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.modeBtnText,
                        {
                          color: mode === "video" ? "#fff" : colors.mutedForeground,
                          fontFamily: "Poppins_600SemiBold",
                        },
                      ]}
                    >
                      Video
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {isVideoMode && cameraPermission === false && (
                <Text
                  style={[
                    styles.promptLabel,
                    { color: colors.destructive, fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  Camera access denied. Please enable it in Settings.
                </Text>
              )}

              {isVideoMode && cameraPermission !== false && (
                <CameraPreview
                  cameraRef={cameraRef as React.RefObject<CameraHandle>}
                  onReady={() => setIsCameraReady(true)}
                  isRecording={state === "recording"}
                />
              )}

              {!isVideoMode && (
                <Text
                  style={[
                    styles.promptLabel,
                    { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  {state === "idle"
                    ? "Record yourself doing this exercise to get AI coaching feedback"
                    : "Recording in progress..."}
                </Text>
              )}

              {state === "recording" && (
                <View style={[styles.timer, { backgroundColor: "#EF4444" + "22" }]}>
                  <View style={styles.recordingDot} />
                  <Text
                    style={[
                      styles.timerText,
                      { color: "#EF4444", fontFamily: "Poppins_700Bold" },
                    ]}
                  >
                    {formatTime(recordingSeconds)}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={state === "idle" ? startRecording : stopRecording}
                activeOpacity={0.85}
                disabled={isVideoMode && state === "idle" && !isCameraReady}
                style={[
                  styles.recordBtn,
                  {
                    backgroundColor:
                      state === "recording" ? "#EF4444" : categoryColor,
                    borderRadius: 50,
                    opacity: isVideoMode && state === "idle" && !isCameraReady ? 0.5 : 1,
                  },
                ]}
              >
                <Ionicons
                  name={
                    state === "recording"
                      ? "stop"
                      : isVideoMode
                      ? "videocam"
                      : "mic"
                  }
                  size={32}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.recordHint,
                  { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
                ]}
              >
                {state === "idle"
                  ? isVideoMode
                    ? "Tap to start video recording"
                    : "Tap to start recording"
                  : "Tap to stop and get feedback"}
              </Text>

              {errorMsg && state === "idle" && (
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {errorMsg}
                </Text>
              )}
            </View>
          )}

          {state === "processing" && (
            <View style={styles.processingSection}>
              <ActivityIndicator size="large" color={categoryColor} />
              <Text
                style={[
                  styles.processingText,
                  { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                Your coach is reviewing...
              </Text>
              <Text
                style={[
                  styles.processingSubText,
                  { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
                ]}
              >
                Hang tight!
              </Text>
            </View>
          )}

          {state === "result" && result && (
            <View style={styles.resultSection}>
              {videoUri && Platform.OS !== "web" && (
                <VideoPlayback uri={videoUri} categoryColor={categoryColor} />
              )}

              <View
                style={[
                  styles.scoreCard,
                  { backgroundColor: categoryColor + "15", borderRadius: colors.radius },
                ]}
              >
                <Text
                  style={[
                    styles.scoreLabel,
                    { color: categoryColor, fontFamily: "Poppins_600SemiBold" },
                  ]}
                >
                  Your Score
                </Text>
                <Text
                  style={[
                    styles.scoreNumber,
                    { color: categoryColor, fontFamily: "Poppins_700Bold" },
                  ]}
                >
                  {result.score.toFixed(1)}
                  <Text style={styles.scoreMax}>/10</Text>
                </Text>
              </View>

              <Text
                style={[
                  styles.tipsLabel,
                  { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                Coach's Tips
              </Text>

              {result.tips.map((tip, i) => (
                <View
                  key={i}
                  style={[
                    styles.tipRow,
                    { backgroundColor: colors.card, borderRadius: colors.radius - 4 },
                  ]}
                >
                  <View style={[styles.tipNum, { backgroundColor: categoryColor }]}>
                    <Text style={styles.tipNumText}>{i + 1}</Text>
                  </View>
                  <Text
                    style={[
                      styles.tipText,
                      { color: colors.foreground, fontFamily: "Poppins_400Regular" },
                    ]}
                  >
                    {tip}
                  </Text>
                </View>
              ))}

              {errorMsg && (
                <Text style={[styles.errorText, { color: colors.destructive }]}>
                  {errorMsg}
                </Text>
              )}

              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.85}
                style={[
                  styles.saveBtn,
                  { backgroundColor: categoryColor, borderRadius: colors.radius },
                ]}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={[styles.saveBtnText, { fontFamily: "Poppins_600SemiBold" }]}>
                  Save & Complete Exercise
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

type CameraViewForwardRef = React.ForwardRefExoticComponent<
  React.ComponentProps<typeof CameraView> & React.RefAttributes<CameraView>
>;

function CameraPreview({
  cameraRef,
  onReady,
  isRecording,
}: {
  cameraRef: React.RefObject<CameraHandle>;
  onReady: () => void;
  isRecording: boolean;
}) {
  const [CameraViewComp, setCameraViewComp] =
    React.useState<CameraViewForwardRef | null>(null);

  React.useEffect(() => {
    import("expo-camera").then((mod) => {
      setCameraViewComp(() => mod.CameraView as unknown as CameraViewForwardRef);
    });
  }, []);

  if (!CameraViewComp) return null;

  return (
    <View style={styles.cameraContainer}>
      <CameraViewComp
        ref={cameraRef as React.RefObject<CameraView>}
        style={styles.camera}
        facing="front"
        mode="video"
        onCameraReady={onReady}
      />
      {isRecording && (
        <View style={styles.cameraRecordingBadge}>
          <View style={styles.cameraRecordingDot} />
          <Text style={styles.cameraRecordingText}>REC</Text>
        </View>
      )}
    </View>
  );
}

function VideoPlayback({
  uri,
  categoryColor,
}: {
  uri: string;
  categoryColor: string;
}) {
  const [VideoComp, setVideoComp] = React.useState<
    React.ComponentType<React.ComponentProps<typeof Video>> | null
  >(null);
  const [resizeMode, setResizeMode] = React.useState<typeof ResizeMode | null>(null);

  React.useEffect(() => {
    import("expo-av").then((mod) => {
      setVideoComp(
        () => mod.Video as React.ComponentType<React.ComponentProps<typeof Video>>
      );
      setResizeMode(mod.ResizeMode);
    });
  }, []);

  if (!VideoComp || !resizeMode) return null;

  return (
    <View style={styles.videoContainer}>
      <Text
        style={[
          styles.videoLabel,
          { color: categoryColor, fontFamily: "Poppins_600SemiBold" },
        ]}
      >
        Your Recording
      </Text>
      <VideoComp
        source={{ uri }}
        style={styles.video}
        useNativeControls
        resizeMode={resizeMode.CONTAIN}
        isLooping={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  handleBar: { alignItems: "center", paddingTop: 12 },
  handle: { width: 36, height: 4, borderRadius: 2 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 16 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 20, paddingBottom: 40 },
  exerciseInfo: { padding: 16, gap: 10 },
  exerciseName: { fontSize: 20 },
  exerciseInstructions: { fontSize: 14, lineHeight: 22 },
  recordSection: { alignItems: "center", gap: 16, paddingVertical: 16 },
  modeToggle: { flexDirection: "row", gap: 10 },
  modeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeBtnText: { fontSize: 13 },
  promptLabel: { fontSize: 14, textAlign: "center", paddingHorizontal: 16 },
  cameraContainer: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  camera: { flex: 1 },
  cameraRecordingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  cameraRecordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  cameraRecordingText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins_700Bold",
    letterSpacing: 1,
  },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  timerText: { fontSize: 22 },
  recordBtn: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  recordHint: { fontSize: 13 },
  processingSection: { alignItems: "center", gap: 16, paddingVertical: 40 },
  processingText: { fontSize: 18 },
  processingSubText: { fontSize: 14 },
  resultSection: { gap: 14 },
  videoContainer: { gap: 8 },
  videoLabel: { fontSize: 14 },
  video: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    backgroundColor: "#000",
  },
  scoreCard: { padding: 24, alignItems: "center", gap: 4 },
  scoreLabel: { fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 },
  scoreNumber: { fontSize: 56, lineHeight: 64 },
  scoreMax: { fontSize: 24 },
  tipsLabel: { fontSize: 16, marginTop: 4 },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
  },
  tipNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipNumText: { color: "#fff", fontSize: 12, fontFamily: "Poppins_700Bold" },
  tipText: { flex: 1, fontSize: 14, lineHeight: 21 },
  errorText: { fontSize: 13, textAlign: "center" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: 4,
  },
  saveBtnText: { color: "#fff", fontSize: 16 },
});
