"""Checks the finish moment (`/finishing`) between the last answer and Results.

usage: check_finish.py [--only timing|offline|killed]

Each check cold-starts the app, opens a Rápido round (20 questions) by link,
answers 19 with answer_all.py and then the last one itself, and reads the
`__DEV__` lines the app writes to logcat (device clock, so the gaps are exact):
  `[finish] last answer`            test.tsx, on the last confirm
  `[finishing] shown`               finishing.tsx, on mount
  `[finishing] leaving ad=<bool>`   finishing.tsx, when it hands over to Results
                                    (ad=true: the interstitial is being shown)

  timing   online: "shown" within 1 s of the last answer, the ad shown
           at >= 1.5 s after "shown", and Results after the ad is closed.
  offline  airplane mode from the cold start (no ad can load): "leaving
           ad=false" within 3 s of the last answer, then Results.
  killed   online: force-stop while the ad is on screen; the newest history
           entry is this round's (Rápido, 20 questions, saved after it began).

Prints `<check>: PASS|FAIL (...)` per check; exits 0 only when all pass.
Airplane mode needs the USB cable (it turns Wi-Fi off), and is always turned
off again.
"""
import argparse
import datetime
import os
import re
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
RADIO = "android.widget.RadioButton"
LINE = re.compile(r"^\s*(\d+\.\d+).*?\[(finish|finishing)\] (.*)$")


def airplane(on):
    ui.adb("shell", "cmd", "connectivity", "airplane-mode", "enable" if on else "disable")


def radios(nodes):
    return [n for n in ui.ours(nodes) if n.cls == RADIO]


def play_to_last_answer():
    """Cold start, Rápido by link, 19 answers by answer_all, the 20th here; returns when confirmed."""
    ui.cold_start()
    home, _ = ui.wait_for(ui.start_button, timeout=45)
    if not home:
        sys.exit("Home did not appear after a cold start")
    ui.open_route("testeqi://test?mode=rapido")
    opened, nodes = ui.wait_for(lambda n: ui.progress(n), timeout=15)
    if ui.progress(nodes) != (1, 20):
        sys.exit(f"the link did not open a fresh Rápido round: {ui.progress(nodes)}")
    subprocess.run([sys.executable, "-I", os.path.join(HERE, "answer_all.py"), "--max", "19"], capture_output=True)
    options, nodes = ui.wait_for(radios, timeout=10)
    if not options or ui.progress(nodes) != (20, 20):
        sys.exit(f"expected the last question, got {ui.progress(nodes)}")
    ui.tap(options[0])
    time.sleep(0.4)
    button = ui.primary_button(ui.dump())
    if button is None or not button.enabled:
        sys.exit("the last question's primary button is missing or disabled")
    ui.adb("logcat", "-c")
    ui.tap(button)


def events(wait):
    """{'last answer': t, 'shown': t, 'leaving': (t, ad)} from logcat, after `wait` s."""
    time.sleep(wait)
    out = ui.adb("logcat", "-d", "-v", "epoch", "-s", "ReactNativeJS:*")
    found = {}
    for line in out.splitlines():
        m = LINE.match(line)
        if not m:
            continue
        t, what = float(m[1]), m[3].strip()
        if what == "last answer":
            found["last answer"] = t
        elif what == "shown":
            found["shown"] = t
        elif what.startswith("leaving"):
            found["leaving"] = (t, what.endswith("ad=true"))
    return found


def ad_on_screen():
    out = ui.adb("shell", "dumpsys", "activity", "activities")
    return any("AdActivity" in line for line in out.splitlines() if "ResumedActivity" in line)


def check_timing():
    play_to_last_answer()
    seen = events(4.0)
    if not {"last answer", "shown", "leaving"} <= seen.keys():
        return False, f"missing log lines: {sorted(seen)}"
    to_shown = seen["shown"] - seen["last answer"]
    leaving, ad = seen["leaving"]
    on_screen = leaving - seen["shown"]
    showing = ad_on_screen()
    results = ui.reach_results(timeout=30)
    ok = to_shown <= 1.0 and ad and on_screen >= 1.5 and showing and results
    return ok, f"shown {to_shown:.2f} s after the last answer; ad={ad} after {on_screen:.2f} s on screen; AdActivity resumed={showing}; Results={results}"


def check_offline():
    airplane(True)
    try:
        time.sleep(2)
        play_to_last_answer()
        seen = events(3.5)
        results = ui.reach_results(timeout=15)
    finally:
        airplane(False)
    if not {"last answer", "shown", "leaving"} <= seen.keys():
        return False, f"missing log lines: {sorted(seen)}"
    leaving, ad = seen["leaving"]
    to_results = leaving - seen["last answer"]
    ok = not ad and to_results <= 3.0 and results
    return ok, f"finishing shown after {seen['shown'] - seen['last answer']:.2f} s; left for Results {to_results:.2f} s after the last answer, ad={ad}; Results={results}"


def check_killed():
    started = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(seconds=5)
    play_to_last_answer()
    seen = events(3.0)
    deadline = time.time() + 10
    while not ad_on_screen() and time.time() < deadline:
        time.sleep(0.5)
    showing = ad_on_screen()
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)
    history = ui.read_storage("testHistory") or []
    newest = history[0] if history else {}
    saved = datetime.datetime.fromisoformat(newest.get("date", "1970-01-01T00:00:00+00:00").replace("Z", "+00:00"))
    ok = showing and newest.get("mode") == "rapido" and newest.get("totalQuestions") == 20 and saved >= started
    return ok, f"ad on screen when killed={showing}; newest entry: mode {newest.get('mode')}, {newest.get('totalQuestions')} questions, saved {saved.isoformat(timespec='seconds')}"


CHECKS = {"timing": check_timing, "offline": check_offline, "killed": check_killed}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", choices=sorted(CHECKS))
    args = parser.parse_args()
    ui.require_device()
    results = []
    for name, check in CHECKS.items():
        if args.only and name != args.only:
            continue
        ok, detail = check()
        results.append(ok)
        print(f"{name}: {'PASS' if ok else 'FAIL'} ({detail})", flush=True)
    sys.exit(0 if all(results) else 1)


if __name__ == "__main__":
    main()
