import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const { height } = Dimensions.get("window");

const SKILLS = [
  { icon: "film-outline", label: "Acting", color: "#FF6B6B" },
  { icon: "musical-notes-outline", label: "Singing", color: "#A78BFA" },
  { icon: "mic-outline", label: "Speaking", color: "#34D399" },
  { icon: "body-outline", label: "Movement", color: "#FB923C" },
  { icon: "star-outline", label: "Confidence", color: "#F472B6" },
];

function SkillBadge({ icon, label, color, delay }: { icon: string; label: string; color: string; delay: number }) {
  const colors = useColors();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(delay, withSpring(0, { damping: 14 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        style,
        styles.badge,
        { backgroundColor: color + "22", borderColor: color + "44" },
      ]}
    >
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={[styles.badgeText, { color, fontFamily: "Poppins_600SemiBold" }]}>
        {label}
      </Text>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);
  const btnY = useSharedValue(20);

  useEffect(() => {
    titleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    titleY.value = withDelay(200, withSpring(0, { damping: 14 }));
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    btnOpacity.value = withDelay(900, withTiming(1, { duration: 500 }));
    btnY.value = withDelay(900, withSpring(0, { damping: 14 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnY.value }],
  }));

  return (
    <LinearGradient
      colors={["#170A1E", "#2A1035", "#1A0815"]}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#E63F6E", "#F5A623"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spotlightIcon}
          >
            <Ionicons name="star" size={44} color="#fff" />
          </LinearGradient>
        </View>

        <Animated.View style={titleStyle}>
          <Text style={[styles.appName, { fontFamily: "Poppins_700Bold" }]}>
            Spotlight
          </Text>
          <Text style={[styles.tagline, { fontFamily: "Poppins_400Regular" }]}>
            Your personal performing arts coach
          </Text>
        </Animated.View>

        <Animated.View style={[styles.skillsGrid, subStyle]}>
          {SKILLS.map((s, i) => (
            <SkillBadge
              key={s.label}
              icon={s.icon}
              label={s.label}
              color={s.color}
              delay={600 + i * 80}
            />
          ))}
        </Animated.View>

        <Animated.View style={[styles.desc, subStyle]}>
          <Text style={[styles.descText, { fontFamily: "Poppins_400Regular" }]}>
            Daily exercises, AI coaching feedback, and progress tracking — all
            designed to help you earn that lead role.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.btnContainer, btnStyle]}>
        <TouchableOpacity
          onPress={() => router.push("/onboarding/profile")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#E63F6E", "#F5A623"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={[styles.btnText, { fontFamily: "Poppins_700Bold" }]}>
              Let's Get Started
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 24,
  },
  iconContainer: { alignItems: "center" },
  spotlightIcon: {
    width: 96,
    height: 96,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E63F6E",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  appName: {
    fontSize: 48,
    color: "#fff",
    textAlign: "center",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    marginTop: -4,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: { fontSize: 13 },
  desc: { paddingHorizontal: 8 },
  descText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 24,
  },
  btnContainer: { paddingHorizontal: 24, paddingBottom: 24 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: "#E63F6E",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8,
  },
  btnText: { color: "#fff", fontSize: 18 },
});
