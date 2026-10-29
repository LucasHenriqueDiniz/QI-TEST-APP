import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  SharedValue,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "@/context/ThemeContext";

const TILES = 9;
/** Quanto cada quadrado fica aceso antes de o próximo acender. */
const STEP_MS = 120;

interface GridLoaderProps {
  /** Lado do quadrado inteiro, em dp. */
  size?: number;
}

/**
 * O motivo 3×3 da marca como indicador de espera: os nove quadrados acendem
 * em sequência, linha a linha, e apagam devagar. Só opacidade. Com
 * "remover animações" ligado, os nove ficam acesos e parados.
 */
export function GridLoader({ size = 72 }: GridLoaderProps) {
  const { colors, radius } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    progress.value = withRepeat(withTiming(TILES, { duration: TILES * STEP_MS, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(progress);
  }, [progress, reducedMotion]);

  const gap = Math.round(size * 0.08);
  const tile = (size - 2 * gap) / 3;

  return (
    <View
      style={[styles.grid, { width: size, height: size, gap }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: TILES }, (_, order) => (
        <Tile
          key={order}
          order={order}
          progress={progress}
          still={reducedMotion}
          size={tile}
          color={colors.primary}
          radius={radius.sm}
        />
      ))}
    </View>
  );
}

interface TileProps {
  order: number;
  progress: SharedValue<number>;
  still: boolean;
  size: number;
  color: string;
  radius: number;
}

function Tile({ order, progress, still, size, color, radius }: TileProps) {
  const style = useAnimatedStyle(() => {
    if (still) return { opacity: 1 };
    // Há quanto tempo, em passos, este quadrado acendeu (0 = agora).
    const since = (progress.value - order + TILES) % TILES;
    return { opacity: interpolate(since, [0, 1, 3, TILES], [1, 0.8, 0.22, 0.22], Extrapolation.CLAMP) };
  });

  return <Animated.View style={[{ width: size, height: size, borderRadius: radius, backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
