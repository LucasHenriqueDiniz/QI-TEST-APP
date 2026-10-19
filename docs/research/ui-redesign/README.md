---
tags: [research, area/frontend, ui-redesign]
status: active
decided: 2026-10-19
---

# What should each screen of Teste de QI look like to win store installs and finished tests?

> Verdict: land the shared design-system pieces first (tokens, motion, haptics, option card, segmented progress, ad slot), then redesign **Results + share card**, **Test (pattern)**, **Test (text)**, the **finish moment**, **Home**, **History + answer review**, and leave **Settings / About** for last.

## What was blocking

The app works but looks like a form: equal-weight cards, one violet, no motion story, a text-only share. Before publishing, a later session will redesign every screen. It needs, per screen, a concrete target grounded in what the market does, what keeps people going through 30 questions, what the ad policies allow around a test, and what a Galaxy A15 can animate.

## How to read this

| tag | meaning |
|---|---|
| **[measured]** | produced here from the app's code and its screenshots: WCAG contrast computed with the standard formula; layout budget measured on the A15 screenshots (1080×2340 px = 384×832 dp, 2.8125 px/dp) and from the component code |
| **[source]** | a quoted page in `fetches/`, named inline |
| **[judgement]** | a design call; the evidence that motivated it is named when there is one |

Screenshots were read from the session's `shots/` folder (A15, dark and light) and `p02-about.png`. Two things in them are already stale in code: the home brand mark is now the grid icon (`assets/images/brand-mark.png`), and "Limítrofe" is now "Abaixo da média" (`assets/i18n/translations/pt.ts`). The round gear button on every screenshot and the "Error gathering ads consent" toast are dev-build artefacts (the gear is drawn above the About modal's scrim in `p02-about.png`), not app UI.

## 1. Competitors

Top results for "teste de QI", "QI" (BR) and "IQ test" (US), plus two design benchmarks. Ratings are BR / US because Play shows a per-region average for the same package. Review themes are keyword counts over up to 199 reviews per star level, so they are indicative.

| app | rating · installs | money | question screen | result screen | users praise | users complain | fetch |
|---|---|---|---|---|---|---|---|
| Teste de QI (Paul Stelzer), #1 "teste de QI" BR | 4,3 · 1M+ | ads + Pro; explanations Pro-only | stimulus card, 2×2 big tiles, no timer, pausable | burgundy card, big "122", "melhor que 76.8%", bell curve, share | per-area breakdown, realism | result/explanations gated by pay or ads; "01 vídeo a cada questão" | `play-stelzer`, `reviews-stelzer` |
| Teste de QI: Raciocínio Lógico (Trasco), #1 "QI" BR | 4,7 · 1M+ (35.5K ratings) | ads + coins + IAP | countdown, "8/40", matrix card, 3×2 tiles, explanation per question | gauge "QI ESTIMADO 128", "ACIMA DA MÉDIA" pill, 70–130 bar, stat tiles | explanations, variety | ads (27% pt / 40% en of 1–2★) | `play-trasco`, `reviews-trasco` |
| Teste de QI (Digerati), largest | 4,4 · 5M+ | ads only | dark chalkboard, 3×3 matrix, 4×2 options, timer | big gold "121", bell curve with σ bands, answer review | honest caveats, free | no pause/save (142 helpful), mid-test ads | `play-digerati`, `reviews-digerati` |
| What's my IQ? (Klikapp) | 4,2 · 1M+ | ads + Premium; certificate behind ads | steampunk parchment, 4×2 wooden tiles, countdown | "YOUR IQ SCORE IS: 137", bell curve, celebrity comparison, certificate | free score | pay for results; 3 ads for certificate | `play-klikapp`, `reviews-klikapp` |
| IQ Test (Online Tools Store) | 4,3 · 500K+ | ads + IAP | web-like, timer "29:58", 3×2 options | "Your real IQ score is: 124" | instant result | card/paywall after the test (238 helpful) | `play-onlinetools`, `reviews-onlinetools` |
| IQlab | 4,3 · 10K+ | no ads, subscription | iOS-style stacked list | free result only after 24 h | clean, simple | 24 h wait pushes subscription | `play-iqlab`, `reviews-iqlab` |
| Brainova | 4,8 · 1M+ | ads + subscription | mini-game cards | percentile dashboard, streak | simplicity | ads (~47% of 1–2★), clinical labels ("nível de tdah") | `play-brainova`, `reviews-brainova` |
| Elevate (benchmark) | 4,7 · 10M+ | subscription | one prompt per screen, big type | score + per-skill bars | visual/sound design | paywall; English-only (44–48% of pt reviews) | `play-elevate`, `reviews-elevate` |
| Lumosity (benchmark) | 4,9 · 10M+ | Premium, fully pt-BR | illustrated games | insight cards, ranked bars | layout, "0 ads" | Premium gating | `play-lumosity`, `reviews-lumosity` |

What the best-rated IQ apps do that the rest do not [source: the review and listing fetches above]:

- **The result is the trust test.** Every app that gates the score, the answers or a certificate behind payment, ads or a wait is punished for it in 1★ reviews; "o teste de QI não é pago" and "Instant results… no subscription" are praise. Reclame Aqui already carries "US$1 → US$39.99" complaints about web IQ funnels (`search-reclameaqui-teste-de-qi.md`).
- **Ads inside the test are the top complaint** for ad-funded apps; a Digerati user asks to "put them at the start or then end to see your results".
- **Explanations / answer review are the most requested feature**, even in 5★ reviews; Trasco's second screenshot caption is "TODAS AS RESPOSTAS EXPLICADAS".
- **Honesty is rewarded**: "os resultados são aproximados", "não substitui uma avaliação psicológica".
- **Pause/resume matters**: countdowns and lost progress draw 100+ helpful complaints.
- **Brazilians notice bad localisation**: six of the profiled apps show English or European-Portuguese screenshots on the BR listing.
- **Nobody in the IQ niche has premium design.** Visual noise (skeuomorphic textures, neon AI art, "gacha" sounds) draws complaints during a concentration task. The design-praised apps (Elevate, Lumosity) are calm, big-type, one-thing-per-screen.

**Position this app takes from that:** free full result, no ad inside the test, pausable, offline, native pt-BR, and the cleanest premium look in the niche. The redesign must surface the free result, no signup and no timer on Home, the rest in the store screenshots, and must not add anything that looks like a gate.

## 2. Patterns that matter most

