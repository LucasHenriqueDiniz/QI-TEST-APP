import React from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text, ViewStyle, TextStyle } from "react-native";
import { useTheme } from "context/ThemeContext";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ onPress, title, variant = "primary", size = "medium", disabled, loading, style, textStyle }: ButtonProps) {
  const { theme, colors } = useTheme();

  const buttonStyles = [
    styles.button,
    styles[size],
    variant === "primary" && { backgroundColor: colors[theme].primary },
    variant === "secondary" && { backgroundColor: colors[theme].card },
    variant === "outline" && {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors[theme].primary,
    },
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === "primary" && { color: "#FFFFFF" },
    variant === "secondary" && { color: colors[theme].text },
    variant === "outline" && { color: colors[theme].primary },
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : colors[theme].primary} /> : <Text style={textStyles}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabledText: {
    opacity: 0.5,
  },
});
