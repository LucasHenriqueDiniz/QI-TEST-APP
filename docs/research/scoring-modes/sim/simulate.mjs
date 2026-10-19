// Simulation behind docs/research/scoring-modes/README.md.
// Run: node docs/research/scoring-modes/sim/simulate.mjs   (from the repo root; no dependencies)
// Reads data/questions.ts for the real bank; everything else is a model assumption stated below.

import { readFileSync } from "node:fs";

// ---------- deterministic RNG ----------
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261019);
const gauss = () => { let u = 0, v = 0; while (u === 0) u = rand(); v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const shuffle = (xs) => { const a = [...xs]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
const sd = (xs) => { const m = mean(xs); return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1)); };
const corr = (xs, ys) => { const mx = mean(xs), my = mean(ys); let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < xs.length; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); };
const pct = (xs, p) => { const a = [...xs].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(p * a.length))]; };
const f = (x, d = 2) => x.toFixed(d);

// ---------- the real bank ----------
const source = readFileSync(new URL("../../../../data/questions.ts", import.meta.url), "utf8");
const BANK = [...source.matchAll(/id:\s*"(\w+)",\s*category:\s*"(\w+)",[\s\S]*?difficulty:\s*"(\w+)"/g)].map(([, id, category, difficulty]) => ({ id, category, difficulty }));
const CATS = ["patterns", "matrix", "similarities", "vocabulary", "comprehension"];
const DIFFS = ["easy", "medium", "hard"];
const WEIGHT = { easy: 1, medium: 2, hard: 3 };
const DOMAIN = { patterns: "reasoning", matrix: "reasoning", similarities: "verbal", vocabulary: "verbal", comprehension: "verbal" };

// ---------- blueprints ----------
const CURRENT_30 = { patterns: { medium: 6, hard: 6 }, similarities: { easy: 1, medium: 2, hard: 2 }, matrix: { easy: 1, medium: 2, hard: 2 }, vocabulary: { easy: 1, medium: 1, hard: 2 }, comprehension: { easy: 1, medium: 2, hard: 1 } };
const RAPIDO_20 = { patterns: { easy: 2, medium: 2, hard: 2 }, matrix: { easy: 1, medium: 2, hard: 1 }, similarities: { easy: 1, medium: 2, hard: 1 }, vocabulary: { easy: 1, medium: 1, hard: 1 }, comprehension: { easy: 1, medium: 1, hard: 1 } };
const NORMAL_40 = { patterns: { easy: 4, medium: 4, hard: 4 }, matrix: { easy: 2, medium: 4, hard: 2 }, similarities: { easy: 2, medium: 3, hard: 2 }, vocabulary: { easy: 2, medium: 3, hard: 2 }, comprehension: { easy: 2, medium: 2, hard: 2 } };
const DETALHADO_90 = { patterns: { easy: 8, medium: 11, hard: 8 }, matrix: { easy: 5, medium: 8, hard: 5 }, similarities: { easy: 4, medium: 6, hard: 5 }, vocabulary: { easy: 4, medium: 6, hard: 5 }, comprehension: { easy: 5, medium: 6, hard: 4 } };
const MODES = { "Rápido 20": RAPIDO_20, "Normal 40": NORMAL_40, "Detalhado 90": DETALHADO_90 };
const size = (bp) => CATS.reduce((s, c) => s + DIFFS.reduce((t, d) => t + (bp[c]?.[d] ?? 0), 0), 0);

const cellCount = (bank, c, d) => bank.filter((q) => q.category === c && q.difficulty === d).length;

