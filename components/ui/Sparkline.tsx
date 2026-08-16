import React from "react";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Stop } from "react-native-svg";
import { useAppTheme } from "@/context/ThemeContext";

interface SparklineProps {
  /** Série em ordem cronológica (mais antigo primeiro). */
  values: number[];
  width: number;
  height?: number;
}

/** Linha de evolução compacta, com área preenchida e destaque no último ponto. */
export function Sparkline({ values, width, height = 90 }: SparklineProps) {
  const { colors } = useAppTheme();

  if (values.length === 0) return null;

  const padding = 8;
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Evita divisão por zero quando todos os valores são iguais.
  const span = max - min || 1;

  const toX = (index: number) => (values.length === 1 ? width / 2 : (index / (values.length - 1)) * (width - padding * 2) + padding);
  const toY = (value: number) => height - padding - ((value - min) / span) * (height - padding * 2);

  const points = values.map((value, index) => `${toX(index).toFixed(2)},${toY(value).toFixed(2)}`);
  const line = `M ${points.join(" L ")}`;
  const area = `${line} L ${toX(values.length - 1).toFixed(2)},${height} L ${toX(0).toFixed(2)},${height} Z`;

  const lastIndex = values.length - 1;

  return (
    <Svg
      width={width}
      height={height}
    >
      <Defs>
        <SvgGradient
          id="sparkFill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <Stop
            offset="0"
            stopColor={colors.primary}
            stopOpacity={0.3}
          />
          <Stop
            offset="1"
            stopColor={colors.primary}
            stopOpacity={0}
          />
        </SvgGradient>
      </Defs>

      <Path
        d={area}
        fill="url(#sparkFill)"
      />
      <Path
        d={line}
        stroke={colors.primary}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle
        cx={toX(lastIndex)}
        cy={toY(values[lastIndex])}
        r={4.5}
        fill={colors.primary}
        stroke={colors.background}
        strokeWidth={2}
      />
    </Svg>
  );
}
