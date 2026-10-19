---
tags: [fetch, ui-redesign]
source: /Users/maxter/dev/pessoal/QI-TEST-APP/node_modules/expo/bundledNativeModules.json (expo 57.0.30) + `ls` of /Users/maxter/dev/pessoal/QI-TEST-APP/node_modules + /Users/maxter/dev/pessoal/QI-TEST-APP/package.json
fetched: 2026-10-19
kind: primary
---

# Expo SDK 57 bundled native module versions, and what is installed

> Fetched 2026-10-19 · `bundledNativeModules.json` is the version map `npx expo install` uses for SDK 57. Read to know which version of each candidate library SDK 57 would pick, and `ls` to see which are already in `node_modules`.

## What it says

### `node_modules/expo/bundledNativeModules.json` (verbatim lines)

```
  "expo-blur": "~57.0.3",
  "expo-file-system": "~57.0.7",
  "expo-haptics": "~57.0.3",
  "expo-image": "~57.0.5",
  "expo-linear-gradient": "~57.0.2",
  "expo-media-library": "~57.0.5",
  "expo-sharing": "~57.0.23",
  "lottie-react-native": "~7.3.8",
  "react-native-worklets": "0.10.1",
  "react-native-reanimated": "4.5.1",
  "react-native-svg": "15.15.4",
  "react-native-view-shot": "5.1.0",
  "@shopify/react-native-skia": "2.6.2",
```

### Installed in `node_modules` (by `ls`)

| package | installed? | how |
|---|---|---|
| expo-haptics | yes, 57.0.3 | direct dependency |
| expo-linear-gradient | yes, 57.0.2 | direct dependency |
| react-native-reanimated | yes, 4.5.1 | direct dependency |
| react-native-worklets | yes, 0.10.1 | direct dependency |
| react-native-svg | yes, 15.15.4 | direct dependency |
| expo-dev-client | yes | direct dependency |
| expo-file-system | yes, 57.0.7 | transitive: `node_modules/expo/package.json` declares `"expo-file-system": "~57.0.7"` |
| expo-sharing | **no** | `ls: expo-sharing: No such file or directory` |
| react-native-view-shot | **no** | `ls: react-native-view-shot: No such file or directory` |
| expo-media-library | **no** | not found |
| expo-blur | **no** | not found |
| lottie-react-native | **no** | not found |
| @shopify/react-native-skia | **no** | not found |
| react-native-fast-confetti | **no** | not found |

## What it does not say

- Whether these versions build cleanly together with RN 0.86.3 New Architecture in this project — not built.
- `expo-file-system` being present transitively does not make it a declared dependency; importing it directly from app code without listing it in `package.json` is fragile.
- APK size of any of the missing packages for this app.
