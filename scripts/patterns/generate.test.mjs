// node --test scripts/patterns/generate.test.mjs
//
// Regenerates every item of the bank from its spec and checks that the files
// on disk are what the generator produces, that exactly one option satisfies
// every rule (evaluated on the rule model, not on the SVG), that the options
// differ from each other, that the options carry no information about the
// answer (no majority-vote shortcut, no value foreign to the matrix) and
// that the viewBoxes match the hand-drawn items.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  ITEMS,
  ATTRS,
  SCALAR_ATTRS,
  DEFAULT_OUT,
  PROMPT_VIEWBOX,
  OPTION_VIEWBOX,
  renderItem,
  satisfiesAllRules,
  cellKey,
  features,
  key,
} from "./generate.mjs";

const FILES = ["prompt.svg", "option_1.svg", "option_2.svg", "option_3.svg", "option_4.svg", "meta.json"];

const built = new Map(ITEMS.map((spec) => [spec.id, renderItem(spec)]));

const nonTrivial = (r) => (r.kind === "prog" && (r.attr === "rot" || r.attr === "pos")) || r.kind === "setop";

test("bank: 24 items, ids g01..g24, 16 medium + 8 hard", () => {
  assert.equal(ITEMS.length, 24);
  ITEMS.forEach((spec, i) => assert.equal(spec.id, `g${String(i + 1).padStart(2, "0")}`));
  assert.equal(ITEMS.filter((s) => s.difficulty === "medium").length, 16);
  assert.equal(ITEMS.filter((s) => s.difficulty === "hard").length, 8);
  assert.equal(new Set(ITEMS.map((s) => s.seed)).size, 24, "seeds are unique");
});

