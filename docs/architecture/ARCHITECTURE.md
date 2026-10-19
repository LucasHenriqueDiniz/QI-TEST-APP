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

### D5 — Short store descriptions do not say "grátis"

**Context.** Google's binding Metadata policy forbids price words only in the
title, icon, developer name and screenshots, but its store-listing best
practices also say not to use "free" in descriptions
(`docs/research/ui-redesign/fetches/store-play-listing-best-practices.md`).

**Decision.** The three short descriptions lead with the content and "full
result, no sign-up" instead of "grátis/gratis/Free". Decided 2026-10-19.

**Rules out.** Price wording in short descriptions and screenshot captions.
The full descriptions still mention that nothing is paywalled.

### D4 — Answer review waits for the closed test

**Context.** Answer review is the most requested feature in competitor reviews
(`docs/research/ui-redesign/README.md` §5.7), but it changes the stored
history schema and is worth most once explanations are written.

**Decision.** Not part of the UI redesign; it is built during the 14-day closed
test, alongside the 15/30/60 modes. Decided 2026-10-19.

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
