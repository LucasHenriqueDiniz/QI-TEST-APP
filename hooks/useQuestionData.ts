import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { questions } from "@/data/questions";
import { Question } from "@/types";
import { applyOptionOrder } from "@/utils/scoring/selection";

interface TranslatedQuestion extends Question {
  question: string;
  /** Alternativas já na ordem de exibição. */
  options: string[];
  /** Posição da alternativa correta em `options` — na ordem exibida, não na do banco. */
  correctAnswer: number;
}

/** Junta a questão (dados) com o texto traduzido (i18n). */
export function useQuestionData() {
  const { t } = useTranslation();

  const getQuestionData = useCallback(
    (questionId: string, optionOrder?: readonly number[]): TranslatedQuestion | null => {
      const question = questions.find((q) => q.id === questionId);
      if (!question) return null;

      // Questões de padrão são puramente visuais — não têm texto nem alternativas.
      if (question.type === "image") {
        return { ...question, question: "", options: [] };
      }

      const base = `questions.items.${question.category}.${question.questionKey}`;
      const options = t(`${base}.options`, { returnObjects: true });

      if (!Array.isArray(options)) {
        console.warn(`Alternativas ausentes para ${base}`);
        return null;
      }

      const displayed = optionOrder
        ? applyOptionOrder(options as string[], question.correctAnswer, optionOrder)
        : { options: options as string[], correctAnswer: question.correctAnswer };

      return {
        ...question,
        question: t(`${base}.question`),
        options: displayed.options,
        correctAnswer: displayed.correctAnswer,
      };
    },
    [t]
  );

  return { getQuestionData };
}
