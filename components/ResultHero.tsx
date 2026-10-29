import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet } from "react-native";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { ScoreCountUp } from "@/components/ui/ScoreCountUp";
import { TopBar } from "@/components/ui/TopBar";
import { useAppTheme } from "@/context/ThemeContext";

/** Quanto o cartão seguinte sobe por cima do herói, em dp. */
export const HERO_OVERLAP = 24;

export interface ResultHeroTimeline {
  /** Quando a contagem começa, em ms. */
  countDelayMs: number;
  /** Duração da contagem, em ms. */
  countMs: number;
  /** Quando o chip de faixa aparece e a linha de leitura entra, em ms. */
  chipAtMs: number;
}

interface ResultHeroProps {
  /** Pontuação final. */
  score: number;
  /**
   * Faixa provável, já traduzida ("Faixa provável: 108–122"). Sem valor,
   * nada é desenhado: os testes pontuados pela fórmula antiga não a têm.
   */
  bandLabel?: string;
  /** Rótulo da faixa ("Média", "Superior"…). */
  tierLabel: string;
  /** Linha de leitura: percentil ou ponto forte. */
  headline: string;
  /** Partes da faixa de rodapé, já traduzidas; são unidas com " · ". */
  strip: string[];
  overline: string;
  closeLabel: string;
  skipHint: string;
  /** `false` desenha o estado final de uma vez. */
  animate: boolean;
  timeline: ResultHeroTimeline;
  onClose: () => void;
  /** Toque no herói durante a revelação. */
  onSkip: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  /** Camada por cima de tudo (confete). */
  children?: React.ReactNode;
}

/**
 * Herói do resultado: gradiente da marca de borda a borda, sob a barra de
 * status, só com texto branco sólido. A hierarquia vem do tamanho, não da
 * opacidade — branco a 80% sobre o ponto claro do gradiente não passa no
 * contraste.
 *
 * Toda animação aqui é `opacity` e `transform`; o número é um rolo de dígitos.
 */
export function ResultHero({
  score,
  bandLabel,
  tierLabel,
  headline,
  strip,
  overline,
  closeLabel,
  skipHint,
  animate,
  timeline,
  onClose,
  onSkip,
  onLayout,
  children,
}: ResultHeroProps) {
  const { colors, spacing, radius, motion } = useAppTheme();
  const insets = useSafeAreaInsets();
  const white = colors.onPrimary;

  const fade = useSharedValue(animate ? 0 : 1);
  const chip = useSharedValue(animate ? 0 : 1);
  const line = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (!animate) {
      cancelAnimation(fade);
      cancelAnimation(chip);
      cancelAnimation(line);
      fade.value = 1;
      chip.value = 1;
      line.value = 1;
      return;
    }
    fade.value = 0;
    chip.value = 0;
    line.value = 0;
    fade.value = withSpring(1, motion.defaultEffects);
    chip.value = withDelay(timeline.chipAtMs, withSpring(1, motion.fastSpatial));
    line.value = withDelay(timeline.chipAtMs, withTiming(1, { duration: motion.durations.enter }));
    return () => {
      cancelAnimation(fade);
      cancelAnimation(chip);
      cancelAnimation(line);
    };
  }, [animate, timeline.chipAtMs, fade, chip, line, motion]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));
  const chipStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, chip.value),
    transform: [{ scale: 0.6 + 0.4 * chip.value }],
  }));
  const lineStyle = useAnimatedStyle(() => ({ opacity: line.value }));

  return (
    <Pressable
      onPress={onSkip}
      disabled={!animate}
      accessibilityHint={animate ? skipHint : undefined}
      onLayout={onLayout}
    >
      <LinearGradient
        colors={colors.gradientBrand}
        style={{ paddingTop: insets.top, paddingBottom: spacing.lg + HERO_OVERLAP }}
      >
        <TopBar
          leading={{ icon: "close", label: closeLabel, onPress: onClose }}
          color={white}
        />

        <Animated.View style={[styles.body, { paddingHorizontal: spacing.xl }, fadeStyle]}>
          <ThemedText
            variant="overline"
            color={white}
            center
            style={styles.overline}
          >
            {overline.toUpperCase()}
          </ThemedText>

          <ScoreCountUp
            target={score}
            animate={animate}
            delayMs={timeline.countDelayMs}
            durationMs={timeline.countMs}
            color={white}
          />

          {bandLabel !== undefined && (
            <ThemedText
              variant="bodyStrong"
              color={white}
              center
              style={styles.band}
            >
              {bandLabel}
            </ThemedText>
          )}

          <Animated.View style={[styles.chip, { backgroundColor: colors.gradientChip, borderRadius: radius.pill }, chipStyle]}>
            <ThemedText
              variant="captionStrong"
              color={white}
            >
              {tierLabel}
            </ThemedText>
          </Animated.View>

          <Animated.View style={lineStyle}>
            <ThemedText
              variant="body"
              color={white}
              center
            >
              {headline}
            </ThemedText>
          </Animated.View>

          <ThemedText
            variant="caption"
            color={white}
            center
            style={styles.strip}
          >
            {strip.join(" · ")}
          </ThemedText>
        </Animated.View>

        {children}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
  },
  overline: {
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  band: {
    marginTop: -4,
  },
  chip: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  strip: {
    marginTop: 12,
    fontVariant: ["tabular-nums"],
  },
});