| # | pattern | what it means here | evidence |
|---|---|---|---|
| P1 | **The free, honest result is the product** | Results is never gated, never delayed beyond the finish moment, always labelled "estimado", disclaimer kept one line | competitor reviews (§1); `store-play-listing-best-practices.md` ("for entertainment purposes" disclaimer "doesn't exempt" misleading claims) |
| P2 | **Show the structure, keep the bar quiet, encourage at section breaks** | 3 segments of 10, step count "12/30", short milestone at 10 and 20, "faltam N" in the last stretch. Never fake the pace | Villar meta-analysis: constant bar no effect (LOR 0.072, p = .365), slow-early bar raises drop-off, deceptive fast-to-slow "questionable in its ethics" (`ux-survey-progress-meta-analysis.md`); Conrad: feedback "only at section transitions" gave breakoff "either intermediate or lowest", always-on "intensifies" early feedback, structure-explicit indicators improve estimates (`ux-survey-progress-conrad-2010.md`); goal-gradient (`ux-goal-gradient-kivetz.md`) |
| P3 | **Every tap answers within ~100 ms, with action-based haptics** | selection pop ≤ 120 ms, `SEGMENT_TICK` on choice, `CONFIRM` on commit; no Vibrator waveforms | NN/g: simple feedback "roughly 100 ms" (`ux-nng-animation-duration.md`), microinteractions (`ux-nng-microinteractions.md`); Android: "strongly discourage… createOneshot or createWaveform", "choose no haptics" over buzzy ones (`ux-android-haptic-feedback.md`, `ux-android-haptics-principles.md`); installed API (`local-expo-haptics.md`) |
| P4 | **A short "calculating" beat that shows real steps, then the ad, then the result** | ~2 s screen listing the 5 areas being scored; no banner on it; interstitial only if pre-loaded | labor illusion (`ux-labor-illusion-buell-norton.md`); AdMob: insert "a loading or please wait screen" before an interstitial in tap-heavy flows, pre-load, never after page load (`policy-admob-recommended-interstitials.md`, `policy-admob-disallowed-interstitials.md`); M3 loading indicator for 200 ms–5 s (`ux-m3-loading-indicator.md`) |
| P5 | **One hero moment: the reveal** | count-up, curve sweep to the marker, haptic in sync, confetti only for a personal best | M3 Expressive: "Stick to one or two hero moments" (`ux-m3-expressive-blog.md`); peak–end (`ux-nng-peak-end-rule.md`); Spotify builds data-driven reveals natively (`ux-spotify-wrapped-animation.md`) |
| P6 | **A share image that flatters the sender** | 1080×1920 card via the Android Sharesheet; lead with the score, or with the strongest area when the score is modest | Berger & Milkman: positive content shared for self-presentation (`ux-berger-milkman-virality.md`); Duolingo milestone share card (`ux-duolingo-streak-milestone.md`); Sharesheet (`ux-android-sharesheet.md`); Instagram 9:16, min 720×1280; direct Stories needs a Facebook App ID (`ux-instagram-sharing-to-stories.md`); 87.3% of BR adults on Instagram (`ux-datareportal-brazil-2026.md`) |
| P7 | **Expressive, but familiar** | bigger primary action, colour, rounder shapes, spring motion; keep standard lists and grids, keep text labels | M3 Expressive research: key elements spotted "up to four times faster"; broken paradigms and removed labels hurt usability (`ux-m3-expressive-research.md`); spring tokens (`ux-m3-motion-physics.md`, `ux-m3-motion-tokens-source.md`) |
| P8 | **Ads never touch the task** | banner below the primary button with a non-clickable gap, fixed reserved height, one instance per screen; nothing on the calculating screen | Publisher Policies: no ads "adjacent to navigational or other action items" (`policy-publisher-ads-interfering.md`); "allocate a fixed space" (`policy-admob-recommended-banners.md`); "do not cover or shift the other content", 60 s refresh (`policy-admob-implementation-guidance.md`); no ads on behavioural screens (`policy-publisher-screens-without-content.md`) |

Gamification beyond this (badges, streaks, points) is left out on purpose: the meta-analysis finds small, unstable effects on motivation (`ux-gamification-meta-analysis.md`) and a streak is a daily-habit mechanic that does not fit a one-shot test.

## 3. What is wrong today, measured

| finding | number | where |
|---|---|---|
| Pattern question does not fit: matrix + 4 options need scrolling | content 664 dp vs viewport 486 dp → **178 dp overflow** (square 162 dp cells hold a 1.65:1 figure) | `components/PatternQuestion.tsx`, `09/10-pattern-*.png` [measured] |
| Faint text fails AA | dark `textFaint` 3.60:1 on surface, light 2.85:1 on white (overlines, disclaimer, labels) | `constants/theme.ts` [measured] |
| Primary-coloured text fails on dark | `#6E63F0` on surface 3.96:1; category pill text 3.49:1 | [measured] |
| Option outlines invisible | border vs surface 1.31:1 dark, 1.18:1 light (needs 3:1, `ux-wcag-non-text-contrast.md`) | [measured] |
| Banner sits between the options and "Confirmar", 10 dp from the button | textbook "adjacent" + "sandwiched" case | `app/test.tsx` footer, `policy-admob-discouraged-banners.md` |
| Banner collapses to 0 until loaded, then pushes the layout | violates "allocate a fixed space" | `components/ui/AdSlot.tsx` |
| Last tap goes straight to a full-screen ad | no transition; close button appears ~3 s later | `11/12-after-finish*.png`, `hooks/useGatedInterstitial.ts` |
| Score count-up re-renders React every frame | `setState` in `requestAnimationFrame` for 900 ms | `app/results.tsx` |
| Progress bar animates `width` (a layout prop) and starts at 0% on question 1 | `value={index / total}` | `components/ui/ProgressBar.tsx`, `app/test.tsx` |
| Button haptic is a Vibrator waveform | `impactAsync` → `createWaveform` on Android | `components/ui/Button.tsx`, `local-expo-haptics.md` |
| Share is text only | "Compartilhando texto" sheet | `16-share.png` |
| Store screenshots cannot be uploaded as they are | 824×1784 = 2.17:1 (Play max 2:1) and under the 1080 px minimum for promotion slots; a raw A15 capture (1080×2340) is also 2.17:1 | `store/screenshots/`, `store-play-preview-assets.md` |

## 4. Design-system changes that land first

Every screen below assumes these. They also carry the ad-policy and haptics fixes, so they ship as one change.

### DS-1 Colour tokens (`constants/theme.ts`)

| token | light | dark | why [measured contrast] |
|---|---|---|---|
| `textFaint` (fix) | `#6E6E8A` | `#8A8AAD` | 4.93 on white / 4.62 on surface; 5.81 on bg / 5.31 on surface |
| `primaryText` (new: primary-coloured text, links, score digits on plain bg) | `#5B4FE9` | `#9D94FF` | 5.62 on white; 6.82 on surface, 6.02 on `primarySoft` |
| `outline` (new: 3:1 boundary of unselected options/inputs; keep `border` for decorative dividers) | `#8A8AA6` | `#62628A` | 3.35 on white; 3.05 on surface |
| `gradientBrand` (new: primary CTA, Results hero, share card) | `#6A5CF5 → #4A3FD6` | same | white label 4.71 at the light stop, 7.06 at the dark stop (check the worst stop, `ux-wcag-contrast-minimum.md`) |
| `gradientGlow` (new: top-of-screen wash, one per screen) | `#EDEBFE → #FFFFFF` | `#2A1F6B → #0D0D18` | white 13.94 on `#2A1F6B` |
| `accent` (light fix: curve marker, best-score ring, must reach 3:1 as a graphic) | `#A35F00` (was `#E8890C`, 2.62 on white) | `#F0A93C` (keep) | 5.01 on white, 4.69 on surface; dark 8.78 on surface |
| `onAccentSoft` (new: "Ponto forte" chip text) | `#8F5600` on `accentSoft` | `#F0A93C` on `accentSoft` | 5.34; 7.33 |
| on-gradient text | solid `#FFFFFF` only, never white with opacity | same | 80% white over `#6A5CF5` is 3.60 and fails; hierarchy comes from size and weight. Chips on the gradient use `rgba(0,0,0,0.20)` fill + white text (6.64) |
| `paper` (dark tweak) | `#FFFFFF` | `#DCDCE8` | less glare than `#E8E8F1`; SVG strokes are black so contrast stays >14 |
| `category.*` (new, icon/bar/accent colour per area) | visual `#5B4FE9`, numeric `#1F6FD1`, similarities `#0B7F67`, vocabulary `#A35F00`, comprehension `#C2365F` | visual `#8B7CFF`, numeric `#4DA3FF`, similarities `#2CC7A0`, vocabulary `#F2B33D`, comprehension `#FF7A9C` | light: 4.6–5.6 on white/surface (usable as text); dark: 5.4–9.5 on surface |

