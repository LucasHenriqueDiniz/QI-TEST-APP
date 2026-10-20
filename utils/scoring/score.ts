import type { IndexDomain, IndexScore, QuestionCategory, ScoreBand } from "../../types/index.ts";
import { bandOf, estimateAbility, percentileOf, toIq, type Response } from "./eap.ts";

/** Uma resposta com o que a pontuação precisa saber dela. */
export interface ScoredItem extends Response {
  category: QuestionCategory;
}

/** A que índice cada categoria contribui (pesquisa §2). */
export const INDEX_DOMAIN: Record<QuestionCategory, IndexDomain> = {
  patterns: "reasoning",
  matrix: "reasoning",
  similarities: "verbal",
  vocabulary: "verbal",
  comprehension: "verbal",
};

export const INDEX_DOMAINS: readonly IndexDomain[] = ["reasoning", "verbal"];

/** Abaixo disto um subescore não diz mais que o total (Benton 2012; pesquisa §4.4). */
export const MIN_ITEMS_FOR_INDEX = 30;

export interface TestScore {
  iq: number;
  band: ScoreBand;
  percentile: number;
  theta: number;
  standardError: number;
  indices?: Partial<Record<IndexDomain, IndexScore>>;
}

/**
 * Pontua um conjunto de respostas: QI, faixa, percentil e, quando um domínio
 * tem itens suficientes, o índice dele. `shift` é o ajuste etário, em pontos
 * de QI; entra igual nos três números para ficarem na mesma escala.
 */
export function scoreTest(items: readonly ScoredItem[], shift = 0): TestScore {
  const estimate = estimateAbility(items);
  const iq = toIq(estimate.theta, shift);
  const indices = indexScores(items, shift);

  return {
    iq,
    band: bandOf(estimate, shift),
    percentile: percentileOf(iq),
    theta: estimate.theta,
    standardError: estimate.standardError,
    ...(indices && { indices }),
  };
}

/** EAP por domínio, só para os domínios com ≥ `MIN_ITEMS_FOR_INDEX` itens; `undefined` quando nenhum alcança. */
export function indexScores(items: readonly ScoredItem[], shift = 0): Partial<Record<IndexDomain, IndexScore>> | undefined {
  const indices: Partial<Record<IndexDomain, IndexScore>> = {};

  for (const domain of INDEX_DOMAINS) {
    const subset = items.filter((item) => INDEX_DOMAIN[item.category] === domain);
    if (subset.length < MIN_ITEMS_FOR_INDEX) continue;
    const estimate = estimateAbility(subset);
    indices[domain] = { score: toIq(estimate.theta, shift), band: bandOf(estimate, shift), items: subset.length };
  }

  return Object.keys(indices).length > 0 ? indices : undefined;
}
