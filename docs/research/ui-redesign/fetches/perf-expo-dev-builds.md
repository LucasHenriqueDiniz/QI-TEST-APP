---
tags: [fetch, ui-redesign]
source: https://docs.expo.dev/develop/development-builds/use-development-builds/
fetched: 2026-10-19
kind: primary
---

# Use a development build — Expo docs

> Fetched 2026-10-19 · Expo guide on development builds (page unversioned, last modified 2026-07-17). Read because the app already uses `expo-dev-client`, to confirm adding native modules (expo-sharing, view-shot, Lottie, Skia, blur) needs a new build.

Quotes extracted with WebFetch; short passages only.

## What it says

- After adding a library with native code: "you will have to rebuild the development client".
- Reason: "the native code of the library is not included in the development client automatically".
- JS-only iteration: you "won't have to wait for the native build process until you change the underlying native code."

## What it does not say

- Not pinned to SDK 57.
- Does not cover OTA (EAS Update) implications: a JS bundle that imports a native module missing from the installed binary will fail at runtime — inference, not stated here.
