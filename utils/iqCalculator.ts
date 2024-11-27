import { Answer } from "@/types";
import { questions } from "@/data/questions";

const MEAN_IQ = 100;
const STANDARD_DEVIATION = 15;

interface QuestionScore {
  isCorrect: boolean;
  weight: number;
  timeSpent: number;
}

export function calculateIQ(answers: Answer[], age: number): number {
  // Calculate raw score
  const totalPossibleScore = 30 * 3; // 30 questions, max weight 3
  let rawScore = 0;
  let timeBonus = 0;

  answers.forEach((answer) => {
    if (answer.isCorrect) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question) {
        rawScore += question.weight;

        // Time bonus for quick correct answers
        if (answer.timeSpent < 20) {
          // If answered correctly in less than 20 seconds
          timeBonus += 0.1 * question.weight;
        }
      }
    }
  });

  // Add time bonus to raw score
  rawScore += timeBonus;

  // Convert to scaled score (similar to Wechsler scaling)
  const scaledScore = (rawScore / totalPossibleScore) * 100;

  // Apply age adjustment (simplified version of Wechsler age adjustment)
  let ageAdjustment = 0;
  if (age < 16) {
    ageAdjustment = 5; // Bonus for younger test takers
  } else if (age > 60) {
    ageAdjustment = -5; // Adjustment for older test takers
  }

  // Calculate final IQ using normal distribution
  const zScore = (scaledScore - 50) / 20; // Convert to z-score
  const iq = Math.round(MEAN_IQ + zScore * STANDARD_DEVIATION + ageAdjustment);

  // Clamp IQ between 40 and 160
  return Math.min(Math.max(iq, 40), 160);
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
