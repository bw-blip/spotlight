import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
}

export function ScoreRing({
  score,
  size = 64,
  strokeWidth = 6,
  color,
  showLabel = true,
}: ScoreRingProps) {
  const colors = useColors();
  const ringColor = color ?? colors.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(10, Math.max(0, score)) / 10;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;
  const fontSize = size < 50 ? 14 : size < 80 ? 18 : 24;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={center}
          originY={center}
        />
      </Svg>
      {showLabel && (
        <Text
          style={[
            styles.score,
            { fontSize, color: ringColor, fontFamily: "Poppins_700Bold" },
          ]}
        >
          {score.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  score: {
    fontWeight: "700",
    textAlign: "center",
  },
});
