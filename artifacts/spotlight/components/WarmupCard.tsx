import React, { useState } from "react";
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
import type { Warmup } from "@/services/curriculum";

interface WarmupCardProps {
  warmup: Warmup;
  completed: boolean;
  onComplete: () => void;
}

const typeColors = {
  vocal: "#A78BFA",
  physical: "#FB923C",
  mental: "#34D399",
};

const typeIcons: Record<string, string> = {
  vocal: "musical-notes",
  physical: "body",
  mental: "brain",
};

export function WarmupCard({ warmup, completed, onComplete }: WarmupCardProps) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const typeColor = typeColors[warmup.type];

  function handleComplete() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onComplete();
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: completed ? typeColor : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
        style={styles.header}
      >
        <View style={[styles.iconBadge, { backgroundColor: typeColor + "22" }]}>
          <Ionicons
            name={(typeIcons[warmup.type] ?? "fitness") as any}
            size={20}
            color={typeColor}
          />
        </View>
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={[styles.label, { color: typeColor }]}>
              Daily Warm-Up
            </Text>
            <Text style={[styles.duration, { color: colors.mutedForeground }]}>
              {warmup.duration} min
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
            {warmup.name}
          </Text>
          <Text
            style={[
              styles.description,
              { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
            ]}
          >
            {warmup.description}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.expanded, { borderTopColor: colors.border }]}>
          <Text
            style={[
              styles.instructions,
              {
                color: colors.foreground,
                fontFamily: "Poppins_400Regular",
              },
            ]}
          >
            {warmup.instructions}
          </Text>
        </View>
      )}

      {!completed && (
        <TouchableOpacity
          onPress={handleComplete}
          activeOpacity={0.8}
          style={[
            styles.completeBtn,
            { backgroundColor: typeColor, borderRadius: colors.radius - 4 },
          ]}
        >
          <Ionicons name="checkmark" size={16} color="#fff" />
          <Text style={styles.completeBtnText}>Done!</Text>
        </TouchableOpacity>
      )}

      {completed && (
        <View style={[styles.completedBadge, { backgroundColor: typeColor + "22" }]}>
          <Ionicons name="checkmark-circle" size={16} color={typeColor} />
          <Text style={[styles.completedText, { color: typeColor }]}>
            Warm-up complete!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    padding: 14,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  duration: { fontSize: 11, fontFamily: "Poppins_400Regular" },
  name: { fontSize: 15, marginTop: 1 },
  description: { fontSize: 12, marginTop: 2 },
  expanded: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 2,
  },
  instructions: { fontSize: 13, lineHeight: 20 },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    marginTop: 2,
  },
  completeBtnText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
});
