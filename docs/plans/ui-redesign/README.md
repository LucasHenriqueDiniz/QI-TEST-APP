# Plan — UI redesign

From `docs/pitches/ui-redesign.md` (accepted 2026-10-19). The per-screen spec
is `docs/research/ui-redesign/README.md`; each slice names the section it
implements. Decisions D1–D5 are in `docs/architecture/ARCHITECTURE.md`; when a
slice and a decision disagree, the decision wins.

| slice | delivers | new native module (needs a dev build) |
|---|---|---|
| 00 | device harness in `scripts/device/` + static contrast check | — |
| 01 | tokens, typography, motion, haptics | — |
| 02 | `AdSlot` v2 on every screen | — |
| 03 | Results: hero, count-up, curve reveal, area bars | — |
| 04 | share card image | `react-native-view-shot`, `expo-sharing` |
| 05 | Test — pattern question without scroll | — |
| 06 | Test — text question, segmented progress, pause sheet | — |
| 07 | finish moment `/finishing` + interstitial | — |
| 08 | Home, three variants | — |
| 09 | History | — |
| 10 | Settings + About sheet | `expo-store-review` |
| 11 | release check on a preview build + store screenshots | — |

## How a slice gets done

One slice at a time, in order: every slice touches `components/ui/` or
`constants/theme.ts`, and there is one test phone.

1. **Implement.** A Fable agent gets the slice file, the research section it
   names, and this README. It works in the main checkout with Metro running
   (`npx expo start --dev-client --localhost`) and the phone on USB.
2. **Verify on the device.** The slice's "Done when" commands run against the
   Galaxy A15 (Android 16, 384×832 dp). `tsc --noEmit` passing is necessary and
   never sufficient. A slice that adds a native module first needs a new EAS
   `development` build installed (`eas build:run` downloads, `adb install -r`
   installs; the harness README has the commands).
3. **Review.** A second agent (or the orchestrator) reads the diff against the
   slice and the research section, re-runs the commands, and looks at the
   screenshots in both themes. Findings go back to step 1.
4. **Commit.** One commit per slice (more if the slice has separable parts),
   English, `<area>: <what changed>`, body says what was measured. Flip the
   slice's `status:` to `done`.

## Rules every slice inherits

- Colours only through `useAppTheme()`; text only through `ThemedText`; every
  visible string in all three `assets/i18n/translations/*.ts`.
- Animate `transform` and `opacity` only. Springs use the slice-01 tokens
  (`mass: 1` explicit). No blur, Lottie, Skia, animated shadows.
- Haptics only through `utils/haptics.ts` (slice 01).
- One `AdSlot` per screen, never inside scroll content (slice 02, D2).
- Never colour a score by tier or red; never clinical labels.
- Screenshots and recordings go to the session scratchpad, not the repo.
