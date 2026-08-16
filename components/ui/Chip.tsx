import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import { ThemedText } from "@/components/ThemedText";

type ChipTone = "neutral" | "primary" | "accent" | "success" | "danger";

interface ChipProps {
  label: string;
  tone?: ChipTone;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export function Chip({ label, tone = "neutral", icon, style }: ChipProps) {
  const { colors, radius } = useAppTheme();

  const tones: Record<ChipTone, { bg: string; fg: string }> = {
    neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
    primary: { bg: colors.primarySoft, fg: colors.primary },
    accent: { bg: colors.accentSoft, fg: colors.accent },
    success: { bg: colors.successSoft, fg: colors.success },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
  };

  const { bg, fg } = tones[tone];

  return (
    <View style={[styles.chip, { backgroundColor: bg, borderRadius: radius.pill }, style]}>
      {icon && (
        <Ionicons
          name={icon}
          size={13}
          color={fg}
        />
      )}
      <ThemedText
        variant="overline"
        color={fg}
      >
        {label.toUpperCase()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
