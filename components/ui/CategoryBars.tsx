import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay, withSpring } from "react-native-reanimated";
import { Chip } from "@/components/ui/Chip";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";

/** Intervalo entre o início de uma barra e o da seguinte, em ms. */
const STAGGER_MS = 60;
/** Lado do círculo do ícone, em dp. */
const ICON_CIRCLE = 32;
/** Altura da barra, em dp. */
const BAR = 8;

export interface CategoryBarRow {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colour: string;
  correct: number;
  total: number;
}

interface CategoryBarsProps {
  /** Linhas em qualquer ordem; o componente ordena por aproveitamento. */
  rows: CategoryBarRow[];
  /** Rótulo do chip da primeira linha ("Ponto forte"). */
  strengthLabel: string;
  /** `false` mostra as barras cheias de uma vez (reduzir movimento, histórico, pulo). */
  animate: boolean;
  /** Espera antes de a primeira barra crescer, em ms. */
  delayMs?: number;
}

/**
 * Barras por área, da melhor para a pior, com a primeira marcada como ponto
 * forte. Nenhuma linha é vermelha: uma área fraca não é um erro.
 *
 * As linhas são genéricas (`{ key, label, icon, colour, correct, total }`), de
 * modo que índices de outro modelo de pontuação substituam as categorias sem
 * mexer aqui.
 */
export function CategoryBars({ rows, strengthLabel, animate, delayMs = 0 }: CategoryBarsProps) {
  const sorted = [...rows].sort((a, b) => ratioOf(b) - ratioOf(a));

  return (
    <View style={styles.list}>
      {sorted.map((row, index) => (
        <BarRow
          key={row.key}
          row={row}
          strengthLabel={index === 0 && row.total > 0 ? strengthLabel : undefined}
          animate={animate}
          delayMs={delayMs + index * STAGGER_MS}
        />
      ))}
    </View>
  );
}

function ratioOf(row: CategoryBarRow): number {
  return row.total > 0 ? row.correct / row.total : 0;
}

interface BarRowProps {
  row: CategoryBarRow;
  strengthLabel?: string;
  animate: boolean;
  delayMs: number;
}

function BarRow({ row, strengthLabel, animate, delayMs }: BarRowProps) {
  const { colors, motion, radius } = useAppTheme();
  const ratio = ratioOf(row);

  // Uma barra vazia some; o mínimo mantém a ponta arredondada visível.
  const target = Math.max(ratio, 0.02);
  const scale = useSharedValue(animate ? 0 : target);

  useEffect(() => {
    if (!animate) {
      cancelAnimation(scale);
      scale.value = target;
      return;
    }
    scale.value = 0;
    scale.value = withDelay(delayMs, withSpring(target, motion.defaultSpatial));
    return () => cancelAnimation(scale);
  }, [animate, delayMs, scale, target, motion.defaultSpatial]);

  // `scaleX` com origem à esquerda: a barra cresce sem recalcular layout.
  const fill = useAnimatedStyle(() => ({
    transform: [{ scaleX: scale.value }],
  }));

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${row.label}: ${row.correct}/${row.total}`}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${row.colour}22` }]}>
        <Ionicons
          name={row.icon}
          size={17}
          color={row.colour}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.labelRow}>
          <ThemedText
            variant="captionStrong"
            numberOfLines={1}
            style={styles.label}
          >
            {row.label}
          </ThemedText>
          {strengthLabel && (
            <Chip
              label={strengthLabel}
              tone="accent"
            />
          )}
          <ThemedText
            variant="caption"
            tone="muted"
            style={styles.count}
          >
            {row.correct}/{row.total}
          </ThemedText>
        </View>

        <View style={[styles.track, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
          <Animated.View style={[styles.fill, { backgroundColor: row.colour, borderRadius: radius.pill }, fill]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    flexShrink: 1,
  },
  count: {
    marginLeft: "auto",
    fontVariant: ["tabular-nums"],
  },
  track: {
    height: BAR,
    overflow: "hidden",
  },
  fill: {
    width: "100%",
    height: "100%",
    transformOrigin: "left center",
  },
});
