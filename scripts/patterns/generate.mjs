#!/usr/bin/env node
// Deterministic generator of Raven-style 3x3 matrix puzzles for the
// "patterns" category. Every item is a pure function of its spec (rules +
// seed): the same spec always produces byte-identical SVGs.
//
//   node scripts/patterns/generate.mjs            # write data/staging/patterns/
//   node scripts/patterns/generate.mjs --render   # also PNGs and contact sheets (Quick Look + ImageMagick)
//   node scripts/patterns/generate.mjs --only g07
//
// Model: a cell is a bag of attributes (shape, count, fill, rot, pos, frame,
// parts). Each attribute is governed by exactly one rule across the 3x3
// matrix: constant, progression (per row or per column), distribution of
// three (Latin square), or a set operation on parts (row 3 = row 1 op row 2).
// Every rule determines cell 9 uniquely given cells 1-8.
//
// Distractors: the options carry no information about the answer.
//   - one rule attribute A: the four options have four different values of A
//     (parts: a 2x2 design over two toggles p, q: X, X^p, X^q, X^pq)
//   - two rule attributes A, B: a balanced 2x2 design (a*,b*) (a*,b') (a',b*) (a',b')
//   - three rule attributes: (a*,b*,k*) (a*,b*,k') (a',b',k*) (a',b',k') with K
//     the rotation/position/parts rule, so K must be solved
// so the answer's value of every varying attribute appears in at most two
// options, every value an option shows already appears in the matrix, and on
// part sets a distractor always swaps one part for another (no superset cue).
// Exactly one option satisfies every rule by construction; the test checks
// it on the rule model.

import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export const PROMPT_VIEWBOX = "0 0 500 335";
export const OPTION_VIEWBOX = "0 0 173 105";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_OUT = resolve(HERE, "../../data/staging/patterns");

// ---------------------------------------------------------------- rng

