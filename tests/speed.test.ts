import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { mulberry32 } from "../utils/scoring/random.ts";
import { PAIR_LENGTH, differences, makePair, speedScore } from "../utils/speed.ts";

describe("speed task", () => {
  const rng = mulberry32(2026);
  const pairs = Array.from({ length: 1000 }, () => makePair(rng));

  test("about half of 1 000 seeded pairs are equal", () => {
    const equal = pairs.filter((pair) => pair.same).length;
    assert.ok(equal >= 450 && equal <= 550, `${equal} equal`);
  });

  test("an equal pair matches at every position, a different one at all but one", () => {
    for (const pair of pairs) {
      assert.equal(pair.left.length, PAIR_LENGTH);
      assert.equal(pair.right.length, PAIR_LENGTH);
      assert.equal(differences(pair), pair.same ? 0 : 1);
    }
  });

  test("the same seed draws the same pairs", () => {
    const again = mulberry32(2026);
    assert.deepEqual(
      Array.from({ length: 50 }, () => makePair(again)),
      pairs.slice(0, 50)
    );
  });

  test("the score is correct minus wrong, never below zero", () => {
    assert.equal(speedScore(30, 4), 26);
    assert.equal(speedScore(5, 9), 0);
  });
});
