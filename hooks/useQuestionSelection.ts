import { questions } from "@/data/questions";
import { Difficulty, Question, QuestionCategory } from "@/types";

/** Composição de um teste: quantas questões de cada categoria e dificuldade. */
const BLUEPRINT: Record<QuestionCategory, Partial<Record<Difficulty, number>>> = {
  patterns: { medium: 6, hard: 6 },
  similarities: { easy: 1, medium: 2, hard: 2 },
  matrix: { easy: 1, medium: 2, hard: 2 },
  vocabulary: { easy: 1, medium: 1, hard: 2 },
  comprehension: { easy: 1, medium: 2, hard: 1 },
};

export const TEST_LENGTH = Object.values(BLUEPRINT).reduce(
  (total, levels) => total + Object.values(levels).reduce((sum, count) => sum + (count ?? 0), 0),
  0
);

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Sorteia um teste novo seguindo o BLUEPRINT.
 *
 * Se uma categoria não tiver questões suficientes na dificuldade pedida,
 * completa com as demais dificuldades daquela categoria em vez de devolver
 * um teste mais curto.
 */
export function buildTest(): Question[] {
  const selected: Question[] = [];

  (Object.keys(BLUEPRINT) as QuestionCategory[]).forEach((category) => {
    const pool = questions.filter((q) => q.category === category);
    const taken = new Set<string>();

    Object.entries(BLUEPRINT[category]).forEach(([difficulty, count]) => {
      const matching = shuffle(pool.filter((q) => q.difficulty === difficulty && !taken.has(q.id))).slice(0, count ?? 0);
      matching.forEach((q) => taken.add(q.id));
      selected.push(...matching);

      const missing = (count ?? 0) - matching.length;
      if (missing > 0) {
        const fallback = shuffle(pool.filter((q) => !taken.has(q.id))).slice(0, missing);
        fallback.forEach((q) => taken.add(q.id));
        selected.push(...fallback);
      }
    });
  });

  return shuffle(selected);
}

/** Reconstrói um teste a partir dos ids salvos, preservando a ordem original. */
export function restoreTest(questionIds: string[]): Question[] {
  return questionIds.map((id) => questions.find((q) => q.id === id)).filter((q): q is Question => !!q);
}
