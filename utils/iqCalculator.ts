import { questions } from "@/data/questions";
import { Answer, CategoryScore, QuestionCategory, TestOutcome } from "@/types";

const MEAN_IQ = 100;
const STANDARD_DEVIATION = 15;

/**
 * Calibração da pontuação bruta.
 *
 * Não é um teste normatizado — não temos amostra populacional. Assumimos que
 * o acerto ponderado médio fica em torno de 55% com desvio de 18 p.p., que é
 * o que produz uma distribuição plausível sobre este banco de questões.
 * Trocar estes números é o único ponto a mexer caso um dia haja dados reais.
 */
const EXPECTED_RATIO = 0.55;
const RATIO_SPREAD = 0.18;

/** Limites de exibição. Fora disso a estimativa não tem qualquer significado. */
const MIN_IQ = 55;
const MAX_IQ = 145;

/** Função de distribuição acumulada da normal padrão (Abramowitz & Stegun 26.2.17). */
function normalCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;

  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);

  return 0.5 * (1 + sign * y);
}

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
 * Pontua sobre as questões efetivamente respondidas, e não sobre um total
 * fixo — assim um teste interrompido não é penalizado como se todas as
 * questões restantes estivessem erradas.
 */
export function evaluateTest(answers: Answer[], age?: number): TestOutcome {
  const byCategory = new Map<QuestionCategory, CategoryScore>();

  let weightEarned = 0;
  let weightTotal = 0;
  let correct = 0;

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const entry = byCategory.get(question.category) ?? {
      category: question.category,
      correct: 0,
      total: 0,
      weightEarned: 0,
      weightTotal: 0,
    };

    entry.total += 1;
    entry.weightTotal += question.weight;
    weightTotal += question.weight;

    if (answer.isCorrect) {
      entry.correct += 1;
      entry.weightEarned += question.weight;
      weightEarned += question.weight;
      correct += 1;
    }

    byCategory.set(question.category, entry);
  });

  const ratio = weightTotal > 0 ? weightEarned / weightTotal : 0;
  const z = (ratio - EXPECTED_RATIO) / RATIO_SPREAD;

  const rawIq = MEAN_IQ + z * STANDARD_DEVIATION + ageAdjustment(age);
  const iq = Math.min(Math.max(Math.round(rawIq), MIN_IQ), MAX_IQ);

  // Percentil derivado do QI final (e não do z bruto) para manter coerência
  // com o número que o usuário vê depois do ajuste e do clamp.
  const percentile = Math.min(Math.max(Math.round(normalCdf((iq - MEAN_IQ) / STANDARD_DEVIATION) * 100), 1), 99);

  return {
    iq,
    percentile,
    classification: getIQClassification(iq),
    correct,
    total: answers.length,
    categories: Array.from(byCategory.values()),
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
