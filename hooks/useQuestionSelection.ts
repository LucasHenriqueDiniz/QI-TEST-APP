import { useMemo } from "react";
import { questions } from "@/data/questions";
import { Question } from "@/types";

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function selectQuestionsByDifficulty(questions: Question[], difficulty: string, count: number): Question[] {
  return shuffleArray(questions.filter((q) => q.difficulty === difficulty)).slice(0, count);
}

export function useQuestionSelection() {
  const selectedQuestions = useMemo(() => {
    // Separar questões por categoria
    const patternQuestions = questions.filter((q) => q.category === "patterns");
    const similaritiesQuestions = questions.filter((q) => q.category === "similarities");
    const vocabularyQuestions = questions.filter((q) => q.category === "vocabulary");
    const matrixQuestions = questions.filter((q) => q.category === "matrix");
    const comprehensionQuestions = questions.filter((q) => q.category === "comprehension");

    // Selecionar questões de padrões (patterns)
    const selectedPatterns = shuffleArray(patternQuestions).slice(0, 12); // 12 questões de padrões

    // Selecionar questões das outras categorias
    const selectedSimilarities = [
      ...selectQuestionsByDifficulty(similaritiesQuestions, "easy", 1),
      ...selectQuestionsByDifficulty(similaritiesQuestions, "medium", 2),
      ...selectQuestionsByDifficulty(similaritiesQuestions, "hard", 2),
    ]; // 5 questões de similaridades

    const selectedVocabulary = [
      ...selectQuestionsByDifficulty(vocabularyQuestions, "easy", 1),
      ...selectQuestionsByDifficulty(vocabularyQuestions, "medium", 1),
      ...selectQuestionsByDifficulty(vocabularyQuestions, "hard", 2),
    ]; // 4 questões de vocabulário

    const selectedMatrix = [
      ...selectQuestionsByDifficulty(matrixQuestions, "easy", 1),
      ...selectQuestionsByDifficulty(matrixQuestions, "medium", 2),
      ...selectQuestionsByDifficulty(matrixQuestions, "hard", 2),
    ]; // 5 questões de matriz

    const selectedComprehension = [
      ...selectQuestionsByDifficulty(comprehensionQuestions, "easy", 1),
      ...selectQuestionsByDifficulty(comprehensionQuestions, "medium", 2),
      ...selectQuestionsByDifficulty(comprehensionQuestions, "hard", 1),
    ]; // 4 questões de compreensão

    // Combinar todas as questões selecionadas
    const allSelected = [
      ...selectedPatterns, // 12 questões
      ...selectedSimilarities, // 5 questões
      ...selectedVocabulary, // 4 questões
      ...selectedMatrix, // 5 questões
      ...selectedComprehension, // 4 questões
    ]; // Total: 30 questões

    // Embaralhar a ordem final das questões
    return shuffleArray(allSelected);
  }, []);

  return selectedQuestions;
}
