"""The release gate on a preview (release-JS) build installed on the phone.

usage: release_gate.py <preview.apk> [--only=reveal,offline,...]

Runs the gates that only a release build can answer, with QI_RELEASE=1 (no
dev client, no Metro, no `__DEV__` logs, no `run-as`):
  reveal     Results opened by link with a Detalhado entry, its reveal
             played; `dumpsys gfxinfo` over it: janky frames (Android's own,
             deadline-based) <= 10% and at most 2 missed vsyncs. The 90th
             percentile is printed but not gated: it is total frame time,
             which pipelining keeps above 11 ms at 90 Hz without dropping a
             frame; Results with no animation scores worse on it (p90 29-30
             ms over 92 frames) than the reveal (22-23 ms over ~540).
  16k        check_16k.py on the APK: every 64-bit native lib 16 KB aligned
  contrast   check_contrast.py: the colour tokens, both themes
  round      check_fit_round.py: a Normal round from Home, each question fits
  offline    airplane mode, a Rápido round by link to its last answer, the
             screen recorded through it: from the first frame of the finish
             moment to the first frame of Results (its violet hero) <= 2.7 s
             (the hand-over is at 2 s). Timed on video because uiautomator
             cannot dump during the reveal and its retries read 7.7 s.
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
import tempfile
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
    missed = re.search(r"Number Missed Vsync: (\d+)", out)
    p90 = re.search(r"90th percentile: (\d+)ms", out)
    ui.back()
    if not (total and janky and missed):
        return False, "no gfxinfo numbers"
    ok = float(janky[2]) <= 10 and int(missed[1]) <= 2
    return ok, f"{total[1]} frames, janky {janky[1]} ({janky[2]}%), missed vsync {missed[1]}, p90 {p90[1] if p90 else '?'} ms (not gated)"


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
        recording = subprocess.Popen(["adb", "shell", "screenrecord", "--time-limit", "8", "/sdcard/qi-offline.mp4"])
        time.sleep(1.0)
        ui.tap(button)
        recording.wait()
    finally:
        ui.adb("shell", "cmd", "connectivity", "airplane-mode", "disable")
    finishing, results = finish_timeline()
    if finishing is None or results is None:
        return False, f"finish moment at {finishing} s, Results at {results} s in the video"
    gap = results - finishing
    return gap <= 2.7, f"finish moment at {finishing:.2f} s, Results at {results:.2f} s: {gap:.2f} s apart"


def finish_timeline():
    """(finish moment, Results) first-frame times in the offline recording, from the top band's colour:
    the question screen is grey-dark (~67,66,80), the finish moment's glow violet-dark (~30,23,73), the
    Results hero bright violet (~105,93,234)."""
    folder = tempfile.mkdtemp(prefix="qi-offline-")
    video = os.path.join(folder, "offline.mp4")
    subprocess.run(["adb", "pull", "/sdcard/qi-offline.mp4", video], capture_output=True)
    subprocess.run(["swift", os.path.join(HERE, "video_frames.swift"), video, folder, "30"], capture_output=True)
    finishing = results = None
    for name in sorted(f for f in os.listdir(folder) if f.endswith(".png")):
        colour = subprocess.run(["magick", os.path.join(folder, name), "-crop", "360x60+0+90", "-scale", "1x1!",
                                 "-format", "%[fx:int(255*r)] %[fx:int(255*g)] %[fx:int(255*b)]", "info:"],
                                capture_output=True, text=True).stdout.split()
        r, g, b = (int(v) for v in colour)
        at = int(re.search(r"_(\d+)ms", name)[1]) / 1000
        if finishing is None and b - r > 35 and r < 50:
            finishing = at
        if results is None and b > 200 and r > 80:
            results = at
    return finishing, results


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--only=")]
    only = next((a.split("=", 1)[1].split(",") for a in sys.argv[1:] if a.startswith("--only=")), None)
    if len(args) != 1:
        sys.exit(__doc__)
    apk = args[0]
    ui.require_device()
    results = []

    def record(name, ok, detail):
        results.append(ok)
        print(f"{name}: {'PASS' if ok else 'FAIL'} ({detail})", flush=True)

    def gate(name):
        return only is None or name in only

    if gate("reveal"):
        record("reveal", *gate_reveal())
    if gate("16k"):
        code, last = script("check_16k.py", apk)
        record("16k", code == 0, last)
    if gate("contrast"):
        code, last = script("check_contrast.py")
        record("contrast", code == 0, last)
    if gate("round"):
        code, last = script("check_fit_round.py")
        record("round", code == 0, last)
    if gate("offline"):
        record("offline", *gate_offline())
    if gate("banner"):
        code, last = script("ad_shift.py", "--screen", "test")
        record("banner", code == 0, last)
    print(f"{sum(results)}/{len(results)} gates pass")
    sys.exit(0 if all(results) else 1)


if __name__ == "__main__":
    main()