Rules: never put body text on a `*Soft`/container colour unless the pair above says it passes; never colour a score red (a low score is not an error).

### DS-2 Typography

- Load `Manrope_800ExtraBold` (present in `@expo-google-fonts/manrope`).
- Add `score`: 96/104, Manrope 800, `fontVariant: ['tabular-nums']`, `maxFontSizeMultiplier: 1.2`. Manrope and Inter both carry the `tnum` feature [measured: tag present in the shipped TTFs], so digits do not jitter during the count-up.
- Change `display` to 36/42 Manrope 800 (Home headline); keep the rest.
- Every number on screen (counter, scores, deltas) uses `tabular-nums`.
- Test at 200% font scale; Android 14+ scales non-linearly (`ux-android-font-scaling.md`).

### DS-3 Motion tokens

Replace `motion.spring`/`springGentle` with the M3 Expressive springs, converted for Reanimated (`ux-m3-motion-tokens-source.md`). **Set `mass: 1` explicitly**: Reanimated 4.5.1 defaults `mass` to 4 (`local-reanimated-spring-config.md`).

| token | use | `withSpring` config |
|---|---|---|
| `fastSpatial` | press, selection pop, chip pop, marker drop | `{ mass: 1, stiffness: 800, damping: 33.9 }` |
| `defaultSpatial` | question enter, bottom sheet, card enter | `{ mass: 1, stiffness: 380, damping: 31.2 }` |
| `slowSpatial` | full-screen hero enter | `{ mass: 1, stiffness: 200, damping: 22.6 }` |
| `fastEffects` / `defaultEffects` / `slowEffects` | colour, opacity (no overshoot) | `{ mass: 1, stiffness: 3800/1600/800, damping: 123.3/80/56.6 }` |

Also: `durations = { feedback: 100, exit: 150, enter: 250 }` for `withTiming` (`ux-nng-animation-duration.md`); animate only `transform` and `opacity` (layout props cost "layout recalculation on each animation frame", `perf-reanimated-performance.md`), so `ProgressBar` switches from `width` to `scaleX` with left origin; keep `ReduceMotion.System` (the default, `perf-reanimated-accessibility.md`); budget ≤ 100 animated views at once on low-end Android (`perf-reanimated-performance.md`).

### DS-4 Haptics module (`utils/haptics.ts`)

| call | Android (`performAndroidHapticsAsync`) | iOS fallback | when |
|---|---|---|---|
| `tick()` | `AndroidHaptics.Segment_Tick` | `selectionAsync()` | option selected / changed |
| `confirm()` | `AndroidHaptics.Confirm` | `notificationAsync(Success)` | answer committed, test finished, result revealed |
| `press()` | `AndroidHaptics.Virtual_Key` | `impactAsync(Light)` | generic buttons |

Rules: never call `impactAsync`/`notificationAsync` on Android (Vibrator waveform, `ux-android-haptic-feedback.md`); one haptic per user action; none during the count-up; a "Vibração" switch in Settings turns them all off. `performAndroidHapticsAsync` needs no permission and respects the system touch-feedback setting. On API < 34 (`minSdkVersion` is 24) expo-haptics substitutes an older constant when one exists and otherwise throws `HapticsNotSupportedException`, so every call is wrapped in `.catch(() => {})` (`local-expo-haptics.md`, `ux-android-haptic-constants.md`).

### DS-5 Components to add or rework (`components/ui/`)

| component | spec |
|---|---|
| `Button` primary → gradient | `LinearGradient` with `gradientBrand`, 56 dp (large 60), radius 18, label 18/24 Manrope 700 white; press scale 0.96 `fastSpatial` + `haptics.press()`; disabled = `surfaceAlt` fill + `textFaint` label (no 45% opacity). One gradient per button, no animated shadow (`perf-android-overdraw.md`) |
| `TopBar` | replaces the stack header on Test, Results, History, Settings: 56 dp, 48 dp icon buttons, optional centre slot (progress) |
| `OptionCard` | text option: min height 60, radius 16, padding 16×14, letter badge A–D (32 dp circle), body 16/24; unselected `surface` + 1.5 dp `outline`; selected 2 dp `primary` border, `primarySoft` fill, badge filled `primary` with white letter, label weight 600 in `text` colour; selection pop scale 0.98→1 `fastSpatial`, colours `fastEffects`; `haptics.tick()`; `accessibilityRole="radio"` |
| `FigureOption` | same states on `paper` / `paperSelected`; 3 dp ring when selected; letter badge 22 dp top-left; check badge top-right |
| `SegmentedProgress` | 3 segments × 10, 8 dp tall, 4 dp gaps, track `surfaceAlt`, fill `gradientBrand`; current segment fills `answered/10` with `scaleX`; completed segments full |
| `MilestoneChip` | inline pill above the question, `primarySoft` bg + `primaryText`, enters `defaultSpatial`, auto-hides after 1.8 s |
| `AdSlot` v2 | fixed-height container (reserve `max(60, lastMeasuredBannerHeight)`; cache the measured height at module level so the next screen reserves it immediately); 24 dp non-interactive zone above it with a hairline `border` divider; anchored at the bottom edge above the system inset; never inside scroll content; one instance per screen (do not key it to the question) |
| `ScoreCountUp` | digit roller: one column per digit with 0–9 stacked, `translateY` only (transform fast path). Fallback: `AnimatedTextInput` with `useAnimatedProps({ text })` + `editable={false}`, which takes the slower commit path (`perf-reanimated-slider-example.md`, `local-react-native-reanimated.md`) |
| `BellCurve` | static curve `Path` drawn once; fill revealed by animating the `width` of a `<Rect>` inside a `<ClipPath>`; outline optionally drawn on with `strokeDashoffset`; never morph `d` (`perf-reanimated-animating-svg.md`, `perf-android-slow-rendering.md`) |
| `CategoryBars` | rows sorted by ratio desc; icon in a 32 dp tinted circle; bar 8 dp in `category.*`, grows with `scaleX`, 60 ms stagger; top row tagged "Ponto forte" |
| `Confetti` | ≤ 40 `Animated.View` particles, transform/opacity only, 1.4 s one-shot, skipped under reduce-motion. No Skia (+4 MB, `perf-skia-installation-v2.6.2.md`) |
| `Screen` | gutters 20 dp (was 24); one `gradientGlow` at the top; no stack header |

