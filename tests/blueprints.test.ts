import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { BLUEPRINTS, CATEGORIES, DIFFICULTIES, blueprintLength, cellCount, cellShortfalls, isModeAvailable, parseMode, roundLength } from "../utils/scoring/blueprints.ts";
import { INDEX_DOMAIN } from "../utils/scoring/score.ts";
import { TODAY_BANK, bankWithForms } from "./helpers.ts";

describe("blueprints", () => {
  test("totals are 20 / 40 / 90", () => {
    assert.equal(roundLength("rapido"), 20);
    assert.equal(roundLength("normal"), 40);
    assert.equal(roundLength("detalhado"), 90);
  });

  test("every mode splits reasoning and verbal 50/50", () => {
    for (const mode of ["rapido", "normal", "detalhado"] as const) {
      const perDomain = { reasoning: 0, verbal: 0 };
      for (const category of CATEGORIES) {
        for (const difficulty of DIFFICULTIES) perDomain[INDEX_DOMAIN[category]] += BLUEPRINTS[mode][category][difficulty];
      }
      assert.equal(perDomain.reasoning, perDomain.verbal, `${mode}: ${perDomain.reasoning} reasoning vs ${perDomain.verbal} verbal`);
    }
  });

  test("easy / medium / hard totals are 6/8/6, 12/16/12 and 26/37/27", () => {
    const byDifficulty = (mode: "rapido" | "normal" | "detalhado") =>
      DIFFICULTIES.map((difficulty) => CATEGORIES.reduce((sum, category) => sum + BLUEPRINTS[mode][category][difficulty], 0));
    assert.deepEqual(byDifficulty("rapido"), [6, 8, 6]);
    assert.deepEqual(byDifficulty("normal"), [12, 16, 12]);
    assert.deepEqual(byDifficulty("detalhado"), [26, 37, 27]);
    assert.equal(blueprintLength(BLUEPRINTS.detalhado), 90);
  });

  test("parseMode accepts the three modes and nothing else", () => {
    assert.equal(parseMode("rapido"), "rapido");
    assert.equal(parseMode("normal"), "normal");
    assert.equal(parseMode("detalhado"), "detalhado");
    assert.equal(parseMode("completo"), null);
    assert.equal(parseMode(undefined), null);
    assert.equal(parseMode(40), null);
  });
});

describe("fit against today's bank (110 items)", () => {
  test("the bank is the one the research measured", () => {
    assert.equal(TODAY_BANK.length, 110);
    assert.equal(cellCount(TODAY_BANK, "vocabulary", "easy"), 0);
    assert.equal(cellCount(TODAY_BANK, "vocabulary", "medium"), 2);
    assert.equal(cellCount(TODAY_BANK, "patterns", "medium"), 6);
  });

  test("rapido fits every cell except easy vocabulary (bank has none)", () => {
    assert.deepEqual(cellShortfalls(BLUEPRINTS.rapido, TODAY_BANK), [{ category: "vocabulary", difficulty: "easy", wanted: 1, available: 0 }]);
  });

  test("normal fits every cell except easy (0 of 2) and medium (2 of 3) vocabulary", () => {
    assert.deepEqual(cellShortfalls(BLUEPRINTS.normal, TODAY_BANK), [
      { category: "vocabulary", difficulty: "easy", wanted: 2, available: 0 },
      { category: "vocabulary", difficulty: "medium", wanted: 3, available: 2 },
    ]);
  });

  test("detalhado is short in several cells today", () => {
    const short = cellShortfalls(BLUEPRINTS.detalhado, TODAY_BANK);
    assert.ok(short.length >= 5, `only ${short.length} short cells`);
    assert.ok(short.some((s) => s.category === "patterns" && s.difficulty === "medium" && s.wanted === 11 && s.available === 6));
  });
});

describe("mode availability", () => {
  test("rapido and normal are available on today's bank", () => {
    assert.equal(isModeAvailable("rapido", TODAY_BANK), true);
    assert.equal(isModeAvailable("normal", TODAY_BANK), true);
  });

  test("detalhado is unavailable on today's bank", () => {
    assert.equal(isModeAvailable("detalhado", TODAY_BANK), false);
  });

  test("detalhado becomes available once every cell holds 2× its blueprint count, not before", () => {
    assert.equal(isModeAvailable("detalhado", bankWithForms("detalhado", 2)), true);
    assert.equal(isModeAvailable("detalhado", bankWithForms("detalhado", 1.6)), false);

    // One cell one item short of 2× is enough to keep it off.
    const bank = bankWithForms("detalhado", 2);
    const lastHardPattern = [...bank].reverse().find((q) => q.category === "patterns" && q.difficulty === "hard")!;
    assert.equal(isModeAvailable("detalhado", bank.filter((q) => q.id !== lastHardPattern.id)), false);
  });
});
