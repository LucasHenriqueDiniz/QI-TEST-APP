import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { TypographyVariant } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";

type ToneName = "default" | "muted" | "faint" | "primary" | "accent" | "success" | "danger" | "onPrimary";

export type ThemedTextProps = TextProps & {
  variant?: TypographyVariant;
  tone?: ToneName;
  /** Sobrescreve a cor resolvida pelo `tone`. */
  color?: string;
  center?: boolean;
};

export function ThemedText({ variant = "body", tone = "default", color, center, style, ...rest }: ThemedTextProps) {
  const { colors, typography } = useAppTheme();

  const tones: Record<ToneName, string> = {
    default: colors.text,
    muted: colors.textMuted,
    faint: colors.textFaint,
    primary: colors.primary,
    accent: colors.accent,
    success: colors.success,
    danger: colors.danger,
    onPrimary: colors.onPrimary,
  };

  const resolved: StyleProp<TextStyle> = [
    typography[variant] as TextStyle,
    { color: color ?? tones[tone] },
    center && { textAlign: "center" as const },
    style,
  ];

  return (
    <Text
      style={resolved}
      {...rest}
    />
  );
}
