import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { Answer, Difficulty, TestMode } from "../types/index.ts";
import { evaluateTest, getIQClassification } from "../utils/iqCalculator.ts";
import { mulberry32 } from "../utils/scoring/random.ts";
import { scoreTest } from "../utils/scoring/score.ts";
import { buildRound } from "../utils/scoring/selection.ts";
import { TODAY_BANK } from "./helpers.ts";

/**
 * `evaluateTest` looks every answer up in the shipped bank, so these rounds
 * come from today's 110 items. Their vocabulary holes are filled with hard
 * items, which is why the numbers differ from the exact-blueprint golden
 * values in eap.test.ts: the estimate follows the difficulties actually
 * answered, and the comparison against `scoreTest` over the same items is
 * what pins the wiring (category and difficulty looked up per answer).
 */
function roundOn(mode: TestMode, seed = 1) {
  return buildRound(TODAY_BANK, mode, null, mulberry32(seed)).items;
}

const answersFor = (mode: TestMode, correct: boolean, seed = 1): Answer[] =>
  roundOn(mode, seed).map((item) => ({ questionId: item.question.id, isCorrect: correct, timeSpent: 1 }));

const mixOf = (mode: TestMode, seed = 1): Record<Difficulty, number> => {
  const mix: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  roundOn(mode, seed).forEach((item) => (mix[item.question.difficulty] += 1));
  return mix;
};

describe("evaluateTest over the shipped bank", () => {
  test("a normal round all correct: 138 (10/15/15 instead of 12/16/12 — three hard items fill the vocabulary holes)", () => {
    assert.deepEqual(mixOf("normal"), { easy: 10, medium: 15, hard: 15 });
    const outcome = evaluateTest(answersFor("normal", true));
    const expected = scoreTest(roundOn("normal").map((item) => ({ category: item.question.category, difficulty: item.question.difficulty, correct: true })));
    assert.equal(outcome.iq, 138);
    assert.equal(outcome.iq, expected.iq);
    assert.deepEqual(outcome.band, expected.band);
    assert.equal(outcome.percentile, 99);
    assert.equal(outcome.correct, 40);
    assert.equal(outcome.total, 40);
    assert.equal(outcome.indices, undefined);
    assert.equal(outcome.classification, "classifications.veryHigh");
    assert.equal(outcome.categories.length, 5);
    assert.equal(
      outcome.categories.reduce((sum, c) => sum + c.correct, 0),
      40
    );
  });

  test("a rapido round all wrong: 66 (one hard item in the easy-vocabulary slot), band from the same estimate", () => {
    assert.deepEqual(mixOf("rapido"), { easy: 5, medium: 8, hard: 7 });
    const outcome = evaluateTest(answersFor("rapido", false));
    const expected = scoreTest(roundOn("rapido").map((item) => ({ category: item.question.category, difficulty: item.question.difficulty, correct: false })));
    assert.equal(outcome.iq, 66);
    assert.equal(outcome.iq, expected.iq);
    assert.deepEqual(outcome.band, expected.band);
    assert.equal(outcome.correct, 0);
    assert.equal(outcome.classification, "classifications.veryLow");
  });

  test("a detalhado round (90 real items, short cells filled) reports both indices with 45 items each", () => {
    const outcome = evaluateTest(answersFor("detalhado", true));
    assert.equal(outcome.total, 90);
    assert.equal(outcome.indices?.verbal?.items, 45);
    assert.equal(outcome.indices?.reasoning?.items, 45);
    assert.ok(outcome.iq >= 140, `all correct on 90 items gives ${outcome.iq}`);
  });

  test("the age adjustment still moves the score and its band: +4 under 14, −3 over 65", () => {
    const answers = answersFor("rapido", true);
    const adult = evaluateTest(answers, 30);
    const child = evaluateTest(answers, 10);
    const senior = evaluateTest(answers, 70);
    assert.equal(child.iq, adult.iq + 4);
    assert.equal(child.band.lower, adult.band.lower + 4);
    assert.equal(senior.iq, adult.iq - 3);
    assert.equal(senior.band.lower, adult.band.lower - 3);
  });

  test("an interrupted test is scored on what was answered", () => {
    const answers = answersFor("normal", true).slice(0, 12);
    const outcome = evaluateTest(answers);
    assert.equal(outcome.total, 12);
    assert.ok(outcome.iq > 100 && outcome.iq < 138, `12 right answers give ${outcome.iq}`);
    assert.ok(outcome.band.upper - outcome.band.lower > 25, "a short test has a wide band");
  });

  test("answers to unknown questions are ignored by the estimate", () => {
    const outcome = evaluateTest([{ questionId: "does-not-exist", isCorrect: true, timeSpent: 1 }]);
    assert.equal(outcome.iq, 100);
    assert.equal(outcome.correct, 0);
    assert.equal(outcome.total, 1);
  });

  test("classification boundaries are unchanged", () => {
    assert.equal(getIQClassification(130), "classifications.veryHigh");
    assert.equal(getIQClassification(129), "classifications.high");
    assert.equal(getIQClassification(90), "classifications.average");
    assert.equal(getIQClassification(69), "classifications.veryLow");
  });
});
