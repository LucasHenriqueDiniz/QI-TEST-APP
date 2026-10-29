# Device harness

Checks that run against a real phone over USB, so a change is judged by what
the app does on a device, not by `tsc`. Written for the Galaxy A15 (Android 16,
1080×2340, 384×832 dp); nothing is hard-coded to it except the fallback tap on
the interstitial's close button.

## Setup

```bash
brew install --cask android-platform-tools   # adb
```

On the phone: Settings → About phone → Software information → tap "Build
number" 7 times; Developer options → USB debugging on; plug in and accept
"Allow USB debugging" (tick "Always allow"). `adb devices` must list it as
`device`.

The app under test is the EAS `development` build, loading JS from Metro:

```bash
npx expo start --dev-client --localhost      # keep running
sh scripts/device/cold.sh                    # opens the app on Metro over USB
```

A new native module needs a new dev build installed:

```bash
npx eas-cli build --profile development --platform android --non-interactive
npx eas-cli build:run --platform android --id <build id>   # downloads; fails at "emulator", that is fine
adb install -r "$TMPDIR/eas-cli-nodejs/eas-build-run-cache/<project>_<build id>.apk"
```

## Scripts

All Python scripts run with `python3 -I` and need nothing beyond the standard
library. Exit 0 means pass.

| script | checks | today (2026-10-19) |
|---|---|---|
| `check_contrast.py` | WCAG pairs of the colour tokens in `constants/theme.ts`; no device | 13 failing pairs → exit 1 |
| `answer_all.py [--start] [--seed N] [--max N]` | answers the test on screen to the end; `N/N` (stops after `--max`, 100, questions) | `30/30` → exit 0; Detalhado `90/90` (2026-10-28) |
| `check_fit.py [--require LABEL] [--options N]` | options, primary button and labels fully visible, none clipped by their scroll viewport, none under the banner | q=69 alone: `FIT`; prompt margin pushed to 700 dp: `only 0 of 4 options on screen` → exit 1; to 250 dp: C and D clipped → exit 1 (2026-10-20) |
| `check_fit_round.py [--only patterns] [--seed N]` | opens a round (every pattern item in order with `--only patterns`), runs `check_fit`'s rules on every question after the layout settles, answers it; `N/N fit` | pattern round: `30/30 fit` in light and dark; `54/54 fit` after the 05e merge (2026-10-28) → exit 0 |
| `check_fit_round.py --longest-text` | the longest text question of pt, en and es (characters of question + options, read from the translation files), each opened alone with `/test?q=<id>&lang=<code>`; `3/3 fit` | `3/3 fit` → exit 0, but en and es were shown in pt until the link was quoted (2026-10-29); now each language's question text must be on screen: comprehension q30, 290–299 characters, `3/3 fit`; unquoted link: `1/3` |
| `check_finish.py [--only timing\|offline\|killed]` | a Rápido round to its last answer, three times; reads the `[finish]`/`[finishing]` `__DEV__` lines from logcat: the finish screen within 1 s and the ad after ≥ 1.5 s; offline → Results within 3 s, no ad; force-stop during the ad → the round is the newest history entry | 3 × `PASS` (0.37 s, ad at 2.02 s; 2.30 s offline); with the hand-over at 0.5 s: timing `FAIL` (2026-10-29) |
| `speed_task.py [--restart]` | a Normal round, then the speed task: practice from the dev `testID`, the 90 s block from the dev `[speed] pair` logcat lines (the clock keeps uiautomator from dumping); every fifth answer wrong; `speed stored: c-w` vs what it tapped. `--restart`: HOME mid-block and back → `restarted` | `464-116` stored, `465-116` tapped (last tap after 90 s) → `PASS`; `restarted`; with the AppState listener off: not restarted (2026-10-29) |
| `check_results_band.py` | Results opened by link with four entries written in the script (Rápido, Normal + speed, Detalhado + indices + speed, legacy); band on screen vs stored, indices and speed shown (over three scroll positions), share button on the first screen; `N/4 match` | `4/4 match`; on the Results before slice 03b `1/4` (2026-10-29) |
| `check_share_image.py` | Results by link (Detalhado entry), tap share; the PNG path from the dev `[share] image` logcat line, copied out with `run-as`; its size from the PNG header; the Sharesheet shows an image preview, not "Compartilhando texto"; `<w>x<h> <size> KB OK` | `1080x1920 275 KB OK` (2026-10-29) |
| `check_option_scale.py [--tolerance 2]` | dev pattern round; in a screenshot of each item, the matrix hole's width and option A's frame width, in dp (hole positions from `scripts/patterns/measure-holes.py --json`); `N/N same scale` | `54/54` (delta −1.1 to +0.4 dp); before slice 05.1 `0/54`, p25–p54 +16 to +18 dp (2026-10-29) |
| `check_pause.py [--answers N]` | answers N (5), system back → pause sheet, "Continuar o teste" keeps the question, back again → "Sair e continuar depois" → Home "Continuar teste" → resume prompt → counter N+1/total | `PASS` (8 steps) → exit 0 (2026-10-20) |
| `check_double_finish.py [--mode rapido] [--gap 0.08]` | two taps on the last question's "Ver meu resultado", `--gap` s apart; reads `testHistory` from the app's AsyncStorage: grew by 1 and that entry has as many answers as the round | `PASS`, history +1 with 20 answers → exit 0; without the guard: +2 (20 and 21 answers) (2026-10-20) |
| `check_relink.py [--answers 5]` | a Normal round answered 5 times, then a link to `/test?mode=rapido` onto the open screen: the counter reads 1/20 | `PASS` (6/40 → 1/20) → exit 0; without the reset: 11/40 → 11/20 (2026-10-20) |
| `ad_shift.py --screen home\|test\|results` | the screen frame (primary button, scroll viewport) is identical offline (no banner) and online (banner loaded) | test screen: viewport bottom 1978 → 1809 px when the banner loads → exit 1 |
| `check_16k.py <apk> [abis]` | 16 KB ELF and zip alignment of 64-bit native libs | 46/46 ok → exit 0 |
| `cold.sh` | force-stop + open on Metro | — |
| `shot.sh <name> [dir]` | screenshot, full and half size, into `$SHOTS_DIR` or `$TMPDIR/qi-shots` | — |

