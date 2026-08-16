import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useAppTheme } from "@/context/ThemeContext";

interface ProgressBarProps {
  /** Progresso de 0 a 1. */
  value: number;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({ value, height = 8, style }: ProgressBarProps) {
  const { colors, radius } = useAppTheme();
  const progress = useSharedValue(0);

  const clamped = Math.min(Math.max(value, 0), 1);

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: 400 });
  }, [clamped, progress]);

  const fill = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt }, style]}
    >
      <Animated.View style={[styles.fill, { borderRadius: radius.pill, backgroundColor: colors.primary }, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
  },
});
