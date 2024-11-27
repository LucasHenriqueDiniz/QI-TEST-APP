import { Answer } from ".";

export const STORAGE_KEYS = {
  testProgress: "testProgress",
  testHistory: "testHistory",
  userData: "userData",
  userPurchases: "userPurchases",
} as const;

export type StorageKeys = keyof typeof STORAGE_KEYS;

export interface UserPurchases {
  availableTests: number;
  unlimitedTests: boolean;
  hideAds: boolean;
  lastAdWatchDate?: string;
}

export interface StorageData {
  testProgress: {
    currentIndex: number;
    savedAnswers: Answer[];
  };
  testHistory: HistoryItem[];
  userData: {
    name: string;
    age: string;
  };
  userPurchases: UserPurchases;
}

export interface HistoryItem {
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  iqScore: number;
}
