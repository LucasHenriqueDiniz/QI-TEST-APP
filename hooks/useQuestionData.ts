import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { questions } from "@/data/questions";
import { Question } from "@/types";

interface TranslatedQuestion extends Question {
  question: string;
  options: string[];
}

/** Junta a questão (dados) com o texto traduzido (i18n). */
export function useQuestionData() {
  const { t } = useTranslation();

  const getQuestionData = useCallback(
    (questionId: string): TranslatedQuestion | null => {
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

      return {
        ...question,
        question: t(`${base}.question`),
        options: options as string[],
      };
    },
    [t]
  );

  return { getQuestionData };
}
