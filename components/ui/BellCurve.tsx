import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient as SvgGradient, Line, Path, Stop, Text as SvgText } from "react-native-svg";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";

const MIN = 55;
const MAX = 145;
const MEAN = 100;
const SD = 15;
const TICKS = [70, 85, 100, 115, 130];

/** Faixa acima da curva reservada ao balão "Você · N", em dp. */
const BUBBLE_BAND = 34;
/** Faixa abaixo da linha de base com os números, em dp. */
const LABEL_BAND = 22;
/** Diâmetro do ponto do marcador, em dp. */
const DOT = 10;
/** Duração da varredura do preenchimento, em ms. */
const SWEEP_MS = 800;

interface BellCurveProps {
  /** QI a destacar na curva. */
  score: number;
  width: number;
  height?: number;
  /** Texto do balão sobre o marcador ("Você · 112"). */
  label: string;
  /** `false` desenha o estado final de uma vez (reduzir movimento, histórico, pulo). */
  animate: boolean;
  /** Espera antes de a varredura começar, em ms. */
  delayMs?: number;
}

/** Altura relativa da normal padrão em `x` (pico = 1). */
function density(x: number): number {
  return Math.exp(-0.5 * ((x - MEAN) / SD) ** 2);
}

/**
 * Curva normal do QI com a posição do usuário.
 *
 * O contorno e os números são um SVG estático, desenhado uma vez. O
 * preenchimento à esquerda do marcador é outro SVG estático dentro de uma
 * janela com `overflow: hidden`: a janela desliza para a direita enquanto o
 * conteúdo desliza na mesma medida para a esquerda, então o desenho fica
 * parado e só a parte visível cresce. Tudo é `transform`, nada de prop de
 * SVG animada — no Android um `Rect` dentro de `ClipPath` nunca repinta
 * (`VirtualView.invalidate` ignora nós sem caminho desenhado), e `width` em
 * View passaria pelo layout a cada quadro.
 */
export function BellCurve({ score, width, height = 140, label, animate, delayMs = 0 }: BellCurveProps) {
  const { colors, motion, radius } = useAppTheme();

  const geometry = useMemo(() => {
    const plotTop = BUBBLE_BAND;
    const baseline = height - LABEL_BAND;
    const toX = (iq: number) => ((iq - MIN) / (MAX - MIN)) * width;
    const toY = (d: number) => baseline - d * (baseline - plotTop);

    const samples = Array.from({ length: 91 }, (_, i) => MIN + i);
    const point = (iq: number) => `${toX(iq).toFixed(2)},${toY(density(iq)).toFixed(2)}`;
    const outline = `M ${samples.map(point).join(" L ")}`;

    const clamped = Math.min(Math.max(score, MIN), MAX);
    const filled = samples.filter((iq) => iq <= clamped);
    // A área termina exatamente sob o marcador, mesmo entre duas amostras.
    const areaPoints = [...filled.map(point), point(clamped)];
    const area = `M ${toX(MIN).toFixed(2)},${baseline} L ${areaPoints.join(" L ")} L ${toX(clamped).toFixed(2)},${baseline} Z`;

    return { baseline, outline, area, markerX: toX(clamped), markerY: toY(density(clamped)), toX };
  }, [score, width, height]);

  const { baseline, outline, area, markerX, markerY, toX } = geometry;

  // 0 = nada preenchido, 1 = preenchido até o marcador.
  const sweep = useSharedValue(animate ? 0 : 1);
  // 0 = marcador acima e invisível, 1 = pousado.
  const landed = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (!animate) {
      cancelAnimation(sweep);
      cancelAnimation(landed);
      sweep.value = 1;
      landed.value = 1;
      return;
    }
    sweep.value = 0;
    landed.value = 0;
    sweep.value = withDelay(delayMs, withTiming(1, { duration: SWEEP_MS, easing: Easing.out(Easing.cubic) }));
    // Cai enquanto a varredura chega ao marcador, pousando junto com ela.
    landed.value = withDelay(delayMs + SWEEP_MS - 250, withSpring(1, motion.fastSpatial));
    return () => {
      cancelAnimation(sweep);
      cancelAnimation(landed);
    };
  }, [animate, delayMs, sweep, landed, motion.fastSpatial]);

  // Janela visível: [0, sweep × markerX]. A janela tem a largura toda e
  // começa inteira à esquerda do gráfico; o conteúdo compensa o deslocamento.
  const windowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -width + sweep.value * markerX }],
  }));
  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: width - sweep.value * markerX }],
  }));

  const markerStyle = useAnimatedStyle(() => ({
    opacity: landed.value,
    transform: [{ translateY: (1 - landed.value) * -18 }],
  }));

  // O balão é centralizado no marcador, mas não sai do gráfico nas pontas.
  const bubbleHalf = 46;
  const bubbleX = Math.min(Math.max(markerX, bubbleHalf), width - bubbleHalf);

  return (
    <View style={{ width, height }}>
      <Svg
        width={width}
        height={height}
        pointerEvents="none"
      >
        <Line
          x1={0}
          y1={baseline}
          x2={width}
          y2={baseline}
          stroke={colors.border}
          strokeWidth={1}
        />
        <Path
          d={outline}
          stroke={colors.primary}
          strokeWidth={2}
          fill="none"
        />
        {TICKS.map((tick) => (
          <SvgText
            key={tick}
            x={toX(tick)}
            y={height - 6}
            fill={colors.textFaint}
            fontSize={11}
            fontWeight="600"
            textAnchor="middle"
          >
            {tick}
          </SvgText>
        ))}
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.window, windowStyle]}
      >
        <Animated.View style={contentStyle}>
          <Svg
            width={width}
            height={height}
          >
            <Defs>
              <SvgGradient
                id="bellFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <Stop
                  offset="0"
                  stopColor={colors.primary}
                  stopOpacity={0.45}
                />
                <Stop
                  offset="1"
                  stopColor={colors.primary}
                  stopOpacity={0.04}
                />
              </SvgGradient>
            </Defs>
            <Path
              d={area}
              fill="url(#bellFill)"
            />
          </Svg>
        </Animated.View>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, markerStyle]}
      >
        <View
          style={[
            styles.markerLine,
            { left: markerX - 1.25, top: markerY, height: baseline - markerY, backgroundColor: colors.accent },
          ]}
        />
        <View
          style={[
            styles.dot,
            { left: markerX - DOT / 2, top: markerY - DOT / 2, backgroundColor: colors.accent, borderColor: colors.surface },
          ]}
        />
        <View
          style={[
            styles.bubbleAnchor,
            { left: bubbleX - bubbleHalf, width: bubbleHalf * 2, top: Math.max(0, markerY - DOT / 2 - 30) },
          ]}
        >
          <View style={[styles.bubble, { backgroundColor: colors.accent, borderRadius: radius.pill }]}>
            <ThemedText
              variant="captionStrong"
              color={colors.onAccent}
              numberOfLines={1}
            >
              {label}
            </ThemedText>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    overflow: "hidden",
  },
  markerLine: {
    position: "absolute",
    width: 2.5,
    borderRadius: 1.25,
  },
  dot: {
    position: "absolute",
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
  },
  bubbleAnchor: {
    position: "absolute",
    alignItems: "center",
  },
  bubble: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
