import React, { useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";
import * as haptics from "@/utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Medidas fixas do cartão, em dp. */
const MIN_HEIGHT = 60;
const BORDER = 1.5;
/** Borda da alternativa marcada: entra no lugar da fina, sem somar a ela. */
const SELECTED_BORDER = 2;
const PAD_X = 16;
const PAD_Y = 12;
const BADGE = 32;
const GAP = 14;
/** Escala do "pop" ao tocar. */
const PRESSED_SCALE = 0.98;

interface OptionCardProps {
  /** A, B, C ou D. */
  letter: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

/**
 * Alternativa de texto: cartão sobre `surface` com badge de letra à esquerda.
 *
 * Marcada, ganha borda de 2 dp na cor da marca, fundo `primarySoft` e badge
 * preenchido. O fundo é uma camada cuja opacidade anima (`fastEffects`), e o
 * toque assenta e volta de mola (`fastSpatial`): só transform e opacity. O
 * padding compensa a borda mais grossa para o texto não pular 0,5 dp.
 */
export function OptionCard({ letter, label, selected, onPress }: OptionCardProps) {
  const { colors, radius, motion } = useAppTheme();

  const scale = useSharedValue(1);
  const fill = useSharedValue(selected ? 1 : 0);
  const wasSelected = useRef(selected);

  useEffect(() => {
    fill.value = withSpring(selected ? 1 : 0, motion.fastEffects);
    // Pop só quando a seleção chega por este cartão ou por outro; o primeiro
    // render de uma alternativa já marcada (retomada) não pula.
    if (selected && !wasSelected.current) {
      scale.value = PRESSED_SCALE;
      scale.value = withSpring(1, motion.fastSpatial);
    }
    wasSelected.current = selected;
  }, [selected, fill, scale, motion]);

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const fillStyle = useAnimatedStyle(() => ({ opacity: fill.value }));

  const borderWidth = selected ? SELECTED_BORDER : BORDER;

  const handlePress = () => {
    // Tocar de novo na alternativa já marcada não muda nada; sem vibração.
    if (!selected) haptics.tick();
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${letter}. ${label}`}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withSpring(PRESSED_SCALE, motion.fastSpatial);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.fastSpatial);
      }}
      style={[
        styles.card,
        {
          borderWidth,
          paddingHorizontal: PAD_X + BORDER - borderWidth,
          paddingVertical: PAD_Y + BORDER - borderWidth,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          borderColor: selected ? colors.primary : colors.outline,
        },
        cardStyle,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.fill, { backgroundColor: colors.primarySoft, borderRadius: radius.lg - borderWidth }, fillStyle]}
      />

      <View
        style={[
          styles.badge,
          selected ? { backgroundColor: colors.primary } : { borderWidth: BORDER, borderColor: colors.outline },
        ]}
      >
        <ThemedText
          variant="captionStrong"
          color={selected ? colors.onPrimary : colors.textMuted}
          maxFontSizeMultiplier={1.3}
        >
          {letter}
        </ThemedText>
      </View>

      <ThemedText
        variant={selected ? "bodyStrong" : "body"}
        style={styles.label}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: MIN_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: GAP,
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
  },
});
