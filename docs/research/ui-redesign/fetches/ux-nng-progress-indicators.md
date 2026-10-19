---
tags: [fetch, ui-redesign]
source: https://www.nngroup.com/articles/progress-indicators/
fetched: 2026-10-19
kind: secondary
---

# Progress Indicators Make a Slow System Less Insufferable (NN/g, Katie Sherwin, 2014-10-26)

> Fetched 2026-10-19 · NN/g guidance on wait animations vs percent-done indicators and step counts; read for the "calculating result" interstitial and for the in-test progress display. Contains a parenthetical on survey progress bars.

## What it says

> "Users experience higher satisfaction with a site and are willing to wait longer when the site uses a dynamic progress indicator."

> "They can reduce users' perception of time: Users devote some cognitive resources to the feedback itself, and they pay less attention to the wait itself."

> "The researchers found that the people who saw the moving feedback bar experienced higher satisfaction and were willing to wait on average 3 times longer than those who did not see any progress indicators."

> "Immediately, the system should give some visual feedback to communicate that it has received the request. For example, a button may change to state to look "pressed", or the page may begin to refresh. Without any visual change from the system, most users will assume the action was not registered and they will try again."

> "Use a progress indicator for any action that takes longer than about 1.0 second."

> "For anything that takes less than 1 second to load, it is distracting to use a looped animation, because users cannot keep up with what happened and might feel anxious about whatever flashed on the screen."

> "It can also be helpful to add additional clarity for the user by including text that explains why the user is waiting (e.g., "Loading comments…")."

> "A percent-done indicator makes users develop an expectation for how fast the action is being processed. As a result, changes in speed will be noticed and will impact user satisfaction: if the progress moves quickly only to hang on the last percentage remaining, the user will become frustrated and the benefits of showing progress will be negated."

> "Start the progressive animation slower and allow it to move faster as it approaches the end. [...] (Note that this slow-fast recommendation only applies to wait-animations; research has shown that for surveys, progress indicators that start fast and end slow reduce drop-off rates.)"

> "Instead of showing a percentage number, consider showing the number of steps. Users might not know how long each step lasts, but knowing the number of steps at least helps them form an estimate."

> "Avoid using static progress indicators, which do not give enough feedback about the status of the action."

> "Use simple and fun animations that are related to the main activity, as they are most likely to hold users' attention and reduce the perception of wait time."

## What it does not say

- The 2014 article is about system waits, not questionnaires; the survey claim is one parenthetical without a citation on the page (the meta-analysis is in `ux-survey-progress-meta-analysis.md`).
- Nothing about *intentional* delays before a result; it assumes the wait is real.
- The "3 times longer" figure is a single study (University of Nebraska-Lincoln; reference listed as Nah 2004).
