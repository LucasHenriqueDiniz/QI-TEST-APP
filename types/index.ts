export type Theme = "light" | "dark";

export interface ThemeColors {
  light: ColorScheme;
  dark: ColorScheme;
}

interface ColorScheme {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}

export interface TestHistory {
  date: string;
  score: number;
}

export interface Answer {
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

export type QuestionCategory = "similarities" | "vocabulary" | "matrix" | "comprehension" | "patterns";

export interface Question {
  id: string;
  category: QuestionCategory;
  questionKey: string;
  difficulty: "easy" | "medium" | "hard";
  correctAnswer: number;
  weight: number;
  type?: "text" | "image";
}

export interface QuestionWithTranslation {
  id: string;
  questionKey: string;
  options: string[];
  correctAnswer: number;
}