// ---------- selection: today's buildTest (random + fallback) and an LRU variant ----------
// policy: null = random (today); { kind: "lru", lastUsed } = least recently used first;
// { kind: "excludeLast", last: Set } = items not in the previous test first, random otherwise.
function buildTest(bank, bp, policy) {
  const order = (items) => {
    if (!policy) return shuffle(items);
    if (policy.kind === "lru") return shuffle(items).sort((x, y) => (policy.lastUsed.get(x.id) ?? -1) - (policy.lastUsed.get(y.id) ?? -1));
    if (policy.kind === "soft") {
      // weighted sampling without replacement (Efraimidis–Spirakis): key = u^(1/w), highest keys first.
      // w depends on how many tests ago the item was last shown: 1 test ago -> w[0], 2 -> w[1], older/never -> 1.
      const key = (q) => { const last = policy.lastUsed.get(q.id); const age = last === undefined ? Infinity : policy.now - last; const w = age === 1 ? policy.w[0] : age === 2 ? policy.w[1] : 1; return Math.pow(rand(), 1 / w); };
      return items.map((q) => [key(q), q]).sort((x, y) => y[0] - x[0]).map(([, q]) => q);
    }
    const fresh = shuffle(items.filter((q) => !policy.last.has(q.id))), seen = shuffle(items.filter((q) => policy.last.has(q.id)));
    return [...fresh, ...seen];
  };
  const selected = [];
  for (const c of CATS) {
    const pool = bank.filter((q) => q.category === c);
    const taken = new Set();
    for (const d of Object.keys(bp[c] ?? {})) {
      const count = bp[c][d];
      const matching = order(pool.filter((q) => q.difficulty === d && !taken.has(q.id))).slice(0, count);
      matching.forEach((q) => taken.add(q.id));
      selected.push(...matching);
      const missing = count - matching.length;
      if (missing > 0) {
        const fallback = order(pool.filter((q) => !taken.has(q.id))).slice(0, missing);
        fallback.forEach((q) => taken.add(q.id));
        selected.push(...fallback);
      }
    }
  }
  return selected;
}

function overlapStats(bank, bp, kind, runs = 400, w = null) {
  // lag 1 = consecutive tests; lag 2 = the test before the previous one
  const lag1 = [], lag2 = [], lag3 = [];
  const lastUsed = new Map();
  const history = [];
  for (let t = 0; t < runs; t++) {
    const policy = kind === "random" ? null : kind === "lru" ? { kind, lastUsed } : kind === "soft" ? { kind, lastUsed, now: t, w } : { kind, last: history.length ? history[history.length - 1] : new Set() };
    const test = buildTest(bank, bp, policy);
    test.forEach((q) => lastUsed.set(q.id, t));
    const ids = new Set(test.map((q) => q.id));
    if (history.length >= 1) lag1.push(test.filter((q) => history[history.length - 1].has(q.id)).length / test.length);
    if (history.length >= 2) lag2.push(test.filter((q) => history[history.length - 2].has(q.id)).length / test.length);
    if (history.length >= 3) lag3.push(test.filter((q) => history[history.length - 3].has(q.id)).length / test.length);
    history.push(ids);
  }
  return { mean: mean(lag1), p95: pct(lag1, 0.95), lag2: mean(lag2), lag3: mean(lag3) };
}

// ---------- expanded bank: every cell at least `factor` x the Detalhado cell ----------
function expandedBank(factor) {
  const bank = [...BANK];
  const added = {};
  for (const c of CATS) for (const d of DIFFS) {
    const need = Math.ceil(factor * (DETALHADO_90[c]?.[d] ?? 0));
    const have = cellCount(BANK, c, d);
    added[`${c}.${d}`] = Math.max(0, need - have);
    for (let i = 0; i < need - have; i++) bank.push({ id: `new-${c}-${d}-${i}`, category: c, difficulty: d });
  }
  return { bank, added };
}

// ---------- item model (assumption): 3PL with c = 1/4 (every item has 4 options), b by label ----------
const C = 0.25;
const logistic = (x) => 1 / (1 + Math.exp(-x));
const pCorrect = (theta, a, b) => C + (1 - C) * logistic(a * (theta - b));

// Calibrate a and the label difficulties so that today's 30-item test, scored the current way,
// keeps its current constants: mean weighted ratio 0.55 and SD 0.18 (EXPECTED_RATIO / RATIO_SPREAD).
// Deterministic given the sampled tests: quadrature over theta instead of simulated persons.
const CAL_TESTS = Array.from({ length: 400 }, () => buildTest(BANK, CURRENT_30, null));
const QGRID = Array.from({ length: 121 }, (_, i) => -6 + i * 0.1);
const QW = (() => { const w = QGRID.map((t) => Math.exp(-t * t / 2)); const z = w.reduce((s, x) => s + x, 0); return w.map((x) => x / z); })();
function currentScoreMoments(a, b) {
  let m1 = 0, m2 = 0;
  for (const test of CAL_TESTS) {
    const W = test.reduce((s, q) => s + WEIGHT[q.difficulty], 0);
    QGRID.forEach((theta, g) => {
      let mu = 0, v = 0;
      for (const q of test) { const P = pCorrect(theta, a, b[q.difficulty]); const w = WEIGHT[q.difficulty]; mu += w * P; v += w * w * P * (1 - P); }
      mu /= W; v /= W * W;
      m1 += QW[g] * mu; m2 += QW[g] * (v + mu * mu);
    });
  }
  m1 /= CAL_TESTS.length; m2 /= CAL_TESTS.length;
  return { m: m1, s: Math.sqrt(m2 - m1 * m1) };
}

