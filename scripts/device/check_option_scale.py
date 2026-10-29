"""Checks that pattern options are drawn at the scale of the matrix hole.

usage: check_option_scale.py [--tolerance 2]

Opens the dev pattern round (every pattern item, in order) and, for each
question, measures two widths in a screenshot, in dp:
  hole    the tag-shaped empty cell of the matrix: along the rows around its
          middle, the dark pixels nearest to where its left edge and its tip
          should be
          (positions from scripts/patterns/measure-holes.py --json, mapped
          onto the matrix card that uiautomator reports);
  option  option A's frame: over the rows within 20 dp of the option's middle
          (clear of the cell's 16 dp rounded corners) and right of the letter
          badge, the first and the last dark pixel; nothing in an option
          reaches past its frame.
Not one row: the tip is a thin curve, vertical at the middle, that can come
out lighter than DARK on that row (p17), and p18's option A frame is wider
than its viewBox, so its tip is cut and has a gap exactly at the middle.
Prints `p<n> hole=<dp> option=<dp> delta=<dp>` per item and `N/N same scale`;
exits 0 only when every |delta| is within --tolerance dp. Before slice 05.1
the option came out ~20 dp wider than the hole in p25–p54.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_fit_round  # noqa: E402
import ui  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# PatternQuestion: card padding + border, around the matrix SVG.
CARD_INSET_DP = 8 + 1
# FigureOption: border + padding, and the letter badge column.
CELL_BORDER_DP = 1.5
CELL_INSET_DP = CELL_BORDER_DP + 6
BADGE_DP = 22
# Paper is ~221; a thin stroke comes out antialiased (one pixel at 0 here, up
# to ~190 there, by where it falls on the pixel grid), the cell border at ~101
# lies outside the area searched.
DARK = 190
BAND = 4
OPTION_BAND_DP = 20
ZOOM_LABEL = r"(?i)^(Ampliar|Zoom)$"


def geometry():
    out = subprocess.run(
        [sys.executable, "-I", os.path.join(ROOT, "scripts", "patterns", "measure-holes.py"), "--json"],
        capture_output=True, text=True, check=True,
    ).stdout
    return json.loads(out)


def screenshot():
    """(width, height, bytes) of the screen in 8-bit gray."""
    png = subprocess.run(["adb", "exec-out", "screencap", "-p"], capture_output=True, check=True).stdout
    pgm = subprocess.run(
        ["magick", "png:-", "-colorspace", "gray", "-depth", "8", "pgm:-"], input=png, capture_output=True, check=True
    ).stdout
    header = re.match(rb"P5\s+(\d+)\s+(\d+)\s+(\d+)\s", pgm)
    width, height = int(header[1]), int(header[2])
    return width, height, pgm[header.end():]


def row(image, y):
    width, _, pixels = image
    return pixels[y * width:(y + 1) * width]


def nearest_dark(line, x, reach):
    for offset in range(reach + 1):
        for candidate in (x - offset, x + offset):
            if 0 <= candidate < len(line) and line[candidate] < DARK:
                return candidate
    return None


def measure_hole(image, card, hole, d):
    x1, y1, x2, y2 = card
    height = (y2 - y1) - 2 * CARD_INSET_DP * d
    width = height * 500 / 335
    left = (x1 + x2) / 2 - width / 2
    top = y1 + CARD_INSET_DP * d
    middle = round(top + (hole["y"] + hole["h"] / 2) / 335 * height)
    reach = round(4 / 500 * width)
    starts, ends = [], []
    for y in range(middle - BAND, middle + BAND + 1):
        line = row(image, y)
        starts.append(nearest_dark(line, round(left + hole["x"] / 500 * width), reach))
        ends.append(nearest_dark(line, round(left + (hole["x"] + hole["w"]) / 500 * width), reach))
    starts = [x for x in starts if x is not None]
    ends = [x for x in ends if x is not None]
    if not starts or not ends:
        return None
    return (max(ends) - min(starts)) / d


def measure_option(image, option, d):
    x1, y1, x2, y2 = option.box
    # From just right of the badge to just left of the cell border: the figure
    # fills its area, so a frame's tip can sit on the area's last pixel (p18).
    first = round(x1 + (CELL_INSET_DP + BADGE_DP) * d) + 2
    last = round(x2 - CELL_BORDER_DP * d) - 1
    middle, reach = (y1 + y2) // 2, round(OPTION_BAND_DP * d)
    dark = []
    for y in range(middle - reach, middle + reach + 1):
        line = row(image, y)
        dark += [x for x in range(first, last) if line[x] < DARK]
    if not dark:
        return None
    return (max(dark) - min(dark)) / d


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--tolerance", type=float, default=2.0)
    args = parser.parse_args()
    ui.require_device()
    holes = geometry()
    d = ui.density()

    check_fit_round.open_round("patterns")
    results = []
    for _ in range(len(holes) + 5):
        options, nodes = ui.wait_for(check_fit_round.radios, timeout=10)
        if not options:
            break
        nodes = check_fit_round.settled()
        options = check_fit_round.radios(nodes)
        prog = ui.progress(nodes)
        key = f"p{prog[0]}"
        cards = [n for n in ui.find(ui.ours(nodes), pattern=ZOOM_LABEL)]
        card = max(cards, key=lambda n: n.height).box if cards else None
        image = screenshot()
        hole = measure_hole(image, card, holes[key]["hole"], d) if card else None
        frame = measure_option(image, options[0], d)
        if hole is None or frame is None:
            results.append((key, None))
            print(f"{key}: could not measure (hole={hole}, option={frame})")
        else:
            delta = frame - hole
            results.append((key, delta))
            print(f"{key} hole={hole:.1f} option={frame:.1f} delta={delta:+.1f}")

        ui.tap(options[0])
        time.sleep(0.35)
        button = ui.primary_button(ui.dump())
        if button is None or not button.enabled:
            sys.exit(f"{key}: primary button missing or disabled after picking an option")
        ui.tap(button)
        ui.wait_for(lambda ns: not check_fit_round.radios(ns) or (ui.progress(ns) or (None,))[0] != prog[0], timeout=10)

    good = [key for key, delta in results if delta is not None and abs(delta) <= args.tolerance]
    print(f"{len(good)}/{len(holes)} same scale (|delta| <= {args.tolerance} dp)")
    sys.exit(0 if len(good) == len(holes) else 1)


if __name__ == "__main__":
    main()
