import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "context/ThemeContext";

interface CardProps extends ViewProps {
  variant?: "elevated" | "outlined";
}

export function Card({ children, style, variant = "elevated", ...props }: CardProps) {
  const { theme, colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        variant === "elevated" && styles.elevated,
        variant === "outlined" && styles.outlined,
        {
          backgroundColor: colors[theme].card,
          borderColor: colors[theme].border,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  outlined: {
    borderWidth: 1,
  },
});
