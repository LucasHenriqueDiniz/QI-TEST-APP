import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, SharedValue, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useAppTheme } from "@/context/ThemeContext";

/** Partículas: fica abaixo do teto de 40 views animadas do orçamento. */
const COUNT = 36;
/** Duração total, em ms. */
const DURATION_MS = 1400;

interface Particle {
  colour: string;
  width: number;
  height: number;
  /** Deslocamento final, em dp. */
  dx: number;
  dy: number;
  /** Voltas completas até o fim. */
  spin: number;
  /** Demora relativa (0–0.25) para a chuva não sair toda num bloco. */
  lag: number;
}

interface ConfettiProps {
  /** Largura e altura da área sobre a qual as partículas caem. */
  width: number;
  height: number;
  /** Chamado quando a última partícula apagou; desmonte o componente aqui. */
  onDone?: () => void;
}

/**
 * Explosão de confete de uma vez só: ≤ 40 `Animated.View`, só `transform` e
 * `opacity`, 1,4 s. Sai do centro superior da área e cai com gravidade.
 *
 * Quem decide se há motivo para festa é a tela; este componente só a executa
 * e não deve ser montado com "reduzir movimento" ligado.
 */
export function Confetti({ width, height, onDone }: ConfettiProps) {
  const { colors } = useAppTheme();

  const particles = useMemo<Particle[]>(() => {
    const palette = [...Object.values(colors.category), colors.accent, colors.onPrimary];
    return Array.from({ length: COUNT }, (_, i) => {
      const angle = (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = 0.35 + Math.random() * 0.45;
      return {
        colour: palette[i % palette.length],
        width: 6 + Math.round(Math.random() * 4),
        height: 10 + Math.round(Math.random() * 6),
        dx: Math.sin(angle) * speed * width,
        dy: height * (0.75 + Math.random() * 0.4),
        spin: (Math.random() - 0.5) * 4,
        lag: Math.random() * 0.25,
      };
    });
  }, [colors, width, height]);

  const t = useSharedValue(0);

  // Em ref para a chuva não recomeçar quando a tela passar um callback novo.
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const finish = () => doneRef.current?.();
    t.value = 0;
    t.value = withTiming(1, { duration: DURATION_MS, easing: Easing.linear }, (finished) => {
      if (finished) runOnJS(finish)();
    });
  }, [t]);

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.layer]}
    >
      {particles.map((particle, index) => (
        <Piece
          key={index}
          particle={particle}
          t={t}
          originX={width / 2}
          originY={height * 0.3}
        />
      ))}
    </View>
  );
}

function Piece({ particle, t, originX, originY }: { particle: Particle; t: SharedValue<number>; originX: number; originY: number }) {
  const style = useAnimatedStyle(() => {
    // Progresso próprio, descontado o atraso da partícula.
    const p = Math.min(1, Math.max(0, (t.value - particle.lag) / (1 - particle.lag)));
    const eased = 1 - (1 - p) * (1 - p);
    const rise = Math.sin(p * Math.PI) * 24;
    return {
      opacity: p === 0 ? 0 : p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3,
      transform: [
        { translateX: particle.dx * eased },
        { translateY: particle.dy * p * p - rise },
        { rotate: `${particle.spin * p * 360}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: originX - particle.width / 2,
          top: originY,
          width: particle.width,
          height: particle.height,
          backgroundColor: particle.colour,
          borderRadius: 2,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  layer: {
    overflow: "hidden",
  },
  piece: {
    position: "absolute",
  },
});
