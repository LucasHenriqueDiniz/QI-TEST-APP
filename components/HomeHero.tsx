import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { SpeedGlyph } from "@/components/ui/SpeedGlyph";
import { fonts } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";
import type { Glyph } from "@/utils/speed";

/** Os oito quadrados com símbolo, na ordem em que entram; o nono é o "?". */
const GLYPHS: Glyph[] = [
  { shape: "circle", filled: true },
  { shape: "triangle", filled: true },
  { shape: "square", filled: true },
  { shape: "diamond", filled: false },
  { shape: "plus", filled: true },
  { shape: "star", filled: true },
  { shape: "hexagon", filled: false },
  { shape: "cross", filled: true },
];
const STAGGER_MS = 40;
/** O "?" pulsa depois que o último quadrado pousa. */
const PULSE_AT_MS = GLYPHS.length * STAGGER_MS + 250;

interface HomeHeroProps {
  /** Lado do quadrado inteiro, em dp. */
  size: number;
}

/**
 * A matriz 3×3 do ícone da loja, desenhada: oito quadrados com símbolos
 * brancos sobre o gradiente da marca e o nono tracejado, com "?". É o ícone
 * que a pessoa acabou de tocar, então serve também de reconhecimento. Os
 * quadrados entram de mola um atrás do outro e o "?" pulsa duas vezes; com
 * "remover animações", tudo já está no lugar.
 */
export function HomeHero({ size }: HomeHeroProps) {
  const reducedMotion = useReducedMotion();
  const gap = Math.round(size * 0.07);
  const tile = (size - 2 * gap) / 3;

  return (
    <View
      style={[styles.grid, { width: size, height: size, gap }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {GLYPHS.map((glyph, index) => (
        <Tile
          key={index}
          index={index}
          size={tile}
          still={reducedMotion}
        >
          <SpeedGlyph
            glyph={glyph}
            size={tile * 0.46}
            color="#FFFFFF"
          />
        </Tile>
      ))}
      <Missing
        size={tile}
        still={reducedMotion}
      />
    </View>
  );
}

function Tile({ index, size, still, children }: { index: number; size: number; still: boolean; children: React.ReactNode }) {
  const { colors, radius, motion } = useAppTheme();
  const scale = useSharedValue(still ? 1 : 0);

  useEffect(() => {
    if (still) return;
    scale.value = withDelay(index * STAGGER_MS, withSpring(1, motion.fastSpatial));
  }, [index, motion.fastSpatial, scale, still]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ width: size, height: size, borderRadius: radius.md, overflow: "hidden" }, style]}>
      <LinearGradient
        colors={colors.gradientBrand}
        style={styles.tile}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
}

function Missing({ size, still }: { size: number; still: boolean }) {
  const { colors, radius, motion } = useAppTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (still) return;
    const up = withSpring(1.08, motion.defaultSpatial);
    const down = withSpring(1, motion.defaultSpatial);
    scale.value = withDelay(PULSE_AT_MS, withSequence(up, down, up, down));
  }, [motion.defaultSpatial, scale, still]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      style={[
        styles.center,
        { width: size, height: size, borderRadius: radius.md, borderWidth: 2, borderStyle: "dashed", borderColor: colors.primary },
        style,
      ]}
    >
      <Text style={[styles.question, { color: colors.primaryText, fontSize: size * 0.42, lineHeight: size * 0.55 }]}>?</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  question: {
    fontFamily: fonts.display,
    includeFontPadding: false,
  },
});
