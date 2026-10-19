import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";
import * as haptics from "@/utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Medidas fixas da célula, em dp. */
const BORDER = 1.5;
/** Anel da alternativa marcada: substitui a borda, não soma a ela. */
const RING = 3;
const BADGE = 22;
/** Entre a borda e o conteúdo, nos quatro lados. */
const PAD = 6;
/** Entre a coluna dos badges e a figura. */
const GUTTER_GAP = 4;

/**
 * Largura que sobra para a figura numa célula de `cellWidth` dp.
 *
 * A figura fica à direita de uma coluna com o badge da letra (e o de
 * confirmação), nunca embaixo deles: os SVGs das alternativas desenham até a
 * borda do viewBox, então um badge sobreposto cobriria parte do estímulo.
 */
export function figureWidthFor(cellWidth: number): number {
  return cellWidth - 2 * (BORDER + PAD) - BADGE - GUTTER_GAP;
}

/** Altura da célula que guarda uma figura de `figureHeight` dp. */
export function cellHeightFor(figureHeight: number): number {
  return figureHeight + 2 * (BORDER + PAD);
}

interface FigureOptionProps {
  /** A, B, C ou D. */
  letter: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  width: number;
  height: number;
  /** A figura, já dimensionada com `figureWidthFor`. */
  children: React.ReactNode;
}

/**
 * Alternativa em figura: célula sobre `paper` com badge de letra à esquerda.
 *
 * Marcada, ganha `paperSelected`, anel de 3 dp na cor da marca, badge
 * preenchido e um check embaixo dele. O anel entra no lugar da borda com o
 * mesmo recuo total (borda + padding constante), para a figura não pular
 * 1,5 dp quando a seleção muda.
 */
export function FigureOption({ letter, selected, onPress, accessibilityLabel, width, height, children }: FigureOptionProps) {
  const { colors, radius, motion } = useAppTheme();

  // Assenta ao toque e volta de mola ao soltar — o "pop" da seleção, só em
  // transform, como o botão.
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const borderWidth = selected ? RING : BORDER;

  const handlePress = () => {
    // Tocar de novo na alternativa já marcada não muda nada; sem vibração.
    if (!selected) haptics.tick();
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(0.98, motion.fastSpatial);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.fastSpatial);
      }}
      style={[
        styles.cell,
        {
          width,
          height,
          borderWidth,
          padding: PAD + BORDER - borderWidth,
          borderRadius: radius.lg,
          backgroundColor: selected ? colors.paperSelected : colors.paper,
          borderColor: selected ? colors.primary : colors.outline,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.gutter}>
        <View
          style={[
            styles.badge,
            selected ? { backgroundColor: colors.primary } : { borderWidth: BORDER, borderColor: colors.outline },
          ]}
        >
          <ThemedText
            variant="overline"
            color={selected ? colors.onPrimary : colors.onPaper}
            style={styles.letter}
            maxFontSizeMultiplier={1.3}
          >
            {letter}
          </ThemedText>
        </View>
        {selected && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Ionicons
              name="checkmark"
              size={14}
              color={colors.onPrimary}
            />
          </View>
        )}
      </View>

      <View style={styles.figure}>{children}</View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flexDirection: "row",
    gap: GUTTER_GAP,
  },
  gutter: {
    width: BADGE,
    justifyContent: "space-between",
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    letterSpacing: 0,
  },
  figure: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
