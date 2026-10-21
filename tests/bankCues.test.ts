import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { en } from "../assets/i18n/translations/en.ts";
import { es } from "../assets/i18n/translations/es.ts";
import { pt } from "../assets/i18n/translations/pt.ts";
import { questions } from "../data/questions.ts";
import type { Question, QuestionCategory } from "../types/index.ts";

/**
 * Test-wise cues on the bank the app ships: the texts in the translation
 * files, not a staging copy. A key that is longer than every distractor lets
 * someone answer without reading the question; the limit is the one
 * scripts/bank/count.py applies to staged items.
 */
const MAX_LONGEST_SHARE = 0.35;

/**
 * Every text category. Before the rewrite of 2026-10-20 the key was the
 * longest option in pt 10/20 similarities, 16/20 vocabulary and 15/20
 * comprehension items.
 */
const GUARDED: QuestionCategory[] = ["similarities", "vocabulary", "matrix", "comprehension"];

const LANGUAGES = { pt, en, es };

function optionsOf(lang: keyof typeof LANGUAGES, question: Question): string[] {
  const items = LANGUAGES[lang].translation.questions.items as Record<string, Record<string, { options: string[] }>>;
  return items[question.category][question.questionKey].options;
}

/** True when the key is strictly longer, in characters, than every distractor. */
function keyIsLongest(options: string[], key: number): boolean {
  return options.every((option, index) => index === key || option.length < options[key].length);
}

describe("bank cues", () => {
  for (const category of GUARDED) {
    const items = questions.filter((question) => question.category === category && question.type !== "image");

    for (const lang of Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]) {
      test(`${category} ${lang}: the key is the longest option in at most ${MAX_LONGEST_SHARE * 100}% of items`, () => {
        const longest = items.filter((question) => keyIsLongest(optionsOf(lang, question), question.correctAnswer));
        assert.ok(items.length > 0, `no ${category} text items in the bank`);
        assert.ok(
          longest.length / items.length <= MAX_LONGEST_SHARE,
          `${longest.length}/${items.length}: ${longest.map((question) => question.questionKey).join(", ")}`
        );
      });
    }
  }
});
