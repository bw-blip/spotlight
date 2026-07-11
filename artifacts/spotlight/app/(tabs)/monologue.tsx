import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import {
  getMonologues,
  saveMonologue,
  deleteMonologue,
  addMonologueSession,
  MonologueEntry,
  MonologueSession,
  SceneFeedback,
} from "@/services/storage";

const MONOLOGUE_COLOR = "#8B5CF6";

type PracticeState = "idle" | "recording" | "processing" | "result";

interface MonologueResult {
  overallScore: number;
  accuracyScore: number;
  expressionScore: number;
  pacingScore: number;
  emotionScore: number;
  tips: string[];
  sceneFeedback: SceneFeedback[];
}

export default function MonologueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useApp();

  const [monologues, setMonologues] = useState<MonologueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCompose, setShowCompose] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCharacter, setFormCharacter] = useState("");
  const [formScript, setFormScript] = useState("");
  const [formError, setFormError] = useState("");

  const [practiceMonologue, setPracticeMonologue] = useState<MonologueEntry | null>(null);
  const [practiceState, setPracticeState] = useState<PracticeState>("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [practiceResult, setPracticeResult] = useState<MonologueResult | null>(null);
  const [practiceError, setPracticeError] = useState("");

  const audioRecordingRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadMonologues();
  }, []);

  async function loadMonologues() {
    const all = await getMonologues();
    setMonologues(all);
    setLoading(false);
  }

  function openCompose(entry?: MonologueEntry) {
    if (entry) {
      setEditingId(entry.id);
      setFormTitle(entry.title);
      setFormCharacter(entry.character);
      setFormScript(entry.script);
    } else {
      setEditingId(null);
      setFormTitle("");
      setFormCharacter("");
      setFormScript("");
    }
    setFormError("");
    setShowCompose(true);
  }

  const SCRIPT_MAX_LENGTH = 5000;

  async function handleSaveCompose() {
    if (!formTitle.trim()) {
      setFormError("Please enter a title for this monologue.");
      return;
    }
    if (!formScript.trim()) {
      setFormError("Please paste or type your script.");
      return;
    }
    if (formScript.trim().length > SCRIPT_MAX_LENGTH) {
      setFormError(`Script is too long (${formScript.trim().length.toLocaleString()} characters). Please keep it under ${SCRIPT_MAX_LENGTH.toLocaleString()} characters.`);
      return;
    }
    const now = new Date().toISOString();
    const entry: MonologueEntry = editingId
      ? {
          ...(monologues.find((m) => m.id === editingId)!),
          title: formTitle.trim(),
          character: formCharacter.trim(),
          script: formScript.trim(),
        }
      : {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
          title: formTitle.trim(),
          character: formCharacter.trim(),
          script: formScript.trim(),
          createdAt: now,
          lastPracticed: null,
          bestScore: null,
          sessions: [],
        };
    await saveMonologue(entry);
    await loadMonologues();
    setShowCompose(false);
  }

  async function handleDelete(id: string) {
    Alert.alert(
      "Delete Monologue",
      "Are you sure you want to delete this monologue and all its practice history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteMonologue(id);
            await loadMonologues();
          },
        },
      ]
    );
  }

  function openPractice(entry: MonologueEntry) {
    setPracticeMonologue(entry);
    setPracticeState("idle");
    setPracticeResult(null);
    setPracticeError("");
    setRecordingSeconds(0);
  }

  function closePractice() {
    clearTimer();
    if (audioRecordingRef.current) {
      try {
        audioRecordingRef.current.stopAndUnloadAsync?.();
      } catch {}
      audioRecordingRef.current = null;
    }
    setPracticeMonologue(null);
    setPracticeState("idle");
    setPracticeResult(null);
    setPracticeError("");
    setRecordingSeconds(0);
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

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  async function startRecording() {
    setPracticeError("");
    try {
      if (Platform.OS === "web") {
        setPracticeState("recording");
        startTimer();
        return;
      }
      const { Audio } = await import("expo-av");
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Microphone needed",
          "Please allow microphone access to record your performance."
        );
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      audioRecordingRef.current = recording;
      setPracticeState("recording");
      startTimer();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      setPracticeError("Could not start recording. Try again.");
    }
  }

  async function stopRecording() {
    clearTimer();
    setPracticeState("processing");
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

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

    await sendForAnalysis(audioBase64);
  }

  async function sendForAnalysis(audioBase64: string) {
    if (!practiceMonologue) return;
    try {
      const domain = process.env.EXPO_PUBLIC_DOMAIN;
      const url = domain
        ? `https://${domain}/api/coaching/monologue`
        : "/api/coaching/monologue";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioBase64,
          script: practiceMonologue.script,
          title: practiceMonologue.title,
          character: practiceMonologue.character,
          grade: profile?.grade ?? "",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: MonologueResult = await response.json();
      setPracticeResult(data);
      setPracticeState("result");

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      const session: MonologueSession = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
        timestamp: new Date().toISOString(),
        overallScore: data.overallScore,
        accuracyScore: data.accuracyScore,
        expressionScore: data.expressionScore,
        pacingScore: data.pacingScore,
        emotionScore: data.emotionScore,
        tips: data.tips,
        sceneFeedback: data.sceneFeedback,
      };
      const updated = await addMonologueSession(practiceMonologue.id, session);
      if (updated) {
        setPracticeMonologue(updated);
        await loadMonologues();
      }
    } catch {
      setPracticeError("Couldn't get AI feedback. Check your connection and try again.");
      setPracticeState("idle");
    }
  }

  function ScoreBar({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: string;
  }) {
    const fillFlex = ((value - 1) / 9);
    const remainFlex = 1 - fillFlex;
    return (
      <View style={styles.scoreBarRow}>
        <Text style={[styles.scoreBarLabel, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
          {label}
        </Text>
        <View style={[styles.scoreBarTrack, { backgroundColor: colors.muted }]}>
          <View style={[styles.scoreBarFill, { flex: fillFlex, backgroundColor: color }]} />
          <View style={{ flex: remainFlex }} />
        </View>
        <Text style={[styles.scoreBarValue, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
          {value.toFixed(1)}
        </Text>
      </View>
    );
  }

  if (!profile) return <Redirect href="/onboarding" />;

  const topInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + topInset + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
            Monologue Coach
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
            Paste a script and get line-by-line AI feedback
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => openCompose()}
          activeOpacity={0.8}
          style={[styles.addBtn, { backgroundColor: MONOLOGUE_COLOR }]}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={MONOLOGUE_COLOR} />
        </View>
      ) : monologues.length === 0 ? (
        <View style={styles.center}>
          <View style={[styles.emptyIcon, { backgroundColor: MONOLOGUE_COLOR + "18" }]}>
            <Ionicons name="chatbubbles-outline" size={40} color={MONOLOGUE_COLOR} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
            No monologues yet
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
            Tap + to add your first script and start getting AI coaching feedback
          </Text>
          <TouchableOpacity
            onPress={() => openCompose()}
            activeOpacity={0.85}
            style={[styles.emptyBtn, { backgroundColor: MONOLOGUE_COLOR, borderRadius: colors.radius }]}
          >
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={[styles.emptyBtnText, { fontFamily: "Poppins_600SemiBold" }]}>
              Add Monologue
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {monologues.map((m) => (
            <View
              key={m.id}
              style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.cardIconWrap, { backgroundColor: MONOLOGUE_COLOR + "18" }]}>
                  <Ionicons name="chatbubbles" size={20} color={MONOLOGUE_COLOR} />
                </View>
                <View style={styles.cardMeta}>
                  <Text style={[styles.cardTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]} numberOfLines={1}>
                    {m.title}
                  </Text>
                  {m.character ? (
                    <Text style={[styles.cardCharacter, { color: MONOLOGUE_COLOR, fontFamily: "Poppins_600SemiBold" }]}>
                      {m.character}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity onPress={() => openCompose(m)} style={styles.iconBtn}>
                    <Ionicons name="pencil-outline" size={18} color={colors.mutedForeground} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(m.id)} style={styles.iconBtn}>
                    <Ionicons name="trash-outline" size={18} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.cardScript, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]} numberOfLines={2}>
                {m.script}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.cardStats}>
                  {m.bestScore !== null ? (
                    <View style={[styles.statPill, { backgroundColor: MONOLOGUE_COLOR + "18" }]}>
                      <Ionicons name="star" size={12} color={MONOLOGUE_COLOR} />
                      <Text style={[styles.statText, { color: MONOLOGUE_COLOR, fontFamily: "Poppins_600SemiBold" }]}>
                        Best {m.bestScore.toFixed(1)}/10
                      </Text>
                    </View>
                  ) : null}
                  {m.sessions.length > 0 ? (
                    <View style={[styles.statPill, { backgroundColor: colors.muted }]}>
                      <Ionicons name="mic" size={12} color={colors.mutedForeground} />
                      <Text style={[styles.statText, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
                        {m.sessions.length} {m.sessions.length === 1 ? "session" : "sessions"}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => openPractice(m)}
                  activeOpacity={0.85}
                  style={[styles.practiceBtn, { backgroundColor: MONOLOGUE_COLOR, borderRadius: colors.radius - 4 }]}
                >
                  <Ionicons name="mic" size={15} color="#fff" />
                  <Text style={[styles.practiceBtnText, { fontFamily: "Poppins_600SemiBold" }]}>
                    Practice
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={showCompose} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={[styles.modalContainer, { backgroundColor: colors.background }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCompose(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
              {editingId ? "Edit Monologue" : "New Monologue"}
            </Text>
            <TouchableOpacity onPress={handleSaveCompose} style={styles.saveHeaderBtn}>
              <Text style={[styles.saveHeaderText, { color: MONOLOGUE_COLOR, fontFamily: "Poppins_700Bold" }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {formError ? (
              <View style={[styles.errorBanner, { backgroundColor: colors.destructive + "18" }]}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.destructive} />
                <Text style={[styles.errorBannerText, { color: colors.destructive, fontFamily: "Poppins_400Regular" }]}>
                  {formError}
                </Text>
              </View>
            ) : null}

            <Text style={[styles.fieldLabel, { color: colors.foreground, fontFamily: "Poppins_600SemiBold" }]}>
              Title *
            </Text>
            <TextInput
              value={formTitle}
              onChangeText={setFormTitle}
              placeholder="e.g. Hamlet Soliloquy, Our Town Monologue"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground, fontFamily: "Poppins_400Regular", borderRadius: colors.radius - 4 }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.foreground, fontFamily: "Poppins_600SemiBold" }]}>
              Character Name
            </Text>
            <TextInput
              value={formCharacter}
              onChangeText={setFormCharacter}
              placeholder="e.g. Hamlet, Emily Webb"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground, fontFamily: "Poppins_400Regular", borderRadius: colors.radius - 4 }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.foreground, fontFamily: "Poppins_600SemiBold" }]}>
              Script *
            </Text>
            <Text style={[styles.fieldHint, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
              Paste or type your full monologue text
            </Text>
            <TextInput
              value={formScript}
              onChangeText={setFormScript}
              placeholder="To be, or not to be, that is the question..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              textAlignVertical="top"
              style={[styles.scriptInput, { backgroundColor: colors.card, borderColor: formScript.length > SCRIPT_MAX_LENGTH ? colors.destructive : colors.border, color: colors.foreground, fontFamily: "Poppins_400Regular", borderRadius: colors.radius - 4 }]}
            />
            <Text style={[styles.charCounter, { color: formScript.length > SCRIPT_MAX_LENGTH ? colors.destructive : colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
              {formScript.length.toLocaleString()} / {SCRIPT_MAX_LENGTH.toLocaleString()}
            </Text>

            <TouchableOpacity
              onPress={handleSaveCompose}
              activeOpacity={0.85}
              style={[styles.saveBigBtn, { backgroundColor: MONOLOGUE_COLOR, borderRadius: colors.radius }]}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={[styles.saveBigBtnText, { fontFamily: "Poppins_600SemiBold" }]}>
                {editingId ? "Save Changes" : "Add Monologue"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!practiceMonologue} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closePractice}
              style={styles.closeBtn}
              disabled={practiceState === "processing"}
            >
              <Ionicons name="close" size={22} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]} numberOfLines={1}>
              {practiceMonologue?.title ?? "Practice"}
            </Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView
            style={styles.practiceScroll}
            contentContainerStyle={styles.practiceScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {practiceMonologue?.character ? (
              <View style={[styles.characterBadge, { backgroundColor: MONOLOGUE_COLOR + "18" }]}>
                <Ionicons name="person" size={14} color={MONOLOGUE_COLOR} />
                <Text style={[styles.characterBadgeText, { color: MONOLOGUE_COLOR, fontFamily: "Poppins_600SemiBold" }]}>
                  {practiceMonologue.character}
                </Text>
              </View>
            ) : null}

            {(practiceState === "idle" || practiceState === "recording") && (
              <>
                <Text style={[styles.scriptSectionTitle, { color: colors.mutedForeground, fontFamily: "Poppins_600SemiBold" }]}>
                  YOUR SCRIPT
                </Text>
                <View style={[styles.scriptBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                  <Text style={[styles.scriptText, { color: colors.foreground, fontFamily: "Poppins_400Regular" }]}>
                    {practiceMonologue?.script}
                  </Text>
                </View>

                <View style={styles.recordSection}>
                  {practiceState === "recording" && (
                    <View style={[styles.timer, { backgroundColor: "#EF4444" + "22" }]}>
                      <View style={styles.recordingDot} />
                      <Text style={[styles.timerText, { color: "#EF4444", fontFamily: "Poppins_700Bold" }]}>
                        {formatTime(recordingSeconds)}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={practiceState === "idle" ? startRecording : stopRecording}
                    activeOpacity={0.85}
                    style={[
                      styles.recordBtn,
                      { backgroundColor: practiceState === "recording" ? "#EF4444" : MONOLOGUE_COLOR },
                    ]}
                  >
                    <Ionicons
                      name={practiceState === "recording" ? "stop" : "mic"}
                      size={32}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <Text style={[styles.recordHint, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
                    {practiceState === "idle"
                      ? Platform.OS === "web"
                        ? "Read the script aloud, then tap to get AI feedback based on your script (audio capture not available on web)"
                        : "Read the script above, then tap to record your performance"
                      : "Recording — tap to stop and get AI feedback"}
                  </Text>
                  {practiceError ? (
                    <Text style={[styles.practiceErrorText, { color: colors.destructive, fontFamily: "Poppins_400Regular" }]}>
                      {practiceError}
                    </Text>
                  ) : null}
                </View>
              </>
            )}

            {practiceState === "processing" && (
              <View style={styles.processingSection}>
                <ActivityIndicator size="large" color={MONOLOGUE_COLOR} />
                <Text style={[styles.processingText, { color: colors.foreground, fontFamily: "Poppins_600SemiBold" }]}>
                  Your coach is reviewing...
                </Text>
                <Text style={[styles.processingSubText, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
                  Analyzing accuracy, expression, pacing, and emotion
                </Text>
              </View>
            )}

            {practiceState === "result" && practiceResult && (
              <View style={styles.resultSection}>
                <View style={[styles.overallScoreCard, { backgroundColor: MONOLOGUE_COLOR + "15", borderRadius: colors.radius }]}>
                  <Text style={[styles.overallScoreLabel, { color: MONOLOGUE_COLOR, fontFamily: "Poppins_600SemiBold" }]}>
                    Overall Score
                  </Text>
                  <Text style={[styles.overallScoreNum, { color: MONOLOGUE_COLOR, fontFamily: "Poppins_700Bold" }]}>
                    {practiceResult.overallScore.toFixed(1)}
                    <Text style={styles.overallScoreMax}>/10</Text>
                  </Text>
                </View>

                <Text style={[styles.sectionHeading, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
                  Score Breakdown
                </Text>
                <View style={[styles.breakdownCard, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
                  <ScoreBar label="Accuracy" value={practiceResult.accuracyScore} color={MONOLOGUE_COLOR} />
                  <ScoreBar label="Expression" value={practiceResult.expressionScore} color="#F59E0B" />
                  <ScoreBar label="Pacing" value={practiceResult.pacingScore} color="#10B981" />
                  <ScoreBar label="Emotion" value={practiceResult.emotionScore} color="#EF4444" />
                </View>

                {practiceResult.sceneFeedback.length > 0 && (
                  <>
                    <Text style={[styles.sectionHeading, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
                      Scene-by-Scene Feedback
                    </Text>
                    {practiceResult.sceneFeedback.map((sf, i) => (
                      <View
                        key={i}
                        style={[styles.sceneFeedbackCard, { backgroundColor: colors.card, borderRadius: colors.radius - 4, borderColor: colors.border }]}
                      >
                        <View style={[styles.sceneLabel, { backgroundColor: MONOLOGUE_COLOR }]}>
                          <Text style={[styles.sceneLabelText, { fontFamily: "Poppins_600SemiBold" }]}>
                            {sf.scene || `Scene ${i + 1}`}
                          </Text>
                        </View>
                        <Text style={[styles.sceneFeedbackText, { color: colors.foreground, fontFamily: "Poppins_400Regular" }]}>
                          {sf.feedback}
                        </Text>
                      </View>
                    ))}
                  </>
                )}

                <Text style={[styles.sectionHeading, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
                  Coach's Tips
                </Text>
                {practiceResult.tips.map((tip, i) => (
                  <View
                    key={i}
                    style={[styles.tipRow, { backgroundColor: colors.card, borderRadius: colors.radius - 4, borderColor: colors.border }]}
                  >
                    <View style={[styles.tipNum, { backgroundColor: MONOLOGUE_COLOR }]}>
                      <Text style={styles.tipNumText}>{i + 1}</Text>
                    </View>
                    <Text style={[styles.tipText, { color: colors.foreground, fontFamily: "Poppins_400Regular" }]}>
                      {tip}
                    </Text>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={() => {
                    setPracticeState("idle");
                    setPracticeResult(null);
                    setPracticeError("");
                    setRecordingSeconds(0);
                  }}
                  activeOpacity={0.85}
                  style={[styles.practiceAgainBtn, { backgroundColor: MONOLOGUE_COLOR, borderRadius: colors.radius }]}
                >
                  <Ionicons name="refresh" size={18} color="#fff" />
                  <Text style={[styles.practiceAgainBtnText, { fontFamily: "Poppins_600SemiBold" }]}>
                    Practice Again
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={closePractice}
                  activeOpacity={0.85}
                  style={[styles.doneBtn, { borderColor: MONOLOGUE_COLOR, borderRadius: colors.radius }]}
                >
                  <Text style={[styles.doneBtnText, { color: MONOLOGUE_COLOR, fontFamily: "Poppins_600SemiBold" }]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 26, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 20, marginBottom: 8, textAlign: "center" },
  emptyDesc: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 24 },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  emptyBtnText: { color: "#fff", fontSize: 15 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },
  card: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 16 },
  cardCharacter: { fontSize: 13, marginTop: 1 },
  cardActions: { flexDirection: "row", gap: 4 },
  iconBtn: { padding: 6 },
  cardScript: { fontSize: 13, lineHeight: 18 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardStats: { flexDirection: "row", gap: 6 },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statText: { fontSize: 12 },
  practiceBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  practiceBtnText: { color: "#fff", fontSize: 13 },
  modalContainer: { flex: 1 },
  handleBar: { alignItems: "center", paddingTop: 10, paddingBottom: 4 },
  handle: { width: 36, height: 4, borderRadius: 2 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: { padding: 6 },
  modalTitle: { flex: 1, fontSize: 17, textAlign: "center", marginHorizontal: 8 },
  saveHeaderBtn: { padding: 6 },
  saveHeaderText: { fontSize: 16 },
  formScroll: { flex: 1 },
  formContent: { padding: 20, gap: 6 },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  errorBannerText: { flex: 1, fontSize: 13 },
  fieldLabel: { fontSize: 14, marginTop: 12, marginBottom: 4 },
  fieldHint: { fontSize: 12, marginBottom: 6, marginTop: -2 },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    fontSize: 15,
  },
  scriptInput: {
    minHeight: 180,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  charCounter: { fontSize: 12, textAlign: "right", marginTop: 2 },
  saveBigBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 20,
  },
  saveBigBtnText: { color: "#fff", fontSize: 16 },
  practiceScroll: { flex: 1 },
  practiceScrollContent: { padding: 20, gap: 14, paddingBottom: 60 },
  characterBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  characterBadgeText: { fontSize: 13 },
  scriptSectionTitle: { fontSize: 11, letterSpacing: 0.8, marginBottom: -6 },
  scriptBox: {
    padding: 16,
    borderWidth: 1,
  },
  scriptText: { fontSize: 15, lineHeight: 24 },
  recordSection: { alignItems: "center", gap: 14, paddingTop: 8 },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  timerText: { fontSize: 18 },
  recordBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  recordHint: { fontSize: 14, textAlign: "center", maxWidth: 260, lineHeight: 20 },
  practiceErrorText: { fontSize: 13, textAlign: "center" },
  processingSection: { alignItems: "center", gap: 14, paddingTop: 60 },
  processingText: { fontSize: 17 },
  processingSubText: { fontSize: 14, textAlign: "center" },
  resultSection: { gap: 14 },
  overallScoreCard: {
    alignItems: "center",
    paddingVertical: 20,
  },
  overallScoreLabel: { fontSize: 14 },
  overallScoreNum: { fontSize: 52 },
  overallScoreMax: { fontSize: 22 },
  sectionHeading: { fontSize: 16, marginTop: 4 },
  breakdownCard: {
    padding: 16,
    gap: 12,
    borderWidth: 1,
  },
  scoreBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scoreBarLabel: { fontSize: 13, width: 80 },
  scoreBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: 8,
    borderRadius: 4,
  },
  scoreBarValue: { fontSize: 13, width: 28, textAlign: "right" },
  sceneFeedbackCard: {
    borderWidth: 1,
    overflow: "hidden",
  },
  sceneLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sceneLabelText: { color: "#fff", fontSize: 12 },
  sceneFeedbackText: { padding: 12, fontSize: 14, lineHeight: 20 },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderWidth: 1,
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
  tipText: { flex: 1, fontSize: 14, lineHeight: 20 },
  practiceAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginTop: 6,
  },
  practiceAgainBtnText: { color: "#fff", fontSize: 15 },
  doneBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  doneBtnText: { fontSize: 15 },
});
