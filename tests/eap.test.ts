import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { TestMode } from "../types/index.ts";
import { BLUEPRINTS } from "../utils/scoring/blueprints.ts";
import { MAX_IQ, MEAN_IQ, MIN_IQ, SD_IQ, bandOf, estimateAbility, percentileOf, toIq } from "../utils/scoring/eap.ts";
import { MIN_ITEMS_FOR_INDEX, scoreTest } from "../utils/scoring/score.ts";
import { itemsFromBlueprint } from "./helpers.ts";

const MODES: TestMode[] = ["rapido", "normal", "detalhado"];

/** Golden values from docs/research/scoring-modes/README.md §4.2 (band = 90% × 1.25). */
const GOLDEN = {
  allCorrect: { rapido: 130, normal: 137, detalhado: 145 },
  allCorrectBand: { rapido: [111, 145], normal: [120, 145], detalhado: [131, 145] },
  easyMediumRight: { rapido: 106, normal: 107, detalhado: 107 },
  onlyEasyRight: { rapido: 84, normal: 82, detalhado: 81 },
  // Only detalhado's 51 falls below the 55 floor; 65 and 58 are shown as they are.
  allWrongBeforeFloor: { rapido: 65, normal: 58, detalhado: 51 },
  allWrong: { rapido: 65, normal: 58, detalhado: 55 },
  allWrongBand: { rapido: [55, 82], normal: [55, 73], detalhado: [55, 63] },
};

/** The IQ the estimate would give without the 55–145 limits. */
const unclamped = (theta: number) => Math.round(MEAN_IQ + SD_IQ * theta);

describe("EAP reference values per mode", () => {
  for (const mode of MODES) {
    test(`${mode}: all correct scores ${GOLDEN.allCorrect[mode]} with band ${GOLDEN.allCorrectBand[mode].join("–")}`, () => {
      const score = scoreTest(itemsFromBlueprint(BLUEPRINTS[mode], () => true));
      assert.equal(score.iq, GOLDEN.allCorrect[mode]);
      assert.deepEqual([score.band.lower, score.band.upper], GOLDEN.allCorrectBand[mode]);
    });

    test(`${mode}: easy and medium right, hard wrong scores ${GOLDEN.easyMediumRight[mode]}`, () => {
      const score = scoreTest(itemsFromBlueprint(BLUEPRINTS[mode], (difficulty) => difficulty !== "hard"));
      assert.equal(score.iq, GOLDEN.easyMediumRight[mode]);
    });

    test(`${mode}: only easy right scores ${GOLDEN.onlyEasyRight[mode]}`, () => {
      const score = scoreTest(itemsFromBlueprint(BLUEPRINTS[mode], (difficulty) => difficulty === "easy"));
      assert.equal(score.iq, GOLDEN.onlyEasyRight[mode]);
    });

    test(`${mode}: all wrong scores ${GOLDEN.allWrong[mode]} (${GOLDEN.allWrongBeforeFloor[mode]} before the ${MIN_IQ} floor) with band ${GOLDEN.allWrongBand[mode].join("–")}`, () => {
      const score = scoreTest(itemsFromBlueprint(BLUEPRINTS[mode], () => false));
      assert.equal(unclamped(score.theta), GOLDEN.allWrongBeforeFloor[mode]);
      assert.equal(score.iq, GOLDEN.allWrong[mode]);
      assert.deepEqual([score.band.lower, score.band.upper], GOLDEN.allWrongBand[mode]);
    });
  }
});

