import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Switch,
} from "react-native";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { clearAll, saveProfile } from "@/services/storage";
import { CATEGORIES } from "@/services/curriculum";
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
  cancelDailyReminder,
  formatReminderTime,
} from "@/services/notifications";

const GRADE_NOTE: Record<string, string> = {
  Kindergarten: "K",
  "1st Grade": "grades 1-2",
  "2nd Grade": "grades 1-2",
  "3rd Grade": "grades 3-5",
  "4th Grade": "grades 3-5",
  "5th Grade": "grades 3-5",
  "6th Grade": "grades 6-8",
  "7th Grade": "grades 6-8",
  "8th Grade": "grades 6-8",
  "9th Grade": "grades 9-12",
  "10th Grade": "grades 9-12",
  "11th Grade": "grades 9-12",
  "12th Grade": "grades 9-12",
};

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6am - 9pm
const MINUTES = [0, 15, 30, 45];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, scores, refreshAll } = useApp();
  const topInset = Platform.OS === "web" ? 67 : 0;

  const [reminderEnabled, setReminderEnabled] = useState(
    profile?.reminderEnabled ?? false
  );
  const [reminderHour, setReminderHour] = useState(
    profile?.reminderHour ?? 16
  );
  const [reminderMinute, setReminderMinute] = useState(
    profile?.reminderMinute ?? 0
  );
  const [savingReminder, setSavingReminder] = useState(false);

  if (!profile) return <Redirect href="/onboarding" />;

  const totalExercises = scores.filter((s) => s.exerciseId !== "baseline").length;

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  async function handleToggleReminder(value: boolean) {
    if (!profile) return;
    setReminderEnabled(value);
    if (value) {
      let granted = false;
      try {
        granted = await requestNotificationPermissions();
      } catch {
        granted = false;
      }
      if (!granted) {
        setReminderEnabled(false);
        if (Platform.OS !== "web") {
          Alert.alert(
            "Notifications Blocked",
            "Please allow notifications in your device settings to enable daily reminders."
          );
        }
        return;
      }
      try {
        await scheduleDailyReminder(reminderHour, reminderMinute);
      } catch {
        setReminderEnabled(false);
        Alert.alert(
          "Could not schedule reminder",
          "Something went wrong setting up your reminder. Please try again."
        );
        return;
      }
    } else {
      try {
        await cancelDailyReminder();
      } catch {
        // cancellation failure is non-critical; proceed to save the off state
      }
    }
    await saveProfile({
      ...profile,
      reminderEnabled: value,
      reminderHour,
      reminderMinute,
    });
  }

  async function handleSaveReminderTime() {
    if (!profile) return;
    setSavingReminder(true);
    if (reminderEnabled) {
      try {
        await scheduleDailyReminder(reminderHour, reminderMinute);
      } catch {
        setSavingReminder(false);
        Alert.alert(
          "Could not schedule reminder",
          "Something went wrong updating your reminder. Please try again."
        );
        return;
      }
    }
    await saveProfile({
      ...profile,
      reminderEnabled,
      reminderHour,
      reminderMinute,
    });
    setSavingReminder(false);
    Alert.alert(
      "Reminder saved!",
      reminderEnabled
        ? `You'll get a daily reminder at ${formatReminderTime(reminderHour, reminderMinute)}.`
        : "Reminders are turned off."
    );
  }

  function handleReset() {
    Alert.alert(
      "Reset App",
      "This will erase all your progress and scores. This cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await cancelDailyReminder();
            await clearAll();
            await refreshAll();
            router.replace("/onboarding");
          },
        },
      ]
    );
  }

  const highestCategory = CATEGORIES.reduce(
    (best, cat) => {
      const catScores = scores.filter((s) => s.categoryId === cat.id);
      if (catScores.length === 0) return best;
      const latest = catScores.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      if (!best || latest.score > best.score) {
        return { category: cat, score: latest.score };
      }
      return best;
    },
    null as { category: (typeof CATEGORIES)[0]; score: number } | null
  );

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
          Settings
        </Text>

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.primary + "12",
              borderRadius: colors.radius,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary + "30" },
            ]}
          >
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.profileName,
                { color: colors.foreground, fontFamily: "Poppins_700Bold" },
              ]}
            >
              {profile.name}
            </Text>
            <Text
              style={[
                styles.profileGrade,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Poppins_400Regular",
                },
              ]}
            >
              {profile.grade} · AI calibrated for {GRADE_NOTE[profile.grade] ?? "your grade"}
            </Text>
            <Text
              style={[
                styles.profileDate,
                {
                  color: colors.mutedForeground,
                  fontFamily: "Poppins_400Regular",
                },
              ]}
            >
              Audition: {formatDate(profile.goalDate)}
            </Text>
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.mutedForeground,
                fontFamily: "Poppins_600SemiBold",
              },
            ]}
          >
            DAILY REMINDERS
          </Text>
          <View
            style={[
              styles.reminderCard,
              { backgroundColor: colors.card, borderRadius: colors.radius },
            ]}
          >
            <View style={styles.reminderToggleRow}>
              <View style={styles.reminderToggleLeft}>
                <Ionicons name="notifications-outline" size={18} color={colors.accent} />
                <View>
                  <Text
                    style={[
                      styles.reminderToggleTitle,
                      { color: colors.foreground, fontFamily: "Poppins_600SemiBold" },
                    ]}
                  >
                    Practice Reminders
                  </Text>
                  <Text
                    style={[
                      styles.reminderToggleSub,
                      { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
                    ]}
                  >
                    {reminderEnabled
                      ? `Daily at ${formatReminderTime(reminderHour, reminderMinute)}`
                      : "Off"}
                  </Text>
                </View>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={handleToggleReminder}
                trackColor={{ false: colors.border, true: colors.primary + "80" }}
                thumbColor={reminderEnabled ? colors.primary : colors.mutedForeground}
              />
            </View>

            {reminderEnabled && (
              <View style={styles.timePicker}>
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <Text
                  style={[
                    styles.timePickerLabel,
                    { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  Reminder time
                </Text>
                <View style={styles.timePickerRow}>
                  <View style={styles.timeColumn}>
                    <Text style={[styles.timeColumnLabel, { color: colors.mutedForeground }]}>
                      Hour
                    </Text>
                    <ScrollView
                      style={[
                        styles.timeScroll,
                        { borderColor: colors.border },
                      ]}
                      showsVerticalScrollIndicator={false}
                    >
                      {HOURS.map((h) => (
                        <TouchableOpacity
                          key={h}
                          onPress={() => setReminderHour(h)}
                          style={[
                            styles.timeOption,
                            reminderHour === h && {
                              backgroundColor: colors.primary + "20",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.timeOptionText,
                              {
                                color:
                                  reminderHour === h
                                    ? colors.primary
                                    : colors.foreground,
                                fontFamily:
                                  reminderHour === h
                                    ? "Poppins_700Bold"
                                    : "Poppins_400Regular",
                              },
                            ]}
                          >
                            {h > 12
                              ? `${h - 12} PM`
                              : h === 12
                              ? "12 PM"
                              : `${h} AM`}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.timeColumn}>
                    <Text style={[styles.timeColumnLabel, { color: colors.mutedForeground }]}>
                      Minute
                    </Text>
                    <View
                      style={[styles.timeScroll, { borderColor: colors.border }]}
                    >
                      {MINUTES.map((m) => (
                        <TouchableOpacity
                          key={m}
                          onPress={() => setReminderMinute(m)}
                          style={[
                            styles.timeOption,
                            reminderMinute === m && {
                              backgroundColor: colors.primary + "20",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.timeOptionText,
                              {
                                color:
                                  reminderMinute === m
                                    ? colors.primary
                                    : colors.foreground,
                                fontFamily:
                                  reminderMinute === m
                                    ? "Poppins_700Bold"
                                    : "Poppins_400Regular",
                              },
                            ]}
                          >
                            :{m.toString().padStart(2, "0")}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSaveReminderTime}
                  activeOpacity={0.85}
                  style={[
                    styles.saveTimeBtn,
                    {
                      backgroundColor: colors.primary,
                      borderRadius: colors.radius - 4,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.saveTimeBtnText,
                      { fontFamily: "Poppins_600SemiBold" },
                    ]}
                  >
                    {savingReminder ? "Saving..." : "Save Reminder Time"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.mutedForeground,
                fontFamily: "Poppins_600SemiBold",
              },
            ]}
          >
            MY STATS
          </Text>
          <View
            style={[
              styles.statsCard,
              { backgroundColor: colors.card, borderRadius: colors.radius },
            ]}
          >
            <View style={styles.statRow}>
              <Ionicons name="mic-outline" size={18} color={colors.primary} />
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: colors.foreground,
                    fontFamily: "Poppins_400Regular",
                  },
                ]}
              >
                Practice sessions recorded
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: colors.foreground, fontFamily: "Poppins_700Bold" },
                ]}
              >
                {totalExercises}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            {highestCategory && (
              <View style={styles.statRow}>
                <Ionicons
                  name={highestCategory.category.icon as any}
                  size={18}
                  color={highestCategory.category.color}
                />
                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: colors.foreground,
                      fontFamily: "Poppins_400Regular",
                    },
                  ]}
                >
                  Strongest skill
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: highestCategory.category.color,
                      fontFamily: "Poppins_700Bold",
                    },
                  ]}
                >
                  {highestCategory.category.name}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.mutedForeground,
                fontFamily: "Poppins_600SemiBold",
              },
            ]}
          >
            ABOUT
          </Text>
          <View
            style={[
              styles.aboutCard,
              { backgroundColor: colors.card, borderRadius: colors.radius },
            ]}
          >
            <View
              style={[
                styles.aboutRow,
                {
                  backgroundColor: colors.primary + "10",
                  borderRadius: colors.radius - 4,
                },
              ]}
            >
              <Ionicons name="star" size={20} color={colors.accent} />
              <Text
                style={[
                  styles.aboutText,
                  {
                    color: colors.foreground,
                    fontFamily: "Poppins_400Regular",
                  },
                ]}
              >
                Spotlight uses AI to give you coaching feedback calibrated for
                your grade level. Keep recording yourself to see your scores improve!
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionGroup}>
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.mutedForeground,
                fontFamily: "Poppins_600SemiBold",
              },
            ]}
          >
            ACCOUNT
          </Text>
          <TouchableOpacity
            onPress={handleReset}
            activeOpacity={0.85}
            style={[
              styles.resetBtn,
              {
                backgroundColor: colors.destructive + "12",
                borderColor: colors.destructive + "40",
                borderRadius: colors.radius,
              },
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.destructive} />
            <Text
              style={[
                styles.resetText,
                {
                  color: colors.destructive,
                  fontFamily: "Poppins_600SemiBold",
                },
              ]}
            >
              Reset App & Start Over
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, gap: 20 },
  screenTitle: { fontSize: 28, letterSpacing: -0.5, marginBottom: -4 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 20 },
  profileGrade: { fontSize: 13 },
  profileDate: { fontSize: 12, marginTop: 2 },
  sectionGroup: { gap: 8 },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 0.8,
  },
  reminderCard: { overflow: "hidden" },
  reminderToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  reminderToggleLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  reminderToggleTitle: { fontSize: 14 },
  reminderToggleSub: { fontSize: 12, marginTop: 1 },
  timePicker: { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  timePickerLabel: { fontSize: 12 },
  timePickerRow: { flexDirection: "row", gap: 12 },
  timeColumn: { flex: 1, gap: 6 },
  timeColumnLabel: { fontSize: 11, fontFamily: "Poppins_400Regular", textAlign: "center" },
  timeScroll: {
    borderWidth: 1,
    borderRadius: 10,
    maxHeight: 160,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  timeOptionText: { fontSize: 14 },
  saveTimeBtn: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveTimeBtnText: { color: "#fff", fontSize: 14 },
  statsCard: { overflow: "hidden" },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  statLabel: { flex: 1, fontSize: 14 },
  statValue: { fontSize: 14 },
  divider: { height: 1, marginHorizontal: 14 },
  aboutCard: { padding: 12 },
  aboutRow: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    alignItems: "flex-start",
  },
  aboutText: { flex: 1, fontSize: 13, lineHeight: 20 },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    borderWidth: 1,
  },
  resetText: { fontSize: 15 },
});
