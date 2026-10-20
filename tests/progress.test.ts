import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { inCountdown, milestoneAt, remainingAfter, segmentFills, segmentsFor } from "../utils/progress.ts";

describe("segments", () => {
  test("the three modes get the blocks of the research", () => {
    assert.deepEqual(segmentsFor(20), [10, 10]);
    assert.deepEqual(segmentsFor(40), [10, 10, 10, 10]);
    assert.deepEqual(segmentsFor(90), [30, 30, 30]);
  });

  test("other lengths still split into whole blocks with a shorter tail", () => {
    assert.deepEqual(segmentsFor(30), [10, 10, 10]);
    assert.deepEqual(segmentsFor(25), [10, 10, 5]);
    assert.deepEqual(segmentsFor(1), [1]);
    assert.deepEqual(segmentsFor(0), []);
  });

  test("fills: completed blocks full, current partial, later empty", () => {
    assert.deepEqual(segmentFills(40, 0), [0, 0, 0, 0]);
    assert.deepEqual(segmentFills(40, 7), [0.7, 0, 0, 0]);
    assert.deepEqual(segmentFills(40, 10), [1, 0, 0, 0]);
    assert.deepEqual(segmentFills(40, 25), [1, 1, 0.5, 0]);
    assert.deepEqual(segmentFills(40, 40), [1, 1, 1, 1]);
  });
});

describe("milestones", () => {
  test("after the third answer, the opening encouragement", () => {
    assert.deepEqual(milestoneAt(3, 40), { kind: "start" });
    assert.equal(milestoneAt(2, 40), null);
    assert.equal(milestoneAt(4, 40), null);
  });

  test("each block boundary except the last; the one before the last block says 'almost there'", () => {
    assert.deepEqual(milestoneAt(10, 40), { kind: "block", done: 1, of: 4, last: false });
    assert.deepEqual(milestoneAt(20, 40), { kind: "block", done: 2, of: 4, last: false });
    assert.deepEqual(milestoneAt(30, 40), { kind: "block", done: 3, of: 4, last: true });
    assert.equal(milestoneAt(40, 40), null);
  });

  test("Rápido has one boundary and it is already the last one; Detalhado has two", () => {
    assert.deepEqual(milestoneAt(10, 20), { kind: "block", done: 1, of: 2, last: true });
    assert.deepEqual(milestoneAt(30, 90), { kind: "block", done: 1, of: 3, last: false });
    assert.deepEqual(milestoneAt(60, 90), { kind: "block", done: 2, of: 3, last: true });
    assert.equal(milestoneAt(45, 90), null);
  });

  test("never before the first answer nor on a one-question round", () => {
    assert.equal(milestoneAt(0, 40), null);
    assert.equal(milestoneAt(0, 1), null);
    assert.equal(milestoneAt(3, 3), null);
  });
});

describe("countdown", () => {
  test("the last five questions count down; question 26 of 30 reads 'faltam 4'", () => {
    assert.equal(inCountdown(24, 30), false);
    assert.equal(inCountdown(25, 30), true);
    assert.equal(remainingAfter(25, 30), 4);
    assert.equal(remainingAfter(29, 30), 0);
  });

  test("the three modes: 16/20, 36/40 and 86/90 start the countdown", () => {
    assert.equal(inCountdown(14, 20), false);
    assert.equal(inCountdown(15, 20), true);
    assert.equal(inCountdown(35, 40), true);
    assert.equal(inCountdown(85, 90), true);
    assert.equal(inCountdown(84, 90), false);
  });

  test("a round of five or fewer questions never counts down", () => {
    assert.equal(inCountdown(0, 1), false);
    assert.equal(inCountdown(4, 5), false);
  });
});
