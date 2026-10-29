"""Checks History: the seeded states and that every row opens its result.

usage: check_history.py [--seed 10]

Writes N history entries into the app's storage (the owner's storage is
copied out first and put back at the end), opens History by link, and taps
each row in turn: Results must open in history mode showing that entry's
score, and back must return to History. Rows below the fold are scrolled to.
Prints `N/N rows open`. Before that it takes a screenshot of History seeded
with 0, 1, 2 and N entries (into $SHOTS_DIR or $TMPDIR/qi-shots).
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

ROW = re.compile(r"^QI (\d+), (.+?), ")
SCORES = [104, 98, 117, 111, 89, 123, 107, 101, 95, 114, 120, 92]


def entries(count):
    out = []
    for i in range(count):
        score = SCORES[i % len(SCORES)]
        out.append({
            "date": f"2026-10-{28 - i:02d}T12:00:00.000Z", "iqScore": score, "percentile": 50 + (score - 100),
            "correctAnswers": 20 + i, "totalQuestions": 40, "mode": "normal", "durationSeconds": 600 + 60 * i,
            "band": {"lower": score - 8, "upper": score + 8},
            "categories": [{"category": "patterns", "correct": 9, "total": 12, "weightEarned": 9, "weightTotal": 12}],
        })
    return out


def rows(nodes):
    return [(n, int(ROW.match(n.label)[1])) for n in ui.ours(nodes) if ROW.match(n.label)]


def inside_list(row, nodes):
    """Whether the row is wholly inside the list's scroll viewport: a row cut
    at the bottom edge sits next to the pinned "Fazer novo teste", and a tap
    on it once started a test instead."""
    lists = [n for n in ui.ours(nodes) if n.cls.endswith("ScrollView")]
    if not lists:
        return True
    top, bottom = lists[0].box[1], lists[0].box[3]
    return row.box[1] >= top and row.box[3] <= bottom and row.height >= round(60 * ui.density())


def open_history(backup, count):
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)
    ui.write_storage(backup, {"testHistory": entries(count)}, ())
    ui.cold_start()
    if not ui.wait_for(ui.start_button, timeout=45)[0]:
        sys.exit("Home did not appear after a cold start")
    ui.open_route("testeqi://history")
    time.sleep(1.5)


def screenshot(folder, name):
    png = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True).stdout
    with open(os.path.join(folder, name), "wb") as handle:
        handle.write(png)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed", type=int, default=10)
    args = parser.parse_args()
    ui.require_device()
    shots = os.environ.get("SHOTS_DIR") or os.path.join(tempfile.gettempdir(), "qi-shots")
    os.makedirs(shots, exist_ok=True)
    width, height = ui.screen_size()

    backup = tempfile.mkdtemp(prefix="rkstorage-backup-")
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)
    ui.pull_storage(backup)
    opened = 0
    try:
        for count in (0, 1, 2, args.seed):
            open_history(backup, count)
            screenshot(shots, f"history-{count}.png")

        seen = set()
        for target in range(args.seed):
            expected = entries(args.seed)[target]["iqScore"]
            row = None
            for _ in range(6):
                nodes = ui.dump()
                found = rows(nodes)
                labels = [n.label for n, _ in found]
                row = next((n for n, s in found if n.label not in seen and s == expected and inside_list(n, nodes)), None)
                if row:
                    break
                ui.adb("shell", "input", "swipe", str(width // 2), str(height // 2), str(width // 2), str(height // 3), "400")
                time.sleep(0.6)
            if not row:
                print(f"row {target + 1}: not found (score {expected}; on screen {labels})")
                continue
            seen.add(row.label)
            ui.tap(row)
            result, nodes = ui.wait_for(lambda n: ui.find(ui.ours(n), pattern=ui.RESULTS_TITLE), timeout=10)
            shown = bool(result) and any(n.label == str(expected) or n.text == str(expected) for n in ui.ours(nodes))
            ui.back()
            back, _ = ui.wait_for(lambda n: rows(n), timeout=10)
            ok = shown and bool(back)
            opened += ok
            print(f"row {target + 1}: {'opens' if ok else 'FAIL'} (score {expected}; Results {'showed it' if shown else 'did not show it'}; back to History {'yes' if back else 'no'})", flush=True)
    finally:
        ui.adb("shell", "am", "force-stop", ui.PACKAGE)
        ui.push_storage(backup)
        shutil.rmtree(backup, ignore_errors=True)
    print(f"{opened}/{args.seed} rows open")
    sys.exit(0 if opened == args.seed else 1)


if __name__ == "__main__":
    main()
