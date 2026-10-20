import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { en } from "../assets/i18n/translations/en.ts";
import { es } from "../assets/i18n/translations/es.ts";
import { pt } from "../assets/i18n/translations/pt.ts";
import { questions } from "../data/questions.ts";
import type { Question } from "../types/index.ts";

/**
 * One item, one key: `correctAnswer` in data/questions.ts is shared by the
 * three languages, so each language must ask the same thing with the same
 * options in the same order. Items 15–20 of several categories once had a
 * different question per language, and the shared index pointed at a wrong
 * option in some of them (1, 2, 4, 8 → "12" in en). Numeric items can be
 * compared exactly: same numbers in the question, same options.
 */
const LANGUAGES = { pt, en, es };

type Item = { question: string; options: string[] };

function itemOf(lang: keyof typeof LANGUAGES, question: Question): Item {
  const items = LANGUAGES[lang].translation.questions.items as Record<string, Record<string, Item>>;
  return items[question.category][question.questionKey];
}

const numbers = (text: string) => text.match(/\d+/g) ?? [];

describe("bank parity", () => {
  const text = questions.filter((question) => question.type !== "image");

  test("every text item has four options in every language and its key points at one", () => {
    for (const question of text) {
      for (const lang of Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]) {
        const item = itemOf(lang, question);
        assert.equal(item?.options?.length, 4, `${question.category}.${question.questionKey} ${lang}`);
        assert.ok(question.correctAnswer < item.options.length, `${question.category}.${question.questionKey} ${lang}`);
      }
    }
  });

  test("numeric items ask the same sequence with the same options in pt, en and es", () => {
    const mismatched = text
      .filter((question) => question.category === "matrix")
      .filter((question) => {
        const [base, ...others] = Object.keys(LANGUAGES).map((lang) => itemOf(lang as keyof typeof LANGUAGES, question));
        return others.some(
          (other) =>
            numbers(other.question).join(",") !== numbers(base.question).join(",") ||
            other.options.join("|") !== base.options.join("|")
        );
      })
      .map((question) => question.questionKey);
    assert.deepEqual(mismatched, []);
  });
});
