import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import type { Exercise } from "@/services/curriculum";

interface ExerciseCardProps {
  exercise: Exercise;
  categoryColor: string;
  completed: boolean;
  latestScore?: number | null;
  onRecord: () => void;
  onMarkDone: () => void;
}

const difficultyLabel = ["", "Beginner", "Intermediate", "Advanced"];

export function ExerciseCard({
  exercise,
  categoryColor,
  completed,
  latestScore,
  onRecord,
  onMarkDone,
}: ExerciseCardProps) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  function handleMarkDone() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onMarkDone();
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: completed ? categoryColor : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.85}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.diffBadge,
                { backgroundColor: categoryColor + "22" },
              ]}
            >
              <Text
                style={[
                  styles.diffText,
                  { color: categoryColor, fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                {difficultyLabel[exercise.difficulty]}
              </Text>
            </View>
            <Text style={[styles.duration, { color: colors.mutedForeground }]}>
              {exercise.duration} min
            </Text>
          </View>
          <Text
            style={[
              styles.name,
              {
                color: colors.foreground,
                fontFamily: "Poppins_600SemiBold",
              },
            ]}
          >
            {exercise.name}
          </Text>
          <Text
            style={[
              styles.description,
              { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
            ]}
          >
            {exercise.description}
          </Text>
        </View>

        <View style={styles.rightSide}>
          {completed && latestScore !== null && latestScore !== undefined && (
            <View
              style={[
                styles.scoreBubble,
                { backgroundColor: categoryColor + "22" },
              ]}
            >
              <Text
                style={[
                  styles.scoreNum,
                  { color: categoryColor, fontFamily: "Poppins_700Bold" },
                ]}
              >
                {latestScore.toFixed(1)}
              </Text>
            </View>
          )}
          {completed && (
            <Ionicons name="checkmark-circle" size={24} color={categoryColor} />
          )}
          {!completed && (
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.mutedForeground}
            />
          )}
        </View>
      </TouchableOpacity>

      {expanded && !completed && (
        <View style={[styles.expandedContent, { borderTopColor: colors.border }]}>
          <Text
            style={[
              styles.instructions,
              {
                color: colors.foreground,
                fontFamily: "Poppins_400Regular",
              },
            ]}
          >
            {exercise.instructions}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onRecord}
              activeOpacity={0.85}
              style={[
                styles.recordBtn,
                {
                  backgroundColor: categoryColor,
                  borderRadius: colors.radius - 4,
                },
              ]}
            >
              <Ionicons name="mic" size={16} color="#fff" />
              <Text style={styles.recordBtnText}>Record & Get Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleMarkDone}
              activeOpacity={0.85}
              style={[
                styles.doneBtn,
                {
                  borderColor: categoryColor,
                  borderRadius: colors.radius - 4,
                },
              ]}
            >
              <Text
                style={[
                  styles.doneBtnText,
                  { color: categoryColor, fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                Mark Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    padding: 14,
    gap: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  headerLeft: { flex: 1, gap: 3 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  diffBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  diffText: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.3 },
  duration: { fontSize: 11, fontFamily: "Poppins_400Regular" },
  name: { fontSize: 15, marginTop: 2 },
  description: { fontSize: 12, marginTop: 1 },
  rightSide: {
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  scoreBubble: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: "center",
  },
  scoreNum: { fontSize: 16 },
  expandedContent: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
    gap: 12,
  },
  instructions: {
    fontSize: 13,
    lineHeight: 20,
  },
  actions: { gap: 8 },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  recordBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  doneBtn: {
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  doneBtnText: { fontSize: 13 },
});