**Do not use**: real blur (`expo-blur` needs `BlurTargetView` and API 31 for the efficient path, `perf-expo-blur-sdk57.md`), Lottie (masks/mattes are the largest Android cost, new native dep, `perf-lottie-android-docs.md`), Skia, shared-element transitions (experimental, `perf-reanimated-shared-element-transitions.md`), animated shadows. Fake "glass" with a mostly opaque tinted card and a 1 dp light border.

## 5. Screens

Layout numbers are for 384×832 dp (A15) at 100% font scale. Status bar 31 dp and 3-button nav bar 48 dp are measured from the screenshots.

### 5.1 Home (`app/index.tsx`)

**Job:** get a first-time user to tap "Começar" within seconds, and a returning user to try to beat their record.

**Fails now:** five equal-weight blocks above the fold (title, subtitle, 3-bullet card, 5 chips, button) and no visual hook; the CTA sits at ~79% of screen height directly above the banner; the category chips look tappable and are not; resume is a 3-button `Alert`.

**Ideal layout (first run):**

1. `TopBar`: brand mark 36 dp + "Teste de QI" 18 sp Manrope 700; right: History, Settings (48 dp targets).
2. Hero visual, 180 dp: the store icon's 3×3 matrix drawn in SVG (8 rounded tiles with white glyphs on `gradientBrand`, the 9th a dashed outline with "?"). Tiles pop in with 40 ms stagger (`fastSpatial`), then "?" pulses twice (scale 1→1.08, `defaultSpatial`) and stops. Static under reduce-motion. It is the icon users just tapped, so it doubles as brand recognition.
3. Headline `display` "Descubra seu QI"; subhead body `textMuted`: "30 questões de lógica, padrões e vocabulário."
4. Trust row, 3 chips with icons (`surfaceAlt`, 14 sp): "Resultado completo, sem bloqueio" · "Sem cadastro" · "Sem cronômetro". These are the competitor gaps from §1. Avoid "grátis" in anything that ends up in a store screenshot: Google's listing guidance says "Don't include promotional offers (like "free" or "discount")" (`store-play-listing-best-practices.md`).
5. Flexible spacer.
6. Primary gradient button "Começar teste" (60 dp, arrow icon), then a one-line caption `textFaint` 12 sp "Apenas entretenimento — não é avaliação psicológica." and a text link "Como funciona" (opens About).
7. `AdSlot` with its 24 dp gap.

**Returning user** (history ≥ 1): replace the hero visual with a "Seu recorde" card on `gradientBrand`: overline "SEU RECORDE", best score 56 sp white, tier chip, white sparkline of the last ≤ 10 scores, "Último: 79 · 3 testes". Button label "Fazer novo teste"; subhead "Questões novas a cada rodada".

**Test in progress:** a card above the button with a 48 dp ring ("12/30"), "Teste em andamento — continue de onde parou"; primary "Continuar teste", text button "Recomeçar" (confirm in a bottom sheet). Removes the `Alert`.

**Copy:** do not promise a duration until it is measured (persist total time per test first; a short promise that runs long raises breakoff, Yan 2007 via `ux-survey-progress-conrad-2010.md`). No "melhor", "#1", "oficial" (`store-play-metadata-policy.md`).

**Remove:** the 3-bullet card, the "O que o teste mede" chip grid (moves to About, with descriptions), the ghost "Sobre o teste" button, any onboarding/tutorial idea (NN/g: "avoid creating app onboarding whenever possible", `ux-nng-mobile-onboarding.md`).

**Verify:** screenshots of the three variants at 100% and 130% font scale show the whole button above the ad gap with no scroll; a 5-second test with 5 Brazilian users: each can say "it's free" and "no signup" (observable count, target 5/5).

### 5.2 Test — text question (`app/test.tsx`)

**Job:** read, choose, commit, with zero friction and a sense of momentum.

**Fails now:** a 53 dp stack header repeating the app name; a thin bar that is empty at question 1; no letters on options; option outlines at 1.3:1; no haptic or animation on select; questions swap instantly; the banner sits between the options and "Confirmar" and pushes the layout when it loads.

**Ideal layout (top → bottom):**

1. `TopBar` 56 dp: close (X) · `SegmentedProgress` (flex) · counter "7/30" 14 sp Manrope 600 tabular. X and system back open a sheet: "Pausar o teste? Seu progresso fica salvo." [Continuar o teste] (primary) / [Sair e continuar depois] (text). Competitors lose ratings for lost progress (`reviews-digerati.md`).
2. Category line 28 dp: 16 dp icon + name in `category.*` colour, 14 sp 600. No pill.
3. Question `heading` 22/30 Manrope 700, up to 3 lines, 20 dp below.
4. Four `OptionCard`s, 10 dp apart.
5. Footer: 12 dp, gradient button 56 dp "Confirmar" (on question 30: "Ver meu resultado"), then the `AdSlot` (24 dp gap + reserved height) at the bottom edge.

Budget: viewport = 832 − 31 status − 56 top bar − 28 category line − 152 footer (12 + 56 button + 24 gap + 60 ad) − 48 nav = **517 dp**. Content: question 90 + 20 + 4×(60+10) = 390 dp with single-line options, 4×(80+10) + 110 = 470 dp with two-line options; both fit [measured].

**Motion & haptics:** select → pop + `tick()`; change allowed until commit. Commit → `confirm()`; current block exits (opacity 1→0, translateX 0→−24, 150 ms), next enters (translateX 24→0 `defaultSpatial`, opacity `fastEffects`); the segment fill advances. Total ≤ 300 ms because it repeats 30 times (`ux-nng-animation-duration.md`).

**Momentum (P2):** after question 3 a `MilestoneChip` "Bom começo!" (Villar suggests encouragement "after the first questions"); after 10 and 20 "1 de 3 blocos concluído" / "2 de 3 — falta pouco", with the finished segment doing one `fastSpatial` pulse; from question 26 the counter reads "faltam 4". No right/wrong feedback during the test; it is kept for the answer review (§5.7). No extra haptic on milestones (one haptic per action).

**Remove:** stack header, category pill, footer hairline, opacity-only pressed state, `impactAsync`.

**Verify:** (1) for the longest text question in pt, en and es, the 4 options and "Confirmar" are visible without scrolling (3/3 screenshots); (2) screen-record the first 3 s while the banner loads: the button's y position does not change (frame compare); (3) 60 fps recording: first visual change ≤ 6 frames after touch; (4) the contrast pairs in DS-1 hold in both themes.

### 5.3 Test — pattern question (`components/PatternQuestion.tsx`)

**Job:** see the whole matrix and all four options at once, compare, choose.

**Fails now:** 178 dp overflow, so the user scrolls between matrix and options [measured]; options are 162 dp squares holding a 1.65:1 figure drawn at 78% width, so the figure covers about a third of each cell; a 26 dp title repeats on every item; "AMPLIAR" label.

**Ideal layout:** same shell as 5.2, with the category line reading "Raciocínio visual · Complete a sequência" (replaces the title).

