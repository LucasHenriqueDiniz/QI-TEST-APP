import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useAppTheme } from "@/context/ThemeContext";
import { ThemedText } from "@/components/ThemedText";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "medium" | "large";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  /** Ocupa toda a largura disponível. */
  block?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = "primary", size = "medium", icon, disabled, loading, block, style }: ButtonProps) {
  const { colors, radius, shadow, motion } = useAppTheme();

  const isDisabled = disabled || loading;

  // Mola em vez de degrau: o botão assenta ao ser pressionado e volta com
  // inércia. `transform` estático dá um salto seco que lê como travamento.
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const surfaces: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.primary, ...shadow(2) },
    secondary: { backgroundColor: colors.surfaceAlt },
    outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.border },
    ghost: { backgroundColor: "transparent" },
  };

  const contentColors: Record<Variant, string> = {
    primary: colors.onPrimary,
    secondary: colors.text,
    outline: colors.text,
    ghost: colors.primary,
  };

  const contentColor = contentColors[variant];

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      onPress={handlePress}
      onPressIn={() => {
        if (!isDisabled) scale.value = withSpring(0.97, motion.spring);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.spring);
      }}
      disabled={isDisabled}
      style={[
        styles.base,
        size === "large" ? styles.large : styles.medium,
        { borderRadius: radius.lg },
        surfaces[variant],
        block && styles.block,
        isDisabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={size === "large" ? 20 : 18}
              color={contentColor}
            />
          )}
          <ThemedText
            variant={size === "large" ? "subheading" : "bodyStrong"}
            color={contentColor}
            numberOfLines={1}
          >
            {title}
          </ThemedText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 58,
  },
  block: {
    alignSelf: "stretch",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.45,
  },
});