// ---------- scoring ----------
const GRID = Array.from({ length: 81 }, (_, i) => -4 + i * 0.1);
const PRIOR = GRID.map((t) => Math.exp(-t * t / 2));
function eap(responses, a, b) {
  const post = PRIOR.map((p, g) => {
    let like = p;
    for (const { difficulty, correct } of responses) { const P = pCorrect(GRID[g], a, b[difficulty]); like *= correct ? P : 1 - P; }
    return like;
  });
  const z = post.reduce((s, x) => s + x, 0);
  const m = post.reduce((s, x, g) => s + x * GRID[g], 0) / z;
  const v = post.reduce((s, x, g) => s + x * (GRID[g] - m) ** 2, 0) / z;
  return { theta: m, se: Math.sqrt(v) };
}
const currentIq = (responses) => {
  let earned = 0, total = 0;
  for (const r of responses) { total += WEIGHT[r.difficulty]; if (r.correct) earned += WEIGHT[r.difficulty]; }
  return Math.min(145, Math.max(55, Math.round(100 + 15 * (earned / total - 0.55) / 0.18)));
};
const clampIq = (x) => Math.min(145, Math.max(55, x));

function answer(test, theta, truthA, truthB) {
  return test.map((q) => ({ ...q, correct: rand() < pCorrect(theta, truthA, truthB(q)) }));
}

// ================= run =================
const out = [];
const log = (s = "") => out.push(s);

log("## Bank (measured from data/questions.ts)");
log(`items: ${BANK.length}`);
for (const c of CATS) log(`${c}: ` + DIFFS.map((d) => `${d} ${cellCount(BANK, c, d)}`).join(" / "));

log("\n## Blueprint sizes");
for (const [name, bp] of Object.entries({ CURRENT_30, ...MODES })) log(`${name}: ${size(bp)} items`);

log("\n## Overlap between two consecutive tests of the same mode (share of items repeated)");
log("lag-1 = consecutive tests; lag-2 / lag-3 = the test two / three before");
log("bank | mode | random: lag-1 mean / p95 (lag-2, lag-3) | exclude-last: lag-1 mean / p95 (lag-2, lag-3) | LRU: lag-1 mean / p95 (lag-2, lag-3)");
const banks = { "today": BANK, "2.0x Detalhado": expandedBank(2.0).bank, "2.5x Detalhado": expandedBank(2.5).bank, "1.6x Detalhado": expandedBank(1.6).bank };
for (const [bname, bank] of Object.entries(banks)) {
  for (const [mname, bp] of Object.entries({ "current 30": CURRENT_30, ...MODES })) {
    const r = overlapStats(bank, bp, "random"), x = overlapStats(bank, bp, "excludeLast", 200), l = overlapStats(bank, bp, "lru", 60);
    log(`${bname} (${bank.length}) | ${mname} | ${f(r.mean)} / ${f(r.p95)} (${f(r.lag2)}, ${f(r.lag3)}) | ${f(x.mean)} / ${f(x.p95)} (${f(x.lag2)}, ${f(x.lag3)}) | ${f(l.mean)} / ${f(l.p95)} (${f(l.lag2)}, ${f(l.lag3)})`);
  }
}
log("\n## Soft recency weighting (weighted random draw; weight 1 for items not seen in the last two tests)");
log("bank | mode | w(last test), w(2 tests ago) | lag-1 mean / p95 | lag-2 mean | lag-3 mean");
for (const [bname, bank] of Object.entries({ "2.0x Detalhado": banks["2.0x Detalhado"], "1.6x Detalhado": banks["1.6x Detalhado"] })) {
  for (const w of [[0.05, 0.3], [0.1, 0.4], [0.2, 0.5], [0.1, 1.0]]) {
    for (const [mname, bp] of Object.entries(MODES)) {
      const r = overlapStats(bank, bp, "soft", 200, w);
      log(`${bname} (${bank.length}) | ${mname} | ${w[0]}, ${w[1]} | ${f(r.mean)} / ${f(r.p95)} | ${f(r.lag2)} | ${f(r.lag3)}`);
    }
  }
}
for (const factor of [1.6, 2.0, 2.5]) {
  const { bank, added } = expandedBank(factor);
  log(`\nitems to add for ${factor}x: total ${bank.length - BANK.length} -> bank ${bank.length}`);
  for (const c of CATS) log(`  ${c}: ` + DIFFS.map((d) => `${d} +${added[`${c}.${d}`]}`).join(" / ") + `  (= ${DIFFS.reduce((s, d) => s + added[`${c}.${d}`], 0)})`);
}

