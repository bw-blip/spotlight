import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import {
  CATEGORIES,
  getDailyWarmup,
  getDailyExercises,
} from "@/services/curriculum";
import { WarmupCard } from "@/components/WarmupCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ExerciseCard } from "@/components/ExerciseCard";
import { RecordingModal } from "@/components/RecordingModal";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import type { Exercise } from "@/services/curriculum";
import type { ScoreEntry } from "@/services/storage";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function greetingFor(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}!`;
  if (hour < 17) return `Good afternoon, ${name}!`;
  return `Good evening, ${name}!`;
}

export default function TodayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    profile,
    todayData,
    streak,
    completeWarmup,
    addScoreEntry,
    completeExercise,
    setSelectedCategory,
    getLatestScoreForCategory,
    refreshAll,
  } = useApp();

  const [recordingExercise, setRecordingExercise] = useState<Exercise | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  }, [refreshAll]);

  if (!profile) return <Redirect href="/onboarding" />;

  const warmup = getDailyWarmup();
  const warmupDone = todayData?.warmupComplete ?? false;
  const selectedCategoryId = todayData?.selectedCategoryId ?? null;
  const completedExerciseIds = new Set(todayData?.completedExerciseIds ?? []);
  const days = daysUntil(profile.goalDate);
  const topInset = Platform.OS === "web" ? 67 : 0;

  const selectedCategory = selectedCategoryId
    ? CATEGORIES.find((c) => c.id === selectedCategoryId)
    : null;
  const todayExercises = selectedCategoryId
    ? getDailyExercises(selectedCategoryId, 4)
    : [];

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
    setShowCelebration(true);
  }

  async function handleMarkDone(exercise: Exercise) {
    await completeExercise(exercise.id);
    setShowCelebration(true);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + topInset + 8,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 110),
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.topBar}>
          <View>
            <Text
              style={[
                styles.greeting,
                { color: colors.foreground, fontFamily: "Poppins_700Bold" },
              ]}
            >
              {greetingFor(profile.name)}
            </Text>
            <Text
              style={[
                styles.subGreeting,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Poppins_400Regular",
                },
              ]}
            >
              Ready to shine today?
            </Text>
          </View>
          <View style={styles.badgesRow}>
            {streak.currentStreak > 0 && (
              <View
                style={[
                  styles.streakBadge,
                  { backgroundColor: colors.accent + "22" },
                ]}
              >
                <Ionicons name="flame" size={14} color={colors.accent} />
                <Text
                  style={[
                    styles.streakText,
                    { color: colors.accent, fontFamily: "Poppins_700Bold" },
                  ]}
                >
                  {streak.currentStreak}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.daysBadge,
                { backgroundColor: colors.primary + "18" },
              ]}
            >
              <Ionicons name="calendar" size={12} color={colors.primary} />
              <Text
                style={[
                  styles.daysText,
                  { color: colors.primary, fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                {days}d
              </Text>
            </View>
          </View>
        </View>

        <WarmupCard
          warmup={warmup}
          completed={warmupDone}
          onComplete={() => completeWarmup(warmup.id)}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/games")}
          style={[styles.gamesCard, { borderRadius: colors.radius }]}
        >
          <LinearGradient
            colors={["#9C27B022", "#E63F6E18"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gamesCardGradient, { borderRadius: colors.radius }]}
          >
            <Text style={styles.gamesCardEmoji}>🐸</Text>
            <View style={styles.gamesCardText}>
              <Text style={[styles.gamesCardTitle, { color: colors.foreground, fontFamily: "Poppins_700Bold" }]}>
                Pitch Jump
              </Text>
              <Text style={[styles.gamesCardSub, { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" }]}>
                Sing the note — make the frog leap!
              </Text>
            </View>
            <View style={[styles.gamesCardBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.gamesCardBadgeText, { fontFamily: "Poppins_700Bold" }]}>Play</Text>
              <Ionicons name="chevron-forward" size={13} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.foreground, fontFamily: "Poppins_700Bold" },
            ]}
          >
            What will you practice?
          </Text>
          <Text
            style={[
              styles.sectionSub,
              { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
            ]}
          >
            Choose a skill to work on today
          </Text>
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat, i) => {
            const score = getLatestScoreForCategory(cat.id);
            const isSelected = cat.id === selectedCategoryId;
            return (
              <View key={cat.id} style={styles.categoryCell}>
                <CategoryCard
                  category={cat}
                  score={score}
                  selected={isSelected}
                  onPress={() =>
                    setSelectedCategory(isSelected ? null : cat.id)
                  }
                />
              </View>
            );
          })}
        </View>

        {selectedCategory && todayExercises.length > 0 && (
          <View style={styles.exercisesSection}>
            <LinearGradient
              colors={[selectedCategory.color + "18", "transparent"]}
              style={styles.exercisesSectionHeader}
            >
              <Ionicons
                name={selectedCategory.icon as any}
                size={18}
                color={selectedCategory.color}
              />
              <Text
                style={[
                  styles.exercisesSectionTitle,
                  {
                    color: colors.foreground,
                    fontFamily: "Poppins_700Bold",
                  },
                ]}
              >
                Today's {selectedCategory.name} Exercises
              </Text>
            </LinearGradient>

            {todayExercises.map((exercise) => {
              const isCompleted = completedExerciseIds.has(exercise.id);
              return (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  categoryColor={selectedCategory.color}
                  completed={isCompleted}
                  latestScore={null}
                  onRecord={() => setRecordingExercise(exercise)}
                  onMarkDone={() => handleMarkDone(exercise)}
                />
              );
            })}

            {completedExerciseIds.size > 0 && (
              <View
                style={[
                  styles.progressPill,
                  { backgroundColor: selectedCategory.color + "18" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={selectedCategory.color}
                />
                <Text
                  style={[
                    styles.progressPillText,
                    {
                      color: selectedCategory.color,
                      fontFamily: "Poppins_600SemiBold",
                    },
                  ]}
                >
                  {
                    todayExercises.filter((e) =>
                      completedExerciseIds.has(e.id)
                    ).length
                  }{" "}
                  of {todayExercises.length} done today
                </Text>
              </View>
            )}
          </View>
        )}

        {!selectedCategoryId && (
          <View
            style={[
              styles.noSelectionCard,
              { backgroundColor: colors.card, borderRadius: colors.radius },
            ]}
          >
            <Ionicons name="star-outline" size={28} color={colors.mutedForeground} />
            <Text
              style={[
                styles.noSelectionText,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Poppins_400Regular",
                },
              ]}
            >
              Select a skill above to see today's exercises
            </Text>
          </View>
        )}
      </ScrollView>

      <RecordingModal
        visible={!!recordingExercise}
        exercise={recordingExercise}
        categoryColor={selectedCategory?.color ?? colors.primary}
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
  scrollContent: { padding: 20, gap: 18 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: { fontSize: 22, letterSpacing: -0.3 },
  subGreeting: { fontSize: 13, marginTop: 1 },
  badgesRow: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 2 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  streakText: { fontSize: 14 },
  daysBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  daysText: { fontSize: 12 },
  sectionTitle: { fontSize: 18, marginBottom: 2 },
  sectionSub: { fontSize: 12 },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: -4,
  },
  categoryCell: { width: "47%" },
  exercisesSection: { gap: 10 },
  exercisesSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  exercisesSectionTitle: { fontSize: 16 },
  progressPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  progressPillText: { fontSize: 13 },
  noSelectionCard: {
    alignItems: "center",
    padding: 24,
    gap: 10,
  },
  noSelectionText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  gamesCard: { overflow: "hidden" },
  gamesCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  gamesCardEmoji: { fontSize: 36 },
  gamesCardText: { flex: 1 },
  gamesCardTitle: { fontSize: 16 },
  gamesCardSub: { fontSize: 12, marginTop: 1 },
  gamesCardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  gamesCardBadgeText: { fontSize: 13, color: "#fff" },
});
