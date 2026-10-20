import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";

/** Quanto tempo o chip fica parado antes de sumir, em ms. */
const HOLD_MS = 1800;
/** Altura da pílula, em dp. */
const HEIGHT = 28;

interface MilestoneChipProps {
  /** Texto a mostrar; `null` não mostra nada. Um texto novo reinicia a entrada. */
  label: string | null;
  /** Chamado quando o chip terminou de sumir sozinho. */
  onHidden: () => void;
  /**
   * Onde a camada fica dentro do pai (posição absoluta): as bordas do texto
   * que o chip cobre. Filhos absolutos ignoram o padding do pai, então quem
   * usa passa a margem do conteúdo aqui.
   */
  style?: ViewStyle;
}

/**
 * Pílula de incentivo (P2): "Bom começo!", "1 de 4 blocos concluído". Entra
 * de mola, fica 1,8 s e sai sozinha. Vive numa camada por cima da linha da
 * categoria, sem ocupar altura própria — o layout não pula quando aparece. A
 * camada tem o fundo da tela e aparece junto com a pílula: o texto de baixo
 * some enquanto ela está lá, em vez de vazar pelo lado dela.
 * Sem vibração: o marco acompanha a resposta, que já vibrou.
 */
export function MilestoneChip({ label, onHidden, style }: MilestoneChipProps) {
  const { colors, radius, motion } = useAppTheme();
  const progress = useSharedValue(0);
  // O texto fica enquanto o chip sai, senão a pílula esvazia antes de sumir.
  const [shown, setShown] = useState<string | null>(null);
  const hiddenRef = useRef(onHidden);
  hiddenRef.current = onHidden;

  useEffect(() => {
    if (!label) return;
    setShown(label);
    progress.value = 0;
    progress.value = withSpring(1, motion.defaultSpatial);

    const timer = setTimeout(() => {
      progress.value = withTiming(0, { duration: motion.durations.exit }, (finished) => {
        if (finished) runOnJS(hiddenRef.current)();
      });
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [label, progress, motion]);

  const layerStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.9 + 0.1 * progress.value }, { translateY: 6 * (1 - progress.value) }],
  }));

  if (!shown) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.layer, { backgroundColor: colors.background }, style, layerStyle]}
    >
      <Animated.View
        accessibilityLiveRegion="polite"
        style={[styles.pill, { backgroundColor: colors.primarySoft, borderRadius: radius.pill }, pillStyle]}
      >
        <ThemedText
          variant="captionStrong"
          tone="primary"
          numberOfLines={1}
        >
          {shown}
        </ThemedText>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
  },
  pill: {
    alignSelf: "flex-start",
    minHeight: HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});