- Matrix card: full width (344 dp), `paper`, radius 16, 8 dp padding, image at its native 1.49:1 (`viewBox 0 0 500 335`) → 328×220. Tap opens the existing zoom modal; hint is a 32 dp icon-only button top-right.
- Options 2×2, 10 dp gaps: cells 167×107 dp, figure 150×91 at its native 1.65:1 (`viewBox 0 0 173 105`), `FigureOption` states.
- Budget: 236 + 12 + 224 = **472 dp in a 517 dp viewport → no scroll** [measured]. On shorter screens compute the matrix height from `onLayout`: `clamp(available − gridHeight − 12, 140, 220)`.
- 2×2 tiles below a stimulus card is the niche convention (Stelzer, Trasco) and keeps P7's "familiar" rule.

**Remove:** the repeated title, the "AMPLIAR" text, square cells.

**Verify:** render all 30 pattern items (p01–p30) on the A15: 30/30 show matrix + 4 options + button without scroll; selected ring visible in both themes.

### 5.4 Finish moment (new route `app/finishing.tsx`)

**Job:** turn the last tap into anticipation, confirm the test is done, and host the interstitial at a clean break without ever losing the result.

**Fails now:** the last tap opens a full-screen ad with no context; the user cannot tell their result is saved.

**Sequence:**

1. Last "Ver meu resultado" → save the result (already happens before navigation) → `confirm()` → `router.replace('/finishing')`.
2. `/finishing`: full-screen `gradientGlow` (dark-leaning), no banner (`policy-publisher-screens-without-content.md`), no back. Centre: the 3×3 grid motif as a loader (9 tiles lighting in sequence, opacity only). Title "Teste concluído!" 24 sp. Below, the 5 areas as rows ("Raciocínio visual… ✓"), one row turning to ✓ every 350 ms (≈1.8 s), so the wait shows real work (`ux-labor-illusion-buell-norton.md`).
3. When an interstitial will show (loaded and gates pass), a 13 sp line under the list: "Um anúncio rápido e já mostramos seu resultado." It makes the ad expected, which is the one thing every policy page agrees on.
4. At ≈2.0 s: show the pre-loaded interstitial; on close, `router.replace('/results')`. Not loaded → go straight to Results. Never show it after Results has rendered (`policy-admob-disallowed-interstitials.md`).
5. Keep the existing cooldown and gates in `useGatedInterstitial`.

**Verify:** screen recording: "Teste concluído!" visible ≤ 100 ms after the last tap; ad appears only after ≥ 1.5 s of this screen; airplane mode → Results at ≈2 s with no blank state; force-quit during the ad → the result is in History.

### 5.5 Results (`app/results.tsx`)

**Job:** deliver the peak, make the number believable, make it shareable, point to the next action.

**Fails now:** the score is a violet number floating on a dark page with no container (it passes as large text at 4.33:1 but carries no emphasis); per-frame React re-renders for the count-up; static curve; a whole card for "10/30"; per-area fractions in red/green, unsorted; text-only share; three stacked buttons and a long scroll; no interpretation; no close.

**Ideal layout** (first viewport ≈ 700 dp from the top edge to the ad gap, since the hero runs under the status bar; hero 331 + curve card 192 + share button 72 = 595 dp, so the share button is visible without scrolling [measured budget]):

1. Transparent `TopBar` over the hero: X (→ Home). No title.
2. **Hero** ≈ 300 dp, full-bleed `gradientBrand`, all text solid white (DS-1): overline "SEU QI ESTIMADO" (12 sp 600, +1.2 letter spacing) · `score` · tier chip (`rgba(0,0,0,0.20)` fill, 14 sp 600) · one line 16 sp: "Você foi melhor que 73% das pessoas" when percentile ≥ 30, otherwise "Seu ponto forte: Compreensão (3 de 4)". Bottom strip 14 sp: "10/30 acertos · 11 min · 5 áreas" (needs total time persisted).
3. **Curve card** overlapping the hero by 24 dp (`surface`, radius 20): "Onde você está" 16 sp 600; `BellCurve` 140 dp; marker = `accent` line + dot + bubble "Você · 79"; ticks 70–130; caption "Média da população: 100".
4. Primary gradient button "Compartilhar resultado" (share icon), full width; below it an outline button "Refazer com novas questões".
5. "Seu perfil" card: `CategoryBars`, top row "Ponto forte" chip (`accentSoft` fill, `onAccentSoft` text). No red anywhere.
6. "Revisar respostas" list row (→ §5.7).
7. Disclaimer line, 12 sp `textFaint`; `AdSlot`.

**Reveal timeline** (tap on the hero skips to the end state; reduce-motion lands it instantly):

| t (ms) | what |
|---|---|
| 0–200 | hero fades in (`defaultEffects`) |
| 150–1350 | count-up 0 → score (`withTiming` 1200 ms, ease-out cubic) |
| 1350 | tier chip pops (`fastSpatial`) + `confirm()`; percentile line fades in |
| 1400–2200 | curve fill sweeps to the marker (clip width), marker drops in (`fastSpatial`) |
| 2200+ | profile bars grow, 60 ms stagger |
| 1350 | confetti only on a new personal best (≥ 2 tests) or a first score ≥ 110 |

**In-app review:** after the reveal and ≥ 3 s on screen, when the score ties or beats the previous best and no request in the last 30 days (local flag), call the review API. No button and no question before it ("Do you like the app?" is forbidden), and the card is never covered (`policy-play-in-app-review.md`). Needs `expo-store-review` (not installed). The Settings "Avaliar" row keeps opening the store page.

**Copy:** never clinical labels (Brainova is punished for "nível de tdah"); keep "estimado"; never colour the score by tier.

**Remove:** the "Acertos" card (folds into the hero strip), red/green fractions, the "Início" ghost button (X replaces it), the stack header, the text-only share.

**Verify:** (1) release build on the A15 with the perf monitor: UI and JS fps ≥ 55 for the whole reveal (the A15 panel is 90 Hz, `perf-gsmarena-galaxy-a15.md`); (2) first viewport shows score, tier, percentile line, curve and the share button at 100% font scale; (3) with "Remove animations" on, the final state appears immediately; (4) share to a WhatsApp self-chat: image arrives, score legible in the chat thumbnail, message carries the store link.

### 5.6 Share card (new, off-screen view)

**Job:** an image people want to post, which carries the app name back to the store.

- 360×640 dp `View` rendered off-screen (`collapsable={false}`), captured at 3× → **1080×1920 PNG** (9:16; Instagram min 720×1280).
- `gradientBrand` full bleed, all text solid white. Top: grid mark 40 dp + "Teste de QI". Centre: "Meu QI estimado" 22 sp · score 140 sp Manrope 800 · tier chip · "Melhor que 73% das pessoas" · mini bell curve (white 2 dp stroke, `#FFC857` marker, 3.06:1 at the light stop) · "Ponto forte: Compreensão". Bottom: "Faça o seu grátis no Google Play" + disclaimer 12 sp. White passes 4.71:1 at the light stop (it is an image of text, `ux-wcag-contrast-minimum.md`).
- Share through the Android Sharesheet with the image plus the existing message and `STORE_URL`. No custom target list (`ux-android-sharesheet.md`), no direct Stories button (needs a Facebook App ID).
- Needs `react-native-view-shot` 5.1.0 and `expo-sharing` ~57.0.23: native modules, so a dev-client rebuild and a new store binary (`perf-react-native-view-shot-readme.md`, `perf-expo-sharing-sdk57.md`, `perf-expo-dev-builds.md`). Neither is installed today.

