import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { ItemUsage, Question } from "../types/index.ts";
import type { TestProgress } from "../types/storage.ts";
import { BLUEPRINTS, cellShortfalls, roundLength } from "../utils/scoring/blueprints.ts";
import { mulberry32 } from "../utils/scoring/random.ts";
import { OPTION_COUNT, applyOptionOrder, buildRound, identityOrder, isPermutation, markUsed, restoreRound, type Round } from "../utils/scoring/selection.ts";
import { FakeStorage, TODAY_BANK, bankWithForms } from "./helpers.ts";

const ids = (round: Round) => round.items.map((item) => item.question.id);
const overlap = (a: Round, b: Round) => ids(a).filter((id) => ids(b).includes(id)).length;
const isText = (q: Question) => q.type !== "image";

/** Draws a round the way the app does: usage read from storage before, written back after. */
async function drawRound(storage: FakeStorage, bank: readonly Question[], mode: "rapido" | "normal" | "detalhado", seed: number): Promise<Round> {
  const usage = await storage.getItem<ItemUsage>("itemUsage");
  const round = buildRound(bank, mode, usage, mulberry32(seed));
  await storage.setItem("itemUsage", markUsed(usage, round));
  return round;
}

describe("round composition", () => {
  test("a round has the blueprint's length and its category × difficulty mix", () => {
    for (const mode of ["rapido", "normal"] as const) {
      const round = buildRound(TODAY_BANK, mode, null, mulberry32(1));
      assert.equal(round.items.length, roundLength(mode));
      assert.equal(new Set(ids(round)).size, round.items.length, "no item twice");
      // Every cell the bank can fill is filled with its own difficulty; the rest comes from the same category.
      for (const [category, levels] of Object.entries(BLUEPRINTS[mode])) {
        const inCategory = round.items.filter((item) => item.question.category === category);
        assert.equal(inCategory.length, Object.values(levels).reduce((a, b) => a + b, 0), `${mode} ${category}`);
      }
    }
  });

  test("short cells are reported exactly as the bank predicts, and filled from the same category", () => {
    const round = buildRound(TODAY_BANK, "normal", null, mulberry32(2));
    assert.deepEqual(round.shortfalls, cellShortfalls(BLUEPRINTS.normal, TODAY_BANK));
    const vocabulary = round.items.filter((item) => item.question.category === "vocabulary");
    assert.equal(vocabulary.length, 7);
    assert.equal(vocabulary.filter((item) => item.question.difficulty === "medium").length, 2, "both medium items are in");
    assert.equal(vocabulary.filter((item) => item.question.difficulty === "hard").length, 5, "2 hard by blueprint + 3 filling the holes");
  });

  test("on a bank with 2× per cell there are no shortfalls, even for detalhado", () => {
    const bank = bankWithForms("detalhado", 2);
    for (const mode of ["rapido", "normal", "detalhado"] as const) {
      assert.deepEqual(buildRound(bank, mode, null, mulberry32(3)).shortfalls, []);
    }
  });
});

describe("least-recently-used selection", () => {
  test("two consecutive normal rounds share 0 items on a bank with 2× per cell, through a storage round trip", async () => {
    const storage = new FakeStorage();
    const bank = bankWithForms("detalhado", 2);
    const first = await drawRound(storage, bank, "normal", 11);
    const second = await drawRound(storage, bank, "normal", 12);
    assert.equal(overlap(first, second), 0);

    // The usage that was persisted is what drove the second draw.
    const usage = (await storage.getItem<ItemUsage>("itemUsage"))!;
    assert.equal(usage.round, 2);
    for (const id of ids(first)) assert.equal(usage.lastUsed[id], 0);
    for (const id of ids(second)) assert.equal(usage.lastUsed[id], 1);
  });

  test("the third round avoids the second, not just the first (recency, not a usage count)", async () => {
    const storage = new FakeStorage();
    const bank = bankWithForms("detalhado", 2);
    const first = await drawRound(storage, bank, "detalhado", 21);
    const second = await drawRound(storage, bank, "detalhado", 22);
    const third = await drawRound(storage, bank, "detalhado", 23);
    assert.equal(overlap(first, second), 0);
    assert.equal(overlap(second, third), 0);
    // With two forms per cell the third round is the first one again, in another order (D8) — except in
    // vocabulary.hard, where today's bank already has 18 items for 5 slots: 8 are still unused after two
    // rounds and never-used items come before round-1 items, so 5 of the 90 are new.
    assert.equal(overlap(first, third), 85);
  });

  test("on today's bank two normal rounds share exactly the 9 items the short cells force (research: 22%)", async () => {
    // patterns.medium 2·4−6 = 2, matrix.easy 2·2−3 = 1, similarities.easy 2, comprehension.easy 2,
    // vocabulary.medium 2 (both items every time); the vocabulary holes are filled from 16 spare hard items.
    const storage = new FakeStorage();
    const first = await drawRound(storage, TODAY_BANK, "normal", 31);
    const second = await drawRound(storage, TODAY_BANK, "normal", 32);
    assert.equal(overlap(first, second), 9);
  });

  test("on today's bank two rapido rounds share 0 items", async () => {
    const storage = new FakeStorage();
    const first = await drawRound(storage, TODAY_BANK, "rapido", 41);
    const second = await drawRound(storage, TODAY_BANK, "rapido", 42);
    assert.equal(overlap(first, second), 0);
  });

  test("without usage the draw is random: two rounds from the same seed are identical, from different seeds they differ", () => {
    assert.deepEqual(ids(buildRound(TODAY_BANK, "normal", null, mulberry32(5))), ids(buildRound(TODAY_BANK, "normal", null, mulberry32(5))));
    assert.notDeepEqual(ids(buildRound(TODAY_BANK, "normal", null, mulberry32(5))), ids(buildRound(TODAY_BANK, "normal", null, mulberry32(6))));
  });
});

