# Plan — UI redesign

From `docs/pitches/ui-redesign.md` (accepted 2026-10-19), extended the same
day by the modes and scoring research (`docs/research/scoring-modes/`,
decisions D6–D9): slices 05b–05e and 03b were inserted, which is why they carry
fractional numbers. The release waits for 05d/05e (D9). The per-screen spec
is `docs/research/ui-redesign/README.md`; each slice names the section it
implements. Decisions D1–D5 are in `docs/architecture/ARCHITECTURE.md`; when a
slice and a decision disagree, the decision wins.

| slice | delivers | new native module (needs a dev build) |
|---|---|---|
| 00 | device harness in `scripts/device/` + static contrast check | — |
| 01 | tokens, typography, motion, haptics | — |
| 02 | `AdSlot` v2 on every screen | — |
| 03 | Results: hero, count-up, curve reveal, area bars | — |
| 03b | Results: band, Verbal/Raciocínio indices, speed (after 05b, 05c) | — |
| 04 | share card image | `react-native-view-shot`, `expo-sharing` |
| 05 | Test — pattern question without scroll | — |
| 05b | modes 20/40/90 and the EAP scoring engine (D6, D8) | — |
| 05c | optional 90 s speed task (D7) | — |
| 05d | bank: +54 text items in pt/en/es, blind-solved (D8) | — |
| 05e | bank: +24 pattern items from a generator (D8) | — |
| 06 | Test — text question, segmented progress, pause sheet | — |
| 07 | finish moment `/finishing` + interstitial | — |
| 08 | Home, three variants | — |
| 09 | History | — |
| 10 | Settings + About sheet | `expo-store-review` |
| 11 | release check on a preview build + store screenshots | — |

## How a slice gets done

One device slice at a time: they share `components/ui/`, `constants/theme.ts`
and one test phone. The bank slices (05d, 05e) need no phone and write to
staging files, so they can run next to a device slice; they merge into
`data/questions.ts` and the translation files only when no screen slice is
open.

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
