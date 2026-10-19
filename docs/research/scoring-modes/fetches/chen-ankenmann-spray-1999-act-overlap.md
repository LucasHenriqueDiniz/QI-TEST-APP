---
tags: [fetch, scoring-modes]
source: https://act.org/content/dam/act/unsecured/documents/ACT_RR99-05.pdf
fetched: 2026-10-19
kind: primary
---

# Chen, Ankenmann & Spray (1999), "Exploring the Relationship Between Item Exposure Rate and Test Overlap Rate in Computerized Adaptive Testing", ACT Research Report 99-5

> Fetched 2026-10-19 · ACT research report; the working-paper version of Chen, Ankenmann & Spray (2003), Journal of Educational Measurement 40(2):129–145. Read for the expected overlap between two tests drawn at random from a bank — the number that sizes our bank. Scanned PDF; text extracted with `pdftotext` (OCR layer, some spacing artefacts, formulas partly garbled).

## What it says

- Abstract: "This paper presents a derivation of an average between-test overlap index as a function of the item exposure index, for fixed-length computerized adaptive tests."
- Definitions: item exposure rate is "the proportion of all CATs in which an item is administered"; average item overlap is "the proportion (or percentage) of items shared by pairs of exams, averaged across all possible pairwise comparisons" (Way, 1998).
- "the sum of the item exposure rates across all items in the pool must equal the fixed test length … Thus, for any given fixed test length and pool size, the average item exposure rate will always be a constant" (r̄ = k/n, k = test length, n = pool size).
- Equation 19: T = (n/k)·S²_r + k/n — "The slope of the straight line … is given by the pool size to fixed test length ratio … and the y-intercept is the reciprocal of this ratio".
- "When there is no variability in the item exposure rates (as would happen if item selection were completely randomized), the large-sample estimate of the average between-test overlap achieves its lowest possible value … Thus, r̄ = k/n is a lower bound for T. Indeed, under completely randomized item selection for fixed-length CATs, the expected value of the between-test overlap is equal to k/n (see the appendix)."
- "item pool size must be at least 6.7 times as large as the fixed test length if the average between-test overlap is not to exceed 15%, as prescribed by Way (1998) for CATs used in college admissions decisions. Limiting the test overlap rate to 10% would require a pool size at least 10 times as large as the fixed test length. However, these ratios are deceiving, because they represent minimal prescriptions based on an assumption of completely randomized item selection."

## What it does not say

- Anything about consecutive retakes by the same person with deliberate exclusion of the previous test's items (the formula assumes independent draws).
- Overlap targets for low-stakes or entertainment tests; the 15% figure is for high-stakes admissions.

## Applied here (derived, not a quote)

With stratified random selection (each category × difficulty cell drawn independently), expected overlap of a cell is k_cell/n_cell, and the whole-test expected overlap is Σ(k_cell²/n_cell) / Σk_cell. Keeping every cell at k/n ≤ t keeps the test at ≤ t.
