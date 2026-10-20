import { questions } from "../data/questions.ts";
import type { Difficulty, Question, QuestionCategory, TestMode } from "../types/index.ts";
import { BLUEPRINTS, CATEGORIES, DIFFICULTIES, cellCount, type Blueprint } from "../utils/scoring/blueprints.ts";
import type { ScoredItem } from "../utils/scoring/score.ts";

/** The bank as shipped today (110 items). */
export const TODAY_BANK: readonly Question[] = questions;

/** Today's bank plus fake items until every cell holds `factor` × the mode's blueprint. */
export function bankWithForms(mode: TestMode, factor: number): Question[] {
  const bank = [...questions];
  for (const category of CATEGORIES) {
    for (const difficulty of DIFFICULTIES) {
      const need = Math.ceil(factor * BLUEPRINTS[mode][category][difficulty]);
      const have = cellCount(questions, category, difficulty);
      for (let i = have; i < need; i++) {
        bank.push({
          id: `fake-${category}-${difficulty}-${i}`,
          category,
          questionKey: `${category[0]}${1000 + i}`,
          difficulty,
          correctAnswer: 0,
          weight: 1,
          ...(category === "patterns" && { type: "image" as const }),
        });
      }
    }
  }
  return bank;
}

/** One scored item per blueprint slot, answered by `correct(difficulty, category)`. */
export function itemsFromBlueprint(blueprint: Blueprint, correct: (difficulty: Difficulty, category: QuestionCategory) => boolean): ScoredItem[] {
  const items: ScoredItem[] = [];
  for (const category of CATEGORIES) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < blueprint[category][difficulty]; i++) {
        items.push({ category, difficulty, correct: correct(difficulty, category) });
      }
    }
  }
  return items;
}

/** The single 30-item blueprint the app shipped before the modes (research sim: CURRENT_30). */
export const LEGACY_30: Blueprint = {
  patterns: { easy: 0, medium: 6, hard: 6 },
  matrix: { easy: 1, medium: 2, hard: 2 },
  similarities: { easy: 1, medium: 2, hard: 2 },
  vocabulary: { easy: 1, medium: 1, hard: 2 },
  comprehension: { easy: 1, medium: 2, hard: 1 },
};

/**
 * An AsyncStorage stand-in: values go through JSON like the real one, so a
 * round trip loses anything JSON cannot carry.
 */
export class FakeStorage {
  private readonly store = new Map<string, string>();

  async getItem<T>(key: string): Promise<T | null> {
    const value = this.store.get(key);
    return value === undefined ? null : (JSON.parse(value) as T);
  }

  async setItem(key: string, value: unknown): Promise<void> {
    this.store.set(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export const mean = (xs: readonly number[]): number => xs.reduce((s, x) => s + x, 0) / xs.length;

export const standardDeviation = (xs: readonly number[]): number => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};
