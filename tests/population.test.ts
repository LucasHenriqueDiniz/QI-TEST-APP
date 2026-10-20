import assert from "node:assert/strict";
import { test } from "node:test";
import type { Difficulty } from "../types/index.ts";
import { mulberry32 } from "../utils/scoring/random.ts";
import { scoreTest } from "../utils/scoring/score.ts";
import { selectFromBlueprint } from "../utils/scoring/selection.ts";
import { LEGACY_30, TODAY_BANK, mean, standardDeviation } from "./helpers.ts";

/**
 * The population model of docs/research/scoring-modes/sim/simulate.mjs:
 * persons θ ~ N(0, 1), items answered by a 3PL with c = 0.25 and the
 * calibrated a = 1.2, b = −1.1 / −0.1 / +0.9. These are the *truth* of the
 * simulation and are written out here on purpose: if the estimator's
 * constants drift from them, this test is what notices.
 */
const TRUE_GUESSING = 0.25;
const TRUE_SLOPE = 1.2;
const TRUE_LOCATION: Record<Difficulty, number> = { easy: -1.1, medium: -0.1, hard: 0.9 };
const PERSONS = 10_000;

/**
 * The research's own numbers for the legacy 30-item form scored by EAP
 * (sim/output.txt, "current 30 | eap"): population mean 100.0, SD 13.3.
 * EAP shrinks every estimate toward the prior mean, so the SD of the
 * *estimates* is below the 15 of the true IQ by construction; 15 is what the
 * population has, 13.3 is what a 30-item test recovers of it.
 *
 * Tolerances: with 10 000 persons the standard error of the mean is
 * 13.3 / √10000 ≈ 0.13 and that of the SD ≈ 0.09, so ±0.5 and ±0.4 are about
 * four standard errors. Measured with this seed: a = 1.2 gives 100.00 / 13.30;
 * a = 1.0 gives 13.98 and a = 1.4 gives 12.75, both red; a = 1.1 (13.64) and
 * a = 1.3 (13.02) stay inside the window, so this test holds the population
 * claim of D6 and the golden values in eap.test.ts hold the constants.
 */
const EXPECTED_MEAN = 100.0;
const EXPECTED_SD = 13.3;
const MEAN_TOLERANCE = 0.5;
const SD_TOLERANCE = 0.4;

test(`legacy 30-item form over ${PERSONS} simulated persons keeps mean ${EXPECTED_MEAN} ± ${MEAN_TOLERANCE} and SD ${EXPECTED_SD} ± ${SD_TOLERANCE}`, () => {
  const rng = mulberry32(20261019);
  const gauss = () => {
    let u = 0;
    while (u === 0) u = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
  };
  const pCorrect = (theta: number, difficulty: Difficulty) => TRUE_GUESSING + (1 - TRUE_GUESSING) / (1 + Math.exp(-TRUE_SLOPE * (theta - TRUE_LOCATION[difficulty])));

  const scores: number[] = [];
  for (let i = 0; i < PERSONS; i++) {
    const theta = gauss();
    const { questions } = selectFromBlueprint(TODAY_BANK, LEGACY_30, null, rng);
    const items = questions.map((q) => ({ category: q.category, difficulty: q.difficulty, correct: rng() < pCorrect(theta, q.difficulty) }));
    scores.push(scoreTest(items).iq);
  }

  const m = mean(scores);
  const sd = standardDeviation(scores);
  assert.ok(Math.abs(m - EXPECTED_MEAN) <= MEAN_TOLERANCE, `population mean ${m.toFixed(2)} is off ${EXPECTED_MEAN} by more than ${MEAN_TOLERANCE}`);
  assert.ok(Math.abs(sd - EXPECTED_SD) <= SD_TOLERANCE, `population SD ${sd.toFixed(2)} is off ${EXPECTED_SD} by more than ${SD_TOLERANCE}`);
});
