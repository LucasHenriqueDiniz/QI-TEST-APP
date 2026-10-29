import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { en } from "../assets/i18n/translations/en.ts";
import { es } from "../assets/i18n/translations/es.ts";
import { pt } from "../assets/i18n/translations/pt.ts";
import { questions } from "../data/questions.ts";
import type { Question, QuestionCategory } from "../types/index.ts";

/**
 * No item asks what another one already asked, or shows another one's answer.
 * Until 2026-10-29 the bank had "efêmero" twice, the sun and a lamp twice,
 * 2, 4, 8, 16 twice, and 1, 3, 6 → 10 inside 1, 3, 6, 10 → 15: a Detalhado
 * round draws half of each category, so such pairs met often.
 */
const LANGUAGES = { pt, en, es };

type Item = { question: string; options: string[] };

function itemOf(lang: keyof typeof LANGUAGES, question: Question): Item {
  const items = LANGUAGES[lang].translation.questions.items as Record<string, Record<string, Item>>;
  return items[question.category][question.questionKey];
}

const inCategory = (category: QuestionCategory) =>
  questions.filter((question) => question.category === category && question.type !== "image");

function repeated<T>(entries: [string, T][]): string[] {
  const seen = new Map<T, string>();
  const clashes: string[] = [];
  for (const [label, value] of entries) {
    const first = seen.get(value);
    if (first) clashes.push(`${first} and ${label}`);
    else seen.set(value, label);
  }
  return clashes;
}

/** Words that only frame a similarities question in pt, leaving the pair. */
const FRAME = new Set(
  "o a os as um uma e em que qual são têm tem comum semelhança entre parecidos parecidas".split(" ")
);

function pairOf(question: string): string {
  const words = question
    .toLowerCase()
    .replace(/[?¿!.,]/g, "")
    .split(/\s+/)
    .filter((word) => word && !FRAME.has(word));
  return [...new Set(words)].sort().join(" ");
}

/** The shown terms of a sequence item followed by its answer. */
function sequenceOf(question: Question): number[] {
  const item = itemOf("pt", question);
  const shown = (item.question.match(/\d+/g) ?? []).map(Number);
  return [...shown, Number(item.options[question.correctAnswer])];
}

function containsRun(sequence: number[], run: number[]): boolean {
  return sequence.some((_, start) => run.every((term, offset) => sequence[start + offset] === term));
}

describe("bank duplicates", () => {
  for (const lang of Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]) {
    test(`vocabulary ${lang}: no word is asked twice`, () => {
      const words = inCategory("vocabulary").map((question): [string, string] => {
        const word = itemOf(lang, question).question.match(/["'“‘]([^"'”’]+)["'”’]/)?.[1];
        assert.ok(word, `vocabulary.${question.questionKey} ${lang}: no quoted word`);
        return [question.questionKey, word.toLowerCase()];
      });
      assert.deepEqual(repeated(words), []);
    });
  }

  test("similarities: no pair is asked twice", () => {
    const pairs = inCategory("similarities").map((question): [string, string] => [
      question.questionKey,
      pairOf(itemOf("pt", question).question),
    ]);
    assert.deepEqual(repeated(pairs), []);
  });

  test("numeric: an item's last three terms, its answer included, never appear in a row in another item", () => {
    const items = inCategory("matrix").map((question) => ({ key: question.questionKey, sequence: sequenceOf(question) }));
    const leaks: string[] = [];
    for (const item of items) {
      const run = item.sequence.slice(-3);
      for (const other of items) {
        if (other !== item && containsRun(other.sequence, run)) leaks.push(`${item.key} (${run.join(", ")}) in ${other.key}`);
      }
    }
    assert.deepEqual(leaks, []);
  });
});
