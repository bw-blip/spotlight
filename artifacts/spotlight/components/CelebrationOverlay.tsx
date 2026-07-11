import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const { width, height } = Dimensions.get("window");

const MESSAGES = [
  "Amazing work!",
  "You crushed it!",
  "Star performance!",
  "Brilliant!",
  "You're a natural!",
];

interface ConfettiPieceProps {
  x: number;
  color: string;
  delay: number;
}

function ConfettiPiece({ x, color, delay }: ConfettiPieceProps) {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS === "web") return;
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    translateY.value = withDelay(
      delay,
      withTiming(height * 0.8, {
        duration: 2000,
        easing: Easing.in(Easing.quad),
      })
    );
    rotation.value = withDelay(
      delay,
      withTiming(360 * 3, { duration: 2000 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
    position: "absolute",
    left: x,
    top: 0,
  }));

  return (
    <Animated.View
      style={[style, { width: 10, height: 10, backgroundColor: color, borderRadius: 2 }]}
    />
  );
}

const CONFETTI_COLORS = [
  "#E63F6E",
  "#F5A623",
  "#A78BFA",
  "#34D399",
  "#FB923C",
  "#F472B6",
  "#60A5FA",
];

interface CelebrationOverlayProps {
  visible: boolean;
  onDismiss: () => void;
}

export function CelebrationOverlay({ visible, onDismiss }: CelebrationOverlayProps) {
  const colors = useColors();
  const overlayOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.6);
  const cardOpacity = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  const pieces = Array.from({ length: 24 }, (_, i) => ({
    x: Math.random() * width,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 400,
  }));

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 250 });
      cardScale.value = withSpring(1, { damping: 14, stiffness: 200 });
      cardOpacity.value = withTiming(1, { duration: 250 });
      timeoutRef.current = setTimeout(() => {
        overlayOpacity.value = withTiming(0, { duration: 400 });
        cardOpacity.value = withTiming(0, { duration: 300 });
        setTimeout(() => runOnJS(onDismiss)(), 400);
      }, 2200);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.overlay, overlayStyle]}
      pointerEvents="none"
    >
      {Platform.OS !== "web" &&
        pieces.map((p, i) => (
          <ConfettiPiece key={i} x={p.x} color={p.color} delay={p.delay} />
        ))}

      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderRadius: colors.radius + 8,
          },
          cardStyle,
        ]}
      >
        <Ionicons name="star" size={48} color={colors.accent} />
        <Text
          style={[
            styles.message,
            { color: colors.foreground, fontFamily: "Poppins_700Bold" },
          ]}
        >
          {message}
        </Text>
        <Text
          style={[
            styles.sub,
            { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
          ]}
        >
          Exercise complete!
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  card: {
    padding: 32,
    alignItems: "center",
    gap: 10,
    minWidth: 220,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 12,
  },
  message: {
    fontSize: 26,
    textAlign: "center",
  },
  sub: {
    fontSize: 15,
    textAlign: "center",
  },
});