**Verify:** generated file is 1080×1920 and < 500 KB; posted to WhatsApp and an Instagram story by hand, the score reads at thumbnail size.

### 5.7 Answer review (new, `app/review.tsx`)

**Job:** let people see what they missed. It is the most requested feature in competitor reviews and the second caption in the best-rated BR app's screenshots.

- Needs data: persist per answer the chosen option index (and total seconds) in `HistoryItem`; old entries without it hide the entry point.
- Layout: list grouped by area; each row "Questão 7 · Vocabulário" with ✓ (`success`) or "Ver resposta" (neutral, not red). Tap → the question rendered read-only: the user's choice outlined, the correct option filled `successSoft` with a check. Slot for a one-line explanation (content to write later, in 3 languages).
- Reached from Results ("Revisar respostas") and from a History entry.

**Verify:** 30/30 rows match the stored answers for a seeded test; correct option matches `data/questions.ts`.

### 5.8 History (`app/history.tsx`)

**Job:** show evolution and give a reason to take another test.

**Fails now:** with one test the summary shows 79 / 79 / 1 and no chart (sparkline hidden under 2 points); rows are not tappable; more than half of the screen is empty (`17-history.png`); no way to start a test.

**Ideal layout:**

1. `TopBar` "Histórico".
2. "Seu recorde" card: best score 56 sp + tier + date; line chart 120 dp of the last ≤ 10 scores, points 6 dp, best point with an `accent` ring, dashed line at 100 labelled "média". One test: the single point + dashed line + "Faça outro teste para ver sua evolução".
3. Metrics row: Média · Testes · Tempo médio (once time is stored).
4. Rows 72 dp: 44 dp score badge (`primarySoft` fill, `primaryText` digits, `accent` ring on the best), date "19 out 2026", "10/30 acertos · melhor que 8%", delta vs previous "▲ 6" (`success`) or "▼ 3" (`textMuted`, never red), chevron → Results in history mode (no reveal animation, no interstitial, no confetti, no review prompt) with share and "Revisar respostas".
5. Gradient button "Fazer novo teste" pinned above the ad gap.
6. Empty state: the grid motif, "Nenhum teste ainda", the same button.

**Verify:** seeded 0 / 1 / 2 / 10 tests → 4 screenshots; 10/10 rows open their result.

### 5.9 Settings (`app/settings.tsx`)

**Job:** change age, theme, language, haptics; reach about, privacy, rating; clear data.

**Fails now:** works; section labels fail contrast (fixed by DS-1); the theme picker is three large cards.

**Changes:** `TopBar`; theme as a single-row segmented control (Sistema · Claro · Escuro, 48 dp); add "Vibração" switch under "Teste"; group About / Avaliar na Play Store (opens the store page) / Privacidade / Opções de privacidade dos anúncios; "Apagar histórico" last, in `danger` text, with a confirm sheet; version footer. All rows ≥ 48 dp (`ux-android-accessibility-basics.md`).

**Verify:** turning "Vibração" off silences every haptic on the A15; Accessibility Scanner reports no touch-target or contrast issues.

### 5.10 About sheet (`components/AboutSheet.tsx`)

**Job:** say what the test is and is not.

**Fails now:** the scrim is a `View` inside a `Modal animationType="slide"`, so it slides up together with the sheet instead of fading [judgement from the code; a still screenshot cannot show it]; the categories live on Home instead of here.

**Changes:** `Modal` with `animationType="none"`; scrim opacity 0→1 `defaultEffects`, sheet translateY `defaultSpatial` (M3 uses "default" for things that partially cover the screen, `ux-m3-motion-physics.md`); drag-down to close (gesture-handler is installed). Content: title, intro, "O que o teste mede" with the 5 areas (icon in `category.*` + one-line description), bullets, the disclaimer card (keep), privacy link, "Fechar".

**Verify:** scrim fades while the sheet slides (recording); back gesture closes it.

### 5.11 Considered and rejected: a pre-test intro / onboarding screen

NN/g recommends avoiding onboarding and putting users "directly into the interface" (`ux-nng-mobile-onboarding.md`). The two things an intro would carry go elsewhere: the length and "no timer" sit on Home, and age stays in Settings.

## 6. Store screenshots (follow-up, after the redesign)

- Upload format: compose each capture onto a **1080×1920** canvas. Raw A15 captures are 2.17:1 and Play caps the ratio at 2:1; at least 4 screenshots ≥ 1080 px for the large promotional slots (`store-play-preview-assets.md`).
- Taglines ≤ 20% of the image, localised per language, real UI first, UI in the first three, full status-bar icons, no device frames or hands (`store-play-preview-assets.md`); no "melhor/#1/top/novo" (`store-play-metadata-policy.md`).
- No price wording in captions ("grátis", "sem anúncios"); the same page puts "free" under promotional offers. `store/listing-pt-BR.md` uses "grátis" in the short description and should be re-checked against it.
- Order: (1) Results hero + curve "Descubra seu QI na hora", (2) pattern question "30 questões de raciocínio", (3) profile bars "Veja seus pontos fortes", (4) answer review "Revise cada resposta", (5) share card, (6) Home "Sem cadastro, sem cronômetro".
- A/B one asset at a time, at least a week, localized experiment for pt-BR (`store-play-experiments-best-practices.md`, `store-play-ab-tests.md`).

## 7. Verdict

Priority order, by impact on store conversion (screenshots 1–4 come from Results, Test, Review) and on finished tests:

| # | work | why first |
|---|---|---|
| 1 | **DS-1…DS-5** (tokens, type, motion, haptics, components incl. `AdSlot` v2) | every screen depends on them; they contain the two ad-policy fixes and the haptics fix that apply app-wide |
| 2 | **Results + share card** (5.5, 5.6) | the peak of the experience and store screenshot #1; the free full result is the differentiator and today it looks plain; the share image is the only organic loop |
| 3 | **Test — pattern** (5.3) | 12 of 30 questions in every round (`BLUEPRINT` in `hooks/useQuestionSelection.ts`); the 178 dp overflow is the worst usability defect; store screenshot #2 |
| 4 | **Test — text + progress + pause sheet** (5.2) | completion: structure, encouragement at breaks, no lost progress |
| 5 | **Finish moment** (5.4) | small build; makes the interstitial expected and adds anticipation before the reveal |
| 6 | **Home** (5.1) | first impression after install; installs already chose to take a test, so it moves completion less than 2–5 |
| 7 | **History + answer review** (5.8, 5.7) | retention and the most requested feature, but needs a data change and written explanations |
| 8 | **Settings, About** (5.9, 5.10) | low traffic, already functional |

## What this does not establish

