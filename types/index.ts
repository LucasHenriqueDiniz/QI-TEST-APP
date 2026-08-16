export type QuestionCategory = "similarities" | "vocabulary" | "matrix" | "comprehension" | "patterns";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  category: QuestionCategory;
  questionKey: string;
  difficulty: Difficulty;
  correctAnswer: number;
  weight: number;
  type?: "text" | "image";
}

export interface Answer {
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

/** Desempenho agregado em uma categoria de questões. */
export interface CategoryScore {
  category: QuestionCategory;
  correct: number;
  total: number;
  weightEarned: number;
  weightTotal: number;
}

/** Resultado consolidado de um teste. */
export interface TestOutcome {
  iq: number;
  /** Posição estimada na população, de 1 a 99. */
  percentile: number;
  /** Chave de tradução, ex.: `classifications.average`. */
  classification: string;
  correct: number;
  total: number;
  categories: CategoryScore[];
}
