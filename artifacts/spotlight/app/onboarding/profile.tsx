import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const GRADES = [
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<string | null>(null);
  const [goalMonths, setGoalMonths] = useState<number | null>(null);

  const MONTH_OPTIONS = [1, 2, 3, 4, 6, 9, 12];
  const isValid = name.trim().length >= 2 && grade !== null && goalMonths !== null;

  function handleContinue() {
    if (!isValid) return;
    const goalDate = new Date();
    goalDate.setMonth(goalDate.getMonth() + goalMonths!);
    router.push({
      pathname: "/onboarding/assessment",
      params: {
        name: name.trim(),
        grade: grade!,
        goalDate: goalDate.toISOString(),
      },
    });
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
                {
                  backgroundColor:
                    i === 0 ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={[
            styles.title,
            { color: colors.foreground, fontFamily: "Poppins_700Bold" },
          ]}
        >
          Tell us about yourself!
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
          ]}
        >
          We'll personalize your coaching to match where you are right now.
        </Text>

        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            Your name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your first name"
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: name.trim().length >= 2 ? colors.primary : colors.border,
                color: colors.foreground,
                fontFamily: "Poppins_400Regular",
                borderRadius: colors.radius,
              },
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            What grade are you in?
          </Text>
          <View style={styles.gradeGrid}>
            {GRADES.map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGrade(g)}
                activeOpacity={0.8}
                style={[
                  styles.gradeChip,
                  {
                    backgroundColor:
                      grade === g ? colors.primary + "20" : colors.card,
                    borderColor: grade === g ? colors.primary : colors.border,
                    borderRadius: colors.radius - 4,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.gradeText,
                    {
                      color: grade === g ? colors.primary : colors.foreground,
                      fontFamily:
                        grade === g ? "Poppins_600SemiBold" : "Poppins_400Regular",
                    },
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
            ]}
          >
            When is your audition?
          </Text>
          <View style={styles.monthGrid}>
            {MONTH_OPTIONS.map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setGoalMonths(m)}
                activeOpacity={0.8}
                style={[
                  styles.monthChip,
                  {
                    backgroundColor:
                      goalMonths === m ? colors.accent + "25" : colors.card,
                    borderColor: goalMonths === m ? colors.accent : colors.border,
                    borderRadius: colors.radius - 4,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.monthNum,
                    {
                      color: goalMonths === m ? colors.accent : colors.foreground,
                      fontFamily: "Poppins_700Bold",
                    },
                  ]}
                >
                  {m}
                </Text>
                <Text
                  style={[
                    styles.monthLabel,
                    { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  {m === 1 ? "month" : "months"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={!isValid}
          style={{ marginTop: 8 }}
        >
          <LinearGradient
            colors={isValid ? ["#E63F6E", "#F5A623"] : [colors.muted, colors.muted]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.continueBtn, { borderRadius: colors.radius }]}
          >
            <Text
              style={[
                styles.continueBtnText,
                {
                  fontFamily: "Poppins_700Bold",
                  color: isValid ? "#fff" : colors.mutedForeground,
                },
              ]}
            >
              Next: Baseline Assessment
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={isValid ? "#fff" : colors.mutedForeground}
            />
          </LinearGradient>
        </TouchableOpacity>
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
    paddingBottom: 8,
  },
  backBtn: { padding: 4 },
  progressDots: { flexDirection: "row", gap: 6 },
  dot: { width: 28, height: 4, borderRadius: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 16, gap: 24, paddingBottom: 40 },
  title: { fontSize: 28, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, lineHeight: 23, marginTop: -12 },
  section: { gap: 12 },
  label: { fontSize: 16 },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  gradeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gradeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
  },
  gradeText: { fontSize: 13 },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  monthChip: {
    width: 82,
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1.5,
    gap: 2,
  },
  monthNum: { fontSize: 22 },
  monthLabel: { fontSize: 11 },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
  },
  continueBtnText: { fontSize: 16 },
});
