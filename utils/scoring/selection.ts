import type { ItemUsage, Question, TestMode } from "../../types/index.ts";
import { BLUEPRINTS, CATEGORIES, DIFFICULTIES, type Blueprint, type CellShortfall } from "./blueprints.ts";
import { shuffle, type Rng } from "./random.ts";

/** Alternativas por questão de texto: todas as do banco têm quatro. */
export const OPTION_COUNT = 4;

export interface RoundItem {
  question: Question;
  /**
   * Ordem de exibição das alternativas: a k-ésima mostrada é a original
   * `optionOrder[k]`. Identidade nas questões visuais, cujos SVGs têm nome
   * pela posição.
   */
  optionOrder: number[];
}

export interface Round {
  mode: TestMode;
  items: RoundItem[];
  /** Células completadas com outra dificuldade da mesma categoria por falta de itens. */
  shortfalls: CellShortfall[];
}

/** O que a retomada precisa de um progresso salvo. */
export interface SavedRound {
  mode?: TestMode;
  questionIds: string[];
  optionOrders?: number[][];
}

export function identityOrder(): number[] {
  return Array.from({ length: OPTION_COUNT }, (_, i) => i);
}

export function isPermutation(order: readonly number[]): boolean {
  if (order.length !== OPTION_COUNT) return false;
  const sorted = [...order].sort((a, b) => a - b);
  return sorted.every((value, i) => value === i);
}

/** Sorteia a rodada de um modo: itens pelo blueprint, LRU em cada célula, alternativas embaralhadas. */
export function buildRound(bank: readonly Question[], mode: TestMode, usage: ItemUsage | null, rng: Rng): Round {
  const { questions, shortfalls } = selectFromBlueprint(bank, BLUEPRINTS[mode], usage, rng);
  return {
    mode,
    items: questions.map((question) => ({ question, optionOrder: optionOrderFor(question, rng) })),
    shortfalls,
  };
}

/**
 * Seleção por célula (categoria × dificuldade), menos usados primeiro.
 *
 * Em cada célula os candidatos são embaralhados e depois ordenados pela
 * última rodada em que saíram; a ordenação é estável, então o sorteio decide
 * os empates, inclusive entre itens nunca usados. Uma célula com menos itens
 * do que o pedido é completada no fim da categoria, com o que sobrou dela
 * (as outras dificuldades), também por recência. O preenchimento acontece
 * depois de todas as células da categoria para não roubar itens de uma
 * célula ainda não visitada.
 */
export function selectFromBlueprint(
  bank: readonly Question[],
  blueprint: Blueprint,
  usage: ItemUsage | null,
  rng: Rng
): { questions: Question[]; shortfalls: CellShortfall[] } {
  const lastUsed = (question: Question) => usage?.lastUsed[question.id] ?? -1;
  const byRecency = (items: Question[]) => shuffle(items, rng).sort((a, b) => lastUsed(a) - lastUsed(b));

  const selected: Question[] = [];
  const shortfalls: CellShortfall[] = [];

  for (const category of CATEGORIES) {
    const pool = bank.filter((q) => q.category === category);
    const taken = new Set<string>();

    const take = (candidates: Question[], count: number): number => {
      const picked = byRecency(candidates.filter((q) => !taken.has(q.id))).slice(0, count);
      picked.forEach((q) => taken.add(q.id));
      selected.push(...picked);
      return picked.length;
    };

    let missing = 0;
    for (const difficulty of DIFFICULTIES) {
      const wanted = blueprint[category][difficulty];
      const got = take(pool.filter((q) => q.difficulty === difficulty), wanted);
      if (got < wanted) {
        shortfalls.push({ category, difficulty, wanted, available: got });
        missing += wanted - got;
      }
    }
    if (missing > 0) take(pool, missing);
  }

  return { questions: shuffle(selected, rng), shortfalls };
}

function optionOrderFor(question: Question, rng: Rng): number[] {
  return question.type === "image" ? identityOrder() : shuffle(identityOrder(), rng);
}

/** Registra a rodada no uso: cada item dela passa a ter esta rodada como última. */
export function markUsed(usage: ItemUsage | null, round: Round): ItemUsage {
  const current = usage?.round ?? 0;
  const lastUsed = { ...usage?.lastUsed };
  round.items.forEach(({ question }) => {
    lastUsed[question.id] = current;
  });
  return { round: current + 1, lastUsed };
}

/**
 * Reconstrói a rodada de um progresso salvo, na mesma ordem e com as mesmas
 * alternativas. `null` se não der para reconstruir exatamente: progresso
 * anterior aos modos, id que não existe mais, ordem corrompida.
 */
export function restoreRound(bank: readonly Question[], saved: SavedRound): Round | null {
  if (!saved.mode || saved.questionIds.length === 0) return null;

  const orders = saved.optionOrders ?? saved.questionIds.map(() => identityOrder());
  if (orders.length !== saved.questionIds.length) return null;

  const items: RoundItem[] = [];
  for (let i = 0; i < saved.questionIds.length; i++) {
    const question = bank.find((q) => q.id === saved.questionIds[i]);
    if (!question || !isPermutation(orders[i])) return null;
    items.push({ question, optionOrder: question.type === "image" ? identityOrder() : orders[i] });
  }

  return { mode: saved.mode, items, shortfalls: [] };
}

/**
 * Aplica a ordem de exibição às alternativas traduzidas e devolve a posição
 * em que a correta aparece. Se a ordem não casa com as alternativas, mostra
 * na ordem original.
 */
export function applyOptionOrder(options: readonly string[], correctAnswer: number, order: readonly number[]): { options: string[]; correctAnswer: number } {
  if (order.length !== options.length || !isPermutation(order)) return { options: [...options], correctAnswer };
  return { options: order.map((i) => options[i]), correctAnswer: order.indexOf(correctAnswer) };
}
