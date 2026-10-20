import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";
import { useAppTheme } from "@/context/ThemeContext";
import { segmentFills } from "@/utils/progress";

/** Altura da barra e vão entre blocos, em dp. */
const HEIGHT = 8;
const GAP = 4;
/** Quanto um bloco recém-fechado incha no pulso. */
const PULSE_SCALE = 1.5;

interface SegmentedProgressProps {
  /** Questões da rodada. */
  total: number;
  /** Questões já respondidas. */
  answered: number;
  style?: ViewStyle;
}

/**
 * Barra de progresso em blocos (P2): a estrutura da rodada fica visível, os
 * blocos fechados ficam cheios e o atual enche na proporção respondida. O
 * preenchimento é `scaleX` com origem à esquerda — só transform, nada de
 * animar `width`. Um bloco que acaba de fechar dá um pulso.
 */
export function SegmentedProgress({ total, answered, style }: SegmentedProgressProps) {
  const fills = segmentFills(total, answered);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: answered }}
      style={[styles.row, style]}
    >
      {fills.map((fill, index) => (
        <Segment
          key={index}
          fill={fill}
        />
      ))}
    </View>
  );
}

function Segment({ fill }: { fill: number }) {
  const { colors, motion } = useAppTheme();
  const progress = useSharedValue(fill);
  const pulse = useSharedValue(1);
  const previous = useRef(fill);

  useEffect(() => {
    progress.value = withSpring(fill, motion.defaultEffects);
    // O pulso marca o fechamento do bloco, uma vez; a retomada de um teste já
    // monta o bloco cheio e não pulsa.
    if (fill === 1 && previous.current < 1) {
      pulse.value = withSequence(withSpring(PULSE_SCALE, motion.fastSpatial), withSpring(1, motion.fastSpatial));
    }
    previous.current = fill;
  }, [fill, progress, pulse, motion]);

  const trackStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: pulse.value }] }));
  const fillStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: progress.value }] }));

  return (
    <Animated.View style={[styles.track, { backgroundColor: colors.surfaceAlt }, trackStyle]}>
      <Animated.View style={[styles.fill, fillStyle]}>
        <LinearGradient
          colors={colors.gradientBrand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: GAP,
    height: HEIGHT,
  },
  track: {
    flex: 1,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transformOrigin: "left",
  },
});
