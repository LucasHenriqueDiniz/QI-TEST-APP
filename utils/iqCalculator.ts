import { questions } from "../data/questions.ts";
import type { Answer, CategoryScore, QuestionCategory, TestOutcome } from "../types/index.ts";
import { scoreTest, type ScoredItem } from "./scoring/score.ts";

/** Ajuste etário leve. Questões verbais favorecem adultos; matriciais, jovens. */
function ageAdjustment(age: number | undefined): number {
  if (!age || Number.isNaN(age)) return 0;
  if (age < 14) return 4;
  if (age < 18) return 2;
  if (age > 65) return -3;
  return 0;
}

/**
 * Consolida as respostas em um resultado completo.
 *
 * O QI é a estimativa EAP (`utils/scoring/eap.ts`) sobre as questões
 * efetivamente respondidas, com a dificuldade de cada uma — um teste
 * interrompido é estimado pelo que foi respondido, não penalizado como se o
 * resto estivesse errado. O ajuste etário entra em pontos de QI, no QI e nos
 * índices.
 */
export function evaluateTest(answers: Answer[], age?: number): TestOutcome {
  const byCategory = new Map<QuestionCategory, CategoryScore>();
  const items: ScoredItem[] = [];
  let correct = 0;

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    items.push({ category: question.category, difficulty: question.difficulty, correct: answer.isCorrect });

    const entry = byCategory.get(question.category) ?? {
      category: question.category,
      correct: 0,
      total: 0,
      weightEarned: 0,
      weightTotal: 0,
    };

    entry.total += 1;
    entry.weightTotal += question.weight;

    if (answer.isCorrect) {
      entry.correct += 1;
      entry.weightEarned += question.weight;
      correct += 1;
    }

    byCategory.set(question.category, entry);
  });

  const score = scoreTest(items, ageAdjustment(age));

  return {
    iq: score.iq,
    band: score.band,
    percentile: score.percentile,
    classification: getIQClassification(score.iq),
    correct,
    total: answers.length,
    categories: Array.from(byCategory.values()),
    ...(score.indices && { indices: score.indices }),
  };
}

export function getIQClassification(iq: number): string {
  if (iq >= 130) return "classifications.veryHigh";
  if (iq >= 120) return "classifications.high";
  if (iq >= 110) return "classifications.aboveAverage";
  if (iq >= 90) return "classifications.average";
  if (iq >= 80) return "classifications.belowAverage";
  if (iq >= 70) return "classifications.borderline";
  return "classifications.veryLow";
}

export function getIQDescription(iq: number): string {
  if (iq >= 130) return "descriptions.veryHigh";
  if (iq >= 120) return "descriptions.high";
  if (iq >= 110) return "descriptions.aboveAverage";
  if (iq >= 90) return "descriptions.average";
  if (iq >= 80) return "descriptions.belowAverage";
  if (iq >= 70) return "descriptions.borderline";
  return "descriptions.veryLow";
}
