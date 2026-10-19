---
tags: [fetch, scoring-modes]
source: https://ncme.org/wp-content/uploads/2025/10/Module-9-Standard-Error-of-Measurement-Harvill-S-1.pdf
fetched: 2026-10-19
kind: primary
---

# Harvill (1991), "An NCME Instructional Module on Standard Error of Measurement", Educational Measurement: Issues and Practice 10(2):33–41

> Fetched 2026-10-19 · NCME's own teaching module (ITEMS series). Read for the SEM formula, how SEM scales with the number of items (Lord, 1959), and how to build a confidence band around an obtained score — the method behind the "Standard Error of Estimation" bands in the WAIS-5 report. Scanned PDF; text extracted with `pdftotext` (some OCR noise in formulas, restored below from the surrounding prose).

## What it says

- "The standard error of measurement (SEM) is the standard deviation of errors of measurement that are associated with test scores from a particular group of examinees. When used to calculate confidence bands around obtained test scores, it can be helpful in expressing the unreliability of individual test scores in an understandable way"
- "It is recommended that SEMs at various score levels be used in calculating score bands rather than a single SEM value."
- Equation 6: SEM = S_x·√(1 − r_xx'). "subtract the test reliability from one, take the square root of that difference, and multiply the square root value times the standard deviation of the test scores."
- On test length: "Lord (1959) determined empirically that the SEM was directly proportional to the square root of the number of items on the test (√n). The correlation between SEM and √n was 0.996. These findings were based on 50 objective tests of aptitude and achievement of moderate difficulty. … A good approximation for the SEM would be: SEM ≈ 0.432 √n." (KR-21: 0.478 √n.) "To get a rough approximation for the SEM of a moderately difficult test … multiply the square root of the number of test items by 0.45. If the test is an easy one, with an average score of approximately 90 percent, the multiplier should be closer to 0.3."
- Feldt, Steffan & Gupta (1985): SEM in raw-score units "reached a peak in the middle of the score range … The maximum was often more than twice the minimum."
- Score bands: "Score bands are sometimes called confidence intervals or confidence bands"; 68% = ±1 SEM, 95% = ±1.96, 99% = ±2.58.
- Band around an obtained score to estimate the true score (Gulliksen, 1950), Equation 8: [X̄ + r_xx'(X − X̄)] ± z·S_x·√(1 − r_xx')·√r_xx'. "The center for this score band is the estimated true score … not [the] obtained score … Since the obtained score was above the mean, the true score is assumed to be shifted toward the mean because the test is not completely reliable."
- Worked example: mean 73, SD 9, α 0.93, obtained 79 → "78.6 ± 2.3".

## What it does not say

- Anything about IRT-based standard errors (it is a classical-test-theory module).

## Applied here (derived, not a quote)

Lord's rule in raw units (SEM ≈ 0.43√n) is, in proportion-correct units, SEM_p ≈ 0.43/√n: 0.096 at n = 20, 0.068 at n = 40, 0.045 at n = 90.
