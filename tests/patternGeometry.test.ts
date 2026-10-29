import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { holeScale } from "../assets/questions/patterns/geometry.ts";
import { questions } from "../data/questions.ts";

/**
 * Every pattern item needs its hole scale, or its options fall back to the
 * cell width and come out ~1.22× larger than the hole they fill (p25–p54
 * until slice 05.1).
 */
describe("pattern geometry", () => {
  const patterns = questions.filter((question) => question.type === "image");

  test("every pattern item in the bank has a hole scale", () => {
    const missing = patterns.filter((question) => holeScale(question.questionKey) === undefined);
    assert.ok(patterns.length > 0);
    assert.deepEqual(missing.map((question) => question.questionKey), []);
  });

  test("an option is drawn smaller than the matrix's third, as its hole is", () => {
    for (const question of patterns) {
      const scale = holeScale(question.questionKey)!;
      assert.ok(scale > 0.3 && scale < 0.4, `${question.questionKey}: ${scale}`);
    }
  });
});
