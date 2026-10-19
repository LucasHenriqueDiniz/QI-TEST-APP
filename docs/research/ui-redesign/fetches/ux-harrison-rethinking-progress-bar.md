---
tags: [fetch, ui-redesign]
source: https://www.chrisharrison.net/projects/progressbars/ProgBarHarrison.pdf
fetched: 2026-10-19
kind: primary
---

# Rethinking the Progress Bar (Harrison, Amento, Kuznetsov & Bell, UIST '07, pp. 115–118)

> Fetched 2026-10-19 · Original HCI study (author-hosted PDF) on how a progress bar's acceleration/pauses change perceived duration; the paper NN/g's peak–end article cites. Read for the animation curve of the "calculating your result" bar and the count-up/curve-fill reveal.

## What it says

Abstract:

> "Progress bars are prevalent in modern user interfaces. Typically, a linear function is employed such that the progress of the bar is directly proportional to how much work has been completed. However, numerous factors cause progress bars to proceed at non-linear rates. Additionally, humans perceive time in a non-linear way. This paper explores the impact of various progress bar behaviors on user perception of process duration. The results are used to suggest several design considerations that can make progress bars appear faster and ultimately improve users' computing experience."

Method: "The duration of each progress bar was kept at a constant 5.5 seconds to act as a control." ... "We recruited 22 participants from two large computer research labs (14 male, 8 female) with a mean age of approximately 37."

Results:

> "The nine functions clustered cleanly into three groups (Figure 4): three that were perceived as slower than linear, four that were perceived as near linear, and two which were perceived faster than linear."

> "The two functions that were perceived as faster than linear, Power and Fast Power, were both exponential functions, with the fastest progress occurring near the end of the process. Slow Wavy, Fast Wavy and Late Pause, the only functions with pauses near the process conclusion, were all perceived as slower than linear."

> "First, participants perceived progress bars with pauses as taking longer to complete (peak effect). Secondly, accelerating progress was strongly favored. The latter two effects had an exaggerated perceptual impact when located towards the end of the process (end effect)."

> "Participants tended to prefer (i.e., perceive as faster) whichever function they saw first. Of the 990 paired comparisons, the first function was preferred 376 times (38%), the second 262 times (26%), with no preference 352 times (36%)."

Discussion:

> "First, since users seem to have a strong aversion to pauses especially towards the end of an operation, progress bars can be designed to compensate for this behavior. [...] Secondly, progress can be downplayed in the beginning and accelerated towards the end, providing a sense of a rapid conclusion that is highly favored by users in our experiment."

> "Our results suggest that users are most willing to tolerate negative progress behavior (e.g., stalls and inconsistent progress) at the beginning of an operation."

> "In general, processes with known static completion conditions and stable progress are not good candidates – standard progress bars can visualize these effectively and accurately."

## What it does not say

- Only 22 participants, desktop, 5.5-second bars; "It would be interesting to investigate if our findings scale to other durations" (Future Work).
- This is about *system waits*. For questionnaire progress the survey literature shows the opposite pacing (fast-to-slow reduces breakoff — `ux-survey-progress-meta-analysis.md`, `ux-survey-progress-conrad-2010.md`). The two must not be conflated: accelerate-to-end fits the "calculating" interstitial; it does not fit the 30-question bar.
- Nothing about count-up numbers specifically; applying "accelerating toward the end / no stall at the end" to a score count-up is an inference (and a count-up that decelerates into the final number is the opposite shape — untested here).
