import { useTranslation } from "react-i18next";
import { questions } from "@/data/questions";

export const useQuestionData = () => {
  const { t } = useTranslation();

  const getQuestionData = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return null;

    const translationKey = `questions.items.${question.category}.${question.questionKey}`;

    // Get the question text and options from translations
    const questionText = t(`${translationKey}.question`);
    const options = t(`${translationKey}.options`, { returnObjects: true });

    // Debug log
    console.log("Translation Key:", translationKey);
    console.log("Question Text:", questionText);
    console.log("Options:", options);

    return {
      ...question,
      question: questionText,
      options: options as string[],
    };
  };

  return { getQuestionData };
};
