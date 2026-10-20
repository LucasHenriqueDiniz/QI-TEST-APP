import type { Difficulty, ScoreBand } from "../../types/index.ts";

/**
 * Modelo de item (pesquisa scoring-modes §4.2): 3PL com a dificuldade dada
 * pelo rótulo. `a` e `b` foram calibrados para o teste antigo de 30 questões
 * manter a média 0,55 e o desvio 0,18 que a fórmula anterior assumia; `c` é
 * o chute em quatro alternativas. Não é um teste normatizado: a população
 * assumida continua sendo N(0, 1).
 */
export const GUESSING = 0.25;
export const SLOPE = 1.2;
export const LOCATION: Record<Difficulty, number> = { easy: -1.1, medium: -0.1, hard: 0.9 };

export const MEAN_IQ = 100;
export const SD_IQ = 15;
/** Limites de exibição. Fora disso a estimativa não tem qualquer significado. */
export const MIN_IQ = 55;
export const MAX_IQ = 145;

/** Faixa de 90% (z = 1,645) alargada ×1,25 porque os rótulos de dificuldade são julgamento (§4.3). */
export const BAND_Z = 1.645;
export const BAND_WIDENING = 1.25;

/** Grade de θ: −4 a 4 em passos de 0,1 (81 pontos), a mesma da simulação. */
const GRID_MIN = -4;
const GRID_STEP = 0.1;
const GRID_POINTS = 81;
const THETA_GRID = Array.from({ length: GRID_POINTS }, (_, i) => GRID_MIN + i * GRID_STEP);
const PRIOR = THETA_GRID.map((theta) => Math.exp((-theta * theta) / 2));

export interface Response {
  difficulty: Difficulty;
  correct: boolean;
}

export interface AbilityEstimate {
  /** Média da posterior (EAP), em desvios da população. */
  theta: number;
  /** Desvio da posterior: o erro-padrão da estimativa. */
  standardError: number;
}

/** Probabilidade de acertar um item do rótulo dado, para uma habilidade θ. */
export function probabilityCorrect(theta: number, difficulty: Difficulty): number {
  return GUESSING + (1 - GUESSING) / (1 + Math.exp(-SLOPE * (theta - LOCATION[difficulty])));
}

/**
 * EAP sobre a grade. Sem respostas devolve a priori (θ 0, erro 1): um teste
 * interrompido é estimado só pelo que foi respondido, não penalizado pelo resto.
 */
export function estimateAbility(responses: readonly Response[]): AbilityEstimate {
  const posterior = PRIOR.map((prior, g) => {
    let density = prior;
    for (const response of responses) {
      const p = probabilityCorrect(THETA_GRID[g], response.difficulty);
      density *= response.correct ? p : 1 - p;
    }
    return density;
  });

  const mass = posterior.reduce((sum, value) => sum + value, 0);
  const theta = posterior.reduce((sum, value, g) => sum + value * THETA_GRID[g], 0) / mass;
  const variance = posterior.reduce((sum, value, g) => sum + value * (THETA_GRID[g] - theta) ** 2, 0) / mass;

  return { theta, standardError: Math.sqrt(variance) };
}

/** QI = 100 + 15·θ (+ ajuste), arredondado e limitado a 55–145. */
export function toIq(theta: number, shift = 0): number {
  return Math.min(Math.max(Math.round(MEAN_IQ + SD_IQ * theta + shift), MIN_IQ), MAX_IQ);
}

/** Faixa provável: θ ± 1,645 × 1,25 × erro, na escala do QI e com as bordas limitadas como o QI. */
export function bandOf(estimate: AbilityEstimate, shift = 0): ScoreBand {
  const halfWidth = BAND_Z * BAND_WIDENING * estimate.standardError;
  return { lower: toIq(estimate.theta - halfWidth, shift), upper: toIq(estimate.theta + halfWidth, shift) };
}

/** Função de distribuição acumulada da normal padrão (Abramowitz & Stegun 26.2.17). */
export function normalCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;

  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);

  return 0.5 * (1 + sign * y);
}

/**
 * Percentil do QI final (e não do θ bruto), para manter coerência com o
 * número que o usuário vê depois do ajuste e do limite.
 */
export function percentileOf(iq: number): number {
  return Math.min(Math.max(Math.round(normalCdf((iq - MEAN_IQ) / SD_IQ) * 100), 1), 99);
}
