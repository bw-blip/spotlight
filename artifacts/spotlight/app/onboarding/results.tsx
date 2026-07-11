import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  type DimensionValue,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES } from "@/services/curriculum";
import {
  getOnboardingResults,
  saveProfile,
  addScore,
} from "@/services/storage";
import { useApp } from "@/context/AppContext";

function AnimatedCategoryRow({
  category,
  score,
  delay,
}: {
  category: (typeof CATEGORIES)[0];
  score: number;
  delay: number;
}) {
  const colors = useColors();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(delay, withSpring(0, { damping: 14 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const barWidth = useSharedValue(0);
  useEffect(() => {
    barWidth.value = withDelay(delay + 200, withSpring(score / 10, { damping: 14 }));
  }, [score]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%` as DimensionValue,
  }));

  return (
    <Animated.View
      style={[
        style,
        styles.catRow,
        { backgroundColor: colors.card, borderRadius: colors.radius },
      ]}
    >
      <View style={styles.catRowLeft}>
        <View style={[styles.catIcon, { backgroundColor: category.color + "22" }]}>
          <Ionicons name={category.icon as any} size={20} color={category.color} />
        </View>
        <Text
          style={[
            styles.catName,
            { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
          ]}
        >
          {category.name}
        </Text>
      </View>

      <View style={styles.catRowRight}>
        <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.barFill,
              barStyle,
              { backgroundColor: category.color },
            ]}
          />
        </View>
        <Text
          style={[
            styles.scoreText,
            { color: category.color, fontFamily: "Poppins_700Bold" },
          ]}
        >
          {score.toFixed(1)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function ResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    name: string;
    grade: string;
    goalDate: string;
  }>();
  const { refreshAll } = useApp();

  const [results, setResults] = useState<
    { categoryId: string; score: number; tips: string[] }[]
  >([]);

  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerY.value = withSpring(0, { damping: 14 });
    loadResults();
  }, []);

  async function loadResults() {
    const r = await getOnboardingResults();
    setResults(r);
  }

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  async function handleStart() {
    const userId = "local";
    const now = new Date().toISOString();

    await saveProfile({
      userId,
      name: params.name,
      grade: params.grade,
      goalDate: params.goalDate,
      onboardingComplete: true,
      createdAt: now,
    });

    for (const r of results) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      await addScore({
        id,
        categoryId: r.categoryId,
        score: r.score,
        tips: r.tips,
        exerciseId: "baseline",
        exerciseName: "Baseline Assessment",
        timestamp: now,
      });
    }

    await refreshAll();
    router.replace("/(tabs)");
  }

  const avgScore =
    results.length > 0
      ? results.reduce((s, r) => s + r.score, 0) / results.length
      : 0;

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <LinearGradient
            colors={["#E63F6E22", "#F5A62322"]}
            style={styles.starBadge}
          >
            <Ionicons name="star" size={36} color={colors.accent} />
          </LinearGradient>
          <Text
            style={[
              styles.title,
              { color: colors.foreground, fontFamily: "Poppins_700Bold" },
            ]}
          >
            Your Starting Point,{"\n"}
            {params.name}!
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
            ]}
          >
            Here are your baseline scores. Remember — these are where you{" "}
            <Text style={{ fontFamily: "Poppins_600SemiBold", color: colors.primary }}>
              start
            </Text>
            , not where you finish!
          </Text>

          <View
            style={[
              styles.avgBadge,
              { backgroundColor: colors.card, borderRadius: colors.radius },
            ]}
          >
            <Text
              style={[
                styles.avgLabel,
                { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
              ]}
            >
              Overall Average
            </Text>
            <Text
              style={[
                styles.avgScore,
                { color: colors.primary, fontFamily: "Poppins_700Bold" },
              ]}
            >
              {avgScore.toFixed(1)}/10
            </Text>
          </View>
        </Animated.View>

        <View style={styles.categoriesSection}>
          {CATEGORIES.map((cat, i) => {
            const r = results.find((r) => r.categoryId === cat.id);
            return (
              <AnimatedCategoryRow
                key={cat.id}
                category={cat}
                score={r?.score ?? 6}
                delay={300 + i * 120}
              />
            );
          })}
        </View>

        <View
          style={[
            styles.noteCard,
            {
              backgroundColor: colors.primary + "12",
              borderRadius: colors.radius,
            },
          ]}
        >
          <Ionicons name="bulb" size={20} color={colors.primary} />
          <Text
            style={[
              styles.noteText,
              { color: colors.foreground, fontFamily: "Poppins_400Regular" },
            ]}
          >
            Scores are calibrated for a{" "}
            <Text style={{ fontFamily: "Poppins_600SemiBold" }}>{params.grade}</Text>{" "}
            student. As you practice, your scores will grow!
          </Text>
        </View>

        <TouchableOpacity onPress={handleStart} activeOpacity={0.85}>
          <LinearGradient
            colors={["#E63F6E", "#F5A623"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.startBtn, { borderRadius: colors.radius }]}
          >
            <Ionicons name="star" size={20} color="#fff" />
            <Text
              style={[styles.startBtnText, { fontFamily: "Poppins_700Bold" }]}
            >
              Start My Journey!
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, gap: 20, paddingBottom: 40 },
  header: { gap: 14, alignItems: "center" },
  starBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 28, textAlign: "center", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, textAlign: "center", lineHeight: 24 },
  avgBadge: {
    padding: 16,
    alignItems: "center",
    gap: 4,
    width: "100%",
  },
  avgLabel: { fontSize: 13 },
  avgScore: { fontSize: 36 },
  categoriesSection: { gap: 10 },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    gap: 12,
  },
  catRowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  catName: { fontSize: 14 },
  catRowRight: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, justifyContent: "flex-end" },
  barTrack: { height: 6, flex: 1, borderRadius: 3, maxWidth: 100, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  scoreText: { fontSize: 18, minWidth: 36, textAlign: "right" },
  noteCard: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    alignItems: "flex-start",
  },
  noteText: { flex: 1, fontSize: 14, lineHeight: 22 },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    shadowColor: "#E63F6E",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8,
  },
  startBtnText: { color: "#fff", fontSize: 18 },
});
