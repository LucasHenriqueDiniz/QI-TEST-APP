"""Captures the raw store screenshots on a preview (release) build, per language.

usage: store_shots.py <out-dir> [--langs pt,en,es]

With QI_RELEASE=1 (no dev client, so no floating dev button in the shots).
Expects the app's storage to hold a showcase history (written beforehand on
the dev build, see scripts/store/README.md). For each language it switches
the app's language in Settings and saves, as <out-dir>/<lang>/<n>-<name>.png:
  1-result    Results revealing the newest history entry
  2-pattern   the first pattern question of a fresh Normal round (the round
              is then left and discarded with "Recomeçar")
  3-profile   that Results scrolled to the profile (indices and areas)
  4-history   History
  5-home      Home
  6-settings  Settings
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse

os.environ["QI_RELEASE"] = "1"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402

RADIO = "android.widget.RadioButton"
LANGUAGE_ROW = {"pt": "Português", "en": "English", "es": "Español"}
ZOOM = r"(?i)^(Ampliar|Zoom)$"
LEAVE = r"(?i)^(Sair e continuar depois|Leave and continue later|Salir y continuar después)$"


def shot(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as handle:
        handle.write(subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True).stdout)


def home():
    ui.cold_start()
    if not ui.wait_for(ui.start_button, timeout=45)[0]:
        sys.exit("Home did not appear")
    time.sleep(1.5)


def set_language(lang):
    ui.open_route("testeqi://settings")
    row, _ = ui.wait_for(lambda n: ui.find(ui.ours(n), pattern=f"^{LANGUAGE_ROW[lang]}$"), timeout=10)
    ui.tap(row[0])
    time.sleep(1.0)
    ui.back()
    time.sleep(1.0)


def newest_entry():
    """The showcase's newest entry, as the app saved it, read back from the screen is not possible on a
    release build; scripts/store/showcase.json holds the same history the dev build wrote."""
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return json.load(open(os.path.join(here, "store", "showcase.json")))["testHistory"][0]


def pattern_question():
    ui.tap(ui.start_button(ui.dump()))
    for _ in range(40):
        options, nodes = ui.wait_for(lambda n: [x for x in ui.ours(n) if x.cls == RADIO], timeout=10)
        if ui.find(ui.ours(nodes), pattern=ZOOM):
            time.sleep(1.0)
            return True
        ui.tap(options[0])
        time.sleep(0.35)
        ui.tap(ui.primary_button(ui.dump()))
        time.sleep(0.8)
    return False


def leave_round():
    ui.back()
    leave, _ = ui.wait_for(lambda n: [x for x in ui.ours(n) if re.search(LEAVE, x.label)], timeout=10)
    if leave:
        ui.tap(leave[0])
    ui.wait_for(ui.start_button, timeout=10)
    ui.discard_progress()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("out")
    parser.add_argument("--langs", default="pt,en,es")
    args = parser.parse_args()
    ui.require_device()
    entry = newest_entry()
    link = urllib.parse.quote(json.dumps(entry, ensure_ascii=False), safe="")
    width, height = ui.screen_size()

    for lang in args.langs.split(","):
        out = os.path.join(args.out, lang)
        home()
        set_language(lang)

        ui.open_route(f"testeqi://results?entry={link}")
        time.sleep(4.0)
        shot(os.path.join(out, "1-result.png"))
        ui.back()
        time.sleep(1.0)

        home()
        if pattern_question():
            shot(os.path.join(out, "2-pattern.png"))
        leave_round()

        ui.open_route(f"testeqi://results?mode=history&entry={link}")
        time.sleep(1.5)
        ui.adb("shell", "input", "swipe", str(width // 2), str(height * 3 // 4), str(width // 2), str(height // 4), "500")
        time.sleep(1.2)
        shot(os.path.join(out, "3-profile.png"))
        ui.back()
        time.sleep(1.0)

        ui.open_route("testeqi://history")
        time.sleep(1.5)
        shot(os.path.join(out, "4-history.png"))
        ui.back()

        home()
        shot(os.path.join(out, "5-home.png"))

        ui.open_route("testeqi://settings")
        time.sleep(1.5)
        shot(os.path.join(out, "6-settings.png"))
        ui.back()
        print(f"{lang}: 6 shots in {out}", flush=True)


if __name__ == "__main__":
    main()
