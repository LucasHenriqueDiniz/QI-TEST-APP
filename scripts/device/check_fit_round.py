"""Checks that every question of a round fits on screen, answering through it.

usage: check_fit_round.py [--only patterns] [--seed N] [--max N]

  --only patterns   open the dev-only round of the 30 pattern items, in order
                    (testeqi://test?only=patterns; the branch exists only in a
                    dev bundle and saves nothing). Without it a normal round
                    starts from Home, resuming a saved one when asked.

Cold-starts the app, opens the round and, for each question: waits until the
layout settles (two consecutive dumps with the same option boxes), applies
check_fit's rules to that dump (imported, not copied), then answers it (random
option, primary button). Prints one line per question, lists the failing ones
with their progress number and problems, then `N/N fit`; exits 0 only when
every question of the round fit. Ends on Results (the interstitial is closed
on the way), so the round is finished.
"""
import argparse
import os
import random
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import answer_all  # noqa: E402
import check_fit  # noqa: E402
import ui  # noqa: E402

RADIO = "android.widget.RadioButton"


def radios(nodes):
    return [n for n in ui.ours(nodes) if n.cls == RADIO]


def open_round(only):
    ui.cold_start()
    start, _ = ui.wait_for(ui.start_button, timeout=45)
    if not start:
        sys.exit("Home did not appear after a cold start (is Metro running?)")
    if only == "patterns":
        ui.open_dev_round()
    else:
        ui.tap(start)
        time.sleep(1.0)
        resume = ui.resume_button(ui.dump())
        if resume:
            ui.tap(resume)
    found, _ = ui.wait_for(radios, timeout=20)
    if not found:
        sys.exit("no question appeared")


def settled(timeout=6.0):
    """Dumps until two consecutive dumps show the same option boxes.

    The pattern question sizes itself from an onLayout measurement, so its
    first frame can differ from the settled one; a check on the first frame
    would judge a layout the user never sees.
    """
    previous = None
    deadline = time.time() + timeout
    while True:
        nodes = ui.dump()
        boxes = [n.box for n in radios(nodes)]
        if boxes and boxes == previous:
            return nodes
        if time.time() > deadline:
            return nodes
        previous = boxes
        time.sleep(0.4)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", choices=["patterns"])
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--max", type=int, default=80)
    args = parser.parse_args()
    ui.require_device()
    rng = random.Random(args.seed)

    open_round(args.only)

    results = []
    total = None
    for _ in range(args.max):
        options, nodes = ui.wait_for(radios, timeout=10)
        if ui.dismiss_logbox(nodes):
            options, nodes = ui.wait_for(radios, timeout=10)
        if not options:
            break
        nodes = settled()
        if not radios(nodes):
            # The app left the screen between two dumps: another app came to
            # the front, or the process was killed. Not a layout verdict.
            front = {n.el.get("package") for n in nodes} - {None}
            sys.exit(f"round interrupted after {len(results)} questions: no options on screen (in front: {sorted(front)})")
        prog = ui.progress(nodes)
        if prog and total is None:
            total = prog[1]
        label = f"{prog[0]}/{prog[1]}" if prog else f"#{len(results) + 1}"

        problems, summary = check_fit.check(nodes)
        results.append((label, problems))
        print(f"{label}: {'FIT' if not problems else 'NO FIT'}  ({summary})")
        for p in problems:
            print("   FAIL", p)

        options = radios(nodes)
        choice = rng.randrange(len(options))
        ui.tap(answer_all.reveal(options[choice], nodes))
        time.sleep(0.35)
        button = ui.primary_button(ui.dump())
        if button is None or not button.enabled:
            sys.exit(f"{label}: primary button missing or disabled after picking an option")
        ui.tap(button)

        # Next question (progress advanced) or the round ended (no options).
        current = prog[0] if prog else None
        ui.wait_for(lambda ns: not radios(ns) or (ui.progress(ns) or (None,))[0] != current, timeout=10)

    if not ui.reach_results():
        print("note: Results did not appear after the last answer")

    total = total or len(results)
    failing = [(label, problems) for label, problems in results if problems]
    if failing:
        print("\nquestions that need scrolling:")
        for label, problems in failing:
            print(f"  {label}: " + "; ".join(problems))
    print(f"{len(results) - len(failing)}/{total} fit")
    sys.exit(0 if not failing and len(results) == total and total > 0 else 1)


if __name__ == "__main__":
    main()