log("\n## Calibration of the item model to today's constants (0.55 / 0.18 on CURRENT_30)");
let best = null;
const near = [];
for (let a = 0.8; a <= 2.6; a += 0.05) for (let bm = -0.6; bm <= 0.8; bm += 0.05) for (const d of [1.0]) {
  const b = { easy: bm - d, medium: bm, hard: bm + d };
  const { m, s } = currentScoreMoments(a, b);
  const loss = (m - 0.55) ** 2 + (s - 0.18) ** 2;
  if (!best || loss < best.loss) best = { a, b, m, s, loss };
  if (Math.abs(m - 0.55) < 0.005 && Math.abs(s - 0.18) < 0.005) near.push(`a ${f(a)} b_medium ${f(bm)}`);
}
log(`best fit a ${f(best.a)} b_medium ${f(best.b.medium)} (mean ${f(best.m, 3)}, sd ${f(best.s, 3)}); within ±0.005 of both targets: ${near.join(", ")}`);
const A = Math.round(best.a * 10) / 10;
const B = { easy: Math.round(best.b.easy * 10) / 10, medium: Math.round(best.b.medium * 10) / 10, hard: Math.round(best.b.hard * 10) / 10 };
const chk = currentScoreMoments(A, B);
log(`a = ${A}, b = easy ${B.easy} / medium ${B.medium} / hard ${B.hard} -> current-score mean ${f(chk.m, 3)}, sd ${f(chk.s, 3)}`);

log("\n## Scoring per mode (simulated persons theta ~ N(0,1); IQ_true = 100 + 15 theta)");
log("Forms are drawn from today's bank for 'current 30' and from the 2.0x bank for the three modes (target state).");
const N = 3000;
const BANK2 = expandedBank(2.0).bank;
const bankFor = (mname) => (mname === "current 30" ? BANK : BANK2);
const truthExact = (q) => B[q.difficulty];

// Per-mode constants for the "fix RATIO_SPREAD per mode" alternative (CHECKLIST §6): population mean/SD of the
// weighted ratio for each mode, measured under the exact model, plus the alternate-form reliability for Kelley.
const ratioOf = (rs) => { let e = 0, t = 0; for (const r of rs) { t += WEIGHT[r.difficulty]; if (r.correct) e += WEIGHT[r.difficulty]; } return e / t; };
const modeConst = {};
for (const [mname, bp] of Object.entries({ "current 30": CURRENT_30, ...MODES })) {
  const xs = [], ys = [];
  for (let i = 0; i < 4000; i++) { const th = gauss(); xs.push(ratioOf(answer(buildTest(bankFor(mname), bp, null), th, A, truthExact))); ys.push(ratioOf(answer(buildTest(bankFor(mname), bp, null), th, A, truthExact))); }
  modeConst[mname] = { m: mean(xs), s: sd(xs), r: corr(xs, ys) };
}
log("\nper-mode weighted-ratio constants (exact model): " + Object.entries(modeConst).map(([k, v]) => `${k}: mean ${f(v.m, 3)} sd ${f(v.s, 3)} r ${f(v.r)}`).join(" · "));

log("\nceiling / floor of EAP (all correct / all wrong), IQ: " + Object.entries({ "current 30": CURRENT_30, ...MODES }).map(([k, bp]) => {
  const t = buildTest(bankFor(k), bp, null);
  const hi = eap(t.map((q) => ({ ...q, correct: true })), A, B), lo = eap(t.map((q) => ({ ...q, correct: false })), A, B);
  return `${k}: ${f(100 + 15 * hi.theta, 0)} ± ${f(1.645 * 15 * hi.se, 0)} / ${f(100 + 15 * lo.theta, 0)} ± ${f(1.645 * 15 * lo.se, 0)}`;
}).join(" · "));

