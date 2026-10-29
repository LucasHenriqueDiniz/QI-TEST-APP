"""Checks that "Vibração" off silences every haptic through a whole round.

usage: check_haptics_off.py [--on]

Writes `hapticsEnabled: false` into the app's storage (the owner's storage is
copied out first and put back at the end, so the round played here leaves no
trace), cold-starts, opens a Rápido round by link and answers it with
answer_all.py through the finish moment to Results. Every haptic the app
fires logs a `__DEV__` line `[haptics] <kind>`; the script counts them.
Prints `<n> haptic calls over <answered>/<total>`; exits 0 when n is 0.
`--on` runs the same round with haptics on, as the red check (n > 0).
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--on", action="store_true", help="haptics on: the red check")
    args = parser.parse_args()
    ui.require_device()

    backup = tempfile.mkdtemp(prefix="rkstorage-backup-")
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)
    ui.pull_storage(backup)
    try:
        ui.write_storage(backup, {"hapticsEnabled": args.on}, ("testProgress",))
        ui.cold_start()
        if not ui.wait_for(ui.start_button, timeout=45)[0]:
            sys.exit("Home did not appear after a cold start")
        ui.adb("logcat", "-c")
        ui.open_route("testeqi://test?mode=rapido")
        ui.wait_for(lambda n: ui.progress(n), timeout=15)
        run = subprocess.run([sys.executable, "-I", os.path.join(HERE, "answer_all.py"), "--max", "25"], capture_output=True, text=True)
        answered = re.search(r"^(\d+)/(\d+)$", run.stdout.strip().splitlines()[-1]) if run.stdout.strip() else None
        ui.reach_results(timeout=30)
        time.sleep(3)  # the reveal's haptic lands at 1.35 s
        log = ui.adb("logcat", "-d", "-v", "raw", "-s", "ReactNativeJS:*")
    finally:
        ui.adb("shell", "am", "force-stop", ui.PACKAGE)
        ui.push_storage(backup)
        shutil.rmtree(backup, ignore_errors=True)

    calls = len(re.findall(r"\[haptics\] \w+", log))
    done = f"{answered[1]}/{answered[2]}" if answered else "?/?"
    print(f"{calls} haptic calls over {done} ({'haptics on' if args.on else 'Vibração off'})")
    ok = (calls > 0) if args.on else (calls == 0 and answered is not None and answered[1] == answered[2])
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
