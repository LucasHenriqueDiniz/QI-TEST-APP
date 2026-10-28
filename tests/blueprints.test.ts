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

describe("fit against the shipped bank (188 items)", () => {
  test("the bank is the expanded one of the research table", () => {
    assert.equal(TODAY_BANK.length, 188);
    assert.equal(cellCount(TODAY_BANK, "vocabulary", "easy"), 8);
    assert.equal(cellCount(TODAY_BANK, "vocabulary", "medium"), 12);
    assert.equal(cellCount(TODAY_BANK, "patterns", "medium"), 22);
  });

  test("every mode fits every cell: no shortfalls", () => {
    for (const mode of ["rapido", "normal", "detalhado"] as const) {
      assert.deepEqual(cellShortfalls(BLUEPRINTS[mode], TODAY_BANK), [], mode);
    }
  });
});

describe("mode availability", () => {
  test("all three modes are available on the shipped bank", () => {
    for (const mode of ["rapido", "normal", "detalhado"] as const) {
      assert.equal(isModeAvailable(mode, TODAY_BANK), true, mode);
    }
  });

  test("detalhado becomes available once every cell holds 2× its blueprint count, not before", () => {
    // Built from nothing, so the shipped bank (already at 2×) does not hide the threshold.
    assert.equal(isModeAvailable("detalhado", bankWithForms("detalhado", 2, [])), true);
    assert.equal(isModeAvailable("detalhado", bankWithForms("detalhado", 1.6, [])), false);

    // One cell one item short of 2× is enough to keep it off.
    const bank = bankWithForms("detalhado", 2, []);
    const lastHardPattern = [...bank].reverse().find((q) => q.category === "patterns" && q.difficulty === "hard")!;
    assert.equal(isModeAvailable("detalhado", bank.filter((q) => q.id !== lastHardPattern.id)), false);
  });
});
