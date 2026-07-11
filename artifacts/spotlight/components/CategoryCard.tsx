import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import type { Category } from "@/services/curriculum";

interface CategoryCardProps {
  category: Category;
  score: number | null;
  selected: boolean;
  onPress: () => void;
}

export function CategoryCard({
  category,
  score,
  selected,
  onPress,
}: CategoryCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: selected
            ? category.color + "18"
            : colors.card,
          borderColor: selected ? category.color : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: category.color + "22" },
        ]}
      >
        <Ionicons
          name={category.icon as any}
          size={26}
          color={category.color}
        />
      </View>

      <Text
        style={[
          styles.name,
          {
            color: colors.foreground,
            fontFamily: "Poppins_600SemiBold",
          },
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>

      {score !== null ? (
        <View style={[styles.scoreBadge, { backgroundColor: category.color + "22" }]}>
          <Text
            style={[
              styles.scoreText,
              { color: category.color, fontFamily: "Poppins_700Bold" },
            ]}
          >
            {score.toFixed(1)}
          </Text>
          <Text style={[styles.scoreLabel, { color: category.color }]}>/10</Text>
        </View>
      ) : (
        <View style={[styles.scoreBadge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.noScore, { color: colors.mutedForeground }]}>
            Not yet
          </Text>
        </View>
      )}

      {selected && (
        <View style={[styles.selectedDot, { backgroundColor: category.color }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    gap: 8,
    borderWidth: 1.5,
    minHeight: 120,
    justifyContent: "center",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    textAlign: "center",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 1,
  },
  scoreText: {
    fontSize: 16,
  },
  scoreLabel: {
    fontSize: 10,
  },
  noScore: {
    fontSize: 11,
    fontFamily: "Poppins_400Regular",
  },
  selectedDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