`ui.py` holds the shared adb/uiautomator helpers.

## Dev-only routes

`app/test.tsx` has two routes behind `__DEV__`, so a release bundle has no
such parameters. Neither reads or writes progress, usage or history: a normal
test left halfway stays resumable, and nothing enters the history.

- `/test?only=patterns`: every pattern item in order (p1…p54).
- `/test?q=<id>`: one question by its id in `data/questions.ts`, to measure
  whether it fits. Add `&lang=pt|en|es` to see it in another language; the
  previous language comes back when the screen is left. The X leaves at once
  (no pause sheet: there is nothing to save); "Confirmar" leaves too.

To open either, the app must already be running its JS bundle (the dev client
shows its launcher otherwise):

```bash
sh scripts/device/cold.sh          # wait for Home
adb shell am start -a android.intent.action.VIEW -d "testeqi://test?only=patterns" com.lhdiniz.testeqi
adb shell am start -a android.intent.action.VIEW -d "testeqi://test?q=69&lang=es" com.lhdiniz.testeqi
```

`check_fit_round.py --only patterns` does the first and then checks and
answers every item; `check_fit_round.py --longest-text` does the second for
the longest text question of each language (`ui.open_single_question`).

## Things that bite

- **Screenshots stay out of the repo.** `shot.sh` writes to a temp folder.
- **`ad_shift.py` toggles airplane mode** with
  `adb shell cmd connectivity airplane-mode enable|disable` and always turns
  it off again; if a run is killed, check `adb shell settings get global airplane_mode_on`.
- **Tapping too fast after a cold start** starts a new test even when one is
  in progress, because Home reads saved progress asynchronously. Scripts that
  need the same question twice compare only what does not depend on it.
- **Accessibility labels carry icon glyphs** (`", Começar teste"`):
  match labels with a search, not an anchored pattern.
- **`answer_all.py` and `ad_shift.py --screen results` add entries to the
  phone's history.** `adb shell pm clear com.lhdiniz.testeqi` resets the app
  (history, theme, language).
- **The dev build shows LogBox toasts** ("Ad failed…" offline); `ui.dismiss_logbox`
  closes them, and they never exist in a release build.
- **`check_fit.py` judges clipping against the option's scroll viewport**:
  uiautomator reports the visible part of a node, so a clipped option's box
  is cut exactly at the viewport's top or bottom edge (a hidden one has no
  height). Until slice 06 it compared each option to the tallest sibling,
  which flagged text questions whose options wrap to different line counts
  even with all four on screen (177 px vs 246 px, both inside the viewport).
  The new rule relies on the content keeping a margin above and below the
  options (the question text above, 32 dp of padding below); an option that
  legitimately touches the edge would be reported as clipped.
- **The test counter counts down on the last five questions** ("faltam 3",
  "última"): `ui.progress` falls back to the counter's accessibility label
  ("Questão 38 de 40") when the visible text has no `N/total`.
- **Alert buttons are upper-case** ("CONTINUAR", "COMEÇAR DE NOVO");
  `ui.resume_button` and `ui.restart_button` match case-insensitively.
- **Home's resume prompt contains the verb three times** (the message, the
  "CONTINUAR" button and Home's own "Continuar teste" behind the Alert):
  `ui.resume_button` matches only a Button whose whole text is the verb.
- **Anything that brings another app to the front kills a round**: on this
  phone the dev build is reclaimed by `lmkd` seconds after going to the
  background. `check_fit_round.py` then stops with `round interrupted after N
  questions` instead of a verdict; leave the phone alone while it runs.
- **Wireless debugging works, except for `ad_shift.py`.** When the USB cable
  drops, `adb mdns services` lists the phone's `_adb-tls-connect` address if
  Wireless debugging is on and this Mac was paired once; `adb connect
  IP:PORT` then needs no code, and `adb reverse tcp:8081` (in `cold.sh`)
  works over it. Set `ANDROID_SERIAL=IP:PORT` so a returning cable does not
  make adb ambiguous. Airplane mode turns Wi-Fi off, so `ad_shift.py` over
  Wi-Fi would cut its own connection and leave the phone offline: run it on
  the cable only.
- **`adb shell` runs the command in the phone's shell**, so an unquoted `&`
  in a deep link ends it there: `testeqi://test?q=13&lang=en` arrived as
  `?q=13` and showed pt. `ui.open_route` quotes the URL; quote it yourself in
  a hand-typed `adb shell am start -d '…'`.
- **A link sent right after a cold start is lost.** While the dev client is
  still loading the bundle, `testeqi://test?mode=detalhado` lands on Home and
  `answer_all.py` reports `0/0`. Wait for Home's start button
  (`ui.wait_for(ui.start_button)`) before sending it.
- **The dev client's floating tools button sits on the top-right corner**,
  over Home's "Ajustes" and the test counter. A tap there opens the Expo
  menu; open Settings with `testeqi://settings` instead. Release builds do
  not have it.
