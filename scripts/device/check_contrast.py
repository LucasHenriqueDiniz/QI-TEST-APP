"""Static WCAG contrast check of the colour tokens in constants/theme.ts.

usage: check_contrast.py [path/to/theme.ts]

Parses the `light` and `dark` palettes and checks the pairs that carry text or
meaning (WCAG 1.4.3: 4.5:1 for text; 1.4.11: 3:1 for UI boundaries and
graphics). Tokens added by the redesign are used when present (`primaryText`,
`outline`); before that the checker falls back to the token the UI uses today,
so today's failures show up. Exit 1 if any pair fails. No device needed.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

TEXT = 4.5
GRAPHIC = 3.0

# (foreground token or fallbacks, background token, minimum, what it is)
PAIRS = [
    (("text",), "background", TEXT, "body text on the page"),
    (("text",), "surface", TEXT, "body text on cards"),
    (("textMuted",), "background", TEXT, "secondary text on the page"),
    (("textMuted",), "surface", TEXT, "secondary text on cards"),
    (("textFaint",), "background", TEXT, "overlines, captions, disclaimer"),
    (("textFaint",), "surface", TEXT, "labels on cards"),
    (("primaryText", "primary"), "background", TEXT, "primary-coloured text and links"),
    (("primaryText", "primary"), "surface", TEXT, "primary-coloured text on cards"),
    (("onPrimary",), "primary", TEXT, "label on the primary button"),
    (("outline", "border"), "surface", GRAPHIC, "unselected option boundary on cards"),
    (("outline", "border"), "background", GRAPHIC, "input/option boundary on the page"),
    (("accent",), "background", GRAPHIC, "curve marker, best-score ring"),
    (("accent",), "surface", GRAPHIC, "accent graphics on cards"),
    (("onAccent",), "accent", TEXT, "label in the curve marker bubble"),
    (("onAccentSoft",), "accentSoft", TEXT, "'Ponto forte' chip"),
    (("onPaper",), "paper", TEXT, "letter badge on a figure tile"),
    (("onPaper",), "paperSelected", TEXT, "letter badge on the selected figure tile"),
    (("outline",), "paper", GRAPHIC, "unselected figure tile boundary"),
    (("primary",), "paperSelected", GRAPHIC, "selection ring on a figure tile"),
]


def palettes(source):
    out = {}
    for name in ("light", "dark"):
        match = re.search(rf"const {name}: Palette = \{{(.*?)\n\}};", source, re.S)
        if not match:
            sys.exit(f"palette '{name}' not found in theme.ts")
        out[name] = dict(re.findall(r"^\s*(\w+):\s*\"(#[0-9A-Fa-f]{6})\"", match[1], re.M))
    return out


def luminance(hex_colour):
    channels = [int(hex_colour[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def ratio(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "constants", "theme.ts")
    pals = palettes(open(path, encoding="utf-8").read())
    failures = 0
    for mode, tokens in pals.items():
        for fgs, bg, minimum, what in PAIRS:
            fg = next((t for t in fgs if t in tokens), None)
            if fg is None or bg not in tokens:
                print(f"SKIP {mode:5} {'/'.join(fgs)} on {bg}: token missing")
                continue
            r = ratio(tokens[fg], tokens[bg])
            ok = r >= minimum
            failures += not ok
            print(f"{'ok  ' if ok else 'FAIL'} {mode:5} {fg:11} {tokens[fg]} on {bg:10} {tokens[bg]}  {r:5.2f}:1 (min {minimum}) {what}")
    print(f"\n{failures} failing pair(s)")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
