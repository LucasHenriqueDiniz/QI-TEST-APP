import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

interface CardProps extends ViewProps {
  variant?: "elevated" | "outlined" | "soft";
  padded?: boolean;
}

export function Card({ children, style, variant = "elevated", padded = true, ...rest }: CardProps) {
  const { colors, radius, spacing, shadow } = useAppTheme();

  const variants = {
    elevated: { backgroundColor: colors.surface, ...shadow(1) },
    outlined: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    soft: { backgroundColor: colors.surfaceAlt },
  };

  return (
    <View
      style={[styles.card, { borderRadius: radius.lg }, padded && { padding: spacing.lg }, variants[variant], style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
});