export class Rng {
  constructor(seed) {
    this.s = seed >>> 0;
  }
  // mulberry32
  next() {
    this.s = (this.s + 0x6d2b79f5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(n) {
    return Math.floor(this.next() * n);
  }
  pick(arr) {
    return arr[this.int(arr.length)];
  }
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  sample(arr, n) {
    return this.shuffle(arr).slice(0, n);
  }
}

// ---------------------------------------------------------------- domains

// big single shapes (46 px): any of these; with a hatch fill only the bulky ones
export const SHAPES = ["circle", "square", "triangle", "diamond", "pentagon", "hexagon", "star", "cross"];
export const BULKY_SHAPES = ["circle", "square", "triangle", "diamond", "pentagon", "hexagon"];
// shapes that stay distinct at 32 px (19 dp on the phone) when drawn 1-4 times per cell
export const SMALL_SHAPES = ["circle", "square", "triangle", "diamond"];
// shapes whose orientation is unambiguous at 45 degree steps
export const ORIENTED_SHAPES = ["arrow", "tee", "pacman"];
// striped only on big shapes (>= 24 dp); dotted (outline + centre dot) on small ones
export const FILLS = ["empty", "striped", "solid", "dotted"];
export const COUNTS = [1, 2, 3, 4];
export const ROTS = [0, 45, 90, 135, 180, 225, 270, 315];
export const POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7];
export const FRAMES = ["circle", "square", "diamond", "hexagon"];
export const SEGMENTS = ["T", "R", "B", "L", "D1", "D2"];
export const DOTS = ["nw", "ne", "c", "sw", "se"];

const DOMAINS = { shape: SHAPES, count: COUNTS, fill: FILLS, rot: ROTS, pos: POSITIONS, frame: FRAMES };
const CYCLIC = { rot: true, pos: true };
export const ATTRS = ["shape", "count", "fill", "rot", "pos", "frame", "parts"];
export const SCALAR_ATTRS = ATTRS.filter((a) => a !== "parts");

export function key(v) {
  return Array.isArray(v) ? v.slice().sort().join("+") : String(v);
}
function eq(a, b) {
  return key(a) === key(b);
}
function uniq(values) {
  const out = [];
  for (const v of values) if (!out.some((o) => eq(o, v))) out.push(v);
  return out;
}

// ---------------------------------------------------------------- rules
//
// A rule works on a 3x3 grid of values for one attribute.
//   generate(rng, domain, params) -> grid
//   check(grid, params, domain)   -> boolean (the whole grid obeys the rule)
//   prefer(grid, params, domain)  -> wrong values for cell 9 worth trying first
// `check` is what the test evaluates; every wrong value is re-verified with it.

const rowsOf = (g) => g;
const colsOf = (g) => [0, 1, 2].map((c) => [g[0][c], g[1][c], g[2][c]]);
const flat = (g) => g.flat();

function withCell9(grid, v) {
  return [grid[0], grid[1], [grid[2][0], grid[2][1], v]];
}

const RULES = {
  // every cell has the same value
  const: {
    generate(rng, domain, p) {
      const v = p.value !== undefined ? p.value : rng.pick(domain);
      return [0, 1, 2].map(() => [v, v, v]);
    },
    check(grid) {
      const f = flat(grid);
      return f.every((v) => eq(v, f[0]));
    },
    prefer() {
      return [];
    },
    describe(attr, p, grid) {
      return `${attr}: constant (${key(grid[0][0])})`;
    },
  },

  // along `axis` ("col": left to right in every row; "row": top to bottom in
  // every column) the index in the ordered domain advances by `step`.
  // Cyclic domains (rot, pos) wrap and get a different base per line;
  // non-cyclic ones (count) always run through the first three values.
  prog: {
    generate(rng, domain, p) {
      const n = domain.length;
      const cyclic = !!p.cyclic;
      const step = p.step;
      let bases;
      if (!cyclic) bases = [0, 0, 0].map(() => (step > 0 ? 0 : 2));
      else if (p.sameBase) bases = Array(3).fill(rng.int(n)); // e.g. one orientation per row, turning row by row
      else bases = rng.sample(domain.map((_, i) => i), 3);
      const grid = [[], [], []];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const line = p.axis === "col" ? r : c;
          const k = p.axis === "col" ? c : r;
          let idx = bases[line] + k * step;
          if (cyclic) idx = ((idx % n) + n) % n;
          grid[r][c] = domain[idx];
        }
      }
      return grid;
    },
    check(grid, p, domain) {
      const n = domain.length;
      const idx = (v) => domain.findIndex((d) => eq(d, v));
      const lines = p.axis === "col" ? rowsOf(grid) : colsOf(grid);
      return lines.every((line) => {
        for (let k = 0; k < 2; k++) {
          const a = idx(line[k]);
          const b = idx(line[k + 1]);
          if (a < 0 || b < 0) return false;
          const want = p.cyclic ? (((a + p.step) % n) + n) % n : a + p.step;
          if (b !== want) return false;
        }
        return true;
      });
    },
    prefer(grid, p, domain) {
      // one step short (a copy of the neighbour) and one step too far
      const n = domain.length;
      const idx = domain.findIndex((d) => eq(d, grid[2][2]));
      const at = (i) => domain[((i % n) + n) % n];
      if (p.cyclic) return [at(idx - p.step), at(idx + p.step)];
      return [idx - p.step, idx + p.step].filter((i) => i >= 0 && i < n).map((i) => domain[i]);
    },
    describe(attr, p, grid) {
      const where = p.axis === "col" ? "across each row" : "down each column";
      const unit = attr === "rot" ? `${p.step * 45} deg` : attr === "pos" ? `${p.step * 45} deg around the frame` : `${p.step > 0 ? "+" : ""}${p.step}`;
      const same = p.sameBase ? (p.axis === "col" ? ", every column starts alike" : ", constant within a row") : "";
      return `${attr}: progression ${unit} ${where}${same} (row 3: ${grid[2].map(key).join(", ")})`;
    },
  },

  // distribution of three: each of 3 values appears once per row and once
  // per column (a 3x3 Latin square)
  dist: {
    generate(rng, domain, p) {
      const values = p.values ? p.values : rng.sample(domain, 3);
      const first = rng.shuffle(values);
      const shift = rng.pick([1, 2]);
      const grid = [];
      for (let r = 0; r < 3; r++) grid.push([0, 1, 2].map((c) => first[(c + r * shift) % 3]));
      return grid;
    },
    check(grid) {
      const set = (line) => line.map(key).sort().join("|");
      const want = set(grid[0]);
      if (new Set(grid[0].map(key)).size !== 3) return false;
      return rowsOf(grid).every((l) => set(l) === want) && colsOf(grid).every((l) => set(l) === want);
    },
    prefer(grid) {
      return grid[0].filter((v) => !eq(v, grid[2][2]));
    },
    describe(attr, p, grid) {
      return `${attr}: each of {${grid[0].map(key).join(", ")}} once per row and once per column (row 3 needs ${key(grid[2][2])})`;
    },
  },

  // parts: row 3 = op(row 1, row 2) cell-wise, op in xor | union
  setop: {
    generate(rng, domain, p) {
      const U = domain;
      const grid = [];
      for (let r = 0; r < 3; r++) {
        for (let attempt = 0; ; attempt++) {
          if (attempt > 500) throw new Error("setop: no admissible row");
          const a = rng.sample(U, 2 + rng.int(Math.min(3, U.length - 1)));
          const b = rng.sample(U, 2 + rng.int(Math.min(3, U.length - 1)));
          const c = applyOp(p.op, a, b);
          const inter = a.filter((x) => b.includes(x));
          if (inter.length === 0) continue; // xor and union must be distinguishable
          if (c.length < 2 || c.length > p.max) continue;
          if (eq(c, a) || eq(c, b)) continue;
          if (p.op === "union" && (inter.length === a.length || inter.length === b.length)) continue;
          if (grid.some((row) => eq(row[2], c))) continue; // no repeated answers
          grid.push([a.slice().sort(), b.slice().sort(), c]);
          break;
        }
      }
      return grid;
    },
    check(grid, p) {
      return grid.every((row) => eq(applyOp(p.op, row[0], row[1]), row[2]));
    },
    prefer() {
      return [];
    },
    describe(attr, p, grid) {
      return `${attr}: row 3 = row 1 ${p.op === "xor" ? "XOR" : "UNION"} row 2 (${key(grid[2][0])} ${p.op} ${key(grid[2][1])} = ${key(grid[2][2])})`;
    },
  },
};

function applyOp(op, a, b) {
  if (op === "xor") return [...a.filter((x) => !b.includes(x)), ...b.filter((x) => !a.includes(x))].sort();
  if (op === "union") return [...new Set([...a, ...b])].sort();
  throw new Error(`unknown op ${op}`);
}

// ---------------------------------------------------------------- item model

function domainFor(attr, spec) {
  if (spec.domains && spec.domains[attr]) return spec.domains[attr];
  if (attr === "parts") return spec.partsStyle === "dots" ? DOTS : SEGMENTS;
  return DOMAINS[attr];
}

function defaultConst(attr, spec) {
  switch (attr) {
    case "shape":
      return undefined; // random from the shape domain
    case "count":
      return 1;
    case "fill":
      return "solid";
    case "rot":
      return 0;
    case "pos":
      return 0;
    case "frame":
      return spec.kind === "orbit" ? "square" : "none";
    case "parts":
      return [];
    default:
      return undefined;
  }
}

