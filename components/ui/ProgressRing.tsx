import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";

interface ProgressRingProps {
  done: number;
  total: number;
  size?: number;
  /** Rótulo para leitores de tela ("12 de 40 questões respondidas"). */
  accessibilityLabel: string;
}

/** Anel de progresso com "12/40" no meio. */
export function ProgressRing({ done, total, size = 48, accessibilityLabel }: ProgressRingProps) {
  const { colors } = useAppTheme();
  const stroke = 4;
  const r = (size - stroke) / 2;
  const length = 2 * Math.PI * r;
  const fraction = total > 0 ? Math.min(done / total, 1) : 0;

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg
        width={size}
        height={size}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.surfaceAlt}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.primary}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${length * fraction} ${length}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <ThemedText
          variant="overline"
          maxFontSizeMultiplier={1}
          style={styles.label}
        >
          {`${done}/${total}`}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    letterSpacing: 0,
    fontSize: 11,
  },
});
