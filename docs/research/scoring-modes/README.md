---
tags: [research, area/scoring, scoring-modes]
status: active
decided: 2026-10-19
---

# How should Teste de QI score Rápido 20 / Normal 40 / Detalhado 90, and what does "use speed the way real tests do" mean here?

> Verdict: real tests never score response time on reasoning items, so every question stays untimed and pausable. Speed gets its own optional 90-second task, reported as a separate experimental index that stays out of the headline QI. All three modes are scored by one IRT-style estimate (EAP) and shown as "QI estimado N (faixa A–B)". Blueprints split 50/50 between reasoning and verbal. The bank grows to 2× the Detalhado blueprint per cell (+78 items, of which 24 are pattern items = 120 SVG files), and selection draws least-recently-used items first.

Supersedes the 15/30/60 plan and the "`RATIO_SPREAD` por modo" item in `store/CHECKLIST.md` §6, and the "15/30/60 modes" mention in `docs/architecture/ARCHITECTURE.md` D4.

## What was blocking

The owner chose three modes (Rápido 20 / Normal 40 / Detalhado 90) and asked that speed be used "do jeito que os testes de verdade fazem". Building that needed answers to five questions:

1. what real batteries do with speed;
2. how they build a full-scale score from domain indices;
3. which speed design is honest in an offline, norm-free, pausable app;
4. how to score modes of different lengths so the same person gets a consistent number;
5. how big the bank must be so that 90 questions still vary between retakes.

The current code answers none of these. It has one 30-item blueprint, one pair of constants (0.55 / 0.18), and a `timeSpent` that also counts time spent in the background.

## How to read this

| tag | meaning |
|---|---|
| **[source]** | quoted in a file under `fetches/`, named inline |
| **[measured]** | counted or computed here from the repo (`fetches/local-app-code.md`) |
| **[simulated]** | produced by `sim/simulate.mjs` (seeded; output in `sim/output.txt`). True **only under the model it assumes**, which is stated next to every number |
| **[judgement]** | a design call; the evidence behind it is named |

---

## 1. What real tests do with speed and with the composite