function isMulti(spec) {
  return spec.rules.some((r) => r.attr === "count") || (spec.const && spec.const.count > 1);
}

/** Build the full model of an item: grids per attribute, cells, options. */
export function buildItem(spec) {
  const rng = new Rng(spec.seed);
  const rules = {};
  for (const attr of ATTRS) {
    const r = (spec.rules || []).find((x) => x.attr === attr);
    if (r) {
      rules[attr] = { ...r, cyclic: !!CYCLIC[attr] };
    } else {
      const fixed = spec.const && spec.const[attr] !== undefined ? spec.const[attr] : defaultConst(attr, spec);
      rules[attr] = { attr, kind: "const", value: fixed };
    }
  }
  const ruleAttrs = ATTRS.filter((a) => rules[a].kind !== "const");

  for (let attempt = 0; attempt < 400; attempt++) {
    const grids = {};
    for (const attr of ATTRS) grids[attr] = RULES[rules[attr].kind].generate(rng, domainFor(attr, spec), rules[attr]);
    if (!independentDistributions(grids, rules)) continue;
    if (!answersAppearInMatrix(grids, rules, ruleAttrs)) continue;

    const cells = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push(Object.fromEntries(ATTRS.map((a) => [a, grids[a][r][c]])));
    const correct = cells[8];
    const distractors = buildDistractors(rng, spec, rules, grids, cells, ruleAttrs);
    if (!distractors) continue;

    const correctIndex = rng.int(4);
    const order = rng.shuffle(distractors);
    const options = [];
    for (let i = 0, d = 0; i < 4; i++) options.push(i === correctIndex ? correct : order[d++]);
    const described = ruleAttrs.map((a) => RULES[rules[a].kind].describe(a, rules[a], grids[a]));
    const item = { spec, rules, grids, cells, correct, options, correctIndex, ruleAttrs, described };
    const problem = validateItem(item);
    if (problem) continue;
    return item;
  }
  throw new Error(`${spec.id}: could not build a valid item from seed ${spec.seed}`);
}

function independentDistributions(grids, rules) {
  const dists = ATTRS.filter((a) => rules[a].kind === "dist");
  for (let i = 0; i < dists.length; i++) {
    for (let j = i + 1; j < dists.length; j++) {
      const map = new Map();
      let functional = true;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const k = key(grids[dists[i]][r][c]);
          const v = key(grids[dists[j]][r][c]);
          if (map.has(k) && map.get(k) !== v) functional = false;
          map.set(k, v);
        }
      }
      if (functional) return false;
    }
  }
  return true;
}

// the answer's value of every scalar rule attribute must already be visible
// in cells 1-8 (otherwise "the value not yet seen" would single it out), and
// a one-rule item needs three other in-matrix values for its distractors
function answersAppearInMatrix(grids, rules, ruleAttrs) {
  for (const attr of ruleAttrs) {
    if (attr === "parts") continue;
    const seen = flat(grids[attr]).slice(0, 8);
    const answer = grids[attr][2][2];
    if (!seen.some((v) => eq(v, answer))) return false;
    const others = uniq(seen.filter((v) => !eq(v, answer)));
    if (others.length < (ruleAttrs.length === 1 ? 3 : 1)) return false;
  }
  return true;
}

/** In-matrix values of `attr` that break its rule when placed in cell 9, best first. */
function wrongValues(rng, spec, rules, grids, attr) {
  const rule = rules[attr];
  const domain = domainFor(attr, spec);
  const seen = uniq(flat(grids[attr]).slice(0, 8));
  const bad = (v) => !eq(v, grids[attr][2][2]) && !RULES[rule.kind].check(withCell9(grids[attr], v), rule, domain);
  const preferred = RULES[rule.kind].prefer(grids[attr], rule, domain).filter((v) => seen.some((s) => eq(s, v)) && bad(v));
  const rest = rng.shuffle(seen.filter((v) => bad(v) && !preferred.some((p) => eq(p, v))));
  return [...rng.shuffle(preferred), ...rest];
}

/**
 * Parts to swap in the answer: `removable` are parts of the answer, `addable`
 * are parts shown in the matrix but absent from the answer; row-3 parts first.
 * A distractor always removes one and adds one, so no option is a superset or
 * subset of the others and every option has the same number of parts.
 */
function swapCandidates(rng, cells) {
  const answer = cells[8].parts;
  const inMatrix = uniq(cells.slice(0, 8).flatMap((c) => c.parts));
  const inRow3 = uniq([...cells[6].parts, ...cells[7].parts]);
  const order = (list) => [...rng.shuffle(list.filter((p) => inRow3.includes(p))), ...rng.shuffle(list.filter((p) => !inRow3.includes(p)))];
  return { removable: order(answer.slice()), addable: order(inMatrix.filter((p) => !answer.includes(p))) };
}
const swap = (set, remove, add) => [...set.filter((x) => x !== remove), add].sort();

