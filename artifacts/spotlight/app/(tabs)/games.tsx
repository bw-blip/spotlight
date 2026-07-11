import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { usePitchDetection, getPitchPlatformSupport } from "@/hooks/usePitchDetection";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

const GAME_NOTES = ["C", "E", "G", "A", "D", "F", "B", "G", "A", "C"] as const;
const NOTE_DURATION = 4000;
const HIT_HOLD_MS = 600;
const TOTAL_ROUNDS = 10;

const NOTE_COLORS: Record<string, string> = {
  C: "#E63F6E",
  D: "#F5A623",
  E: "#4CAF50",
  F: "#2196F3",
  G: "#9C27B0",
  A: "#FF5722",
  B: "#00BCD4",
};

const ENCOURAGEMENTS = [
  "Amazing!",
  "You nailed it!",
  "Perfect pitch!",
  "Brilliant!",
  "Spot on!",
];

type GameState = "idle" | "playing" | "done";

function getEncouragement(score: number): string {
  if (score === TOTAL_ROUNDS) return "Perfect score! You're a star! ⭐";
  if (score >= 8) return "Incredible! Almost perfect!";
  if (score >= 6) return "Great work! Keep practicing!";
  if (score >= 4) return "Good effort! You're improving!";
  return "Keep trying — you'll get it!";
}

const HOW_TO_ITEMS: Array<{ icon: IoniconsName; text: string }> = [
  { icon: "musical-note", text: "A target note appears on screen" },
  { icon: "mic", text: "Sing or hum that note into the mic" },
  { icon: "happy", text: "Hit it — the frog jumps!" },
  { icon: "trophy", text: "Score as many notes as you can in 10 rounds" },
];

function AndroidUnsupportedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = 0;
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary + "18", "transparent"]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.idleContent,
          { paddingTop: insets.top + topInset + 20, paddingBottom: insets.bottom + 40 },
        ]}
      >
        <Text style={styles.frogEmoji}>🐸</Text>
        <Text style={[styles.idleTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
          Pitch Jump
        </Text>
        <Text style={[styles.idleSub, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
          Coming soon on Android
        </Text>
        <View style={[styles.howToCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Ionicons name="information-circle-outline" size={24} color={colors.mutedForeground} />
          <Text
            style={[
              styles.howToText,
              { color: colors.mutedForeground, fontFamily: "Poppins_400Regular", textAlign: "center" },
            ]}
          >
            Real-time pitch detection requires audio streaming APIs that are not yet available on Android.
            Play on iOS or the web version for the full game experience.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function GamesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : 0;
  const platformSupported = getPitchPlatformSupport() === "full";

  const [gameState, setGameState] = useState<GameState>("idle");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(NOTE_DURATION);
  const [lastResult, setLastResult] = useState<"hit" | "miss" | null>(null);
  const [flashMsg, setFlashMsg] = useState("");

  const hitLockRef = useRef(false);
  const gameActiveRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const roundRef = useRef(round);
  roundRef.current = round;

  const isPlaying = gameState === "playing";
  const { pitch, error } = usePitchDetection(isPlaying);

  const jumpAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const noteScaleAnim = useRef(new Animated.Value(1)).current;

  function safeTimeout(fn: () => void, ms: number): ReturnType<typeof setTimeout> {
    const id = setTimeout(() => {
      pendingTimeoutsRef.current.delete(id);
      fn();
    }, ms);
    pendingTimeoutsRef.current.add(id);
    return id;
  }

  function clearAllTimers() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    pendingTimeoutsRef.current.forEach(clearTimeout);
    pendingTimeoutsRef.current.clear();
  }

  function doJump() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(jumpAnim, {
          toValue: -110,
          duration: 230,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.25,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(jumpAnim, {
          toValue: 0,
          friction: 5,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }

  function pulseNote() {
    noteScaleAnim.setValue(1.3);
    Animated.spring(noteScaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }

  const advanceRound = useCallback((currentRound: number) => {
    if (!gameActiveRef.current) return;

    clearAllTimers();
    hitLockRef.current = false;
    const nextRound = currentRound + 1;

    if (nextRound >= TOTAL_ROUNDS) {
      gameActiveRef.current = false;
      setGameState("done");
      return;
    }

    setRound(nextRound);
    setTimeLeft(NOTE_DURATION);
    setLastResult(null);
    pulseNote();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 100));
    }, 100);

    safeTimeout(() => {
      if (!gameActiveRef.current) return;
      setLastResult("miss");
      safeTimeout(() => advanceRound(nextRound), 500);
    }, NOTE_DURATION);
  }, []);

  function startGame() {
    clearAllTimers();
    hitLockRef.current = false;
    gameActiveRef.current = true;
    setScore(0);
    setRound(0);
    setTimeLeft(NOTE_DURATION);
    setLastResult(null);
    setGameState("playing");
    pulseNote();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 100));
    }, 100);

    safeTimeout(() => {
      if (!gameActiveRef.current) return;
      setLastResult("miss");
      safeTimeout(() => advanceRound(0), 500);
    }, NOTE_DURATION);
  }

  function stopGame() {
    gameActiveRef.current = false;
    clearAllTimers();
    setGameState("idle");
  }

  useEffect(() => {
    return () => {
      gameActiveRef.current = false;
      clearAllTimers();
    };
  }, []);

  const targetNote = GAME_NOTES[round] ?? "C";
  const noteColor = NOTE_COLORS[targetNote] ?? colors.primary;

  useEffect(() => {
    if (!isPlaying || hitLockRef.current || !gameActiveRef.current) return;
    if (!pitch.note) return;

    if (pitch.note === targetNote) {
      hitLockRef.current = true;
      const idx = Math.floor(Math.random() * ENCOURAGEMENTS.length);
      setFlashMsg(ENCOURAGEMENTS[idx]);
      setScore((s) => s + 1);
      setLastResult("hit");
      doJump();

      flashAnim.setValue(1);
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();

      clearAllTimers();
      safeTimeout(() => advanceRound(roundRef.current), HIT_HOLD_MS);
    }
  }, [pitch.note, isPlaying, targetNote, advanceRound]);

  if (!platformSupported) {
    return <AndroidUnsupportedScreen />;
  }

  const timeProgress = timeLeft / NOTE_DURATION;

  const progressColor =
    timeProgress > 0.6 ? "#4CAF50" : timeProgress > 0.3 ? "#FF9800" : "#EF4444";

  if (gameState === "idle") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.primary + "18", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.idleContent,
            {
              paddingTop: insets.top + topInset + 20,
              paddingBottom: insets.bottom + 40,
            },
          ]}
        >
          <Text style={[styles.idleTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
            Pitch Jump
          </Text>
          <Text style={[styles.idleSub, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
            Sing the note to make the frog leap!
          </Text>

          <Text style={styles.frogEmoji}>🐸</Text>

          <View style={[styles.howToCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <Text style={[styles.howToTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
              How to play
            </Text>
            {HOW_TO_ITEMS.map(({ icon, text }) => (
              <View key={text} style={styles.howToRow}>
                <Ionicons name={icon} size={18} color={colors.primary} />
                <Text style={[styles.howToText, { color: colors.foreground, fontFamily: "Poppins_400Regular" }]}>
                  {text}
                </Text>
              </View>
            ))}
          </View>

          {error && (
            <View style={[styles.errorBanner, { backgroundColor: colors.destructive + "18" }]}>
              <Ionicons name="warning-outline" size={16} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.destructive, fontFamily: "Poppins_400Regular" }]}>
                {error}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={startGame}
            activeOpacity={0.85}
            style={[styles.startBtn, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={[styles.startBtnText, { fontFamily: "Poppins_700Bold" }]}>
              Start Game
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (gameState === "done") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.accent + "22", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.idleContent,
            {
              paddingTop: insets.top + topInset + 20,
              paddingBottom: insets.bottom + 40,
            },
          ]}
        >
          <Text style={styles.trophyEmoji}>🏆</Text>
          <Text style={[styles.idleTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
            Round Complete!
          </Text>

          <View style={[styles.scoreCircle, { borderColor: colors.primary }]}>
            <Text style={[styles.scoreCircleNum, { color: colors.primary, fontFamily: "Poppins_700Bold" }]}>
              {score}
            </Text>
            <Text style={[styles.scoreCircleDen, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
              / {TOTAL_ROUNDS}
            </Text>
          </View>

          <Text style={[styles.encouragement, { color: colors.foreground, fontFamily: "Poppins_600SemiBold" }]}>
            {getEncouragement(score)}
          </Text>

          <View style={[styles.scoreSummary, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            {[
              { label: "Notes Hit", value: String(score), color: "#4CAF50" },
              { label: "Notes Missed", value: String(TOTAL_ROUNDS - score), color: colors.destructive },
              {
                label: "Accuracy",
                value: `${Math.round((score / TOTAL_ROUNDS) * 100)}%`,
                color: colors.primary,
              },
            ].map(({ label, value, color }) => (
              <View key={label} style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
                  {label}
                </Text>
                <Text style={[styles.summaryValue, { color, fontFamily: "Poppins_700Bold" }]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={startGame}
            activeOpacity={0.85}
            style={[styles.startBtn, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={[styles.startBtnText, { fontFamily: "Poppins_700Bold" }]}>
              Play Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGameState("idle")}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            <Text style={[styles.backBtnText, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
              Back to Menu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: lastResult === "hit" ? "#4CAF50" : "#EF4444",
            opacity: flashAnim,
          },
        ]}
        pointerEvents="none"
      />

      <View
        style={[
          styles.playHeader,
          {
            paddingTop: insets.top + topInset + 12,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={stopGame} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={24} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.roundText, { color: colors.foreground, fontFamily: "Poppins_600SemiBold" }]}>
          {round + 1} / {TOTAL_ROUNDS}
        </Text>
        <View style={[styles.scorePill, { backgroundColor: colors.primary + "20" }]}>
          <Ionicons name="star" size={13} color={colors.primary} />
          <Text style={[styles.scorePillText, { color: colors.primary, fontFamily: "Poppins_700Bold" }]}>
            {score}
          </Text>
        </View>
      </View>

      <View style={styles.timerBarWrap}>
        <View style={[styles.timerBarBg, { backgroundColor: colors.border }]}>
          <View style={styles.timerBarRow}>
            <View style={[styles.timerBarFill, { flex: timeProgress, backgroundColor: progressColor }]} />
            <View style={{ flex: 1 - timeProgress }} />
          </View>
        </View>
      </View>

      <View style={styles.playContent}>
        <Text style={[styles.singLabel, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
          Sing this note:
        </Text>

        <Animated.View
          style={[
            styles.noteCircle,
            {
              backgroundColor: noteColor + "22",
              borderColor: noteColor,
              transform: [{ scale: noteScaleAnim }],
            },
          ]}
        >
          <Text style={[styles.noteLetter, { color: noteColor, fontFamily: "Poppins_700Bold" }]}>
            {targetNote}
          </Text>
        </Animated.View>

        {lastResult === "hit" && (
          <Text style={[styles.flashMsg, { color: "#4CAF50", fontFamily: "Poppins_700Bold" }]}>
            {flashMsg}
          </Text>
        )}
        {lastResult === "miss" && (
          <Text style={[styles.flashMsg, { color: colors.destructive, fontFamily: "Poppins_700Bold" }]}>
            Missed!
          </Text>
        )}
        {lastResult === null && <View style={styles.flashMsgPlaceholder} />}

        <View style={styles.frogStage}>
          <Animated.Text
            style={[
              styles.frogPlay,
              {
                transform: [
                  { translateY: jumpAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            🐸
          </Animated.Text>
          <View style={[styles.shadow, { backgroundColor: colors.mutedForeground + "30" }]} />
        </View>

        <View style={[styles.detectionCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <View style={styles.detectionRow}>
            <Ionicons
              name={pitch.note ? "mic" : "mic-outline"}
              size={18}
              color={pitch.note ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.detectionLabel,
                { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
              ]}
            >
              {pitch.note ? "Detected:" : "Listening..."}
            </Text>
            {pitch.note !== null && (
              <Text
                style={[
                  styles.detectedNote,
                  {
                    color: pitch.note === targetNote ? "#4CAF50" : colors.foreground,
                    fontFamily: "Poppins_700Bold",
                  },
                ]}
              >
                {pitch.note}{pitch.octave}
              </Text>
            )}
          </View>
          {error !== null && (
            <Text style={[styles.errorSmall, { color: colors.destructive, fontFamily: "Poppins_400Regular" }]}>
              {error}
            </Text>
          )}
        </View>

        <View style={styles.dotsRow}>
          {GAME_NOTES.map((n, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i < round
                      ? colors.mutedForeground
                      : i === round
                      ? noteColor
                      : colors.border,
                  opacity: i < round ? 0.4 : 1,
                  transform: [{ scale: i === round ? 1.3 : 1 }],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  idleContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  idleTitle: { fontSize: 32, letterSpacing: -0.5, textAlign: "center" },
  idleSub: { fontSize: 15, textAlign: "center", marginTop: -8 },
  frogEmoji: { fontSize: 80 },
  trophyEmoji: { fontSize: 64 },
  howToCard: {
    width: "100%",
    padding: 18,
    gap: 12,
  },
  howToTitle: { fontSize: 16, marginBottom: 2 },
  howToRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  howToText: { fontSize: 14, flex: 1 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  errorText: { fontSize: 13, flex: 1 },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 4,
  },
  startBtnText: { fontSize: 18, color: "#fff" },
  backBtn: { marginTop: 4 },
  backBtnText: { fontSize: 14 },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
  },
  scoreCircleNum: { fontSize: 44 },
  scoreCircleDen: { fontSize: 20, marginTop: 14 },
  encouragement: { fontSize: 17, textAlign: "center" },
  scoreSummary: { width: "100%", padding: 16, gap: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 16 },
  playHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  roundText: { fontSize: 15 },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scorePillText: { fontSize: 15 },
  timerBarWrap: { paddingHorizontal: 20, paddingTop: 10 },
  timerBarBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  timerBarRow: { flex: 1, flexDirection: "row" },
  timerBarFill: { height: 6, borderRadius: 3 },
  playContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  singLabel: { fontSize: 15 },
  noteCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  noteLetter: { fontSize: 64 },
  flashMsg: { fontSize: 20, minHeight: 30 },
  flashMsgPlaceholder: { height: 30 },
  frogStage: { alignItems: "center", gap: 4, height: 120, justifyContent: "flex-end" },
  frogPlay: { fontSize: 72 },
  shadow: {
    width: 56,
    height: 10,
    borderRadius: 5,
    marginTop: -2,
  },
  detectionCard: {
    padding: 14,
    width: "100%",
    gap: 4,
  },
  detectionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detectionLabel: { fontSize: 13 },
  detectedNote: { fontSize: 18, marginLeft: "auto" },
  errorSmall: { fontSize: 12 },
  dotsRow: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
