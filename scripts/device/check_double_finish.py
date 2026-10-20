"""A double tap on the last question's button saves one result, not two.

usage: check_double_finish.py [--mode rapido] [--gap 0.08]

Opens a round from Home, answers it, and on the last question sends two taps
on "Ver meu resultado" from one `adb shell`, `--gap` seconds apart — closer
than a re-render, which is what a quick double tap does. After Results it
reads `testHistory` straight from the app's AsyncStorage and checks the two
ends: the history grew by exactly one entry, and that entry counts as many
answers as the round has questions (a second confirm would also append a
duplicate answer, so 21 of 20).

Exit 0 on PASS. Revert the guard in app/test.tsx (`finishingRef`) and this
must print FAIL.
"""
import argparse
import os
import random
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402
from answer_all import radios, reveal  # noqa: E402

FINISH = r"(?i)^(Ver meu resultado|See my result|Ver mi resultado)$"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", default="rapido")
    parser.add_argument("--gap", type=float, default=0.08)
    parser.add_argument("--seed", type=int, default=11)
    args = parser.parse_args()
    ui.require_device()
    rng = random.Random(args.seed)

    ui.cold_start()
    found, _ = ui.wait_for(ui.start_button, timeout=40)
    if not found:
        sys.exit("Home did not come up")
    before = ui.read_storage("testHistory") or []
    ui.open_route(f"testeqi://test?mode={args.mode}")

    total = None
    for _ in range(120):
        options, nodes = ui.wait_for(radios, timeout=8)
        if not options:
            sys.exit("no options on screen before the last question")
        prog = ui.progress(nodes)
        total = total or (prog and prog[1])
        ui.tap(reveal(options[rng.randrange(len(options))], nodes))
        time.sleep(0.35)
        button = ui.primary_button(ui.dump())
        if button is None or not button.enabled:
            sys.exit("primary button missing or disabled after picking an option")
        if re.fullmatch(FINISH, button.label.strip()):
            x, y = button.center
            ui.adb("shell", f"input tap {x} {y} & sleep {args.gap}; input tap {x} {y}; wait")
            break
        ui.tap(button)
        time.sleep(0.6)
    else:
        sys.exit("never reached the last question")

    # Without the guard Results can lag behind the second save; the history
    # is the verdict either way, so it is read even when Results is missed.
    reached = ui.reach_results()
    time.sleep(2)
    after = ui.read_storage("testHistory") or []

    added = after[: len(after) - len(before)]
    print(f"round of {total}; history {len(before)} -> {len(after)}; Results {'seen' if reached else 'not seen'}")
    for entry in added:
        print(f"  {entry['date']}  {entry['totalQuestions']} answers  IQ {entry['iqScore']}  mode {entry.get('mode')}")

    ok = len(added) == 1 and added[0]["totalQuestions"] == total
    print("PASS" if ok else "FAIL")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
