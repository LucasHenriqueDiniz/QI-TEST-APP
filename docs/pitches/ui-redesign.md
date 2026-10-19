---
tags: [pitch, area/frontend, ui-redesign]
status: accepted
date: 2026-10-19
research: docs/research/ui-redesign/README.md
---

# UI redesign before the first store release

## Problem

The app works end to end on a real device (Galaxy A15, Android 16: 30/30
questions, both ad formats, history, themes), but it looks like a form:
equal-weight cards, one violet, no motion, a text-only share. In the Brazilian
IQ-test niche nobody has a premium look, and the best-rated apps win on two
things this app already does and does not show: a **free, complete result**
and **no ads inside the test**
([research §1](../research/ui-redesign/README.md#1-competitors)).

Who has the problem: a first-time user deciding in seconds whether to install
(store screenshots) and then whether to finish 30 questions; the owner, whose
revenue depends on finished tests (the interstitial) and on shares (installs).

Measured defects the redesign must remove, not just restyle
([research §3](../research/ui-redesign/README.md#3-what-is-wrong-today-measured)):

| defect | today |
|---|---|
| pattern question needs scrolling to compare matrix and options | 178 dp overflow on 384×832 dp |
| faint text and option outlines fail contrast | `textFaint` 3.60:1 dark / 2.85:1 light; outlines 1.31:1 |
| banner sits between the options and "Confirmar", collapses until loaded, then shifts the button | ad-policy "adjacent"/"shifting content" cases |
| last tap jumps straight into a full-screen ad | no transition, close button after ~3 s |
| share is plain text | no image to post |
| button haptics use Vibrator waveforms | Android discourages them |
| store screenshots cannot be uploaded | 2.17:1, Play caps at 2:1 |

## Solution

Redesign every screen against the per-screen targets in the research note,
in this order: **design system → Results + share card → Test (pattern) →
Test (text) → finish moment → Home → History → Settings / About**. Each step ships alone and is checked on the A15 before the next.

Shape it implies:

- **Design system first** (`constants/theme.ts`, `components/ui/*`,
  new `utils/haptics.ts`): contrast-fixed colour tokens, a gradient brand,
  per-category colours, a `score` type style with tabular digits, M3 Expressive
  spring tokens with `mass: 1` (verified: Reanimated 4.5.1's default
  `withSpring` config is `GentleSpringConfig`, mass 4), action-based haptics via
  `performAndroidHapticsAsync` (present in expo-haptics 57.0.3), and new
  components: `OptionCard`, `FigureOption`, `SegmentedProgress`, `TopBar`,
  `ScoreCountUp`, `BellCurve`, `CategoryBars`, `AdSlot` v2.
- **Motion budget**: transform and opacity only; no blur, Lottie or Skia;
  one hero moment (the result reveal).
- **New route** `app/finishing.tsx` between the last answer and Results:
  ~2 s "calculating" screen with no banner, then the pre-loaded interstitial,
  then the result.

## Interfaces it touches

- Storage schema: `types/storage.ts` gains the total test time (for the
  Results strip and History). Old entries without it keep working.
- Ads: `components/ui/AdSlot.tsx` (fixed height, gap, one per screen) and
  `hooks/useGatedInterstitial.ts` (shown from `/finishing`, never after
  Results renders). Ad unit IDs and the consent flow do not change.
- New native modules (each means a new dev build and a new store binary):
  `react-native-view-shot` + `expo-sharing` for the share image,
  `expo-store-review` for the in-app review prompt.
- Translations: every new string in the three files of
  `assets/i18n/translations/`.

## Scope

**In:** the steps above, the share card, the haptics switch in Settings,
store screenshots composed at 1080×1920 in pt-BR, es-419 and en-US after the
redesign lands.

**Out:** answer review and per-question explanations (D4: built during the
closed test), test modes 15/30/60 (planned in `store/CHECKLIST.md` §6
for the 14-day closed test), onboarding/intro screen (rejected in research
§5.11), streaks/badges, iOS-specific work, any paywall.

## Decisions (settled 2026-10-19)

Recorded in `docs/architecture/ARCHITECTURE.md`:

| # | question | decision |
|---|---|---|
| D2 | banner on the test screen | kept, bottom edge below the button, 24 dp gap, fixed height |
| D3 | interstitial placement | before Results, behind `/finishing` with a disclosure line |
| D4 | answer review | after this redesign, during the closed test |
| D5 | "grátis" in store copy | removed from the three short descriptions (done in the Play Console) |

Plan: `docs/plans/ui-redesign/`.

## How it gets tested

Every step is verified on the A15 with the dev build and the USB harness used
on 2026-10-19 (`adb` screenshots, `uiautomator` taps, a script that answers all
30 questions), not by `tsc` alone. Success is the research's per-screen
"Verify" lines, with these as the release gate:

| check | pass |
|---|---|
| pattern items p01–p30 show matrix + 4 options + button without scroll | 30/30 |
| longest text question in pt, en, es fits without scroll | 3/3 |
| button y position while the banner loads (frame compare) | unchanged |
| contrast pairs in research DS-1, both themes | all ≥ 4.5:1 text, ≥ 3:1 graphics |
| result reveal on a release build, perf monitor | UI and JS ≥ 55 fps |
| share image | 1080×1920 PNG < 500 KB, score legible in a WhatsApp thumbnail |
| airplane mode at finish | Results within ~2 s, no blank state |
| force-quit during the interstitial | result present in History |
| "Remove animations" on | final states appear immediately |

A step whose check was not run on the device is not done.