function buildDistractors(rng, spec, rules, grids, cells, ruleAttrs) {
  const correct = cells[8];
  const make = (changes) => ({ ...correct, ...changes, _breaks: Object.keys(changes) });

  if (ruleAttrs.length === 1) {
    const [A] = ruleAttrs;
    if (A === "parts") {
      // 2x2 over two swaps: X, X-p+q, X-r+s, X-p+q-r+s
      const { removable, addable } = swapCandidates(rng, cells);
      if (removable.length < 2 || addable.length < 2) return null;
      const [p, r] = removable;
      const [q, s] = addable;
      return [make({ parts: swap(correct.parts, p, q) }), make({ parts: swap(correct.parts, r, s) }), make({ parts: swap(swap(correct.parts, p, q), r, s) })];
    }
    const values = wrongValues(rng, spec, rules, grids, A);
    if (values.length < 3) return null;
    return values.slice(0, 3).map((v) => make({ [A]: v }));
  }

  // one wrong value per rule attribute, then a balanced design over them
  const wrong = {};
  for (const attr of ruleAttrs) {
    if (attr === "parts") {
      const { removable, addable } = swapCandidates(rng, cells);
      if (removable.length === 0 || addable.length === 0) return null;
      wrong.parts = swap(correct.parts, removable[0], addable[0]);
    } else {
      const values = wrongValues(rng, spec, rules, grids, attr);
      if (values.length === 0) return null;
      wrong[attr] = values[0];
    }
  }
  if (ruleAttrs.length === 2) {
    const [A, B] = ruleAttrs;
    return [make({ [B]: wrong[B] }), make({ [A]: wrong[A] }), make({ [A]: wrong[A], [B]: wrong[B] })];
  }
  if (ruleAttrs.length === 3) {
    // the non-trivial attribute K (rotation/position/parts) is varied against the
    // other two together: (a*,b*,k') (a',b',k*) (a',b',k'), so K has to be solved
    const K = ruleAttrs.find((a) => a === "rot" || a === "pos" || a === "parts") ?? ruleAttrs[2];
    const [A, B] = ruleAttrs.filter((a) => a !== K);
    return [make({ [K]: wrong[K] }), make({ [A]: wrong[A], [B]: wrong[B] }), make({ [A]: wrong[A], [B]: wrong[B], [K]: wrong[K] })];
  }
  throw new Error(`${spec.id}: ${ruleAttrs.length} rule attributes, expected 1-3`);
}

/** True when `optionCell` placed in cell 9 satisfies every rule of the item. */
export function satisfiesAllRules(item, optionCell) {
  const { spec, rules, grids } = item;
  return ATTRS.every((attr) => {
    const rule = rules[attr];
    const g = withCell9(grids[attr], optionCell[attr]);
    return RULES[rule.kind].check(g, rule, domainFor(attr, spec));
  });
}

export function cellKey(cell) {
  return ATTRS.map((a) => `${a}=${key(cell[a])}`).join(";");
}

/** Binary/scalar features of a cell: scalar attributes plus one presence flag per part. */
export function features(cell, universe) {
  const f = {};
  for (const a of SCALAR_ATTRS) f[a] = key(cell[a]);
  for (const p of universe) f[`parts:${p}`] = cell.parts.includes(p) ? "1" : "0";
  return f;
}

/** Returns a problem description, or null when the item passes every structural check. */
export function validateItem(item) {
  const { options, correctIndex, cells } = item;
  const sat = options.filter((o) => satisfiesAllRules(item, o)).length;
  if (sat !== 1) return `${sat} options satisfy all rules`;
  if (new Set(options.map(cellKey)).size !== 4) return "options not pairwise different";
  // every value shown by an option already appears in the matrix
  const matrix = cells.slice(0, 8);
  for (const a of SCALAR_ATTRS) {
    const seen = new Set(matrix.map((c) => key(c[a])));
    if (options.some((o) => !seen.has(key(o[a])))) return `an option shows a ${a} that the matrix never shows`;
  }
  const seenParts = new Set(matrix.flatMap((c) => c.parts));
  if (options.some((o) => o.parts.some((p) => !seenParts.has(p)))) return "an option shows a part the matrix never shows";
  // no "most/fewest elements" cue on part sets
  if (new Set(options.map((o) => key(o.parts))).size > 1) {
    const sets = options.map((o) => new Set(o.parts));
    const contains = (a, b) => [...b].every((x) => a.has(x));
    for (let k = 0; k < 4; k++) {
      const others = sets.filter((_, j) => j !== k);
      if (others.every((o) => contains(sets[k], o))) return `option ${k + 1} is a superset of all other options`;
      if (others.every((o) => contains(o, sets[k]))) return `option ${k + 1} is a subset of all other options`;
    }
    const counts = sets.map((x) => x.size);
    const rest = counts.filter((_, k) => k !== correctIndex);
    if (rest.every((c) => c < counts[correctIndex]) || rest.every((c) => c > counts[correctIndex])) return "the answer's element count is the unique extreme";
  }
  // attribute-wise majority vote must not single out the answer
  const universe = [...seenParts];
  const feats = options.map((o) => features(o, universe));
  const names = Object.keys(feats[0]).filter((n) => new Set(feats.map((f) => f[n])).size > 1);
  const freq = (n, v) => feats.filter((f) => f[n] === v).length;
  for (const n of names) if (freq(n, feats[correctIndex][n]) > 2) return `${n}: answer value in more than two options`;
  const score = feats.map((f) => names.filter((n) => freq(n, f[n]) === Math.max(...feats.map((g) => freq(n, g[n])))).length);
  const best = Math.max(...score);
  const winners = score.map((v, k) => (v === best ? k : -1)).filter((k) => k >= 0);
  if (winners.length === 1 && winners[0] === correctIndex) return "majority vote singles out the answer";
  return null;
}

// ---------------------------------------------------------------- geometry

const fmt = (n) => {
  const s = (Math.round(n * 100) / 100).toFixed(2);
  return s.replace(/\.?0+$/, "").replace(/^-0$/, "0");
};
const pt = (x, y) => `${fmt(x)},${fmt(y)}`;
const polar = (r, deg) => [r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];

function polygon(points) {
  return "M" + points.map(([x, y]) => pt(x, y)).join("L") + "Z";
}
function regular(n, R, startDeg) {
  return polygon([...Array(n)].map((_, i) => polar(R, startDeg + (360 / n) * i)));
}

