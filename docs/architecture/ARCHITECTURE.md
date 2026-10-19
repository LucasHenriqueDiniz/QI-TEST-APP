---
tags:
  - architecture
  - status/active
---

# Architecture — Teste de QI

## The shape

An Expo SDK 57 app (React Native 0.86, expo-router), Android first, fully
offline except for ads. No backend; everything the user produces stays in
AsyncStorage on the device.

```
app/             screens, one file per route (expo-router)
components/      PatternQuestion, AboutSheet, ThemedText
components/ui/   design-system primitives (Button, Card, Screen, AdSlot, ScoreCurve…)
constants/       theme tokens, ad unit resolution, app constants
context/         ThemeContext (light/dark/system), AdsContext (UMP consent + SDK init)
data/            question metadata (category, weight, difficulty, correct answer)
hooks/           question selection, storage, gated interstitial
utils/           IQ scoring
assets/i18n/     pt, en, es strings and question texts
plugins/         withKotlinMetadataCheck (required for the AdMob native build)
store/           Play Store material: listings, graphics, privacy page, CHECKLIST
```

## Ports

None. A single-device app with no backend has one external system (AdMob),
reached through `react-native-google-mobile-ads` directly; see Divergences.

## Decisions

### D9 — The first release waits for the bank and ships all three modes

**Context.** Rápido and Normal work with today's 110 items; Detalhado needs the
bank at 188 or two consecutive 90-question tests overlap by 84%
(`docs/research/scoring-modes/README.md`). Shipping the closed test earlier
would start the 14-day clock sooner.

**Decision.** The closed-testing release waits until the bank reaches 188
reviewed items and ships Rápido, Normal and Detalhado together. Decided
2026-10-19.

**Rules out.** A "Detalhado em breve" placeholder in the first build.

### D8 — Modes of 20 / 40 / 90 on a bank of 188 items

**Context.** One 30-question test drew all 6 medium pattern items every time
and never an easy one; the owner wants short, normal and detailed tests.

**Decision.** Rápido 20, Normal 40, Detalhado 90 with the per-category ×
difficulty blueprints of the scoring-modes research; the bank grows from 110
to 188 (+54 text items in three languages, +24 pattern items = 120 SVGs);
selection prefers the least recently used items in each cell. Decided
2026-10-19.

**Rules out.** The 15/30/60 plan in `store/CHECKLIST.md` §6, and a 90 mode on
today's bank. Consecutive Detalhado tests alternate between two forms (the
third repeats the first); a 233-item bank would remove that.

### D7 — Speed is a separate, optional 90 s task, not a timer on questions

**Context.** No major battery scores response time on reasoning items; speed
enters through dedicated timed subtests (WAIS Coding / Symbol Search) or a
whole-test time limit. The app's questions are untimed and pausable.

**Decision.** An optional 90 s "Iguais ou diferentes?" task at the end of
Normal and Detalhado, scored correct − wrong, restarted if the app leaves the
foreground, reported as "Velocidade (experimental)" outside the main IQ.
Decided 2026-10-19.

**Rules out.** Timers on questions, time bonuses, and speed inside the main IQ.

### D6 — IRT-style (EAP) scoring with a shown band

**Context.** The ratio → z formula is tied to today's 30-item difficulty mix:
on the new blueprints it inflates everyone by ~3.5 points, and short tests
swing too much (seeded simulation in the research).

**Decision.** An EAP estimator with c = 0.25, a = 1.2, b = −1.1 / −0.1 / +0.9 for
easy / medium / hard, calibrated so the old 30-item test keeps its mean and
spread; Results shows "QI estimado N · faixa A–B" (90% band widened ×1.25).
Verbal and Raciocínio index scores only in Detalhado (≥ 30 items per domain).
The score is a GAI-like composite, not a full-scale IQ. Decided 2026-10-19.

**Rules out.** A bare point score, and index scores from fewer than 30 items.

### D5 — Short store descriptions do not say "grátis"

**Context.** Google's binding Metadata policy forbids price words only in the
title, icon, developer name and screenshots, but its store-listing best
practices also say not to use "free" in descriptions
(`docs/research/ui-redesign/fetches/store-play-listing-best-practices.md`).

**Decision.** The three short descriptions lead with the content and "full
result, no sign-up" instead of "grátis/gratis/Free". Decided 2026-10-19.

**Rules out.** Price wording in short descriptions and screenshot captions.
The full descriptions still mention that nothing is paywalled.

### D4 — Answer review waits for the closed test (modes part superseded by D8)

**Context.** Answer review is the most requested feature in competitor reviews
(`docs/research/ui-redesign/README.md` §5.7), but it changes the stored
history schema and is worth most once explanations are written.

**Decision.** Not part of the UI redesign; it is built during the 14-day closed
test. Decided 2026-10-19. The modes it mentioned moved before the release
(D8).

**Rules out.** Persisting chosen answers in this redesign, and the "Revise cada
resposta" store screenshot for the first listing.

### D3 — The interstitial plays before Results, behind a finish screen

**Context.** AdMob recommends the interstitial before the break page; Play's ads
policy calls an ad between a button tap and its action disruptive and gives
"after the score screen" as its safe example; showing it after the score loses
most impressions because people leave once they see the number.

**Decision.** The last answer opens `/finishing` (~2 s, no banner, a line saying
an ad comes next), then the pre-loaded interstitial, then Results. If the ad is
not loaded, Results comes straight after the finish screen. Decided 2026-10-19.

**Rules out.** An ad after Results has rendered, an ad with no announcement,
and loading the ad on demand at the finish.

### D2 — The banner stays on the test screen, mitigated

**Context.** The banner sits next to "Confirmar", the case Google's publisher
policy calls adjacent to action items; it also collapses until loaded and
shifts the button. Removing it from the test screen is the only zero-risk
option and costs most banner impressions, since a test lasts minutes.

**Decision.** Keep it, anchored at the bottom edge below the primary button,
with a 24 dp non-interactive gap and a reserved fixed height so loading never
moves the layout. Decided 2026-10-19.

**Rules out.** A banner between content and the primary button, and any banner
that changes the layout when it loads. Still a policy risk; see Known gaps.

### D1 — The declared audience is 16+

**Context.** Declaring 13–15 makes Play apply the Families policy where under-16
users count as children (EU), which requires child-appropriate, lower-paying
ads for those users.

**Decision.** Target audience 16–17 and 18+ in the Play Console. Decided
2026-10-19.

**Rules out.** Child-directed ad treatment and Families-policy obligations.

## Divergences from the house style

| what | house style says | here | why |
|---|---|---|---|
| no hexagon | ports and adapters around a deterministic core | screens call storage, ads and scoring directly | a one-screen-at-a-time offline app with one SDK; the scoring core (`utils/iqCalculator.ts`) is already pure |
| store docs in Portuguese | everything in the repo in English | `store/*.md` and app comments are pt-BR | written for the Brazilian listing before the house style was adopted; new docs are English |

## Known gaps

- [ ] No automated tests; correctness is checked by `tsc`, `expo export` and a
      device run over USB. The device harness still lives outside the repo
      (`docs/plans/ui-redesign/slice-00-device-harness.md` brings it in).
- [ ] D2 is a mitigation, not a removal: Google gives no minimum distance.
- [ ] Contrast fails in three token pairs (`textFaint`, primary text on dark,
      option outlines); fixed by `docs/plans/ui-redesign/slice-01-*`.
