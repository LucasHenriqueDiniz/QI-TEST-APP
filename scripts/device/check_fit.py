"""Checks that the current screen needs no scrolling for its task.

usage: check_fit.py [--require LABEL ...] [--options N]

Passes (exit 0) when, on the screen as it is now, the options (RadioButtons),
the primary button and each --require label are all fully visible: inside the
window, below the status bar, above the banner and the navigation bar, and not
clipped by a scroll viewport. When a question is on screen, all --options
(default 4) must be present.

uiautomator reports the visible part of a node, so a clipped option shows a
shorter box than its siblings; options are compared to the tallest one. The
`scrollable` flag is not used: React Native's ScrollView reports it even when
its content fits.

Fails with the offending nodes listed. Run it with the screen settled.
"""
import argparse
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--require", action="append", default=[])
    parser.add_argument("--options", type=int, default=4)
    args = parser.parse_args()
    ui.require_device()

    nodes = ui.dump()
    if ui.dismiss_logbox(nodes):
        nodes = ui.dump()
    mine = ui.ours(nodes)
    width, height = ui.screen_size()
    dp = ui.density()
    status_bar = round(24 * dp)
    nav_bar = round(48 * dp)
    ad = ui.ad_node(nodes)
    bottom = height - nav_bar
    problems = []

    radios = [n for n in mine if n.cls == "android.widget.RadioButton"]
    if radios and len(radios) < args.options:
        problems.append(f"only {len(radios)} of {args.options} options on screen")
    tallest = max((n.height for n in radios), default=0)
    for n in radios:
        if n.height < 0.9 * tallest:
            problems.append(f"clipped option ({n.height}px of {tallest}px): {n}")

    targets = list(radios)
    primary = ui.primary_button(nodes)
    if primary:
        targets.append(primary)
    for label in args.require:
        hits = ui.find(mine, pattern=re.escape(label))
        if not hits:
            problems.append(f"required label not on screen: {label!r}")
        targets.extend(hits)

    for n in targets:
        x1, y1, x2, y2 = n.box
        if y1 < status_bar or y2 > bottom or x1 < 0 or x2 > width:
            problems.append(f"outside the window: {n}")
        if ad and y1 < ad.box[3] and y2 > ad.box[1]:
            problems.append(f"overlaps the banner {ad.box}: {n}")
        if n not in radios and n.height < round(24 * dp):
            problems.append(f"clipped (height {n.height}px): {n}")

    print(f"checked {len(targets)} targets on {width}x{height}, banner {ad.box if ad else 'absent'}")
    for p in problems:
        print("FAIL", p)
    print("FIT" if not problems else f"NO FIT ({len(problems)} problems)")
    sys.exit(0 if not problems else 1)


if __name__ == "__main__":
    main()
