"""The release gate on a preview (release-JS) build installed on the phone.

usage: release_gate.py <preview.apk>

Runs the gates that only a release build can answer, with QI_RELEASE=1 (no
dev client, no Metro, no `__DEV__` logs, no `run-as`):
  reveal     Results opened by link with a Detalhado entry, its reveal
             played; `dumpsys gfxinfo` over it: janky frames <= 10% and the
             90th percentile frame time < 18 ms (the A15 runs at 90 Hz)
  16k        check_16k.py on the APK: every 64-bit native lib 16 KB aligned
  contrast   check_contrast.py: the colour tokens, both themes
  round      check_fit_round.py: a Normal round from Home, each question fits
  offline    airplane mode, a Rápido round by link to its last answer: Results
             within 4.5 s of it (the finish moment hands over at 2 s; the rest
             is the dump's latency), no ad
  banner     ad_shift.py --screen test: the frame does not move when the
             banner loads
Prints `<gate>: PASS|FAIL (...)` per gate; exits 0 only when all pass. The
gates that need the dev build's routes, logs or storage access (pattern items
54/54, longest text 3/3, share image, force-stop during the ad, haptics,
review prompt) keep their dev-build results; "Remove animations" is a
system setting and is left to the owner.
"""
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse

os.environ["QI_RELEASE"] = "1"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_results_band  # noqa: E402
import ui  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
RADIO = "android.widget.RadioButton"


def script(name, *args, timeout=900):
    run = subprocess.run([sys.executable, "-I", os.path.join(HERE, name), *args], capture_output=True, text=True,
                         timeout=timeout, env={**os.environ, "QI_RELEASE": "1"})
    lines = [line for line in run.stdout.strip().splitlines() if line.strip()]
    return run.returncode, lines[-1] if lines else run.stderr.strip()[-200:]


def gate_reveal():
    ui.cold_start()
    ui.wait_for(ui.start_button, timeout=45)
    ui.adb("shell", "dumpsys", "gfxinfo", ui.PACKAGE, "reset")
    entry = check_results_band.ENTRIES["detalhado"]
    ui.open_route("testeqi://results?entry=" + urllib.parse.quote(json.dumps(entry, ensure_ascii=False), safe=""))
    time.sleep(4.5)
    out = ui.adb("shell", "dumpsys", "gfxinfo", ui.PACKAGE)
    total = re.search(r"Total frames rendered: (\d+)", out)
    janky = re.search(r"Janky frames: (\d+) \(([\d.]+)%\)", out)
    p90 = re.search(r"90th percentile: (\d+)ms", out)
    ui.back()
    if not (total and janky and p90):
        return False, "no gfxinfo numbers"
    ok = float(janky[2]) <= 10 and int(p90[1]) < 18
    return ok, f"{total[1]} frames, janky {janky[1]} ({janky[2]}%), 90th percentile {p90[1]} ms"


def gate_offline():
    ui.adb("shell", "cmd", "connectivity", "airplane-mode", "enable")
    try:
        time.sleep(2.5)
        ui.cold_start()
        ui.wait_for(ui.start_button, timeout=45)
        ui.open_route("testeqi://test?mode=rapido")
        _, nodes = ui.wait_for(lambda n: ui.progress(n), timeout=15)
        if ui.progress(nodes) != (1, 20):
            return False, f"the link did not open a fresh Rápido round: {ui.progress(nodes)}"
        subprocess.run([sys.executable, "-I", os.path.join(HERE, "answer_all.py"), "--max", "19"], capture_output=True,
                       env={**os.environ, "QI_RELEASE": "1"})
        options, nodes = ui.wait_for(lambda n: [x for x in ui.ours(n) if x.cls == RADIO], timeout=10)
        ui.tap(options[0])
        time.sleep(0.4)
        button = ui.primary_button(ui.dump())
        started = time.time()
        ui.tap(button)
        found, _ = ui.wait_for(lambda n: ui.find(ui.ours(n), pattern=ui.RESULTS_TITLE), timeout=15, interval=0.2)
        elapsed = time.time() - started
    finally:
        ui.adb("shell", "cmd", "connectivity", "airplane-mode", "disable")
    return bool(found) and elapsed <= 4.5, f"Results {'after %.1f s' % elapsed if found else 'never appeared'}"


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    apk = sys.argv[1]
    ui.require_device()
    results = []

    def record(name, ok, detail):
        results.append(ok)
        print(f"{name}: {'PASS' if ok else 'FAIL'} ({detail})", flush=True)

    record("reveal", *gate_reveal())
    code, last = script("check_16k.py", apk)
    record("16k", code == 0, last)
    code, last = script("check_contrast.py")
    record("contrast", code == 0, last)
    code, last = script("check_fit_round.py")
    record("round", code == 0, last)
    record("offline", *gate_offline())
    code, last = script("ad_shift.py", "--screen", "test")
    record("banner", code == 0, last)
    print(f"{sum(results)}/{len(results)} gates pass")
    sys.exit(0 if all(results) else 1)


if __name__ == "__main__":
    main()