describe("option shuffle", () => {
  const ROUNDS = 1000;
  const LETTERS = ["A", "B", "C", "D"];

  test(`over ${ROUNDS} seeded normal rounds the key lands on each of A–D 25% ± 3 of the time`, () => {
    const rng = mulberry32(20261019);
    const counts = [0, 0, 0, 0];
    let textItems = 0;
    for (let i = 0; i < ROUNDS; i++) {
      for (const item of buildRound(TODAY_BANK, "normal", null, rng).items) {
        if (!isText(item.question)) continue;
        counts[item.optionOrder.indexOf(item.question.correctAnswer)] += 1;
        textItems += 1;
      }
    }
    assert.equal(textItems, ROUNDS * 28);
    const shares = counts.map((c) => c / textItems);
    for (let k = 0; k < OPTION_COUNT; k++) {
      assert.ok(Math.abs(shares[k] - 0.25) <= 0.03, `${LETTERS[k]} is the key ${(shares[k] * 100).toFixed(1)}% of the time: ${counts.join(" / ")}`);
    }
  });

  test("text items get a permutation of 0–3; pattern items keep the stored order", () => {
    const round = buildRound(TODAY_BANK, "normal", null, mulberry32(7));
    for (const item of round.items) {
      assert.ok(isPermutation(item.optionOrder));
      if (!isText(item.question)) assert.deepEqual(item.optionOrder, identityOrder());
    }
    assert.ok(round.items.some((item) => isText(item.question) && item.optionOrder.join() !== identityOrder().join()), "at least one text item is shuffled");
  });

  test("applyOptionOrder permutes the strings and maps the key to its displayed position", () => {
    const shown = applyOptionOrder(["a", "b", "c", "d"], 0, [2, 0, 3, 1]);
    assert.deepEqual(shown.options, ["c", "a", "d", "b"]);
    assert.equal(shown.correctAnswer, 1);
    assert.equal(shown.options[shown.correctAnswer], "a");
  });

  test("applyOptionOrder falls back to the stored order when the order does not fit the options", () => {
    assert.deepEqual(applyOptionOrder(["a", "b", "c"], 2, [2, 0, 3, 1]), { options: ["a", "b", "c"], correctAnswer: 2 });
    assert.deepEqual(applyOptionOrder(["a", "b", "c", "d"], 2, [0, 0, 1, 2]), { options: ["a", "b", "c", "d"], correctAnswer: 2 });
  });
});

describe("resume", () => {
  test("a round saved after 5 answers restores the same items in the same order with the same option order", async () => {
    const storage = new FakeStorage();
    const round = buildRound(TODAY_BANK, "normal", null, mulberry32(99));

    const progress: TestProgress = {
      mode: round.mode,
      currentIndex: 5,
      savedAnswers: round.items.slice(0, 5).map((item) => ({ questionId: item.question.id, isCorrect: true, timeSpent: 3 })),
      questionIds: ids(round),
      optionOrders: round.items.map((item) => item.optionOrder),
    };
    await storage.setItem("testProgress", progress);

    const saved = (await storage.getItem<TestProgress>("testProgress"))!;
    const restored = restoreRound(TODAY_BANK, saved);
    assert.ok(restored);
    assert.equal(restored.mode, "normal");
    assert.deepEqual(ids(restored), ids(round));
    assert.deepEqual(
      restored.items.map((item) => item.optionOrder),
      round.items.map((item) => item.optionOrder)
    );

    // What the screen shows is identical before and after: same strings in the same slots, same key position.
    const options = ["o0", "o1", "o2", "o3"];
    round.items.forEach((item, i) => {
      if (!isText(item.question)) return;
      assert.deepEqual(
        applyOptionOrder(options, item.question.correctAnswer, restored.items[i].optionOrder),
        applyOptionOrder(options, item.question.correctAnswer, item.optionOrder)
      );
    });
    assert.equal(saved.currentIndex, 5);
    assert.equal(saved.savedAnswers.length, 5);
  });

  test("progress from before the modes (no mode) is not resumed", () => {
    assert.equal(restoreRound(TODAY_BANK, { questionIds: ["1", "2", "3"] }), null);
  });

  test("progress with a mode but no option orders restores with the stored order", () => {
    const restored = restoreRound(TODAY_BANK, { mode: "normal", questionIds: ["1", "2"] });
    assert.ok(restored);
    assert.deepEqual(restored.items.map((item) => item.optionOrder), [identityOrder(), identityOrder()]);
  });

  test("an unknown id or a corrupted order refuses to restore", () => {
    assert.equal(restoreRound(TODAY_BANK, { mode: "normal", questionIds: ["1", "nope"] }), null);
    assert.equal(restoreRound(TODAY_BANK, { mode: "normal", questionIds: ["1"], optionOrders: [[0, 0, 1, 2]] }), null);
    assert.equal(restoreRound(TODAY_BANK, { mode: "normal", questionIds: ["1", "2"], optionOrders: [[0, 1, 2, 3]] }), null);
  });
});
