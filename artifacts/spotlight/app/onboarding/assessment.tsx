import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  type DimensionValue,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES } from "@/services/curriculum";
import { saveOnboardingResults } from "@/services/storage";

type StepState = "prompt" | "recording" | "processing" | "done";

interface StepResult {
  categoryId: string;
  score: number;
  tips: string[];
}

export default function AssessmentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    name: string;
    grade: string;
    goalDate: string;
  }>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [stepState, setStepState] = useState<StepState>("prompt");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [results, setResults] = useState<StepResult[]>([]);
  const [currentResult, setCurrentResult] = useState<StepResult | null>(null);

  const recordingRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const category = CATEGORIES[currentIndex];
  const progress = (currentIndex / CATEGORIES.length) * 100;

  async function startRecording() {
    try {
      if (Platform.OS === "web") {
        setStepState("recording");
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
        return;
      }
      const { Audio } = await import("expo-av");
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Microphone needed", "Please allow microphone access.");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setStepState("recording");
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      Alert.alert("Error", "Could not start recording. Please try again.");
    }
  }

  async function stopAndScore() {
    if (timerRef.current) clearInterval(timerRef.current);
    setStepState("processing");

    let audioBase64 = "";
    try {
      if (Platform.OS !== "web" && recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        if (uri) {
          const FileSystem = await import("expo-file-system");
          audioBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: "base64",
          });
        }
        recordingRef.current = null;
      }
    } catch {
      // proceed without audio
    }

    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const url = domain
        ? `https://${domain}/api/coaching/score`
        : "/api/coaching/score";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          category: category.id,
          grade: params.grade,
          exerciseName: `Baseline ${category.name} Assessment`,
          exercisePrompt: category.assessmentPrompt,
        }),
      });
      const data = await response.json();
      const result: StepResult = {
        categoryId: category.id,
        score: data.score,
        tips: data.tips,
      };
      setCurrentResult(result);
      setStepState("done");
    } catch {
      const result: StepResult = {
        categoryId: category.id,
        score: 6,
        tips: [
          "Great start!",
          "Keep practicing every day!",
          "You have so much potential!",
        ],
      };
      setCurrentResult(result);
      setStepState("done");
    }
  }

  async function handleNext() {
    const newResults = [...results, currentResult!];
    setResults(newResults);

    if (currentIndex + 1 >= CATEGORIES.length) {
      await saveOnboardingResults(newResults);
      router.push({
        pathname: "/onboarding/results",
        params: {
          name: params.name,
          grade: params.grade,
          goalDate: params.goalDate,
        },
      });
    } else {
      setCurrentIndex(currentIndex + 1);
      setStepState("prompt");
      setRecordingSeconds(0);
      setCurrentResult(null);
    }
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.progressDots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i <= 1 ? colors.primary : colors.border },
              ]}
            />
          ))}
        </View>
        <Text
          style={[
            styles.stepLabel,
            { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
          ]}
        >
          {currentIndex + 1}/{CATEGORIES.length}
        </Text>
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <LinearGradient
          colors={["#E63F6E", "#F5A623"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${progress}%` as DimensionValue }]}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.assessmentTitle,
            { color: colors.mutedForeground, fontFamily: "Poppins_600SemiBold" },
          ]}
        >
          Baseline Assessment
        </Text>

        <View
          style={[
            styles.categoryHeader,
            {
              backgroundColor: category.color + "18",
              borderRadius: colors.radius,
              borderColor: category.color + "44",
            },
          ]}
        >
          <View
            style={[
              styles.catIconWrap,
              { backgroundColor: category.color + "30" },
            ]}
          >
            <Ionicons name={category.icon as any} size={32} color={category.color} />
          </View>
          <Text
            style={[
              styles.catName,
              { color: category.color, fontFamily: "Poppins_700Bold" },
            ]}
          >
            {category.name}
          </Text>
          <Text
            style={[
              styles.catDesc,
              { color: colors.foreground, fontFamily: "Poppins_400Regular" },
            ]}
          >
            {category.assessmentInstructions}
          </Text>
        </View>

        {stepState === "prompt" && (
          <View style={styles.promptSection}>
            <View
              style={[
                styles.promptBubble,
                { backgroundColor: colors.card, borderRadius: colors.radius },
              ]}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={category.color} />
              <Text
                style={[
                  styles.promptText,
                  { color: colors.foreground, fontFamily: "Poppins_400Regular" },
                ]}
              >
                {category.assessmentPrompt}
              </Text>
            </View>
            <TouchableOpacity
              onPress={startRecording}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[category.color, category.color + "CC"]}
                style={[styles.bigBtn, { borderRadius: 50 }]}
              >
                <Ionicons name="mic" size={36} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <Text
              style={[
                styles.tapHint,
                { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
              ]}
            >
              Tap the mic to start recording
            </Text>
          </View>
        )}

        {stepState === "recording" && (
          <View style={styles.promptSection}>
            <View
              style={[
                styles.timerBubble,
                { backgroundColor: "#EF4444" + "18" },
              ]}
            >
              <View style={styles.recDot} />
              <Text
                style={[
                  styles.timerText,
                  { color: "#EF4444", fontFamily: "Poppins_700Bold" },
                ]}
              >
                {formatTime(recordingSeconds)}
              </Text>
            </View>
            <TouchableOpacity onPress={stopAndScore} activeOpacity={0.85}>
              <View style={[styles.bigBtn, { backgroundColor: "#EF4444", borderRadius: 50 }]}>
                <Ionicons name="stop" size={36} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text
              style={[
                styles.tapHint,
                { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
              ]}
            >
              Tap to stop and get your score
            </Text>
          </View>
        )}

        {stepState === "processing" && (
          <View style={styles.processingSection}>
            <ActivityIndicator size="large" color={category.color} />
            <Text
              style={[
                styles.processingText,
                { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
              ]}
            >
              Analyzing your {category.name.toLowerCase()}...
            </Text>
          </View>
        )}

        {stepState === "done" && currentResult && (
          <View style={styles.resultSection}>
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: category.color + "18",
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Text
                style={[
                  styles.resultScore,
                  { color: category.color, fontFamily: "Poppins_700Bold" },
                ]}
              >
                {currentResult.score.toFixed(1)}
                <Text style={styles.resultScoreMax}>/10</Text>
              </Text>
              <Text
                style={[
                  styles.resultScoreLabel,
                  { color: category.color, fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                {category.name} Baseline
              </Text>
            </View>

            {currentResult.tips.slice(0, 2).map((tip, i) => (
              <View
                key={i}
                style={[
                  styles.tipRow,
                  { backgroundColor: colors.card, borderRadius: colors.radius - 4 },
                ]}
              >
                <Ionicons name="bulb-outline" size={16} color={category.color} />
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

            <TouchableOpacity onPress={handleNext} activeOpacity={0.85}>
              <LinearGradient
                colors={["#E63F6E", "#F5A623"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.nextBtn, { borderRadius: colors.radius }]}
              >
                <Text
                  style={[
                    styles.nextBtnText,
                    { fontFamily: "Poppins_700Bold" },
                  ]}
                >
                  {currentIndex + 1 >= CATEGORIES.length
                    ? "See My Results!"
                    : `Next: ${CATEGORIES[currentIndex + 1].name}`}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backBtn: { padding: 4 },
  progressDots: { flexDirection: "row", gap: 6 },
  dot: { width: 28, height: 4, borderRadius: 2 },
  stepLabel: { fontSize: 13 },
  progressBar: { height: 4, marginHorizontal: 20, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, gap: 20, paddingBottom: 40 },
  assessmentTitle: { fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 },
  categoryHeader: {
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
  },
  catIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  catName: { fontSize: 22 },
  catDesc: { fontSize: 14, textAlign: "center", lineHeight: 21 },
  promptSection: { alignItems: "center", gap: 20, paddingVertical: 10 },
  promptBubble: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    alignItems: "flex-start",
    width: "100%",
  },
  promptText: { flex: 1, fontSize: 14, lineHeight: 22 },
  bigBtn: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  tapHint: { fontSize: 13 },
  timerBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF4444" },
  timerText: { fontSize: 24 },
  processingSection: { alignItems: "center", gap: 16, paddingVertical: 32 },
  processingText: { fontSize: 18 },
  resultSection: { gap: 14 },
  resultCard: { padding: 24, alignItems: "center", gap: 4 },
  resultScore: { fontSize: 52, lineHeight: 60 },
  resultScoreMax: { fontSize: 22 },
  resultScoreLabel: { fontSize: 14 },
  tipRow: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    alignItems: "flex-start",
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 20 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    shadowColor: "#E63F6E",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  nextBtnText: { color: "#fff", fontSize: 16 },
});
