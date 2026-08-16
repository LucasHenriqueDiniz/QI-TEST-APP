import React from "react";
import { View } from "react-native";
import Svg, { Defs, LinearGradient as SvgGradient, Line, Path, Stop, Text as SvgText } from "react-native-svg";
import { useAppTheme } from "@/context/ThemeContext";

const MIN = 55;
const MAX = 145;
const MEAN = 100;
const SD = 15;
const TICKS = [70, 85, 100, 115, 130];

interface ScoreCurveProps {
  /** QI a destacar na curva. */
  score: number;
  width: number;
  height?: number;
}

/** Altura relativa da normal padrão em `x` (pico = 1). */
function density(x: number): number {
  return Math.exp(-0.5 * ((x - MEAN) / SD) ** 2);
}

/**
 * Curva de distribuição de QI com a posição do usuário marcada.
 *
 * A área à esquerda do marcador é preenchida — a leitura pretendida é
 * "você está acima desta parte da população".
 */
export function ScoreCurve({ score, width, height = 170 }: ScoreCurveProps) {
  const { colors } = useAppTheme();

  const labelBand = 22;
  const plotHeight = height - labelBand;
  const baseline = plotHeight;

  const toX = (iq: number) => ((iq - MIN) / (MAX - MIN)) * width;
  const toY = (d: number) => baseline - d * (plotHeight - 12);

  const samples = Array.from({ length: 91 }, (_, i) => MIN + i);
  const point = (iq: number) => `${toX(iq).toFixed(2)},${toY(density(iq)).toFixed(2)}`;

  const outline = `M ${samples.map(point).join(" L ")}`;

  const clamped = Math.min(Math.max(score, MIN), MAX);
  const filled = samples.filter((iq) => iq <= clamped);
  // Garante que a área preenchida termine exatamente sob o marcador, mesmo
  // quando o score cai entre duas amostras inteiras.
  const areaPoints = [...filled.map(point), point(clamped)];
  const area = `M ${toX(MIN).toFixed(2)},${baseline} L ${areaPoints.join(" L ")} L ${toX(clamped).toFixed(2)},${baseline} Z`;

  const markerX = toX(clamped);

  return (
    <View>
      <Svg
        width={width}
        height={height}
      >
        <Defs>
          <SvgGradient
            id="curveFill"
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

        <Line
          x1={0}
          y1={baseline}
          x2={width}
          y2={baseline}
          stroke={colors.border}
          strokeWidth={1}
        />

        <Path
          d={area}
          fill="url(#curveFill)"
        />
        <Path
          d={outline}
          stroke={colors.primary}
          strokeWidth={2}
          fill="none"
        />

        <Line
          x1={markerX}
          y1={toY(density(clamped))}
          x2={markerX}
          y2={baseline}
          stroke={colors.accent}
          strokeWidth={2.5}
          strokeLinecap="round"
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
    </View>
  );
}
