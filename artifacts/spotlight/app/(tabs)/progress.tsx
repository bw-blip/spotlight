import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { CATEGORIES } from "@/services/curriculum";
import { LineChart } from "@/components/LineChart";
import { ScoreRing } from "@/components/ScoreRing";

const { width } = Dimensions.get("window");

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProgressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, scores, streak } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    CATEGORIES[0].id
  );

  if (!profile) return <Redirect href="/onboarding" />;

  const days = daysUntil(profile.goalDate);
  const topInset = Platform.OS === "web" ? 67 : 0;

  function getScoreHistory(
    categoryId: string
  ): { label: string; value: number }[] {
    return scores
      .filter((s) => s.categoryId === categoryId)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .map((s) => ({
        label: new Date(s.timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: s.score,
      }));
  }

  function getLatestScore(categoryId: string): number | null {
    const hist = getScoreHistory(categoryId);
    return hist.length > 0 ? hist[hist.length - 1].value : null;
  }

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedCategoryId)!;
  const chartData = getScoreHistory(selectedCategoryId);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + topInset + 12,
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 100),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.screenTitle,
            { color: colors.foreground, fontFamily: "Poppins_700Bold" },
          ]}
        >
          My Progress
        </Text>

        <LinearGradient
          colors={["#E63F6E", "#F5A623"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.countdownCard, { borderRadius: colors.radius }]}
        >
          <View style={styles.countdownContent}>
            <View>
              <Text style={[styles.countdownNum, { fontFamily: "Poppins_700Bold" }]}>
                {days}
              </Text>
              <Text
                style={[
                  styles.countdownLabel,
                  { fontFamily: "Poppins_400Regular" },
                ]}
              >
                days until audition
              </Text>
              <Text
                style={[
                  styles.countdownDate,
                  { fontFamily: "Poppins_400Regular" },
                ]}
              >
                {formatDate(profile.goalDate)}
              </Text>
            </View>
            <Ionicons name="calendar" size={48} color="rgba(255,255,255,0.4)" />
          </View>
        </LinearGradient>

        <View
          style={[
            styles.streakCard,
            { backgroundColor: colors.card, borderRadius: colors.radius },
          ]}
        >
          <View style={styles.streakRow}>
            <View style={styles.streakItem}>
              <Ionicons name="flame" size={28} color={colors.accent} />
              <Text
                style={[
                  styles.streakNum,
                  { color: colors.foreground, fontFamily: "Poppins_700Bold" },
                ]}
              >
                {streak.currentStreak}
              </Text>
              <Text
                style={[
                  styles.streakLabel,
                  {
                    color: colors.mutedForeground,
                    fontFamily: "Poppins_400Regular",
                  },
                ]}
              >
                Day streak
              </Text>
            </View>
            <View
              style={[styles.streakDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.streakItem}>
              <Ionicons name="trophy" size={28} color="#A78BFA" />
              <Text
                style={[
                  styles.streakNum,
                  { color: colors.foreground, fontFamily: "Poppins_700Bold" },
                ]}
              >
                {streak.longestStreak}
              </Text>
              <Text
                style={[
                  styles.streakLabel,
                  {
                    color: colors.mutedForeground,
                    fontFamily: "Poppins_400Regular",
                  },
                ]}
              >
                Best streak
              </Text>
            </View>
            <View
              style={[styles.streakDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.streakItem}>
              <Ionicons name="checkmark-circle" size={28} color="#34D399" />
              <Text
                style={[
                  styles.streakNum,
                  { color: colors.foreground, fontFamily: "Poppins_700Bold" },
                ]}
              >
                {scores.length}
              </Text>
              <Text
                style={[
                  styles.streakLabel,
                  {
                    color: colors.mutedForeground,
                    fontFamily: "Poppins_400Regular",
                  },
                ]}
              >
                Recordings
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.foreground, fontFamily: "Poppins_700Bold" },
          ]}
        >
          Skills Overview
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scoreRingsRow}
        >
          {CATEGORIES.map((cat) => {
            const score = getLatestScore(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategoryId(cat.id)}
                activeOpacity={0.85}
                style={[
                  styles.scoreRingCard,
                  {
                    backgroundColor:
                      selectedCategoryId === cat.id
                        ? cat.color + "18"
                        : colors.card,
                    borderColor:
                      selectedCategoryId === cat.id ? cat.color : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <ScoreRing
                  score={score ?? 0}
                  size={64}
                  color={cat.color}
                  strokeWidth={6}
                />
                <Text
                  style={[
                    styles.ringLabel,
                    {
                      color:
                        selectedCategoryId === cat.id
                          ? cat.color
                          : colors.foreground,
                      fontFamily: "Poppins_600SemiBold",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
                {score === null && (
                  <Text
                    style={[
                      styles.noDataText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    No data
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleRow}>
              <View
                style={[
                  styles.chartCatIcon,
                  { backgroundColor: selectedCategory.color + "22" },
                ]}
              >
                <Ionicons
                  name={selectedCategory.icon as any}
                  size={16}
                  color={selectedCategory.color}
                />
              </View>
              <Text
                style={[
                  styles.chartTitle,
                  {
                    color: colors.foreground,
                    fontFamily: "Poppins_600SemiBold",
                  },
                ]}
              >
                {selectedCategory.name} Score History
              </Text>
            </View>
            {chartData.length > 0 && (
              <Text
                style={[
                  styles.currentScore,
                  {
                    color: selectedCategory.color,
                    fontFamily: "Poppins_700Bold",
                  },
                ]}
              >
                {chartData[chartData.length - 1].value.toFixed(1)}
              </Text>
            )}
          </View>

          {chartData.length === 0 ? (
            <View style={styles.noChartData}>
              <Ionicons name="mic-outline" size={28} color={colors.mutedForeground} />
              <Text
                style={[
                  styles.noChartText,
                  {
                    color: colors.mutedForeground,
                    fontFamily: "Poppins_400Regular",
                  },
                ]}
              >
                Record a practice session to see your{" "}
                {selectedCategory.name.toLowerCase()} progress here.
              </Text>
            </View>
          ) : (
            <LineChart
              data={chartData}
              color={selectedCategory.color}
              width={width - 64}
              height={160}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, gap: 16 },
  screenTitle: { fontSize: 28, letterSpacing: -0.5, marginBottom: -4 },
  countdownCard: {
    overflow: "hidden",
  },
  countdownContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  countdownNum: { fontSize: 48, color: "#fff", lineHeight: 52 },
  countdownLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  countdownDate: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  streakCard: { padding: 16 },
  streakRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  streakItem: { alignItems: "center", gap: 4, flex: 1 },
  streakNum: { fontSize: 28, lineHeight: 32 },
  streakLabel: { fontSize: 11, textAlign: "center" },
  streakDivider: { width: 1, height: 48 },
  sectionTitle: { fontSize: 18 },
  scoreRingsRow: { gap: 10, paddingHorizontal: 2, paddingBottom: 4 },
  scoreRingCard: {
    alignItems: "center",
    padding: 14,
    gap: 8,
    borderWidth: 1.5,
    minWidth: 96,
  },
  ringLabel: { fontSize: 12, textAlign: "center" },
  noDataText: { fontSize: 10, fontFamily: "Poppins_400Regular" },
  chartCard: { padding: 16, gap: 16 },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  chartCatIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chartTitle: { fontSize: 14 },
  currentScore: { fontSize: 24 },
  noChartData: { alignItems: "center", gap: 10, paddingVertical: 24 },
  noChartText: { fontSize: 13, textAlign: "center", lineHeight: 20, paddingHorizontal: 16 },
});
