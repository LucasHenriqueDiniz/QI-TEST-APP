import { questions } from "@/data/questions";
import { ItemUsage, Question, QuestionCategory, TestMode } from "@/types";
import { TestProgress } from "@/types/storage";
import { isModeAvailable as bankHasMode, parseMode, roundLength } from "@/utils/scoring/blueprints";
import { buildRound, identityOrder, markUsed, restoreRound, Round, RoundItem } from "@/utils/scoring/selection";

/**
 * Seleção de questões sobre o banco do app. A lógica (blueprints, LRU,
 * embaralhamento das alternativas) é pura e fica em `utils/scoring/`; aqui
 * ela só recebe o banco real e o `Math.random`.
 */
export { markUsed, parseMode, roundLength };
export type { Round, RoundItem };

/**
 * Sorteia uma rodada nova do modo. `usage` é o registro de recência salvo
 * (`itemUsage`); sem ele, o sorteio é aleatório dentro de cada célula.
 *
 * Uma célula com menos itens do que o blueprint pede é completada com outras
 * dificuldades da mesma categoria — e isso aparece no log de desenvolvimento,
 * para não passar despercebido.
 */
export function buildTest(mode: TestMode, usage: ItemUsage | null): Round {
  const round = buildRound(questions, mode, usage, Math.random);

  // `log`, não `warn`: um aviso viraria um toast do LogBox a cada rodada do
  // build de desenvolvimento enquanto o banco não cresce (fatia 05d).
  if (__DEV__ && round.shortfalls.length > 0) {
    const cells = round.shortfalls.map((s) => `${s.category}.${s.difficulty} ${s.available}/${s.wanted}`).join(", ");
    console.log(`[selection] ${mode}: bank short in ${cells}; filled from the same category`);
  }

  return round;
}

/** Reconstrói a rodada de um progresso salvo; `null` se não for possível retomar exatamente o mesmo teste. */
export function restoreTest(progress: TestProgress): Round | null {
  return restoreRound(questions, progress);
}

/** Se o banco comporta o modo (Detalhado só com duas formas completas por célula). */
export function isModeAvailable(mode: TestMode): boolean {
  return bankHasMode(mode, questions);
}

/**
 * Todas as questões de uma categoria, na ordem da `questionKey` (p1, p2, …),
 * com as alternativas na ordem original.
 *
 * Não é um teste: serve para conferir cada item de uma área na tela — a
 * rodada `__DEV__` do `/test?only=patterns`. Ordem fixa para que "7 de 30"
 * seja sempre o mesmo item.
 */
export function buildCategoryRound(category: QuestionCategory): RoundItem[] {
  const number = (q: Question) => Number(q.questionKey.replace(/\D/g, "")) || 0;
  return questions
    .filter((q) => q.category === category)
    .sort((a, b) => number(a) - number(b))
    .map((question) => ({ question, optionOrder: identityOrder() }));
}
