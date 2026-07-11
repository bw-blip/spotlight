import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { CATEGORIES, getExercisesForCategory } from "@/services/curriculum";
import { ExerciseCard } from "@/components/ExerciseCard";
import { RecordingModal } from "@/components/RecordingModal";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import type { Exercise } from "@/services/curriculum";
import type { ScoreEntry } from "@/services/storage";

export default function PracticeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, addScoreEntry, completeExercise, getLatestScoreForCategory, scores } = useApp();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(CATEGORIES[0].id);
  const [recordingExercise, setRecordingExercise] = useState<Exercise | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedLocal, setCompletedLocal] = useState<Set<string>>(new Set());

  if (!profile) return <Redirect href="/onboarding" />;

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedCategoryId)!;
  const exercises = getExercisesForCategory(selectedCategoryId);

  function getExerciseScore(exerciseId: string): number | null {
    const s = scores.filter((s) => s.exerciseId === exerciseId);
    if (s.length === 0) return null;
    return s.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0].score;
  }

  async function handleSaveResult(
    exercise: Exercise,
    result: { score: number; tips: string[] }
  ) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const entry: ScoreEntry = {
      id,
      categoryId: exercise.categoryId,
      score: result.score,
      tips: result.tips,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      timestamp: new Date().toISOString(),
    };
    await addScoreEntry(entry);
    await completeExercise(exercise.id);
    setCompletedLocal((prev) => new Set([...prev, exercise.id]));
    setShowCelebration(true);
  }

  async function handleMarkDone(exercise: Exercise) {
    await completeExercise(exercise.id);
    setCompletedLocal((prev) => new Set([...prev, exercise.id]));
    setShowCelebration(true);
  }

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
        <Text
          style={[
            styles.headerTitle,
            { color: colors.foreground, fontFamily: "Poppins_700Bold" },
          ]}
        >
          Practice Library
        </Text>
        <Text
          style={[
            styles.headerSub,
            { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
          ]}
        >
          Browse all exercises
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.categoryTabs, { borderBottomColor: colors.border }]}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedCategoryId;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategoryId(cat.id)}
              activeOpacity={0.8}
              style={[
                styles.categoryTab,
                {
                  backgroundColor: isSelected ? cat.color + "20" : "transparent",
                  borderColor: isSelected ? cat.color : "transparent",
                },
              ]}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={isSelected ? cat.color : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.categoryTabText,
                  {
                    color: isSelected ? cat.color : colors.mutedForeground,
                    fontFamily: isSelected
                      ? "Poppins_600SemiBold"
                      : "Poppins_400Regular",
                  },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 100),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.categoryInfo,
            {
              backgroundColor: selectedCategory.color + "12",
              borderRadius: colors.radius,
            },
          ]}
        >
          <Ionicons
            name={selectedCategory.icon as any}
            size={20}
            color={selectedCategory.color}
          />
          <Text
            style={[
              styles.categoryDesc,
              {
                color: colors.foreground,
                fontFamily: "Poppins_400Regular",
              },
            ]}
          >
            {selectedCategory.description}
          </Text>
          <View
            style={[
              styles.scorePill,
              { backgroundColor: selectedCategory.color + "22" },
            ]}
          >
            <Text
              style={[
                styles.scorePillText,
                {
                  color: selectedCategory.color,
                  fontFamily: "Poppins_700Bold",
                },
              ]}
            >
              {(getLatestScoreForCategory(selectedCategory.id) ?? 0).toFixed(1)}/10
            </Text>
          </View>
        </View>

        {exercises.map((exercise) => {
          const isCompleted = completedLocal.has(exercise.id);
          const exScore = getExerciseScore(exercise.id);
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              categoryColor={selectedCategory.color}
              completed={isCompleted}
              latestScore={exScore}
              onRecord={() => setRecordingExercise(exercise)}
              onMarkDone={() => handleMarkDone(exercise)}
            />
          );
        })}
      </ScrollView>

      <RecordingModal
        visible={!!recordingExercise}
        exercise={recordingExercise}
        categoryColor={selectedCategory.color}
        grade={profile.grade}
        onClose={() => setRecordingExercise(null)}
        onSaveResult={(result) => {
          if (recordingExercise) handleSaveResult(recordingExercise, result);
          setRecordingExercise(null);
        }}
      />

      <CelebrationOverlay
        visible={showCelebration}
        onDismiss={() => setShowCelebration(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 26, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  categoryTabs: {
    borderBottomWidth: 1,
    flexGrow: 0,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  categoryTabText: { fontSize: 13 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 10 },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    marginBottom: 4,
  },
  categoryDesc: { flex: 1, fontSize: 13 },
  scorePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scorePillText: { fontSize: 14 },
});
