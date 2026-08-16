import { Answer, CategoryScore } from ".";

export const STORAGE_KEYS = {
  testProgress: "testProgress",
  testHistory: "testHistory",
  userData: "userData",
} as const;

export type StorageKeys = keyof typeof STORAGE_KEYS;

export interface HistoryItem {
  /** ISO 8601. */
  date: string;
  iqScore: number;
  percentile: number;
  correctAnswers: number;
  totalQuestions: number;
  categories: CategoryScore[];
}

export interface UserData {
  name?: string;
  /** Guardado como string por vir de um seletor; converta com `Number()`. */
  age?: string;
}

export interface TestProgress {
  currentIndex: number;
  savedAnswers: Answer[];
  /** Ids das questões sorteadas, para retomar exatamente o mesmo teste. */
  questionIds: string[];
}

export interface StorageData {
  testProgress: TestProgress;
  testHistory: HistoryItem[];
  userData: UserData;
}
