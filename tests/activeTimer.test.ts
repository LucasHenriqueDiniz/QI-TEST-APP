import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createActiveTimer } from "../utils/activeTimer.ts";

/** A clock the test moves by hand, in ms. */
function fakeClock(start = 0) {
  let now = start;
  return { now: () => now, advance: (ms: number) => (now += ms) };
}

describe("active timer", () => {
  test("time in the background is not counted", () => {
    const clock = fakeClock();
    const timer = createActiveTimer(clock.now);
    clock.advance(10_000);
    timer.background();
    clock.advance(60_000);
    timer.foreground();
    clock.advance(5_000);
    assert.equal(timer.take(), 15);
  });

  test("take restarts the count for the next question", () => {
    const clock = fakeClock();
    const timer = createActiveTimer(clock.now);
    clock.advance(4_000);
    assert.equal(timer.take(), 4);
    clock.advance(2_500);
    assert.equal(timer.take(), 2.5);
  });

  test("taking while in the background returns what was active so far and stays paused", () => {
    const clock = fakeClock();
    const timer = createActiveTimer(clock.now);
    clock.advance(3_000);
    timer.background();
    clock.advance(30_000);
    assert.equal(timer.take(), 3);
    clock.advance(30_000);
    assert.equal(timer.take(), 0);
    timer.foreground();
    clock.advance(1_000);
    assert.equal(timer.take(), 1);
  });

  test("repeated foreground or background events do not double count", () => {
    const clock = fakeClock();
    const timer = createActiveTimer(clock.now);
    timer.foreground();
    clock.advance(2_000);
    timer.background();
    timer.background();
    clock.advance(9_000);
    timer.foreground();
    timer.foreground();
    clock.advance(1_000);
    assert.equal(timer.take(), 3);
  });

  test("reset drops what was accumulated", () => {
    const clock = fakeClock();
    const timer = createActiveTimer(clock.now);
    clock.advance(8_000);
    timer.reset();
    clock.advance(1_000);
    assert.equal(timer.take(), 1);
  });
});
