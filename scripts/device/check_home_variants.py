"""Checks the three Home variants: the primary button on the first screen.

usage: check_home_variants.py

For each variant it writes the app's AsyncStorage directly (the app stopped):
  first run    no history, no test in progress
  returning    five history entries, no test in progress
  in progress  a Normal round with 12 of 40 answered
then cold-starts the app and applies check_fit's rules with the variant's
primary button required ("Começar teste", "Fazer novo teste", "Continuar
teste"), and on the first run the three promises too: fully visible above
the banner with no scrolling. A screenshot of
each goes to $SHOTS_DIR (or $TMPDIR/qi-shots). Prints one line per variant,
the system font scale it ran at (read, never changed here), and `N/3`.

The owner's data is kept: the storage files are copied out first and put
back at the end, so nothing needs `pm clear`. Run it once at font scale 1.0
and once at 1.3 (Settings → Display → Font size, set by hand) for the slice's
6/6.
"""
import json
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_fit  # noqa: E402
import ui  # noqa: E402

FILES = ("RKStorage", "RKStorage-wal", "RKStorage-shm")
REMOTE_TMP = "/data/local/tmp/qi-rkstorage"


def run_as(*args):
    return ui.adb("shell", "run-as", ui.PACKAGE, *args)


def pull(folder):
    for name in FILES:
        raw = subprocess.run(["adb", "exec-out", "run-as", ui.PACKAGE, "cat", f"databases/{name}"], capture_output=True).stdout
        if raw and not raw.startswith((b"cat:", b"run-as:")):
            with open(os.path.join(folder, name), "wb") as handle:
                handle.write(raw)


def push(folder):
    """Puts the files in `folder` back as the app's storage; a missing -wal/-shm is removed on the phone."""
    for name in FILES:
        local = os.path.join(folder, name)
        if os.path.exists(local):
            ui.adb("push", local, f"{REMOTE_TMP}-{name}")
            ui.adb("shell", "chmod", "644", f"{REMOTE_TMP}-{name}")
            run_as("cp", f"{REMOTE_TMP}-{name}", f"databases/{name}")
            ui.adb("shell", "rm", "-f", f"{REMOTE_TMP}-{name}")
        else:
            run_as("rm", "-f", f"databases/{name}")


def write_storage(original, values, remove):
    """A copy of `original` with `values` set (JSON) and `remove` deleted, folded into one file, on the phone."""
    with tempfile.TemporaryDirectory() as folder:
        for name in FILES:
            if os.path.exists(os.path.join(original, name)):
                shutil.copy(os.path.join(original, name), folder)
        with sqlite3.connect(os.path.join(folder, "RKStorage")) as db:
            for key in remove:
                db.execute("DELETE FROM catalystLocalStorage WHERE key = ?", (key,))
            for key, value in values.items():
                db.execute("INSERT OR REPLACE INTO catalystLocalStorage (key, value) VALUES (?, ?)", (key, json.dumps(value)))
            db.commit()
            db.execute("PRAGMA wal_checkpoint(TRUNCATE)")
        for name in FILES[1:]:
            path = os.path.join(folder, name)
            if os.path.exists(path):
                os.remove(path)
        push(folder)


def history():
    def entry(day, score):
        return {"date": f"2026-10-{day:02d}T12:00:00.000Z", "iqScore": score, "percentile": 60, "correctAnswers": 25,
                "totalQuestions": 40, "mode": "normal", "band": {"lower": score - 8, "upper": score + 8},
                "categories": [{"category": "patterns", "correct": 9, "total": 12, "weightEarned": 9, "weightTotal": 12}]}
    return [entry(28, 112), entry(25, 104), entry(20, 118), entry(15, 99), entry(10, 107)]


def progress():
    source = open(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "questions.ts")).read()
    ids = re.findall(r'id: "(\d+)"', source)[:40]
    answers = [{"questionId": qid, "isCorrect": i % 3 != 0, "timeSpent": 20} for i, qid in enumerate(ids[:12])]
    return {"currentIndex": 12, "savedAnswers": answers, "questionIds": ids, "mode": "normal", "optionOrders": [[0, 1, 2, 3]] * 40}


TRUST = ("Resultado completo, sem bloqueio", "Sem cadastro", "Sem cronômetro")
VARIANTS = [
    ("first run", {}, ("testHistory", "testProgress"), r"^Começar teste$", TRUST),
    ("returning", {"testHistory": history()}, ("testProgress",), r"^Fazer novo teste$", ()),
    ("in progress", {"testHistory": history(), "testProgress": progress()}, (), r"^Continuar teste$", ()),
]


def main():
    ui.require_device()
    scale = ui.adb("shell", "settings", "get", "system", "font_scale").strip()
    shots = os.environ.get("SHOTS_DIR") or os.path.join(tempfile.gettempdir(), "qi-shots")
    os.makedirs(shots, exist_ok=True)
    backup = tempfile.mkdtemp(prefix="rkstorage-backup-")
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)
    pull(backup)
    if not os.path.exists(os.path.join(backup, "RKStorage")):
        sys.exit("could not copy the app's storage out (is the dev build installed?)")
    passed = 0
    try:
        for name, values, remove, label, extra in VARIANTS:
            ui.adb("shell", "am", "force-stop", ui.PACKAGE)
            write_storage(backup, values, remove)
            ui.cold_start()
            button, nodes = ui.wait_for(lambda n: [x for x in ui.ours(n) if re.search(label, x.label.split(", ")[-1])], timeout=45)
            if not button:
                print(f"{name}: FAIL (no button matching {label})")
                continue
            nodes = ui.dump()
            problems, _ = check_fit.check(nodes, require=(button[0].label,), options=0)
            # Text, not tap targets: present, a whole caption line tall, and
            # above the fixed footer (whose top is the mode chooser's).
            line = round(19 * ui.density())
            footer_top = min((n.box[1] for n in ui.ours(nodes) if n.cls == "android.widget.RadioButton"), default=button[0].box[1])
            for text in extra:
                hits = ui.find(ui.ours(nodes), pattern="^" + re.escape(text) + "$")
                if not hits:
                    problems.append(f"not on screen: {text!r}")
                elif hits[0].height < line or hits[0].box[3] > footer_top:
                    problems.append(f"cut or behind the footer: {hits[0]}")
            png = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True).stdout
            with open(os.path.join(shots, f"home-{name.replace(' ', '-')}-{scale}.png"), "wb") as handle:
                handle.write(png)
            ok = not problems
            passed += ok
            print(f"{name}: {'PASS' if ok else 'FAIL'} ({button[0].label!r} at y {button[0].box[1]}–{button[0].box[3]}{'; ' + '; '.join(problems) if problems else ''})", flush=True)
    finally:
        ui.adb("shell", "am", "force-stop", ui.PACKAGE)
        push(backup)
        shutil.rmtree(backup, ignore_errors=True)
    print(f"font scale {scale}: {passed}/{len(VARIANTS)}")
    sys.exit(0 if passed == len(VARIANTS) else 1)


if __name__ == "__main__":
    main()
