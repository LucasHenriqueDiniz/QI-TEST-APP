"""Checks that the current screen needs no scrolling for its task.

usage: check_fit.py [--require LABEL ...] [--options N]

Passes (exit 0) when, on the screen as it is now, the options (RadioButtons),
the primary button and each --require label are all fully visible: inside the
window, below the status bar, above the banner and the navigation bar, and not
clipped by a scroll viewport. When a question is on screen (an option or the
test's counter is), all --options (default 4) must be present.

uiautomator reports the visible part of a node, so an option clipped by its
ScrollView shows a box cut at the viewport's edge: its top or bottom coincides
with the viewport's (a fully hidden one has no height at all). That is the
clipping rule, judged against the innermost ScrollView around the option; it
does not compare siblings, so text options that wrap to different line counts
are not mistaken for clipped ones. The `scrollable` flag is not used: React
Native's ScrollView reports it even when its content fits.

Fails with the offending nodes listed. Run it with the screen settled. The
rules live in `check()` so that check_fit_round.py applies the same ones to
every question of a round.
"""
import argparse
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402

RADIO = "android.widget.RadioButton"
# No option is this short: text cards are 60 dp at least, figure cells ~90 dp.
MIN_OPTION_DP = 40


def viewport_of(node, scrolls):
    """The innermost ScrollView whose visible box intersects the node, or None."""
    x1, y1, x2, y2 = node.box
    hits = [s for s in scrolls if s.box[0] < x2 and s.box[2] > x1 and s.box[1] < max(y2, y1 + 1) and s.box[3] > y1]
    return min(hits, key=lambda s: s.height) if hits else None


def clipped_by_viewport(node, scrolls):
    """Why the option is clipped by its scroll viewport, or None when it is not."""
    if node.height <= 0:
        return "no visible height"
    viewport = viewport_of(node, scrolls)
    if viewport is None:
        return None
    if node.box[1] <= viewport.box[1]:
        return f"cut at the viewport's top {viewport.box[1]}"
    if node.box[3] >= viewport.box[3]:
        return f"cut at the viewport's bottom {viewport.box[3]}"
    return None


def check(nodes, require=(), options=4):
    """Applies the rules to one UI dump; returns (problems, summary line)."""
    mine = ui.ours(nodes)
    width, height = ui.screen_size()
    dp = ui.density()
    status_bar = round(24 * dp)
    nav_bar = round(48 * dp)
    ad = ui.ad_node(nodes)
    bottom = height - nav_bar
    problems = []

    radios = [n for n in mine if n.cls == RADIO]
    scrolls = [n for n in mine if n.cls.endswith("ScrollView")]
    # A question is on screen when the test's counter is, even with every
    # option pushed below the fold: those are absent from the dump, not empty.
    if (radios or ui.progress(nodes)) and len(radios) < options:
        problems.append(f"only {len(radios)} of {options} options on screen")
    for n in radios:
        reason = clipped_by_viewport(n, scrolls)
        if reason:
            problems.append(f"clipped option ({reason}): {n}")
        elif n.height < round(MIN_OPTION_DP * dp):
            problems.append(f"clipped option (height {n.height}px): {n}")

    targets = list(radios)
    primary = ui.primary_button(nodes)
    if primary:
        targets.append(primary)
    for label in require:
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

    summary = f"checked {len(targets)} targets on {width}x{height}, banner {ad.box if ad else 'absent'}"
    return problems, summary


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--require", action="append", default=[])
    parser.add_argument("--options", type=int, default=4)
    args = parser.parse_args()
    ui.require_device()

    nodes = ui.dump()
    if ui.dismiss_logbox(nodes):
        nodes = ui.dump()
    problems, summary = check(nodes, args.require, args.options)

    print(summary)
    for p in problems:
        print("FAIL", p)
    print("FIT" if not problems else f"NO FIT ({len(problems)} problems)")
    sys.exit(0 if not problems else 1)


if __name__ == "__main__":
    main()
