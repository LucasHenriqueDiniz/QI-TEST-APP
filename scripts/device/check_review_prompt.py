"""Checks when Results asks for a Play Store review.

usage: check_review_prompt.py

Writes one history entry (score 100) and no previous request into the app's
storage (the owner's storage is copied out first and put back at the end),
then opens Results by link three times and reads the `__DEV__` lines
`[review] ...` that utils/reviewPrompt.ts writes:
  1. a new entry scoring 120, revealed (beats the best): `requested`
  2. the same entry in history mode: no `[review]` line at all
  3. a new entry scoring 100, revealed (ties the best), right after: skipped,
     asked less than 30 days ago
Prints one line per case and `N/3`; exits 0 at 3/3. On a sideloaded build
the Play sheet itself does not appear; the request is what is checked.
"""
import json
import os
import re
import shutil
import sys
import tempfile
import time
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402

WAIT_S = 6  # the request goes out 3.7 s after Results opens


def entry(date, score):
    return {"date": date, "iqScore": score, "percentile": 50, "correctAnswers": 20, "totalQuestions": 40, "mode": "normal",
            "band": {"lower": score - 8, "upper": score + 8},
            "categories": [{"category": "patterns", "correct": 9, "total": 12, "weightEarned": 9, "weightTotal": 12}]}


def open_results(item, history_mode):
    ui.adb("logcat", "-c")
    params = {"entry": json.dumps(item)}
    if history_mode:
        params["mode"] = "history"
    ui.open_route("testeqi://results?" + urllib.parse.urlencode(params, quote_via=urllib.parse.quote))
    time.sleep(WAIT_S)
    lines = re.findall(r"\[review\] (.+)", ui.adb("logcat", "-d", "-v", "raw", "-s", "ReactNativeJS:*"))
    ui.back()
    ui.wait_for(ui.start_button, timeout=10)
    return lines


def main():
    ui.require_device()
    backup = tempfile.mkdtemp(prefix="rkstorage-backup-")
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)
    ui.pull_storage(backup)
    results = []
    try:
        ui.write_storage(backup, {"testHistory": [entry("2026-10-01T12:00:00.000Z", 100)]}, ("reviewPromptedAt", "testProgress"))
        ui.cold_start()
        if not ui.wait_for(ui.start_button, timeout=45)[0]:
            sys.exit("Home did not appear after a cold start")

        best = entry("2026-10-29T12:00:00.000Z", 120)
        lines = open_results(best, history_mode=False)
        results.append(("beats the best, revealed", lines == ["requested"], lines))
        lines = open_results(best, history_mode=True)
        results.append(("history mode", lines == [], lines))
        lines = open_results(entry("2026-10-29T13:00:00.000Z", 100), history_mode=False)
        results.append(("ties the best, right after", len(lines) == 1 and lines[0].startswith("skipped: asked less than 30 days"), lines))
    finally:
        ui.adb("shell", "am", "force-stop", ui.PACKAGE)
        ui.push_storage(backup)
        shutil.rmtree(backup, ignore_errors=True)

    for name, ok, lines in results:
        print(f"{name}: {'PASS' if ok else 'FAIL'} ({lines or 'no [review] line'})")
    passed = sum(ok for _, ok, _ in results)
    print(f"{passed}/3")
    sys.exit(0 if passed == 3 else 1)


if __name__ == "__main__":
    main()
