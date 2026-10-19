#!/bin/sh
# Cold-starts the dev build against Metro over USB (Metro must be running:
# npx expo start --dev-client --localhost).
set -e
PKG=com.lhdiniz.testeqi
adb shell am force-stop "$PKG"
adb reverse tcp:8081 tcp:8081 >/dev/null
adb shell am start -a android.intent.action.VIEW \
  -d "exp+teste-de-qi://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081" "$PKG" >/dev/null
