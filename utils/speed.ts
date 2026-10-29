import type { Rng } from "./scoring/random.ts";

/**
 * Tarefa de velocidade "Iguais ou diferentes?" (pesquisa scoring-modes §3,
 * decisão D7): duas sequências de 3 símbolos lado a lado, metade iguais;
 * nas diferentes, um único símbolo muda. Mede velocidade de processamento,
 * à parte do QI, como o Pattern Comparison do NIH Toolbox (90 s, dois botões).
 */

/** Oito formas, cheias ou só o contorno: 16 símbolos, desenhados em SVG. */
export const SHAPES = ["circle", "square", "triangle", "diamond", "plus", "cross", "star", "hexagon"] as const;
export type Shape = (typeof SHAPES)[number];

export interface Glyph {
  shape: Shape;
  filled: boolean;
}

export interface SpeedPair {
  left: Glyph[];
  right: Glyph[];
  same: boolean;
}

/** Símbolos por sequência. */
export const PAIR_LENGTH = 3;
/** Duração do bloco cronometrado; a pesquisa fala em 60–120 s de confiabilidade. */
export const SPEED_DURATION_MS = 90_000;
/** Treino antes do bloco, sem cronômetro e sem contar. */
export const PRACTICE_PAIRS = 4;

export const GLYPHS: Glyph[] = SHAPES.flatMap((shape) => [
  { shape, filled: true },
  { shape, filled: false },
]);

const sameGlyph = (a: Glyph, b: Glyph) => a.shape === b.shape && a.filled === b.filled;

function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

/**
 * Um par: metade das vezes iguais; senão um símbolo, numa posição sorteada,
 * troca por outro diferente. Os três símbolos de uma sequência podem
 * repetir entre si.
 */
export function makePair(rng: Rng): SpeedPair {
  const left = Array.from({ length: PAIR_LENGTH }, () => pick(GLYPHS, rng));
  const same = rng() < 0.5;
  if (same) return { left, right: [...left], same };

  const position = Math.floor(rng() * PAIR_LENGTH);
  const right = [...left];
  right[position] = pick(
    GLYPHS.filter((glyph) => !sameGlyph(glyph, left[position])),
    rng
  );
  return { left, right, same };
}

/** Em quantas posições as duas sequências diferem. */
export function differences(pair: SpeedPair): number {
  return pair.left.filter((glyph, index) => !sameGlyph(glyph, pair.right[index])).length;
}

/**
 * Acertos menos erros, nunca abaixo de zero: com dois botões, tocar rápido
 * ao acaso daria uns 50% de acerto e um número alto sem o desconto.
 */
export function speedScore(correct: number, wrong: number): number {
  return Math.max(0, correct - wrong);
}
