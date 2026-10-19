"""Answers the test on screen until it ends, through uiautomator.

usage: answer_all.py [--seed N] [--start] [--max N]

  --start   tap the home's primary button first (and "Continuar" on a resume
            prompt), so the script can begin from Home
  --seed    random seed for which option gets picked (default 7)

Prints one line per question and exits 0 when the number of answers equals
the total the test announced ("N de 30", "N/30"). Picks options at random, so
the score is noise; this checks the flow, not the scoring.
"""
import argparse
import os
import random
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402

RADIO = "android.widget.RadioButton"


def radios(nodes):
    return [n for n in ui.ours(nodes) if n.cls == RADIO]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--start", action="store_true")
    parser.add_argument("--max", type=int, default=80)
    args = parser.parse_args()
    ui.require_device()
    rng = random.Random(args.seed)

    if args.start:
        found, nodes = ui.wait_for(ui.start_button)
        if not found:
            sys.exit("no start button on screen (expected Home)")
        ui.tap(found)
        time.sleep(1.0)
        nodes = ui.dump()
        resume = ui.find(nodes, pattern=r"\b(Continuar|Retomar|Continue|Resume)")
        if resume:
            ui.tap(resume[0])

    total = None
    answered = 0
    for _ in range(args.max):
        options, nodes = ui.wait_for(radios, timeout=6)
        if ui.dismiss_logbox(nodes):
            options, nodes = ui.wait_for(radios, timeout=6)
        if not options:
            break
        prog = ui.progress(nodes)
        if prog and total is None:
            total = prog[1]
        choice = rng.randrange(len(options))
        ui.tap(options[choice])
        time.sleep(0.35)
        button = ui.primary_button(ui.dump())
        if button is None or not button.enabled:
            print(f"question {answered + 1}: primary button missing or disabled after picking an option")
            sys.exit(1)
        label = f"{prog[0]}/{prog[1]}" if prog else f"#{answered + 1}"
        print(f"{label}: option {choice + 1}/{len(options)} -> {button.label!r}")
        ui.tap(button)
        answered += 1
        time.sleep(0.6)

    total = total or answered
    print(f"{answered}/{total}")
    sys.exit(0 if answered == total and answered > 0 else 1)


if __name__ == "__main__":
    main()
