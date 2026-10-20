"""A link to /test while a test is open starts the new round from question 1.

usage: check_relink.py [--answers 5]

From Home, opens a Normal round, answers N, then deep-links
`/test?mode=rapido` onto the open screen. expo-router only swaps the params,
so the screen is not remounted; the counter must read 1/20, not N+1/20 with
the Normal answers carried into the Rápido round.

Exit 0 on PASS. Remove the state reset at the top of the bootstrap effect in
app/test.tsx and this must print FAIL.
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402
from answer_all import radios  # noqa: E402


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--answers", type=int, default=5)
    args = parser.parse_args()
    ui.require_device()

    ui.cold_start()
    if not ui.wait_for(ui.start_button, timeout=40)[0]:
        sys.exit("Home did not come up")
    ui.open_route("testeqi://test?mode=normal")

    for _ in range(args.answers):
        options, _ = ui.wait_for(radios, timeout=8)
        if not options:
            sys.exit("no options on screen")
        ui.tap(options[0])
        time.sleep(0.35)
        ui.tap(ui.primary_button(ui.dump()))
        time.sleep(0.7)
    _, nodes = ui.wait_for(radios, timeout=8)
    before = ui.progress(nodes)

    ui.open_route("testeqi://test?mode=rapido")
    time.sleep(2.5)
    after, _ = ui.wait_for(lambda ns: (p := ui.progress(ns)) and p[1] == 20 and p, timeout=10)

    print(f"after {args.answers} Normal answers: counter {before}; relinked to Rápido: counter {after}")
    # A saved Normal round resumes instead of starting at 1; what matters is
    # that the open screen was past question 1 when the link arrived.
    ok = bool(before) and before[0] > 1 and after == (1, 20)
    print("PASS" if ok else "FAIL")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
