---
tags: [fetch, scoring-modes]
source: https://ncme.org/wp-content/uploads/2025/10/Module-16-Comparison-of-CTT-and-IRT-Hambleton-J-1.pdf
fetched: 2026-10-19
kind: primary
---

# Hambleton & Jones (1993), "Comparison of Classical Test Theory and Item Response Theory and Their Applications to Test Development", NCME Instructional Module 16, Educational Measurement: Issues and Practice 12(3):38–47

> Fetched 2026-10-19 · NCME teaching module. Read for the IRT models (1PL/Rasch, 2PL, 3PL with guessing), the test information → standard error relation, and the sample size IRT needs to calibrate items — the reason a Rasch model with *assumed* difficulties is the most this app can do. Scanned PDF; text extracted with `pdftotext`.

## What it says

- Three-parameter logistic model: "The c parameter in the model is the height of the lower asymptote of the ICC and is introduced into the model to account for the performance of low-ability examinees on multiple-choice test items. … The b parameter is the point on the ability scale where an examinee has a (1 + c)/2 probability of a correct answer. The a parameter is proportional to the slope of the ICC … Simpler logistic test models can be obtained by setting c_i = 0 (the two-parameter model) or setting c_i = 0 and a_i = 1 (the one-parameter model)."
- "Georg Rasch (1960) published a book describing several item response models … Rasch model (or the one-parameter logistic model)".
- Test information: "the concept of a test information function, denoted I(θ). It is the sum of item information functions in a test and provides estimates of the errors associated with (maximum likelihood) ability estimation, specifically, SE(θ) = 1 / [I(θ)]^½. This means that the more information provided by a test at a particular ability level, the smaller the errors associated with ability estimation."
- "when all items are equally discriminating (such as in the Rasch model) … as P_i increases b_i decreases" (proportion correct and IRT difficulty are monotonically related).
- Comparison table, sample size for item parameter estimation: classical "200 to 500 (in general)"; IRT "Depends on the IRT model but larger samples, i.e., over 500, in general, are needed".
- "test developers do not need a representative sample of the examinee population to calibrate test items. They do, however, need a heterogeneous and large examinee sample to insure proper item parameter estimation."

## What it does not say

- How to use IRT with no calibration sample at all. With only easy/medium/hard labels, item b values are assumptions, not estimates; the SE formula still describes precision *if* the assumed values were right.