for (const spec of ITEMS) {
  const { item, files } = built.get(spec.id);
  const answer = item.options[item.correctIndex];

  test(`${spec.id}: files on disk are byte-identical to a regeneration from the seed`, () => {
    const dir = join(DEFAULT_OUT, spec.id);
    for (const name of FILES) {
      const path = join(dir, name);
      assert.ok(existsSync(path), `${path} missing, run node scripts/patterns/generate.mjs`);
      assert.ok(Buffer.from(files[name]).equals(readFileSync(path)), `${spec.id}/${name} differs from the generator output`);
    }
    // and the generator itself is deterministic in-process
    const again = renderItem(spec);
    for (const name of FILES) assert.equal(again.files[name], files[name], `${name} not deterministic`);
  });

  test(`${spec.id}: exactly one option satisfies every rule`, () => {
    const satisfying = item.options.map((o, k) => (satisfiesAllRules(item, o) ? k : -1)).filter((k) => k >= 0);
    assert.deepEqual(satisfying, [item.correctIndex], `options satisfying all rules: ${JSON.stringify(satisfying)}`);
    const meta = JSON.parse(files["meta.json"]);
    assert.equal(meta.correctAnswer, item.correctIndex);
    assert.equal(meta.weight, spec.difficulty === "hard" ? 3 : 2);
    assert.equal(meta.difficulty, spec.difficulty);
  });

  test(`${spec.id}: difficulty matches the rule mix`, () => {
    const n = spec.rules.length;
    if (spec.difficulty === "medium") {
      assert.ok(n === 2 || (n === 1 && nonTrivial(spec.rules[0])), "medium = one non-trivial rule or two simple rules");
    } else {
      assert.ok(n >= 2 && n <= 3 && spec.rules.some(nonTrivial), "hard = 2-3 rules with rotation/position or XOR/UNION");
    }
    assert.equal(JSON.parse(files["meta.json"]).rules.length, n);
  });

  test(`${spec.id}: each distractor changes exactly the attributes it declares`, () => {
    item.options.forEach((o, k) => {
      if (k === item.correctIndex) return;
      const changed = ATTRS.filter((a) => key(o[a]) !== key(answer[a]));
      assert.deepEqual(changed.sort(), [...o._breaks].sort(), `option ${k + 1} changes ${changed.join(",")}`);
      assert.ok(changed.length >= 1 && changed.length <= 3, `option ${k + 1} changes ${changed.length} attributes`);
    });
  });

  test(`${spec.id}: attribute-wise majority vote over the options does not single out the answer`, () => {
    const universe = [...new Set(item.cells.flatMap((c) => c.parts))];
    const feats = item.options.map((o) => features(o, universe));
    const names = Object.keys(feats[0]).filter((n) => new Set(feats.map((f) => f[n])).size > 1);
    assert.ok(names.length > 0, "options are identical");
    const freq = (n, v) => feats.filter((f) => f[n] === v).length;
    for (const n of names) {
      const answerFreq = freq(n, feats[item.correctIndex][n]);
      assert.ok(answerFreq <= 2, `${n}: the answer's value appears in ${answerFreq}/4 options`);
    }
    const score = feats.map((f) => names.filter((n) => freq(n, f[n]) === Math.max(...feats.map((g) => freq(n, g[n])))).length);
    const best = Math.max(...score);
    const winners = score.map((v, k) => (v === best ? k : -1)).filter((k) => k >= 0);
    assert.ok(!(winners.length === 1 && winners[0] === item.correctIndex), `majority vote picks the answer alone (scores ${score.join("/")})`);
  });

  test(`${spec.id}: every option is built from values that appear in the matrix`, () => {
    const cells = item.cells.slice(0, 8);
    for (const a of SCALAR_ATTRS) {
      const seen = new Set(cells.map((c) => key(c[a])));
      item.options.forEach((o, k) => assert.ok(seen.has(key(o[a])), `option ${k + 1}: ${a}=${key(o[a])} never appears in the matrix`));
    }
    const seenParts = new Set(cells.flatMap((c) => c.parts));
    item.options.forEach((o, k) => {
      for (const p of o.parts) assert.ok(seenParts.has(p), `option ${k + 1}: part ${p} never appears in the matrix`);
    });
  });

  test(`${spec.id}: no option is a superset of all other options, and the answer's element count is not the unique maximum or minimum`, () => {
    const sets = item.options.map((o) => new Set(o.parts));
    if (new Set(item.options.map((o) => key(o.parts))).size === 1) return; // parts do not vary in this item
    const contains = (a, b) => [...b].every((x) => a.has(x));
    sets.forEach((s, k) => {
      const others = sets.filter((_, j) => j !== k);
      assert.ok(!others.every((o) => contains(s, o)), `option ${k + 1} (${key(item.options[k].parts)}) is a superset of all other options`);
      assert.ok(!others.every((o) => contains(o, s)), `option ${k + 1} (${key(item.options[k].parts)}) is a subset of all other options`);
    });
    const counts = sets.map((s) => s.size);
    const mine = counts[item.correctIndex];
    const othersCounts = counts.filter((_, k) => k !== item.correctIndex);
    assert.ok(!othersCounts.every((c) => c < mine), `the answer has the most elements (${counts.join("/")})`);
    assert.ok(!othersCounts.every((c) => c > mine), `the answer has the fewest elements (${counts.join("/")})`);
  });

  test(`${spec.id}: the four options are pairwise different`, () => {
    const keys = item.options.map(cellKey);
    assert.equal(new Set(keys).size, 4, keys.join("\n"));
    const svgs = [1, 2, 3, 4].map((k) => files[`option_${k}.svg`]);
    assert.equal(new Set(svgs).size, 4, "two option SVGs are identical");
  });

  test(`${spec.id}: viewBoxes match the existing items`, () => {
    const vb = (svg) => svg.match(/viewBox="([^"]+)"/)[1];
    assert.equal(vb(files["prompt.svg"]), PROMPT_VIEWBOX);
    for (let k = 1; k <= 4; k++) assert.equal(vb(files[`option_${k}.svg`]), OPTION_VIEWBOX);
    for (const name of FILES.slice(0, 5)) {
      assert.ok(!/<image|<text|font|@import/.test(files[name]), `${name} embeds raster, text or fonts`);
      assert.ok(Buffer.byteLength(files[name]) < 12 * 1024, `${name} larger than 12 KB`);
    }
  });
}

test("index.json lists every item with its correct answer", () => {
  const index = JSON.parse(readFileSync(join(DEFAULT_OUT, "index.json"), "utf8"));
  assert.equal(index.length, 24);
  for (const entry of index) {
    const { item } = built.get(entry.id);
    assert.equal(entry.correctAnswer, item.correctIndex, entry.id);
    assert.equal(entry.difficulty, item.spec.difficulty, entry.id);
    assert.equal(entry.seed, item.spec.seed, entry.id);
  }
});

test("the correct option is spread across positions 1-4", () => {
  const counts = [0, 0, 0, 0];
  for (const { item } of built.values()) counts[item.correctIndex]++;
  assert.ok(counts.every((n) => n >= 4), `distribution ${counts.join("/")}`);
});