- **No user test or A/B test was run.** Every layout here is evidence-informed, not validated.
- **No device measurement.** All performance calls (digit roller, clip reveal, ≤ 40 confetti views) come from docs and source. Whether animating `TextInput.text` updates on Fabric with Reanimated 4.5.1 is unverified.
- **The banner on the test screen stays a policy risk even with the gap.** Google gives no dp distance anywhere, and AdMob says to "implement ads where users are expected to be less engaged" (`policy-admob-implementation-guidance.md`). Removing that banner is the only zero-risk option; the owner keeps it, so the gap and fixed height are the mitigation.
- **The interstitial before Results has a documented tension.** AdMob prefers the ad "before the break page" (`policy-admob-recommended-interstitials.md`); Play lists an ad "after a user has clicked on a button, and before the action intended by the button click has taken effect" as disruptive, and gives "after the score screen" as its safe example (`policy-play-ads.md`); the peak–end rule argues against anything between the last answer and the score (`ux-nng-peak-end-rule.md`). The finish screen and the disclosure line address "unexpected", which every source agrees on. `INTERSTITIAL_AFTER_TESTS = 0` (an ad on the very first test) is a business choice this research does not settle.
- **Segmented bar vs continuous bar** was never tested head-to-head in what was read; the recommendation rests on Conrad's section-break feedback and structure findings.
- **Milestones can backfire:** effort resets "to a lower level" after a reward (`ux-goal-gradient-kivetz.md`). The milestones here carry no reward, only a status line.
- **Test duration is unmeasured**, so no "10 minutos" claim belongs in the UI or captions until real timings are collected.
- **Answer review may raise retake scores** on a ~110-question bank; not quantified.
- **Radar chart rejected without controlled evidence**: bars were chosen for precision; the strongest case against radar is a practitioner critique (`dataviz-scottlogic-radar-critique.md`).
- **Competitor review percentages are regex counts**, and Reddit, AppBrain and Reclame Aqui pages could not be fetched directly.
- **Elevate, Peak, Lumosity and Brilliant design write-ups** were not found as first-party sources; the benchmarks rest on their Play listings and reviews.

## Sources

Every entry has a fetch file in `fetches/`. Files there that are not listed (extra policy pages, alternative perf docs, search pages) were read and support the same findings.