describe("estimator shape", () => {
  test("no answers returns the prior: theta 0, standard error 1", () => {
    const estimate = estimateAbility([]);
    assert.ok(Math.abs(estimate.theta) < 1e-9);
    assert.ok(Math.abs(estimate.standardError - 1) < 0.01);
  });

  test("more items shrink the standard error", () => {
    const rapido = scoreTest(itemsFromBlueprint(BLUEPRINTS.rapido, () => true));
    const normal = scoreTest(itemsFromBlueprint(BLUEPRINTS.normal, () => true));
    const detalhado = scoreTest(itemsFromBlueprint(BLUEPRINTS.detalhado, () => true));
    assert.ok(rapido.standardError > normal.standardError);
    assert.ok(normal.standardError > detalhado.standardError);
  });

  test("the score is clamped to 55–145 and the shift moves it", () => {
    assert.equal(toIq(5), MAX_IQ);
    assert.equal(toIq(-5), MIN_IQ);
    assert.equal(toIq(0), MEAN_IQ);
    assert.equal(toIq(0, 4), MEAN_IQ + 4);
    assert.equal(toIq(1, -3), MEAN_IQ + SD_IQ - 3);
  });

  test("percentile follows the normal curve of the final IQ, within 1–99", () => {
    assert.equal(percentileOf(100), 50);
    assert.equal(percentileOf(115), 84);
    assert.equal(percentileOf(85), 16);
    assert.equal(percentileOf(145), 99);
    assert.equal(percentileOf(55), 1);
  });

  test("a wrong answer never raises the estimate and a right one never lowers it", () => {
    const base = itemsFromBlueprint(BLUEPRINTS.normal, (difficulty) => difficulty === "easy");
    const theta = estimateAbility(base).theta;
    assert.ok(estimateAbility([...base, { difficulty: "hard", correct: true }]).theta > theta);
    assert.ok(estimateAbility([...base, { difficulty: "easy", correct: false }]).theta < theta);
  });
});

describe("Verbal and Raciocínio indices", () => {
  test("detalhado (45 items per domain) reports both indices", () => {
    const score = scoreTest(itemsFromBlueprint(BLUEPRINTS.detalhado, () => true));
    assert.ok(score.indices);
    assert.equal(score.indices.verbal?.items, 45);
    assert.equal(score.indices.reasoning?.items, 45);
    assert.ok(score.indices.verbal!.score >= 130);
    assert.ok(score.indices.reasoning!.band.upper === MAX_IQ);
  });

  test("normal (20 per domain) and rapido (10 per domain) report none", () => {
    assert.equal(scoreTest(itemsFromBlueprint(BLUEPRINTS.normal, () => true)).indices, undefined);
    assert.equal(scoreTest(itemsFromBlueprint(BLUEPRINTS.rapido, () => true)).indices, undefined);
  });

  test(`the threshold is exactly ${MIN_ITEMS_FOR_INDEX} items in the domain`, () => {
    const verbal = (n: number) => Array.from({ length: n }, () => ({ category: "vocabulary" as const, difficulty: "medium" as const, correct: true }));
    assert.equal(scoreTest(verbal(MIN_ITEMS_FOR_INDEX - 1)).indices, undefined);
    const atThreshold = scoreTest(verbal(MIN_ITEMS_FOR_INDEX));
    assert.equal(atThreshold.indices?.verbal?.items, MIN_ITEMS_FOR_INDEX);
    assert.equal(atThreshold.indices?.reasoning, undefined);
  });

  test("an index is the EAP over its own domain only", () => {
    // Verbal all right, reasoning all wrong: the indices must split, the headline sits between.
    const items = itemsFromBlueprint(BLUEPRINTS.detalhado, (_, category) => category === "similarities" || category === "vocabulary" || category === "comprehension");
    const score = scoreTest(items);
    assert.ok(score.indices);
    assert.ok(score.indices.verbal!.score > score.iq);
    assert.ok(score.indices.reasoning!.score < score.iq);
    // Each index is the estimate over that domain's 45 answers alone, shift and all.
    const reasoningOnly = estimateAbility(items.filter((item) => item.category === "patterns" || item.category === "matrix"));
    assert.equal(score.indices.reasoning!.score, toIq(reasoningOnly.theta));
    assert.deepEqual(score.indices.reasoning!.band, bandOf(reasoningOnly));
    const shifted = scoreTest(items, 4);
    assert.equal(shifted.indices!.reasoning!.score, toIq(reasoningOnly.theta, 4));
  });
});
