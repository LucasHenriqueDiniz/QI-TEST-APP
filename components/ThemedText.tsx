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
  const { colors, typography, fonts, fontByVariant } = useAppTheme();

  const tones: Record<ToneName, string> = {
    default: colors.text,
    muted: colors.textMuted,
    faint: colors.textFaint,
    // Texto na cor da marca usa o tom próprio para texto, não o de fundo.
    primary: colors.primaryText,
    accent: colors.accent,
    success: colors.success,
    danger: colors.danger,
    onPrimary: colors.onPrimary,
  };

  // O peso vem embutido no arquivo da fonte (Manrope_700Bold já é bold). Manter
  // `fontWeight` junto faria o Android sintetizar um negrito por cima do
  // negrito real, engordando o traço. Por isso o peso sai quando há família.
  // O teto de escala não é estilo: vai como prop do `Text`.
  const { fontWeight, maxFontSizeMultiplier, ...scale } = typography[variant] as TextStyle & {
    maxFontSizeMultiplier?: number;
  };

  const resolved: StyleProp<TextStyle> = [
    scale,
    { fontFamily: fonts[fontByVariant[variant]], color: color ?? tones[tone] },
    center && { textAlign: "center" as const },
    style,
  ];

  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={resolved}
      {...rest}
    />
  );
}