/** Outline path of a shape centred at the origin, "radius" R, pointing up. */
export function shapePath(shape, R) {
  switch (shape) {
    case "circle":
      return `M${pt(-R, 0)}a${pt(R, R)} 0 1 0 ${pt(2 * R, 0)}a${pt(R, R)} 0 1 0 ${pt(-2 * R, 0)}Z`;
    case "square": {
      const s = R * 0.9;
      return polygon([[-s, -s], [s, -s], [s, s], [-s, s]]);
    }
    case "triangle":
      return regular(3, R * 1.1, -90);
    case "diamond":
      return polygon([[0, -R * 1.05], [R * 0.85, 0], [0, R * 1.05], [-R * 0.85, 0]]);
    case "pentagon":
      return regular(5, R * 1.02, -90);
    case "hexagon":
      return regular(6, R, -90);
    case "star": {
      const pts = [];
      for (let i = 0; i < 10; i++) pts.push(polar(i % 2 === 0 ? R * 1.08 : R * 0.48, -90 + 36 * i));
      return polygon(pts);
    }
    case "cross": {
      const a = R * 0.32;
      return polygon([
        [-a, -R], [a, -R], [a, -a], [R, -a], [R, a], [a, a], [a, R], [-a, R], [-a, a], [-R, a], [-R, -a], [-a, -a],
      ]);
    }
    case "arrow":
      return polygon([[0, -R * 1.05], [R * 0.8, R * 0.75], [0, R * 0.3], [-R * 0.8, R * 0.75]]);
    case "tee":
      return polygon([
        [-R, -R], [R, -R], [R, -R * 0.4], [R * 0.3, -R * 0.4], [R * 0.3, R], [-R * 0.3, R], [-R * 0.3, -R * 0.4], [-R, -R * 0.4],
      ]);
    case "pointer":
      return polygon([
        [0, -R * 1.05], [R * 0.78, -R * 0.15], [R * 0.3, -R * 0.15], [R * 0.3, R * 1.05], [-R * 0.3, R * 1.05], [-R * 0.3, -R * 0.15], [-R * 0.78, -R * 0.15],
      ]);
    case "pacman": {
      // disc with a 90 degree mouth opening upwards
      const [ax, ay] = polar(R, -45);
      const [bx, by] = polar(R, -135);
      return `M0,0L${pt(ax, ay)}A${pt(R, R)} 0 1 1 ${pt(bx, by)}Z`;
    }
    default:
      throw new Error(`unknown shape ${shape}`);
  }
}

const STROKE = 3;
const HATCH_STROKE = 2.2;
const HATCH_GAP = 9.2; // along x; perpendicular spacing 6.5
const HATCH_R = 26; // covers the biggest shape (46 px) in any rotation

function hatchPath(R) {
  const E = R * 1.6;
  const lines = [];
  for (let o = -2 * E; o <= 2 * E; o += HATCH_GAP) lines.push(`M${pt(o - E, E)}L${pt(o + E, -E)}`);
  return lines.join("");
}

/** <defs> with the hatch a file needs ("" when it needs none). */
function hatchDefs(cells) {
  if (!cells.some((c) => c.fill === "striped")) return "";
  return `<defs><path id="hs" d="${hatchPath(HATCH_R)}" fill="none" stroke="#000" stroke-width="${HATCH_STROKE}"/></defs>`;
}

/**
 * One shape with a fill style. Returns SVG markup in local coordinates.
 * `id` must be unique within the file (used for the hatch clip).
 */
function drawShape({ shape, fill, rot, R, id }) {
  const d = shapePath(shape, R);
  const tr = rot ? ` transform="rotate(${rot})"` : "";
  const line = `stroke="#000" stroke-width="${STROKE}" stroke-linejoin="round"`;
  if (fill === "solid") return `<path d="${d}" fill="#000" ${line}${tr}/>`;
  if (fill === "empty") return `<path d="${d}" fill="none" ${line}${tr}/>`;
  if (fill === "dotted") return `<path d="${d}" fill="none" ${line}${tr}/><circle r="${fmt(R * 0.3)}" fill="#000"/>`;
  if (fill === "striped") {
    return (
      `<clipPath id="${id}"><path d="${d}"${tr}/></clipPath>` +
      `<g clip-path="url(#${id})"><use href="#hs"/></g>` +
      `<path d="${d}" fill="none" ${line}${tr}/>`
    );
  }
  throw new Error(`unknown fill ${fill}`);
}

function countLayout(count, pitch) {
  const h = pitch / 2;
  switch (count) {
    case 1:
      return [[0, 0]];
    case 2:
      return [[-h, 0], [h, 0]];
    case 3:
      return [[0, -h], [-h, h * 0.8], [h, h * 0.8]];
    case 4:
      return [[-h, -h], [h, -h], [-h, h], [h, h]];
    default:
      throw new Error(`count ${count}`);
  }
}

function frameMarkup(frame) {
  const line = `fill="none" stroke="#000" stroke-width="${STROKE}" stroke-linejoin="round"`;
  switch (frame) {
    case "none":
      return "";
    case "circle":
      return `<circle r="35" ${line}/>`;
    case "square":
      return `<rect x="-31" y="-31" width="62" height="62" ${line}/>`;
    case "diamond":
      return `<path d="${polygon([[0, -40], [40, 0], [0, 40], [-40, 0]])}" ${line}/>`;
    case "hexagon":
      return `<path d="${regular(6, 38, -90)}" ${line}/>`;
    default:
      throw new Error(`frame ${frame}`);
  }
}

