import React from "react";
import Svg, { Circle, Path, Polygon, Rect } from "react-native-svg";
import type { Glyph } from "@/utils/speed";

interface SpeedGlyphProps {
  glyph: Glyph;
  size: number;
  color: string;
}

/** Pontos de uma estrela de 5 pontas e de um hexágono, num quadro de 24. */
const STAR = "12,2.5 14.6,9 21.5,9.3 16.1,13.6 18,20.5 12,16.6 6,20.5 7.9,13.6 2.5,9.3 9.4,9";
const HEXAGON = "12,2.5 20.2,7.2 20.2,16.8 12,21.5 3.8,16.8 3.8,7.2";

/**
 * Um símbolo da tarefa de velocidade, desenhado com primitivas de SVG (sem
 * arquivo): a forma cheia ou só com o contorno, que é a diferença que a
 * tarefa pede para notar.
 */
export function SpeedGlyph({ glyph, size, color }: SpeedGlyphProps) {
  const paint = glyph.filled
    ? { fill: color, stroke: color, strokeWidth: 1.5 }
    : { fill: "none", stroke: color, strokeWidth: 2.2 };
  const line = { stroke: color, strokeWidth: glyph.filled ? 4.5 : 2.2, strokeLinecap: "round" as const };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      {glyph.shape === "circle" && (
        <Circle
          cx={12}
          cy={12}
          r={9}
          {...paint}
        />
      )}
      {glyph.shape === "square" && (
        <Rect
          x={3.5}
          y={3.5}
          width={17}
          height={17}
          {...paint}
        />
      )}
      {glyph.shape === "triangle" && (
        <Polygon
          points="12,3 21.5,20 2.5,20"
          strokeLinejoin="round"
          {...paint}
        />
      )}
      {glyph.shape === "diamond" && (
        <Polygon
          points="12,2.5 21.5,12 12,21.5 2.5,12"
          strokeLinejoin="round"
          {...paint}
        />
      )}
      {glyph.shape === "plus" && (
        <Path
          d="M12 3.5v17M3.5 12h17"
          {...line}
        />
      )}
      {glyph.shape === "cross" && (
        <Path
          d="M5 5l14 14M19 5L5 19"
          {...line}
        />
      )}
      {glyph.shape === "star" && (
        <Polygon
          points={STAR}
          strokeLinejoin="round"
          {...paint}
        />
      )}
      {glyph.shape === "hexagon" && (
        <Polygon
          points={HEXAGON}
          strokeLinejoin="round"
          {...paint}
        />
      )}
    </Svg>
  );
}