| test | where speed enters | what the full score is made of | speed-free summary | sources |
|---|---|---|---|---|
| **WAIS-IV** (2008) | Two core processing-speed subtests: Symbol Search and Coding, plus Cancellation as a supplemental. All three have a *task-level* time limit. Block Design, Visual Puzzles, Figure Weights, Arithmetic and Picture Completion have *item-level* time limits. Block Design awards time bonuses on some items; WAIS-IV "Reduced # of items with time bonus" and added a "Block Design No Time Bonus (BDN)" process score. A revision goal was "Reduce emphasis on time-bonus". Matrix Reasoning carries no limit, only a "30-second guideline". | "FSIQ • Based on 10 core subtests": VCI 3, PRI 3, WMI 2, PSI 2. Speed is 2 of 10 subtests. | "GAI = VCI + PRI" | [source] `pearson-wais4-introduction.md`, `pearson-wais4-telepractice-table-2.md` |
| **WAIS-5** (2024) | The PSI is Coding + Symbol Search; Naming Speed Quantity is secondary. A "Motor-Reduced Processing Speed Index" is offered too. | Five primary indices of 2 subtests each. The "7-subtest FSIQ" = SI, VC, BD, MR, FW, Digit Sequencing, **Coding** [measured from the sample report's sums of scaled scores], so speed is **1 of 7**. The report shows "95% Confidence Interval", calculated "using the Standard Error of Estimation", plus the SEM: FSIQ ±5 (SEM 3.00), PSI ±8–9 (SEM 5.61). | GAI = SI + VC + BD + MR + FW; CPI = WM + PS [measured from the same sums] | [source] `pearson-wais5-overview-brochure.md`, `pearson-wais5-sample-score-report.md` |
| **WISC-IV GAI** (technical report) | — | — | The GAI "does not include the Working Memory or Processing Speed subtests". It "is not necessarily a more valid estimate of overall cognitive ability than the FSIQ". It is reported with a "confidence interval (90% or 95%)". Without the standardization data, a composite can be approximated with "Tellegen and Briggs (1967, Formula 4) … based on intercorrelations", which is off "approximately 2–3 points" on average. | [source] `pearson-wisc4-technical-report-4-gai.md` |
| **Raven's SPM / APM / Raven's 2** | Designed untimed: Raven (1938), "cannot be given satisfactorily with a time-limit". The APM manual later set "36 items in Set II … time limit of 40 min (i.e., 66.66 s/item)", a limit "adequate to allow examinees to attempt as many items as they are likely to answer correctly". The timed version assesses "intellectual efficiency" and "invariably includes a dimension for speed". Time limits change what the test correlates with (142 studies, N = 26,848), and even mild time pressure costs accuracy (d = 0.35). | One raw score (number correct), converted to a percentile against norms. | the untimed form itself | [source] `pearson-ravens-apm.md`, `pearson-ravens-2-flyer.md`, `bilker-2012-raven-nine-item-short-forms.md`, `tatel-2022-raven-speeded-meta-analysis.md`, `gonthier-2023-speeded-or-unspeeded.md` |
| **Stanford-Binet 5** (2003) | No speed factor. "processing speed … require[s] specialized timing or test apparatus". | FSIQ → NVIQ + VIQ, five factors × verbal/nonverbal. Reliability: IQ ".95 to .98", factor indices ".90 to .92", subtests ".84 to .89". | "An abbreviated IQ based on the two routing subtests" (15–20 min) | [source] `wiley-essentials-sb5-ch1.md` (secondary, written by the SB5 author) |
| **Woodcock-Johnson IV** (2014) | One speed test in the GIA: Letter-Pattern Matching (Gs), median g-weight **0.11** of 7 tests. | "GIA cluster score is derived from seven tests; each test represents the best single measure of one of seven broad CHC abilities". Gf + Gc together ≈ 35% of it. | "Gf-Gc Composite", described as "analogous to the Wechsler General Ability Index … developed to remove the influence of working memory (Gwm) and processing speed (Gs)". Reliability .96 vs GIA .97. | [source] `riverside-wj-iv-asb3-gf-gc-composite.md` |
| **ICAR** (open) | None: "None of the items were timed". The authors avoided timed items "in light of potential technical issues resulting from telemetric assessment". | Four item types: Letter & Number Series, 3×3 Matrix Reasoning, Verbal Reasoning, 3D Rotation. α: ICAR16 .81, ICAR60 .93. No IQ norm table is published. | — | [source] `condon-revelle-2014-icar.md` |
| **ICAR licence** | — | "ICAR is intended for academic use exclusively". The item archive is under a "Scientific Use License v1". | **Not usable in an ad-supported app** | [source] `icar-project-site.md`, `psycharchives-icar-items.md` |
| **Screen-based speed tasks** | NIH Toolbox Pattern Comparison: "number of correct items (of a possible 130) completed in 90 s", same/different with two buttons, retest ICC 0.61. Smartphone SDMT: "number of correct responses after a 90-second trial" on participants' own phones, ICC > 0.80, scores rise with practice. | — | — | [source] `carlozzi-2015-nihtb-pattern-comparison.md`, `lam-2022-smartphone-sdmt.md` |

**Do any of them score response time on reasoning items into IQ? No.** In every battery read here, speed reaches the IQ in one of three ways:

- **A separate speed subtest.** Coding and Symbol Search feed the PSI; Letter-Pattern Matching feeds Gs. This weighs 1/7 of the WAIS-5 FSIQ, 2/10 of the WAIS-IV FSIQ, and about 0.11 of the WJ IV GIA.
- **A whole-test time limit scored by number correct** (timed Raven).
- **Item-level limits or bonuses** on a few Wechsler performance subtests, where running out of time means no credit. Bonuses survive on Block Design, a block-construction task. WAIS-IV cut them back and added a score without them.

On a multiple-choice reasoning item, response time is never scored. One study-guide mirror claimed that Arithmetic awards speed bonuses. No publisher source confirmed it, so it is not used here.

There is also a reason not to score time on reasoning items. On Raven items, response time is "strongly negative for easy items and able persons" but "less negative or even positive" for "difficult items and less able persons" [source] `goldhammer-2015-response-time-raven.md`. A single "faster is better" rule would reward guessing on hard items.

## 2. Our five categories against the real domains

| our category (key / pt label) | item type | closest real subtest | domain |
|---|---|---|---|
| `patterns` / Raciocínio visual | 3×3 visual matrix, 4 options | WAIS Matrix Reasoning; Raven; ICAR Matrix Reasoning; SB5 Object Series/Matrices | Fluid reasoning (WAIS FRI / CHC Gf) |
| `matrix` / Lógica numérica | number series ("2, 4, 8, 16, __") | WJ IV Number Series, classed **Gf** and part of both GIA and Gf-Gc; ICAR Letter & Number Series | Fluid / quantitative reasoning |
| `similarities` / Semelhanças | "Em que são parecidos…", 4 options | WAIS Similarities (VCI, in FSIQ and GAI) | Verbal comprehension (Gc) |
| `vocabulary` / Vocabulário | word meaning, 4 options | WAIS Vocabulary (VCI); SB5 Vocabulary (routing); WJ Oral Vocabulary | Gc |
| `comprehension` / Compreensão | "Por que…", 4 options | WAIS Comprehension (secondary VCI subtest) | Gc |

This gives two honest indices: **Raciocínio** (patterns + numeric) and **Verbal** (similarities + vocabulary + comprehension). The Wechsler verbal subtests are open-ended spoken answers ([source] the telepractice table codes them `OE, SPR`). Ours are 4-option recognition items with a 25% guessing floor [measured: all 110 items have 4 options].

**What we cannot measure with today's item types:**

| domain | why not |
|---|---|
| Working memory (WMI, Gwm) | needs material shown and then hidden (digit/letter sequences) |
| Processing speed (PSI, Gs) | needs a dedicated timed task; §3 adds one |
| Visual-spatial (VSI, Gv) | Block Design and Visual Puzzles are construction and rotation tasks; our matrices are fluid reasoning |

So today's score corresponds to a **GAI or Gf-Gc composite**, not an FSIQ. Adding a speed task still leaves WM out. That is one more reason not to fold speed into the headline (§4.5).

## 3. Three ways to "do speed like real tests", and which one

| option | what it measures | cost to build | pause / "sem cronômetro" | main risk |
|---|---|---|---|---|
| **(a) Separate 90 s speed task** (pattern comparison or symbol search, two big buttons) | Processing speed, the construct behind PSI/Gs. The format follows NIH Toolbox Pattern Comparison (90 s, same/different, count correct) and the smartphone SDMT (90 s, taps) | One new screen: instructions, 4 untimed practice items, a 90 s block. Pairs are generated offline from ~16 glyphs drawn with `react-native-svg` primitives, so no asset files. Also: an `AppState` listener, a `speed` field in history, i18n ×3 | Questions stay untimed and pausable. The 90 s block is atomic: if the app leaves the foreground, the block is discarded and restarted with new pairs. Pitch: "sem cronômetro nas questões; uma tarefa opcional de 90 s mede velocidade, à parte" | **No norms for our task**, so its scale is a guess. Practice raises scores on retakes. Phones and touch latency differ (not measured) |
| (b) Per-mode time limit, like timed Raven (~67 s/item gives Rápido 22 min, Normal 44 min, Detalhado 100 min), scored by number correct | Reasoning mixed with speed ("intellectual efficiency") | Low: a countdown and an auto-finish | The clock either stops on pause, so it only caps active time, or keeps running, which breaks pause/resume. Either way it ends "sem cronômetro", the positioning competitor reviews reward (`docs/research/ui-redesign/README.md` §1) | Changes the construct (Tatel: correlations shift by up to ρ̂ = 0.34). Lowers accuracy even when mild (Gonthier: d = 0.35). The 0.55/0.18 constants would no longer apply |
| (c) Per-item time bonus, like Block Design | Accuracy and speed mixed into one number | Low code, but it needs `AppState`-correct timing (today's `timeSpent` counts background time) and per-item thresholds that require data we do not have | Pausing makes the measured times noise | The sign of "fast = good" flips on hard items (Goldhammer), so the bonus rewards guessing. Wechsler keeps bonuses only on a construction task and cut them in WAIS-IV |

**Recommendation: (a).** It is the only option that matches how all the batteries above measure speed. It is also the only one that leaves the questions untimed. [judgement, from the table in §1]

Design of the speed task:

- **Format:** two 3-glyph strings side by side, buttons "Iguais" and "Diferentes", 50% match rate.
- **Duration:** 90 s, as in NIH Toolbox and the smartphone SDMT.
- **Score:** correct − incorrect, with a floor at 0. [judgement] A two-button task otherwise rewards random fast tapping. NIH Toolbox counts correct answers only, but it removed items below 75% accuracy.
- **When:** offered, skippable, after the last question of Normal and Detalhado. Not offered in Rápido.

## 4. Scoring per mode without norms

### 4.1 Why one `RATIO_SPREAD` per mode is not the fix

Reliability rises with test length (Spearman–Brown), r(n) = (n/n₀)·r₀ / (1 + (n/n₀ − 1)·r₀). Error falls with it: SEM = SD·√(1 − r) [source] Harvill, and Lord's rule gives a raw SEM ≈ 0.43·√n, so the error on proportion-correct ≈ 0.43/√n: 0.096 at 20 items, 0.068 at 40, 0.045 at 90.

Real data back the formula. Spearman–Brown predicts ICAR16 → ICAR60 at 0.941, and ICAR60 scores 0.93 [measured from `condon-revelle-2014-icar.md`]. The simulation agrees too: starting from r₃₀ = 0.77, the formula gives 0.69 / 0.82 / 0.91 for 20 / 40 / 90 items, and the simulation gets 0.67 / 0.80 / 0.90.

The problem the CHECKLIST describes ("132 no Rápido e 106 no Completo") is **error, not spread**. A per-mode spread re-centres each mode's population distribution, but it leaves each person's noise unchanged. [simulated] Model: 3PL items, constants from §4.2, persons θ ~ N(0,1), forms drawn from the 2.0× bank.

| same person, two tests | today's formula | `RATIO_SPREAD` per mode | Kelley shrinkage | **EAP** |
|---|---|---|---|---|
| Rápido vs Detalhado: IQs differ by ≥ 15 | 15.0% | 12.3% | 7.4% | **7.0%** |
| Normal vs Detalhado: differ by ≥ 15 | 5.4% | 5.7% | 2.8% | **2.4%** |
| Rápido retaken: differ by ≥ 15 | 26.5% | 22.6% | 6.5% | **11.4%** |
| alternate-form r: Rápido / Normal / Detalhado | 0.67 / 0.80 / 0.90 | same | same | **0.72 / 0.84 / 0.93** |
| population mean IQ, new blueprints | **103.3–103.8** | 99.8–100.4 | 99.8–100.3 | 99.9–100.2 |

The last row shows a second defect. Today's constants are tied to today's difficulty mix, which is about 10% easy. Any of the new blueprints (30% easy) **inflates everyone by about 3.5 points** under the current formula [simulated].

### 4.2 The model: EAP with difficulty labels (an "IRT-like" scorer)

For each answered item *i*, with label difficulty *bᵢ*, the probability of a correct answer is

```
P_i(θ) = c + (1 − c) / (1 + exp(−a·(θ − b_i)))
```

with these constants:

| constant | value | basis |
|---|---|---|
| `c` guessing | **0.25** | [measured] every item has 4 options |
| `a` slope | **1.2** | [simulated calibration] chosen so that today's 30-item test, scored today's way, keeps mean 0.55 and SD 0.18 (fit: 0.551 / 0.184; a = 1.10–1.20 all fit within ±0.005) |
| `b` easy / medium / hard | **−1.1 / −0.1 / +0.9** | same calibration, labels fixed one logit apart [judgement] |
| prior | N(0, 1) | the same "app users ≈ general population" assumption the 0.55/0.18 constants already make |
| grid | θ from −4 to 4, step 0.1 (81 points) | |

The estimate and its uncertainty:

```
post(θ_g) ∝ φ(θ_g) · Π_i [ P_i(θ_g) if correct else 1 − P_i(θ_g) ]
θ̂   = Σ θ_g·post(θ_g)                 (EAP)
PSD  = √( Σ (θ_g − θ̂)²·post(θ_g) )    (posterior SD = standard error)
QI   = clamp(round(100 + 15·θ̂ + ageAdjustment(age)), 55, 145)
```

The percentile is computed from QI exactly as today. The standard-error formula is the same idea as SE(θ) = 1/√I(θ) [source] `hambleton-jones-1993-ncme-ctt-irt.md`.

Why EAP and not a re-tuned ratio:

- It uses the difficulty of the items actually answered, so fallbacks, unequal mixes and interrupted tests are handled without per-mode constants.
- It shrinks short tests toward the mean, which is what a WAIS band "calculated using the Standard Error of Estimation" does. That band is centred on the estimated true score (Harvill eq. 8).
- It returns its own error, which becomes the band.
- It is ~30 lines of pure TypeScript with no dependency, and the scorer stays pure as `ARCHITECTURE.md` requires.

Ceilings follow from honesty: a 20-item test cannot tell 130 from 145. These are golden values for a unit test, computed with the exact blueprint mixes (band = 90% × 1.25):

| answers | Rápido (6/8/6) | Normal (12/16/12) | Detalhado (26/37/27) |
|---|---|---|---|
| all correct | **130** (111–145) | **137** (120–145) | **145** (131–145) |
| easy + medium right, hard wrong | 106 (92–120) | 107 (96–117) | 107 (100–114) |
| only easy right | 84 (69–99) | 82 (71–94) | 81 (72–89) |
| all wrong | **65** (55–82) | **58** (55–73) | **51 → clamped 55** (55–63) |

Band edges are clamped to 55–145, the same range as the score.

If the owner prefers minimal change, Kelley shrinkage on the existing ratio is the alternative. It means three per-mode constants (mean, SD, reliability):

| mode | mean | SD | reliability |
|---|---|---|---|
| Rápido | 0.589 | 0.195 | 0.69 |
| Normal | 0.593 | 0.175 | 0.81 |
| Detalhado | 0.592 | 0.169 | 0.91 |

The score is then QI = 100 + 15·r·(ratio − m)/s. It performs close to EAP (table in §4.1), but it breaks whenever fallbacks change the mix, and it gives no per-person error. [simulated]

### 4.3 The confidence band ("QI estimado 112 ± 8")

Real reports show one. The WAIS-5 report prints a 95% CI and the SEM for every composite. The WISC-IV GAI table offers "90% or 95%". Harvill recommends SEMs that vary with score level, and EAP's PSD already varies that way.

**Display:** "QI estimado **112** · faixa provável **104–120**", where

```
band = θ̂ ± 1.645 × 1.25 × PSD   (90%, widened ×1.25)
```

[simulated] coverage of the true IQ:

| case | Rápido | Normal | Detalhado |
|---|---|---|---|
| model exactly right, ×1.0 | 90% | 91% | 89% |
| model wrong (slopes 25% flatter, each item's difficulty N(0, 0.6) off its label), ×1.0 | 84% | 82% | 77% |
| model wrong, **×1.25** | **92%** | **90%** | **86%** |

The ×1.25 pays for the labels being judgement. Typical half-widths are **±16 (Rápido), ±12 (Normal), ±8–9 (Detalhado)**. For comparison, the WAIS-5 FSIQ band is ±5. The width difference becomes a product argument: "quer uma faixa mais estreita? faça o Detalhado" [judgement].

### 4.4 Index scores: minimum items

A subscore is worth reporting only when it tells more about its domain than the total does. Sinharay's review of 94 subtests (summarised in Benton) found that only 16 added value, and "no instances were found of subtests with less than 20 marks adding value". Benton's rule is "little point in presenting subscores based on less than 30 marks … 50 or even 60 marks may be required" [source] `benton-2012-subscore-marks.md`.

[simulated] alternate-form reliability of the EAP indices:

| index size | Rápido (10 per domain) | Normal (20) | Detalhado (45) |
|---|---|---|---|
| model right | 0.57–0.58 | 0.72 | 0.86 |
| model wrong | 0.45 | 0.62 | 0.79–0.80 |

**Rule:** compute **Verbal** and **Raciocínio** as EAP over that domain's answers only, and show them only when the domain has **≥ 30 answered items**. That means Detalhado only. Rápido and Normal keep the per-category correct counts shown today ("Raciocínio visual 4/6"), with no IQ-scale number per category. Five category-level indices are never shown: 4–27 items each is below every threshold above.

### 4.5 The speed index and the headline

```
Velocidade = 100 + 15 · (score − μ_s) / σ_s
```

- **Provisional constants:** μ_s and σ_s come from the closed-test pilot (12 testers). This is a sanity anchor, not a norm. [judgement]
- **Label:** "experimental".
- **Band:** assume reliability 0.70, between NIH Toolbox's 0.61 and the smartphone SDMT's > 0.80. That gives SEM = 15·√0.3 = 8.2, so ±13.5 at 90%.
- **Headline:** `SPEED_WEIGHT_IN_IQ = 0`. Three reasons:
  1. it keeps the headline the same construct in all three modes;
  2. its scale has no basis yet;
  3. WM is missing anyway, so an "FSIQ" label would overclaim.

If speed is ever folded in, use the composite of correlated standard scores (the Tellegen–Briggs idea named in the WISC-IV report): QI_total = 100 + 15·(w_g·z_g + w_s·z_s)/√(w_g² + w_s² + 2·w_g·w_s·ρ). WAIS-5 weights are w_s : w_g = 1 : 6. ρ is unknown. [derived, no primary source for the exact Tellegen–Briggs formula was read]

## 5. Blueprints and bank

### 5.1 Blueprints (E/M/H = easy/medium/hard) [judgement]

| mode | patterns | numeric (`matrix`) | similarities | vocabulary | comprehension | total E/M/H | reasoning / verbal |
|---|---|---|---|---|---|---|---|
| **Rápido 20** | 2/2/2 | 1/2/1 | 1/2/1 | 1/1/1 | 1/1/1 | 6/8/6 | 10 / 10 |
| **Normal 40** | 4/4/4 | 2/4/2 | 2/3/2 | 2/3/2 | 2/2/2 | 12/16/12 | 20 / 20 |
| **Detalhado 90** | 8/11/8 | 5/8/5 | 4/6/5 | 4/6/5 | 5/6/4 | 26/37/27 | 45 / 45 |

- **Reasoning and verbal are split 50/50**, as in SB5 ("the duplication of all five cognitive factors in both the nonverbal and verbal domains", five subtests each) and close to the WAIS-5 GAI (2 verbal + 3 nonverbal).
- **Difficulty is ~30/40/30 in every mode**, so the modes measure the same range.
- **Patterns keep the largest share of reasoning:** the matrix item type is the classic fluid-reasoning measure, and the bank already has 30 of them.

### 5.2 How big the bank must be

For random selection within a cell, the expected share of items repeated between two tests is k/n: "under completely randomized item selection … the expected value of the between-test overlap is equal to k/n". High-stakes admission testing holds overlap ≤ 15%, which needs n ≥ 6.7k [source] `chen-ankenmann-spray-1999-act-overlap.md`. An entertainment retake is not high-stakes. The owner's 35–50% range for Detalhado is the target here.

The Detalhado cell dominates every cell's requirement. Per cell:

- **random selection:** n ≥ ⌈k / t⌉
- **least-recently-used (LRU):** consecutive overlap = max(0, 2k − n)/k, so n ≥ ⌈(2 − t)·k⌉, and n ≥ 2k gives 0%.

[simulated] Overlap between consecutive tests of the same mode, as mean (p95). For LRU the overlap with the test two before is also shown:

| bank | Rápido random | Normal random | Detalhado random | Detalhado LRU: consecutive / two before |
|---|---|---|---|---|
| today, 110 | 25% (40%) | 48% (57%) | 84% (88%) | 78% / 87% |
| 1.6× Detalhado, 166 | 13% (25%) | 25% (35%) | 56% (62%) | 24% / 78% |
| **2.0× Detalhado, 188** | **12% (25%)** | **22% (33%)** | **49% (56%)** | **0% / 94%** |
| 2.5× Detalhado, 233 | 8% (20%) | 18% (28%) | 39% (46%) | 0% / 44% |

With LRU at 2.0×, Rápido and Normal show **0%** overlap with both of the two previous tests.

**Choice: 2.0× with LRU** [judgement]:

- Even with plain random selection (fresh install, cleared storage) Detalhado stays within the 50% ceiling on average.
- With LRU, consecutive tests share nothing in every mode.
- The cost: Detalhado becomes **two alternate forms**, A then B then A. A third Detalhado repeats the first, in shuffled order.
- Going to 2.5× (+45 items, +14 pattern items = 70 SVGs) removes the alternation (two-before overlap 44%).
- Soft recency weighting was simulated as a cheaper middle ground and lost on the two-before overlap (0.5–0.7, worse than random); see `sim/output.txt`.

### 5.3 Items to add (2.0× the Detalhado blueprint per cell) [measured + simulated]

| category | easy | medium | hard | add | bank after |
|---|---|---|---|---|---|
| patterns | 16 → 16 (**+0**) | 6 → 22 (**+16**) | 8 → 16 (**+8**) | **+24** | 54 |
| numeric (`matrix`) | 3 → 10 (**+7**) | 8 → 16 (**+8**) | 9 → 10 (**+1**) | **+16** | 36 |
| similarities | 2 → 8 (**+6**) | 8 → 12 (**+4**) | 10 → 10 (**+0**) | **+10** | 30 |
| vocabulary | 0 → 8 (**+8**) | 2 → 12 (**+10**) | 18 → 18 (**+0**) | **+18** | 38 |
| comprehension | 2 → 10 (**+8**) | 12 → 12 (**+0**) | 6 → 8 (**+2**) | **+10** | 30 |
| **total** | 23 → 52 (+29) | 36 → 74 (+38) | 51 → 62 (+11) | **+78** | **188** |

What that means in files:

- **Patterns:** 24 new items × (1 question + 4 options) = **120 SVG files**: 24 `NN_q_01.svg` + 96 `NN_a_0[1-4].svg`, numbered 31–54 and registered in `assets/questions/patterns/index.ts`. At today's average of 6.1 KB per SVG [measured: 916 KB / 150] that is about 0.7 MB.
- **Text:** 54 new text items × 3 locales (pt, en, es) = 162 question entries with 4 options each.

Alternatives:

| bank size | new items | new pattern items | new SVG files |
|---|---|---|---|
| 1.6× | 56 | 17 | 85 |
| 2.5× | 123 | 38 | 190 |

### 5.4 What can ship before the bank grows

With today's 110 items, Rápido and Normal work: with LRU, consecutive overlap is 0% for Rápido and 22% for Normal. **Detalhado must wait for the bank**: 84% overlap under random selection, and several cells ask for more items than exist (patterns medium 11 of 6).

### 5.5 Defects found on the way [measured]

1. **Vocabulary easy:** `BLUEPRINT.vocabulary.easy = 1`, but the bank has **0** easy vocabulary items. The fallback fills the slot from vocabulary (2 medium + 18 hard), so it is hard 90% of the time.
2. **Patterns:** `BLUEPRINT.patterns.medium = 6` with exactly 6 medium patterns, so all 6 appear in every test. No easy pattern is ever drawn: **16 of the 30 pattern items (80 of 150 SVGs) never reach a user.**
3. **`timeSpent`** counts time spent with the app in the background (there is no `AppState` handling). It is also dropped at the end: `HistoryItem` does not keep per-answer times, so no data on mode duration exists.
4. **Today's constants are tied to today's mix.** Any blueprint change shifts the mean by about 3.5 points [simulated] (§4.1).
5. **Vocabulary is 18/20 "hard":** a labelling judgement worth re-reading before writing the new items.

---

## Sources

- [WAIS-5 overview brochure (Pearson)](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/wais-5/wais-5-overview-brochure.pdf) — `fetches/pearson-wais5-overview-brochure.md` — WAIS-5 domains, primary-index subtests, the "7-subtest FSIQ", summary indexes (GAI, CPI)
- [WAIS-5 Sample Score Report (Pearson)](https://pearsonassessments.com/content/dam/school/global/clinical/us/assets/wais-5/wais-5-sample-score-report.pdf) — `fetches/pearson-wais5-sample-score-report.md` — 95% CI by Standard Error of Estimation, SEMs; FSIQ/GAI/CPI composition recovered from the sums
- [Introducing the WAIS-IV (Pearson deck)](https://www.pearsonclinical.asia/content/dam/school/global/clinical/us/assets/wais-iv/presentation-introducing-the-wais-iv.pdf) — `fetches/pearson-wais4-introduction.md` — FSIQ from 10 core subtests, GAI = VCI + PRI, fewer time-bonus items, BDN, "Reduce emphasis on time-bonus"
- [WAIS-IV telepractice Table 2 (Pearson)](https://www.pearsonclinical.ca/content/dam/school/global/clinical/us/assets/wais-iv/wais-iv-telepractice-table-2.pdf) — `fetches/pearson-wais4-telepractice-table-2.md` — which subtests have item-level vs task-level time limits; MR has none
- [WISC-IV Technical Report #4.1 — GAI](https://www.pearsonassessments.com/content/dam/school/global/clinical/us/assets/wisc-iv/wisc-iv-technical-report-4-1.pdf) — `fetches/pearson-wisc4-technical-report-4-gai.md` — GAI excludes WM/PS; 90/95% CIs; Tellegen–Briggs approximation and its error
- [Raven's APM product page (Pearson)](https://www.pearsonassessments.com/en-us/Store/Professional-Assessments/Cognition-%26-Neuro/Raven%E2%80%99s-Advanced-Progressive-Matrices/p/100000414.html) — `fetches/pearson-ravens-apm.md` — untimed vs timed use; single raw score → percentile
- [Raven's 2 flyer (Pearson)](https://www.pearsonclinical.asia/content/dam/school/global/clinical/us/assets/ravens-2/ravens-2-flyer.pdf) — `fetches/pearson-ravens-2-flyer.md` — raw score + percentile; timed use "to assess intellectual reasoning"
- [Bilker et al. 2012, Assessment](https://pmc.ncbi.nlm.nih.gov/articles/PMC4410094) — `fetches/bilker-2012-raven-nine-item-short-forms.md` — timed APM "includes a dimension for speed"; 20-min vs untimed r = .75
- [Tatel, Tidler & Ackerman 2022, Intelligence](https://www.gwern.net/doc/iq/2022-tatel.pdf) — `fetches/tatel-2022-raven-speeded-meta-analysis.md` — APM 40 min / 36 items; time limits change construct validity (142 studies)
- [Gonthier 2023, J. Intelligence](https://pmc.ncbi.nlm.nih.gov/articles/PMC10299616/) — `fetches/gonthier-2023-speeded-or-unspeeded.md` — Raven 1938 "cannot be given satisfactorily with a time-limit"; time pressure d = 0.35 accuracy loss
- [Goldhammer, Naumann & Greiff 2015, J. Intelligence](https://api.crossref.org/works/10.3390/jintelligence3010021) — `fetches/goldhammer-2015-response-time-raven.md` — **abstract only**; RT–accuracy relation flips with difficulty
- [Essentials of SB5, ch. 1 (Wiley)](https://catalogimages.wiley.com/images/db/pdf/0471224049.excerpt.pdf) — `fetches/wiley-essentials-sb5-ch1.md` — SB5 has no speed factor; reliabilities of IQ/factors/subtests; abbreviated IQ (secondary)
- [WJ IV Assessment Service Bulletin 3 (Riverside)](https://pages.nelson.com/assessment/pdf/asb3.pdf) — `fetches/riverside-wj-iv-asb3-gf-gc-composite.md` — GIA = 7 tests incl. Letter-Pattern Matching (g-weight ≈ .11); Gf-Gc composite ≈ GAI
- [ICAR project page (TU Dortmund)](https://sms.statistik.tu-dortmund.de/en/research/projects/completed-research-projects/international-cognitive-ability-resource-icar/) — `fetches/icar-project-site.md` — item types; "academic use exclusively"
- [ICAR item archive (PsychArchives)](https://www.psycharchives.org/jspui/handle/20.500.12034/17526) — `fetches/psycharchives-icar-items.md` — Scientific Use License; licence text itself not read
- [Condon & Revelle 2014, Intelligence](https://personality-project.org/revelle/publications/condon.icar.14.pdf) — `fetches/condon-revelle-2014-icar.md` — untimed items; α 16 vs 60 items (Spearman–Brown check); IRT reliability; mean p = .53
- [Carlozzi et al. 2015, Arch. Clin. Neuropsych.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4542749) — `fetches/carlozzi-2015-nihtb-pattern-comparison.md` — 90 s same/different speed task, retest ICC .61
- [Lam et al. 2022, Mult. Scler. J.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8795217) — `fetches/lam-2022-smartphone-sdmt.md` — 90 s tap SDMT on own phones, ICC > .80, practice effects
- [Harvill 1991, NCME module on SEM](https://ncme.org/wp-content/uploads/2025/10/Module-9-Standard-Error-of-Measurement-Harvill-S-1.pdf) — `fetches/harvill-1991-ncme-sem-module.md` — SEM formula; SEM ∝ √n (Lord); band around estimated true score
- [Hambleton & Jones 1993, NCME module on CTT vs IRT](https://ncme.org/wp-content/uploads/2025/10/Module-16-Comparison-of-CTT-and-IRT-Hambleton-J-1.pdf) — `fetches/hambleton-jones-1993-ncme-ctt-irt.md` — 1PL/2PL/3PL; SE(θ) = 1/√I(θ); calibration needs > 500 examinees
- [Benton 2012, Cambridge Assessment](https://www.cambridgeassessment.org.uk/Images/181088-calculating-the-number-of-marks-needed-in-a-subtest-to-make-reporting-subscores-worthwhile.pdf) — `fetches/benton-2012-subscore-marks.md` — minimum items for a subscore (≥ 20 never below, 30 minimum, 50–60 comfortable); cites Sinharay 2010
- [Chen, Ankenmann & Spray 1999, ACT RR 99-5](https://act.org/content/dam/act/unsecured/documents/ACT_RR99-05.pdf) — `fetches/chen-ankenmann-spray-1999-act-overlap.md` — expected overlap = k/n under random selection; 15% high-stakes norm
- The app's own code — `fetches/local-app-code.md` — bank counts, blueprint, scoring constants, `timeSpent` behaviour, SVG counts
- Simulation — `sim/simulate.mjs`, `sim/output.txt` — every [simulated] number above; run `node docs/research/scoring-modes/sim/simulate.mjs` from the repo root (seeded, ~25 s)

Read but not kept as fetches, only through search summaries: Pearson's WAIS-5 brochures for other regions, the Raven's 2 regional listings (French "36 items … 30 minutes", "48 items … 45 minutes", random item selection from a bank), Sinharay 2010 and Haberman 2008 (cited only through Benton), and the Tellegen & Briggs 1967 paper (cited only through the WISC-IV report). Treat any claim from those as unverified.

## What this does not establish

- **No norms, still.** Every IQ number remains a model of an assumed population. The EAP constants were fitted to reproduce today's 0.55 / 0.18, which were themselves assumptions ("Não é um teste normatizado").
- **The difficulty labels are judgement.** The "model wrong" scenario (slopes 25% flatter, item difficulty N(0, 0.6) off its label) is a guess at how wrong they might be, not a measurement. The ×1.25 band factor rests on it.
- **All reliabilities and overlaps marked [simulated] hold under the model.** No real person has taken any of these modes. Real retest data, even from the 12 closed-test testers, would be the first measurement.
- **Index value depends on how strongly Verbal and Raciocínio correlate in our users.** Benton's condition is subscore reliability > true inter-domain correlation, and that correlation was not measured. The ≥ 30-item rule is borrowed from exam data, not intelligence data.
- **The speed task has no norm and no measured reliability on this app.** Device and touch-latency effects were not measured, and μ_s and σ_s are unknown.
- **WAIS-5 composition was recovered arithmetically** from one sample report, not read from the manual. WAIS-5 timing and bonus rules were not found in any public source. Block Design bonus cut-offs, Arithmetic's time limit and any bonus on it, and the time limit of WJ IV Letter-Pattern Matching are unverified.
- **ICAR's licence text was not read.** The "academic use exclusively" line and the licence's name are what rule ICAR out.
- **Goldhammer et al. was read as an abstract only.** Gonthier was read for the first 100k of 216k characters.
- **How long each mode takes is unknown.** The app keeps no durations. Practice effects across retakes (memory of items aside) were not modelled.
- **The age adjustment stays ad hoc.** Real tests norm by age band instead.
- **Untested idea:** ordering items easy → hard within a category, as Raven and the SB5 routing do.

## Verdict

**Speed, "the way real tests do":**

- No question is ever timed, scored by time or given a time bonus. Pause/resume stays as it is.
- Add **one optional 90 s processing-speed task** ("Iguais / Diferentes"), offered after the last question of **Normal** and **Detalhado**.
- The block is atomic and restarts if the app leaves the foreground.
- Score = correct − incorrect.
- Shown as **"Velocidade (experimental)"** with a band, **not** included in the headline (`SPEED_WEIGHT_IN_IQ = 0`).

**Scoring** (`utils/iqCalculator.ts`): replace ratio→z with the EAP of §4.2.

- Constants: `c = 0.25`, `a = 1.2`, `b = {easy: −1.1, medium: −0.1, hard: 0.9}`, prior N(0,1), grid −4..4 step 0.1.
- `QI = clamp(round(100 + 15·θ̂ + ageAdjustment), 55, 145)`, percentile as today.
- **Band** = θ̂ ± 1.645·1.25·PSD, with edges clamped to 55–145. Display "QI estimado N · faixa A–B".
- **Indices** (Verbal = similarities + vocabulary + comprehension; Raciocínio = patterns + numeric): EAP per domain, shown only when the domain has ≥ 30 answered items, i.e. in Detalhado. Otherwise show per-category correct counts as today.
- Unit-test the scorer against the golden values in §4.2: all correct → 130 / 137 / 145; all wrong → 65 / 58 / 51 → clamped 55.

**Modes** (`hooks/useQuestionSelection.ts`, `types/storage.ts`):

- `BLUEPRINTS` per mode exactly as in §5.1.
- Store `mode` in `TestProgress` and `HistoryItem`, along with the band and, in Detalhado, the indices and speed result.
- Selection becomes **least-recently-used within each category × difficulty cell**, random tie-break. A new storage key maps item id → index of the last test that used it. Keep today's fallback.

**Bank:** add **78 items** to reach **188**:

| category | easy | medium | hard | total |
|---|---|---|---|---|
| patterns | +0 | +16 | +8 | **24 → 120 SVG files** |
| numeric | +7 | +8 | +1 | 16 |
| similarities | +6 | +4 | +0 | 10 |
| vocabulary | +8 | +10 | +0 | 18 |
| comprehension | +8 | +0 | +2 | 10 |

The vocabulary row also fixes the 0-easy-vocabulary defect.

**Order:**

1. EAP, Rápido and Normal (with LRU) ship on today's bank.
2. Detalhado ships when the bank reaches 188.
3. The speed task can ship with either; the closed-test pilot sets its provisional μ_s and σ_s.

**Timing hygiene, not scored:**

- Make `timeSpent` pause on `AppState` background.
- Persist each test's active duration in `HistoryItem`, so mode lengths become a measured number instead of a guess.