const SEGMENT_PTS = {
  T: [[-24, -24], [24, -24]],
  R: [[24, -24], [24, 24]],
  B: [[24, 24], [-24, 24]],
  L: [[-24, 24], [-24, -24]],
  D1: [[-24, -24], [24, 24]],
  D2: [[24, -24], [-24, 24]],
};
// five dot slots (quincunx): 14 px dots, >= 8 px between neighbours, inside every frame
const DOT_XY = { nw: [-16, -16], ne: [16, -16], c: [0, 0], sw: [-16, 16], se: [16, 16] };
const DOT_R = 7;

/** Markup for one cell in local coordinates (origin at the cell centre). */
export function cellMarkup(cell, spec, idPrefix) {
  const parts = [];
  if (spec.kind === "shapes") {
    const framed = cell.frame !== "none";
    if (framed) parts.push(frameMarkup(cell.frame));
    const D = framed ? 36 : isMulti(spec) ? 32 : 46;
    const pitch = D + 8;
    countLayout(cell.count, pitch).forEach(([x, y], i) => {
      parts.push(
        `<g transform="translate(${fmt(x)} ${fmt(y)})">` +
          drawShape({ shape: cell.shape, fill: cell.fill, rot: cell.rot, R: D / 2, id: `${idPrefix}s${i}` }) +
          `</g>`,
      );
    });
  } else if (spec.kind === "orbit") {
    parts.push(frameMarkup(cell.frame));
    const [x, y] = polar(19, cell.pos * 45 - 90);
    parts.push(`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="7" fill="#000"/>`);
  } else if (spec.kind === "parts") {
    parts.push(frameMarkup(cell.frame));
    if (spec.partsStyle === "segments") {
      const d = cell.parts
        .map((s) => SEGMENT_PTS[s])
        .map(([[x1, y1], [x2, y2]]) => `M${pt(x1, y1)}L${pt(x2, y2)}`)
        .join("");
      parts.push(`<path d="${d}" fill="none" stroke="#000" stroke-width="4" stroke-linecap="square"/>`);
    } else {
      for (const name of cell.parts) {
        const [x, y] = DOT_XY[name];
        parts.push(`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${DOT_R}" fill="#000"/>`);
      }
    }
  } else {
    throw new Error(`kind ${spec.kind}`);
  }
  return parts.join("");
}

// tag: the answer-shaped hole (rectangle with a rounded point on the right)
function tagPath(x0, y0, h) {
  const w = 1.19 * h;
  const t = 0.4738 * h;
  return (
    `M${pt(x0 + w, y0)}` +
    `c${pt(0.0346 * h, 0.023 * h)} ${pt(t, 0.318 * h)} ${pt(t, 0.5 * h)}` +
    `s${pt(-(t - 0.0346 * h), 0.477 * h)} ${pt(-t, 0.5 * h)}` +
    `H${fmt(x0)}V${fmt(y0)}Z`
  );
}

const COLS = [115, 250, 385];
const ROWS = [72, 168, 264];
const HOLE = { x: 313, y: 215, h: 98 };
const OPT_TAG = { x: 1, y: 1.5, h: 102 };
const OPT_SCALE = OPT_TAG.h / HOLE.h;
// content centre of cell 9 relative to the hole's rectangle, mapped into the option
const OPT_CX = OPT_TAG.x + (1.19 * OPT_TAG.h) / 2 + (COLS[2] - (HOLE.x + (1.19 * HOLE.h) / 2)) * OPT_SCALE;
const OPT_CY = OPT_TAG.y + OPT_TAG.h / 2;

