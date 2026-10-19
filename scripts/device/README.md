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
| `answer_all.py [--start] [--seed N]` | answers the test on screen to the end; `N/N` | `30/30` → exit 0 |
| `check_fit.py [--require LABEL] [--options N]` | options, primary button and labels fully visible, none clipped, none under the banner | pattern question: options 3–4 clipped to 35 px → exit 1; short text question → exit 0 |
| `check_fit_round.py [--only patterns] [--seed N]` | opens a round (the 30 pattern items in order with `--only patterns`), runs `check_fit`'s rules on every question after the layout settles, answers it; `N/N fit` | pattern round: `30/30 fit` in light and dark → exit 0 |
| `ad_shift.py --screen home\|test\|results` | the screen frame (primary button, scroll viewport) is identical offline (no banner) and online (banner loaded) | test screen: viewport bottom 1978 → 1809 px when the banner loads → exit 1 |
| `check_16k.py <apk> [abis]` | 16 KB ELF and zip alignment of 64-bit native libs | 46/46 ok → exit 0 |
| `cold.sh` | force-stop + open on Metro | — |
| `shot.sh <name> [dir]` | screenshot, full and half size, into `$SHOTS_DIR` or `$TMPDIR/qi-shots` | — |

`ui.py` holds the shared adb/uiautomator helpers.

## The pattern-only round (dev build only)

`app/test.tsx` builds a round of the 30 pattern items, in order (p1…p30), when
opened as `/test?only=patterns`; the branch sits behind `__DEV__`, so a release
bundle has no such route parameter. The round reads and writes nothing: a
normal test left halfway stays resumable, and the dev round does not enter the
history. To open it, the app must already be running its JS bundle (the dev
client shows its launcher otherwise):

```bash
sh scripts/device/cold.sh          # wait for Home
adb shell am start -a android.intent.action.VIEW -d "testeqi://test?only=patterns" com.lhdiniz.testeqi
```

`check_fit_round.py --only patterns` does exactly this and then checks and
answers every item.

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
- **`check_fit.py` judges clipping by comparing each option to the tallest
  one**, which is right for the pattern grid (equal cells) but fails a text
  question whose options wrap to different line counts even with all four on
  screen (measured: 177 px vs 246 px, both inside the viewport). Run it on a
  question with single-line options, or extend the rule before trusting it on
  mixed ones.
- **Home's resume prompt contains the verb three times** (the message, the
  "CONTINUAR" button and Home's own "Continuar teste" behind the Alert):
  `ui.resume_button` matches only a Button whose whole text is the verb.
- **Anything that brings another app to the front kills a round**: on this
  phone the dev build is reclaimed by `lmkd` seconds after going to the
  background. `check_fit_round.py` then stops with `round interrupted after N
  questions` instead of a verdict; leave the phone alone while it runs.
