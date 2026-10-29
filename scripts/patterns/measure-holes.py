"""Measures the hole of every pattern matrix and the frame of its options.

usage: python3 -I scripts/patterns/measure-holes.py [--json]

Draws each SVG of assets/questions/patterns/ in headless Chrome (the
Illustrator files carry `display:none` layers that ImageMagick draws anyway),
takes every visible shape's box in viewBox units, and picks the tag-shaped
outline: in a matrix the widest shape 110–260 units wide, right of x = 150,
with height/width 0.55–0.66; in an option the same shape 140–175 wide.
Prints one line per item, `p<n> hole=<w> frames=<w1>,<w2>,<w3>,<w4>`, the
numbers that assets/questions/patterns/geometry.ts holds per family.
With --json, prints {"p<n>": {"hole": {x, y, w, h}, "frames": [w, ...]}}
instead (scripts/device/check_option_scale.py reads it). Exits 1 when an
item has no such outline.
"""
import html
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS = os.path.join(ROOT, "assets", "questions", "patterns")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

MEASURE = r"""
<pre id=out></pre>
<script>
function measure(frame) {
  const svg = frame.contentDocument.querySelector('svg');
  svg.style.width = frame.dataset.w + 'px'; svg.style.height = 'auto'; svg.style.display = 'block';
  const root = svg.getBoundingClientRect(), unit = Number(frame.dataset.w) / root.width;
  const shapes = [];
  for (const el of svg.querySelectorAll('path,polygon,rect,polyline')) {
    if (el.closest('defs,clipPath')) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    shapes.push({x: (r.left - root.left) * unit, y: (r.top - root.top) * unit, w: r.width * unit, h: r.height * unit});
  }
  return shapes;
}
window.addEventListener('load', () => {
  const res = {};
  for (const f of document.querySelectorAll('iframe')) res[f.dataset.name] = measure(f);
  document.getElementById('out').textContent = JSON.stringify(res);
});
</script>"""


def numbers():
    return sorted(int(m[1]) for f in os.listdir(ASSETS) if (m := re.match(r"(\d+)_q_01\.svg$", f)))


def page(items):
    frames = []
    for n in items:
        for name, width in [(f"{n:02d}_q_01", 500)] + [(f"{n:02d}_a_0{k}", 173) for k in range(1, 5)]:
            svg = open(os.path.join(ASSETS, name + ".svg"), encoding="utf-8").read()
            doc = f"<html><body style='margin:0'><div style='width:{width}px'>{svg}</div></body></html>"
            frames.append(
                f"<iframe data-name='{name}' data-w='{width}' style='width:{width + 10}px;height:400px;border:0' "
                f'srcdoc="{html.escape(doc, quote=True)}"></iframe>'
            )
    return "<!doctype html><html><body>" + "".join(frames) + MEASURE + "</body></html>"


def tag(shapes, low, high, right=None):
    candidates = [
        s for s in shapes
        if low <= s["w"] <= high and 0.55 <= s["h"] / s["w"] <= 0.66 and (right is None or s["x"] > right)
    ]
    return max(candidates, key=lambda s: s["w"]) if candidates else None


def main():
    items = numbers()
    with tempfile.TemporaryDirectory() as folder:
        path = os.path.join(folder, "measure.html")
        open(path, "w", encoding="utf-8").write(page(items))
        dom = subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--dump-dom", "--virtual-time-budget=20000", f"file://{path}"],
            capture_output=True, text=True, check=True,
        ).stdout
    shapes = json.loads(html.unescape(re.search(r'<pre id="out">(.*?)</pre>', dom, re.S)[1]))
    missing, table = [], {}
    for n in items:
        hole = tag(shapes[f"{n:02d}_q_01"], 110, 260, right=150)
        frames = [tag(shapes[f"{n:02d}_a_0{k}"], 140, 175) for k in range(1, 5)]
        if not hole or not all(frames):
            missing.append(n)
            continue
        table[f"p{n}"] = {"hole": hole, "frames": [f["w"] for f in frames]}
        if "--json" not in sys.argv:
            print(f"p{n} hole={hole['w']:.1f} frames={','.join(f'{f['w']:.1f}' for f in frames)}")
    if "--json" in sys.argv:
        print(json.dumps(table))
    if missing:
        print("no tag outline found in:", ", ".join(f"p{n}" for n in missing))
        sys.exit(1)


if __name__ == "__main__":
    main()