function runModes(truthA, truthB, label) {
  log(`\n### truth: ${label}`);
  log("mode | method | pop mean | pop SD | alt-form r | mean |err| vs true");
  const persons = Array.from({ length: N }, () => gauss());
  const res = {};
  for (const [mname, bp] of Object.entries({ "current 30": CURRENT_30, ...MODES })) {
    const k = modeConst[mname];
    const M = { current: [[], []], perModeSpread: [[], []], kelley: [[], []], eap: [[], []] };
    const err = { current: [], perModeSpread: [], kelley: [], eap: [] };
    const cover = { 1.0: [], 1.25: [], 1.5: [] }, half = [];
    const idx = { verbal: [[], [], []], reasoning: [[], [], []] };
    for (const theta of persons) {
      const trueIq = 100 + 15 * theta;
      for (const form of [0, 1]) {
        const r = answer(buildTest(bankFor(mname), bp, null), theta, truthA, truthB);
        const ratio = ratioOf(r);
        const z = (ratio - k.m) / k.s;
        const s = eap(r, A, B);
        const v = { current: currentIq(r), perModeSpread: clampIq(100 + 15 * z), kelley: clampIq(100 + 15 * k.r * z), eap: clampIq(100 + 15 * s.theta) };
        for (const m of Object.keys(M)) M[m][form].push(v[m]);
        if (form === 0) {
          for (const m of Object.keys(M)) err[m].push(Math.abs(v[m] - trueIq));
          half.push(1.645 * 15 * s.se);
          for (const infl of [1.0, 1.25, 1.5]) cover[infl].push(Math.abs(100 + 15 * s.theta - trueIq) <= infl * 1.645 * 15 * s.se ? 1 : 0);
        }
        for (const dom of ["verbal", "reasoning"]) {
          const d = eap(r.filter((q) => DOMAIN[q.category] === dom), A, B);
          idx[dom][form].push(d.theta);
          if (form === 0) idx[dom][2].push(1.645 * 15 * d.se);
        }
      }
    }
    res[mname] = M;
    for (const m of Object.keys(M)) log(`${mname} | ${m} | ${f(mean(M[m][0]), 1)} | ${f(sd(M[m][0]), 1)} | ${f(corr(M[m][0], M[m][1]))} | ${f(mean(err[m]), 1)}`);
    log(`${mname} | eap 90% band half-width ${f(mean(half), 1)} · coverage x1.0 ${f(mean(cover[1.0]) * 100, 0)}% · x1.25 ${f(mean(cover[1.25]) * 100, 0)}% · x1.5 ${f(mean(cover[1.5]) * 100, 0)}%`);
    for (const dom of ["verbal", "reasoning"]) log(`${mname} | eap index ${dom}: alt-form r ${f(corr(idx[dom][0], idx[dom][1]))}, 90% half-width ${f(mean(idx[dom][2]), 1)}`);
  }
  for (const [x, y] of [["Rápido 20", "Detalhado 90"], ["Normal 40", "Detalhado 90"], ["Rápido 20", "Rápido 20"]]) {
    for (const m of ["current", "perModeSpread", "kelley", "eap"]) {
      const dx = res[x][m][0].map((v, i) => Math.abs(v - res[y][m][x === y ? 1 : 0][i]));
      log(`same person, ${x} vs ${y}, ${m}: mean |diff| ${f(mean(dx), 1)}, p95 |diff| ${f(pct(dx, 0.95), 0)}, share |diff| >= 15: ${f(mean(dx.map((v) => (v >= 15 ? 1 : 0))) * 100, 1)}%`);
    }
  }
}
runModes(A, truthExact, "model is right (labels give the exact difficulty)");
const jitter = new Map();
const truthJitter = (q) => { if (!jitter.has(q.id)) jitter.set(q.id, B[q.difficulty] + 0.6 * gauss()); return jitter.get(q.id); };
runModes(A * 0.75, truthJitter, "model is wrong: true slopes 25% flatter, each item's difficulty off its label by N(0, 0.6)");

console.log(out.join("\n"));
