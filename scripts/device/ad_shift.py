"""Checks that the banner does not change the layout of a screen.

usage: ad_shift.py --screen {home,test,results}

Opens the screen twice from a cold start: once in airplane mode (no banner can
load, so the slot is in its empty state) and once online, waiting until the
banner WebView is on screen. Compares the layout of the app's own nodes in
both: the primary button, every scroll container and every option. Exit 0
when they are identical, i.e. the slot reserves its space whether or not an ad
is there.

"test" may land on different questions in the two opens, so only the frame
(primary button, scroll viewport) is compared, plus the options when both opens
show the same question. "results" answers a whole test (answer_all.py) each
time. Airplane mode is always switched off again, also on failure.
"""
import argparse
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
RADIO = "android.widget.RadioButton"


def airplane(on):
    ui.adb("shell", "cmd", "connectivity", "airplane-mode", "enable" if on else "disable")
    time.sleep(2.5)


def open_home():
    ui.cold_start()
    found, _ = ui.wait_for(ui.start_button, timeout=45)
    return bool(found)


def open_test():
    if not open_home():
        return False
    ui.tap(ui.start_button(ui.dump()))
    found, _ = ui.wait_for(lambda ns: [n for n in ui.ours(ns) if n.cls == RADIO])
    return bool(found)


def open_results():
    if not open_home():
        return False
    subprocess.run([sys.executable, "-I", os.path.join(HERE, "answer_all.py"), "--start"], check=True)
    return ui.reach_results()


def layout(nodes):
    """The screen's frame: what a banner can push, independent of the content."""
    mine = ui.ours(nodes)
    primary = ui.primary_button(nodes)
    return {
        "primary": primary.box if primary else None,
        "scroll": sorted(n.box for n in mine if n.cls.endswith("ScrollView")),
    }


def options(nodes):
    return [(n.label, n.box) for n in ui.ours(nodes) if n.cls == RADIO]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--screen", choices=["home", "test", "results"], required=True)
    parser.add_argument("--settle", type=float, default=2.0)
    args = parser.parse_args()
    ui.require_device()
    opener = {"home": open_home, "test": open_test, "results": open_results}[args.screen]

    try:
        airplane(True)
        if not opener():
            sys.exit(f"could not reach the {args.screen} screen offline")
        time.sleep(args.settle)
        offline_nodes = ui.dump()
        offline = layout(offline_nodes)
    finally:
        airplane(False)

    if not opener():
        sys.exit(f"could not reach the {args.screen} screen online")
    banner, online_nodes = ui.wait_for(ui.ad_node, timeout=20)
    time.sleep(args.settle)
    online_nodes = ui.dump()
    online = layout(online_nodes)

    print(f"{args.screen}: banner offline {ui.ad_node(offline_nodes)}, online {ui.ad_node(online_nodes)}")
    # Options only compare when both opens show the same question; a fresh
    # round draws different questions and their boxes would differ anyway.
    off_opts, on_opts = options(offline_nodes), options(online_nodes)
    if off_opts and [l for l, _ in off_opts] == [l for l, _ in on_opts]:
        offline["options"], online["options"] = [b for _, b in off_opts], [b for _, b in on_opts]
    changed = [k for k in offline if offline[k] != online[k]]
    for k in offline:
        mark = "CHANGED" if k in changed else "same   "
        print(f"  {mark} {k}: {offline[k]} -> {online[k]}")
    if banner is None:
        print("banner never loaded online; result is not meaningful")
        sys.exit(2)
    print("SHIFTED" if changed else "STABLE")
    sys.exit(1 if changed else 0)


if __name__ == "__main__":
    main()