export function promptSvg(item) {
  const { spec, cells } = item;
  const body = [];
  if (spec.kind === "shapes") body.push(hatchDefs(cells.slice(0, 8)));
  body.push(`<rect x="0.5" y="0.5" width="499" height="334" fill="none" stroke="#000"/>`);
  body.push(`<path d="${tagPath(HOLE.x, HOLE.y, HOLE.h)}" fill="none" stroke="#000"/>`);
  for (let i = 0; i < 8; i++) {
    const r = Math.floor(i / 3);
    const c = i % 3;
    body.push(`<g transform="translate(${COLS[c]} ${ROWS[r]})">${cellMarkup(cells[i], spec, `c${i}`)}</g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${PROMPT_VIEWBOX}">\n${body.filter(Boolean).join("\n")}\n</svg>\n`;
}

export function optionSvg(item, k) {
  const { spec, options } = item;
  const body = [];
  if (spec.kind === "shapes") body.push(hatchDefs([options[k]]));
  body.push(`<path d="${tagPath(OPT_TAG.x, OPT_TAG.y, OPT_TAG.h)}" fill="none" stroke="#000" stroke-width="2"/>`);
  body.push(
    `<g transform="translate(${fmt(OPT_CX)} ${fmt(OPT_CY)}) scale(${fmt(OPT_SCALE)})">${cellMarkup(options[k], spec, `o${k}`)}</g>`,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${OPTION_VIEWBOX}">\n${body.filter(Boolean).join("\n")}\n</svg>\n`;
}

export function metaJson(item) {
  const { spec, correctIndex, options, described, rules } = item;
  return {
    id: spec.id,
    difficulty: spec.difficulty,
    weight: spec.difficulty === "hard" ? 3 : 2,
    correctAnswer: correctIndex,
    seed: spec.seed,
    kind: spec.kind,
    rules: described,
    ruleSpec: spec.rules,
    constants: Object.fromEntries(
      ATTRS.filter((a) => rules[a].kind === "const").map((a) => [a, rules[a].value === undefined ? item.grids[a][0][0] : rules[a].value]),
    ),
    options: options.map((o) => ({ breaks: o._breaks || [], cell: Object.fromEntries(ATTRS.map((a) => [a, o[a]])) })),
  };
}

/** All files of an item as { relativePath: content }. */
export function renderItem(spec) {
  const item = buildItem(spec);
  const files = { "prompt.svg": promptSvg(item) };
  for (let k = 0; k < 4; k++) files[`option_${k + 1}.svg`] = optionSvg(item, k);
  files["meta.json"] = JSON.stringify(metaJson(item), null, 2) + "\n";
  return { item, files };
}

// ---------------------------------------------------------------- the bank

const prog = (attr, axis, step) => ({ attr, kind: "prog", axis, step });
const dist = (attr, values) => (values ? { attr, kind: "dist", values } : { attr, kind: "dist" });
const setop = (op, max) => ({ attr: "parts", kind: "setop", op, max });
const BIG_FILLS = ["empty", "striped", "solid"];
const SMALL_FILLS = ["empty", "dotted", "solid"];

export const ITEMS = [
  // ---- medium: one non-trivial rule (rotation, position, XOR/UNION) or two simple rules
  { id: "g01", difficulty: "medium", seed: 3101, kind: "shapes", rules: [prog("rot", "col", 2)], const: { shape: "arrow", fill: "solid" } },
  { id: "g02", difficulty: "medium", seed: 3102, kind: "shapes", rules: [prog("rot", "col", 1)], const: { shape: "tee", fill: "solid" } },
  { id: "g03", difficulty: "medium", seed: 3145, kind: "shapes", rules: [dist("count", [1, 2, 3]), dist("fill", SMALL_FILLS)], domains: { shape: SMALL_SHAPES } },
  { id: "g04", difficulty: "medium", seed: 3104, kind: "orbit", rules: [prog("pos", "col", 2)], const: { frame: "square" } },
  { id: "g05", difficulty: "medium", seed: 3140, kind: "orbit", rules: [prog("pos", "col", -2)], const: { frame: "circle" } },
  { id: "g06", difficulty: "medium", seed: 3134, kind: "shapes", rules: [dist("frame", ["circle", "square", "hexagon"]), dist("shape", ["triangle", "star", "cross"])], const: { fill: "solid" } },
  { id: "g07", difficulty: "medium", seed: 3114, kind: "parts", partsStyle: "segments", rules: [setop("xor", 4)] },
  { id: "g08", difficulty: "medium", seed: 3136, kind: "parts", partsStyle: "segments", rules: [setop("union", 4)] },
  { id: "g09", difficulty: "medium", seed: 3172, kind: "parts", partsStyle: "dots", rules: [setop("xor", 3)], const: { frame: "square" } },
  { id: "g10", difficulty: "medium", seed: 3117, kind: "parts", partsStyle: "dots", rules: [setop("union", 3)], const: { frame: "circle" } },
  { id: "g11", difficulty: "medium", seed: 3146, kind: "shapes", rules: [prog("count", "col", 1), dist("shape")], const: { fill: "solid" }, domains: { shape: SMALL_SHAPES } },
  { id: "g12", difficulty: "medium", seed: 3183, kind: "shapes", rules: [prog("count", "row", 1), dist("fill", SMALL_FILLS)], const: { shape: "triangle" } },
  { id: "g13", difficulty: "medium", seed: 3152, kind: "shapes", rules: [dist("shape"), dist("fill", BIG_FILLS)], domains: { shape: BULKY_SHAPES } },
  { id: "g14", difficulty: "medium", seed: 3191, kind: "shapes", rules: [prog("count", "col", 1), { ...prog("rot", "row", 2), sameBase: true }], const: { shape: "pointer", fill: "solid" } },
  { id: "g15", difficulty: "medium", seed: 3185, kind: "shapes", rules: [prog("count", "col", 1), dist("fill", SMALL_FILLS)], const: { shape: "circle" } },
  { id: "g16", difficulty: "medium", seed: 3214, kind: "shapes", rules: [dist("shape"), dist("fill", SMALL_FILLS)], const: { count: 2 }, domains: { shape: SMALL_SHAPES } },
  // ---- hard: two or three simultaneous rules, at least one rotation/position or XOR/UNION
  { id: "g17", difficulty: "hard", seed: 4159, kind: "shapes", rules: [prog("rot", "col", 2), dist("fill", BIG_FILLS)], const: { shape: "arrow" } },
  { id: "g18", difficulty: "hard", seed: 4195, kind: "shapes", rules: [{ ...prog("rot", "row", 2), sameBase: true }, dist("shape")], const: { fill: "solid" }, domains: { shape: ORIENTED_SHAPES } },
  { id: "g19", difficulty: "hard", seed: 4133, kind: "parts", partsStyle: "dots", rules: [setop("xor", 3), dist("frame", ["circle", "square", "hexagon"])] },
  { id: "g20", difficulty: "hard", seed: 4120, kind: "orbit", rules: [prog("pos", "col", 2), dist("frame", ["square", "circle", "diamond"])] },
  { id: "g21", difficulty: "hard", seed: 4135, kind: "shapes", rules: [prog("count", "col", 1), prog("rot", "col", -2)], const: { shape: "pointer", fill: "solid" } },
  { id: "g22", difficulty: "hard", seed: 4164, kind: "shapes", rules: [dist("shape"), dist("fill", BIG_FILLS), prog("rot", "col", 2)], domains: { shape: ORIENTED_SHAPES } },
  { id: "g23", difficulty: "hard", seed: 4228, kind: "parts", partsStyle: "dots", rules: [setop("union", 3), dist("frame", ["circle", "square", "hexagon"])] },
  { id: "g24", difficulty: "hard", seed: 4173, kind: "shapes", rules: [prog("rot", "col", 1), dist("fill", BIG_FILLS)], const: { shape: "tee" } },
];

// ---------------------------------------------------------------- cli

function writeBank(outDir, only, render) {
  const index = [];
  for (const spec of ITEMS) {
    if (only && spec.id !== only) continue;
    const { item, files } = renderItem(spec);
    const dir = join(outDir, spec.id);
    mkdirSync(dir, { recursive: true });
    for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
    const bytes = Object.entries(files).filter(([n]) => n.endsWith(".svg")).reduce((n, [, s]) => n + Buffer.byteLength(s), 0);
    index.push({
      id: spec.id,
      difficulty: spec.difficulty,
      weight: spec.difficulty === "hard" ? 3 : 2,
      correctAnswer: item.correctIndex,
      seed: spec.seed,
      kind: spec.kind,
      rules: item.described,
      svgBytes: bytes,
    });
    console.log(`${spec.id} ${spec.difficulty.padEnd(6)} answer=${item.correctIndex + 1} ${bytes}B  ${item.described.join(" | ")}`);
  }
  if (!only) writeFileSync(join(outDir, "index.json"), JSON.stringify(index, null, 2) + "\n");
  if (render) renderPngs(outDir, only ? [only] : ITEMS.map((s) => s.id));
}

const FONT = "/System/Library/Fonts/Helvetica.ttc";

function magick(args) {
  const r = spawnSync("magick", args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`magick ${args.join(" ")}\n${r.stderr}`);
}

/**
 * SVG -> PNG through Quick Look (WebKit). qlmanage fits the drawing into a
 * size x size square; the crop recovers the exact viewBox area at 2x.
 * (ImageMagick's own SVG renderer drops stroked paths, so it is not used.)
 */
function svgToPng(svg, png, size, w, h) {
  const dir = dirname(png);
  const r = spawnSync("qlmanage", ["-t", "-s", String(size), "-o", dir, svg], { encoding: "utf8" });
  const raw = join(dir, `${svg.split("/").pop()}.png`);
  if (r.status !== 0 || !existsSync(raw)) throw new Error(`qlmanage failed for ${svg}\n${r.stderr}`);
  const y = Math.round((size - h) / 2);
  magick([raw, "-crop", `${w}x${h}+0+${y}`, "+repage", "-background", "white", "-flatten", png]);
  rmSync(raw);
}

function renderPngs(outDir, ids) {
  const tmp = join(outDir, ".sheet");
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const rows = [];
  const keyRows = [];
  for (const id of ids) {
    const dir = join(outDir, id);
    const meta = JSON.parse(readFileSync(join(dir, "meta.json"), "utf8"));
    svgToPng(join(dir, "prompt.svg"), join(dir, "prompt.png"), 1000, 1000, 670);
    for (let k = 1; k <= 4; k++) svgToPng(join(dir, `option_${k}.svg`), join(dir, `option_${k}.png`), 692, 692, 420);
    // review row: prompt at 600 px, options at 240 px, label with id and difficulty
    const prompt = join(tmp, `${id}_p.png`);
    magick([join(dir, "prompt.png"), "-resize", "600x402", prompt]);
    const opts = [];
    const keyOpts = [];
    for (let k = 1; k <= 4; k++) {
      const o = join(tmp, `${id}_o${k}.png`);
      magick([join(dir, `option_${k}.png`), "-resize", "240x146", "-bordercolor", "white", "-border", "3", o]);
      opts.push(o);
      const ok = join(tmp, `${id}_k${k}.png`);
      if (k - 1 === meta.correctAnswer) {
        magick([join(dir, `option_${k}.png`), "-resize", "240x146", "-bordercolor", "#d00", "-border", "3", ok]);
      } else {
        magick([o, ok]);
      }
      keyOpts.push(ok);
    }
    const label = `${id}  ${meta.difficulty}`;
    const strip = join(tmp, `${id}_s.png`);
    magick([...opts, "+append", "-bordercolor", "white", "-border", "4", strip]);
    const kstrip = join(tmp, `${id}_ks.png`);
    magick([...keyOpts, "+append", "-bordercolor", "white", "-border", "4", kstrip]);
    const row = join(tmp, `${id}_row.png`);
    const krow = join(tmp, `${id}_krow.png`);
    for (const [src, dst] of [[strip, row], [kstrip, krow]]) {
      magick([
        prompt, "-bordercolor", "white", "-border", "8", src, "-gravity", "center", "+append",
        "-gravity", "northwest", "-background", "white", "-splice", "0x30",
        "-font", FONT, "-pointsize", "22", "-fill", "#d00", "-annotate", "+12+4", label,
        "-bordercolor", "#ccc", "-border", "1", dst,
      ]);
    }
    rows.push(row);
    keyRows.push(krow);
  }
  const sheet = (list, dst) => {
    const half = Math.ceil(list.length / 2);
    const colA = join(tmp, "colA.png");
    const colB = join(tmp, "colB.png");
    magick([...list.slice(0, half), "-append", colA]);
    if (list.length > half) {
      magick([...list.slice(half), "-append", colB]);
      magick([colA, colB, "-background", "white", "-gravity", "north", "+append", dst]);
    } else {
      magick([colA, dst]);
    }
  };
  sheet(rows, join(outDir, "contact-sheet.png"));
  sheet(keyRows, join(outDir, "contact-sheet-key.png"));
  rmSync(tmp, { recursive: true, force: true });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const outDir = outIdx >= 0 ? resolve(args[outIdx + 1]) : DEFAULT_OUT;
  const onlyIdx = args.indexOf("--only");
  const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
  const render = args.includes("--render");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeBank(outDir, only, render);
}
