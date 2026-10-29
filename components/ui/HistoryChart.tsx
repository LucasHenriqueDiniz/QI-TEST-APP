import React from "react";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { fonts } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";

interface HistoryChartProps {
  /** Pontuações em ordem cronológica (mais antiga primeiro). */
  values: number[];
  width: number;
  height?: number;
  /** Rótulo da linha tracejada em 100 ("média"). */
  meanLabel: string;
}

const MEAN = 100;
const PAD_X = 12;
const PAD_Y = 14;

/**
 * Evolução dos últimos testes: pontos de 6 dp ligados por uma linha, o melhor
 * com um anel em `accent`, e a média da população (100) tracejada. Com um
 * teste só, o ponto e a média.
 */
export function HistoryChart({ values, width, height = 120, meanLabel }: HistoryChartProps) {
  const { colors } = useAppTheme();
  if (values.length === 0) return null;

  const low = Math.min(...values, MEAN) - 5;
  const high = Math.max(...values, MEAN) + 5;
  const x = (index: number) => (values.length === 1 ? width / 2 : PAD_X + (index / (values.length - 1)) * (width - PAD_X * 2));
  const y = (value: number) => PAD_Y + (1 - (value - low) / (high - low)) * (height - PAD_Y * 2);
  const best = values.indexOf(Math.max(...values));
  const line = values.map((value, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)} ${y(value).toFixed(1)}`).join(" ");

  return (
    <Svg
      width={width}
      height={height}
    >
      <Line
        x1={0}
        x2={width}
        y1={y(MEAN)}
        y2={y(MEAN)}
        stroke={colors.textFaint}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <SvgText
        x={width - 2}
        y={y(MEAN) - 5}
        fill={colors.textFaint}
        fontSize={11}
        fontFamily={fonts.body}
        textAnchor="end"
      >
        {meanLabel}
      </SvgText>
      {values.length > 1 && (
        <Path
          d={line}
          stroke={colors.primary}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {values.map((value, index) => (
        <Circle
          key={index}
          cx={x(index)}
          cy={y(value)}
          r={3}
          fill={colors.primary}
        />
      ))}
      <Circle
        cx={x(best)}
        cy={y(values[best])}
        r={7}
        stroke={colors.accent}
        strokeWidth={2.5}
        fill="none"
      />
    </Svg>
  );
}