**Competitors**
- [Teste de QI (Paul Stelzer)](https://play.google.com/store/apps/details?id=de.paulstelzer.iqtest&hl=pt_BR&gl=BR) — `fetches/play-stelzer.md`, `reviews-stelzer.md` — #1 BR listing, gated explanations, praised breakdown
- [Teste de QI: Raciocínio Lógico (Trasco)](https://play.google.com/store/apps/details?id=com.iq.test.maths.intelligence.logic.iqtest&hl=pt_BR&gl=BR) — `play-trasco.md`, `reviews-trasco.md` — best-rated BR IQ app, explanations, ad complaints
- [Teste de QI (Digerati)](https://play.google.com/store/apps/details?id=cz.digerati.iqtest&hl=pt_BR&gl=BR) — `play-digerati.md`, `reviews-digerati.md` — largest install base, honesty praised, no-pause complaints
- [What's my IQ? (Klikapp)](https://play.google.com/store/apps/details?id=com.klikapp.freeiqtest&hl=en&gl=US) — `play-klikapp.md`, `reviews-klikapp.md` — paid results, certificate ads
- [IQ Test (Online Tools Store)](https://play.google.com/store/apps/details?id=com.iq.test.online.tools.store&hl=pt_BR&gl=BR) — `play-onlinetools.md`, `reviews-onlinetools.md` — paywall after test
- [IQlab](https://play.google.com/store/apps/details?id=com.matlubapps.myiq&hl=pt_BR&gl=BR) — `play-iqlab.md`, `reviews-iqlab.md` — 24 h wait
- [Brainova](https://play.google.com/store/apps/details?id=com.fc.app.iq.brain.training.mind.games.logic.test.puzzle&hl=pt_BR&gl=BR) — `play-brainova.md`, `reviews-brainova.md` — ads, clinical labels
- [Elevate](https://play.google.com/store/apps/details?id=com.wonder&hl=en&gl=US) — `play-elevate.md`, `reviews-elevate.md` — design benchmark, English-only complaints
- [Lumosity](https://play.google.com/store/apps/details?id=com.lumoslabs.lumosity&hl=pt_BR&gl=BR) — `play-lumosity.md`, `reviews-lumosity.md` — calm, localised, 4,9 in BR
- [Play search "teste de QI" BR](https://play.google.com/store/search?q=teste%20de%20QI&c=apps&hl=pt_BR&gl=BR) / ["QI"](https://play.google.com/store/search?q=QI&c=apps&hl=pt_BR&gl=BR) / ["IQ test" US](https://play.google.com/store/search?q=IQ%20test&c=apps&hl=en&gl=US) — `play-search-*.md` — which apps lead
- Reclame Aqui / Trustpilot search snippets — `search-reclameaqui-teste-de-qi.md`, `search-iq-test-scam-paywall.md` — paywall distrust (snippets only)

**Ad and store policy**
- [AdMob interstitial guidance](https://support.google.com/admob/answer/6066980?hl=en) — `policy-admob-interstitial-guidance.md` — natural transition points, close delays up to 30 s
- [AdMob disallowed interstitials](https://support.google.com/admob/answer/6201362?hl=en) — `policy-admob-disallowed-interstitials.md` — not unexpected, not after page load, pre-load
- [AdMob recommended interstitials](https://support.google.com/admob/answer/6201350?hl=en) — `policy-admob-recommended-interstitials.md` — before the break page, "please wait" delay
- [Google Play Ads policy](https://support.google.com/googleplay/android-developer/answer/9857753?hl=en) — `policy-play-ads.md` — unexpected interstitials, 15 s closeability, "after the score screen"
- [Publisher Policies: ads interfering](https://support.google.com/publisherpolicies/answer/11035030?hl=en) — `policy-publisher-ads-interfering.md` — no ads adjacent to action items
- [Publisher Policies: screens without content](https://support.google.com/publisherpolicies/answer/11112688?hl=en) — `policy-publisher-screens-without-content.md` — no banner on the calculating screen
- [AdMob banner guidance](https://support.google.com/admob/answer/6128877?hl=en) / [discouraged banners](https://support.google.com/admob/answer/6275345?hl=en) / [recommended banners](https://support.google.com/admob/answer/6275335?hl=en) — `policy-admob-banner-guidance.md`, `policy-admob-discouraged-banners.md`, `policy-admob-recommended-banners.md` — separation, fixed space, no sandwich
- [AdMob implementation guidance](https://support.google.com/admob/answer/2936217?hl=en) — `policy-admob-implementation-guidance.md` — no shifting content, 60 s refresh, less-engaged placement
- [Anchored adaptive banner sizes](https://developers.google.com/admob/unity/banner/anchored-adaptive?hl=en) — `policy-dev-unity-anchored-adaptive.md` — 50 dp min, ≤ 90 dp or 15% height
- [In-App Review API](https://developer.android.com/guide/playcore/in-app-review) — `policy-play-in-app-review.md` — no CTA button, no questions, quota
- [Play preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en) — `store-play-preview-assets.md` — 2:1 cap, 1080 px, 20% taglines
- [Play Metadata policy](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en) / [listing best practices](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en) — `store-play-metadata-policy.md`, `store-play-listing-best-practices.md` — banned words, disclaimers do not exempt
- [Store listing experiments](https://google.play/business/store-listing-experiments/) / [A/B tests](https://support.google.com/googleplay/android-developer/answer/6227309?hl=en) — `store-play-experiments-best-practices.md`, `store-play-ab-tests.md`

**Engagement and UX**
- [Villar, Callegaro & Yang 2013, progress indicator meta-analysis](https://openaccess.city.ac.uk/id/eprint/14427/4/Social%20Science%20Computer%20Review-2013-Villar-744-62.pdf) — `ux-survey-progress-meta-analysis.md` — constant bars do not help; deceptive pacing unethical
- [Conrad et al. 2010, progress feedback in web questionnaires](https://pmc.ncbi.nlm.nih.gov/articles/PMC2910434/) — `ux-survey-progress-conrad-2010.md` — section-break feedback, structure, breakoff numbers
- [Kivetz, Urminsky & Zheng, The Goal-Gradient Hypothesis Resurrected](https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf) — `ux-goal-gradient-kivetz.md` — effort rises near the goal, resets after a reward
- [Harrison et al., Rethinking the Progress Bar](https://www.chrisharrison.net/projects/progressbars/ProgBarHarrison.pdf) — `ux-harrison-rethinking-progress-bar.md` — no stalls near the end of waits (system waits only)
- [Buell & Norton 2011, The Labor Illusion](https://www.hbs.edu/faculty/Pages/item.aspx?num=40158) — `ux-labor-illusion-buell-norton.md` — showing effort raises perceived value (abstract only; full text 403)
- [NN/g progress indicators](https://www.nngroup.com/articles/progress-indicators/) — `ux-nng-progress-indicators.md` — indicator for waits > 1 s, explain the wait
- [NN/g peak–end rule](https://www.nngroup.com/articles/peak-end-rule/) — `ux-nng-peak-end-rule.md` — design the peak and the end
- [NN/g mobile-app onboarding](https://www.nngroup.com/articles/mobile-app-onboarding/) — `ux-nng-mobile-onboarding.md` — avoid onboarding
- [NN/g microinteractions](https://www.nngroup.com/articles/microinteractions/) / [animation duration](https://www.nngroup.com/articles/animation-duration/) — `ux-nng-microinteractions.md`, `ux-nng-animation-duration.md` — ~100 ms feedback, 200–300 ms transitions
- [Start building with M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive) / [research behind M3 Expressive](https://design.google/library/expressive-material-design-google-research) — `ux-m3-expressive-blog.md`, `ux-m3-expressive-research.md` — hero moments, 4× faster spotting, limits of novelty
- [M3 motion physics](https://m3.material.io/styles/motion/overview/how-it-works) / [progress indicators](https://m3.material.io/components/progress-indicators/guidelines) / [loading indicator](https://m3.material.io/components/loading-indicator/guidelines) / [colour roles](https://m3.material.io/styles/color/roles) — `ux-m3-motion-physics.md`, `ux-m3-progress-indicators.md`, `ux-m3-loading-indicator.md`, `ux-m3-color-roles.md`
- [Compose ExpressiveMotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt) — `ux-m3-motion-tokens-source.md` — spring numbers
- [Haptics design principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles) / [haptic feedback](https://developer.android.com/develop/ui/views/haptics/haptic-feedback) / [HapticFeedbackConstants](https://developer.android.com/reference/android/view/HapticFeedbackConstants) — `ux-android-haptics-principles.md`, `ux-android-haptic-feedback.md`, `ux-android-haptic-constants.md`
- [Android accessibility](https://developer.android.com/guide/topics/ui/accessibility/apps) / [font scaling to 200%](https://developer.android.com/about/versions/14/features) / [Sharesheet](https://developer.android.com/training/sharing/send) — `ux-android-accessibility-basics.md`, `ux-android-font-scaling.md`, `ux-android-sharesheet.md`
- [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) / [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) — `ux-wcag-contrast-minimum.md`, `ux-wcag-non-text-contrast.md`
- [Berger & Milkman, What makes online content viral](https://faculty.wharton.upenn.edu/wp-content/uploads/2011/11/Virality.pdf) — `ux-berger-milkman-virality.md`
- [Duolingo streak milestone design](https://blog.duolingo.com/streak-milestone-design-animation/) — `ux-duolingo-streak-milestone.md` — share card at the celebration moment
- [Spotify Wrapped 2023 animation](https://engineering.atspotify.com/2024/1/exploring-the-animation-landscape-of-2023-wrapped) — `ux-spotify-wrapped-animation.md` — native data-driven animation
- [Instagram sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories/) — `ux-instagram-sharing-to-stories.md` — 9:16, App ID requirement
- [DataReportal Digital 2026 Brazil](https://datareportal.com/reports/digital-2026-brazil) — `ux-datareportal-brazil-2026.md`
- [Gamification meta-analysis (Sailer & Homner)](https://link.springer.com/article/10.1007/s10648-019-09498-w) — `ux-gamification-meta-analysis.md`
- [A critique of radar charts](https://blog.scottlogic.com/2011/09/23/a-critique-of-radar-charts) — `dataviz-scottlogic-radar-critique.md`

**Performance and libraries**
- [Reanimated performance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance) — `perf-reanimated-performance.md` — ≤ 100 animated components on low-end Android, non-layout props
- [Reanimated animating SVG](https://docs.swmansion.com/react-native-reanimated/docs/guides/animating-svg/) / [slider example](https://docs.swmansion.com/react-native-reanimated/examples/slider) / [accessibility](https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility) / [shared element transitions](https://docs.swmansion.com/react-native-reanimated/docs/shared-element-transitions/overview) — `perf-reanimated-*.md`
- Installed sources — `local-react-native-reanimated.md` (fast-path prop set), `local-reanimated-spring-config.md` (mass default 4), `local-expo-haptics.md` (exact API)
- [expo-blur SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/blur-view/) — `perf-expo-blur-sdk57.md`
- [Lottie Android performance](https://raw.githubusercontent.com/airbnb/lottie/master/android.md) — `perf-lottie-android-docs.md`
- [Skia installation v2.6.2](https://raw.githubusercontent.com/Shopify/react-native-skia/v2.6.2/apps/docs/docs/getting-started/installation.md) — `perf-skia-installation-v2.6.2.md` — +4 MB Android
- [react-native-fast-confetti](https://github.com/AlirezaHadjar/react-native-fast-confetti) — `perf-react-native-fast-confetti-readme.md` — depends on Skia
- [Android overdraw](https://developer.android.com/topic/performance/rendering/overdraw) / [slow rendering](https://developer.android.com/topic/performance/vitals/render) — `perf-android-overdraw.md`, `perf-android-slow-rendering.md`
- [expo-linear-gradient SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/linear-gradient/) — `perf-expo-linear-gradient-sdk57.md`
- [react-native-view-shot](https://github.com/gre/react-native-view-shot) / [expo-sharing SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/sharing/) / [development builds](https://docs.expo.dev/develop/development-builds/use-development-builds/) — `perf-react-native-view-shot-readme.md`, `perf-expo-sharing-sdk57.md`, `perf-expo-dev-builds.md`
- [Galaxy A15 specs (GSMArena)](https://www.gsmarena.com/samsung_galaxy_a15-12637.php) — `perf-gsmarena-galaxy-a15.md` — Helio G99, Mali-G57 MC2, 90 Hz
