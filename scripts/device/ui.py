"""Shared adb + uiautomator helpers for the device scripts.

Every script in this folder drives the dev build on a phone connected over
USB. Nothing here knows about a specific screen beyond the labels passed in.
"""
import os
import re
import subprocess
import time
import xml.etree.ElementTree as ET

PACKAGE = "com.lhdiniz.testeqi"
DEV_CLIENT_URL = "exp+teste-de-qi://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
BOUNDS = re.compile(r"\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]")
PROGRESS = re.compile(r"(\d+)\s*(?:de|/|of)\s*(\d+)")


def adb(*args, check=False):
    result = subprocess.run(["adb", *args], capture_output=True, text=True)
    if check and result.returncode != 0:
        raise RuntimeError(f"adb {' '.join(args)} failed: {result.stderr.strip()}")
    return result.stdout


def require_device():
    lines = [l for l in adb("devices").splitlines()[1:] if l.strip()]
    ready = [l for l in lines if l.split()[-1] == "device"]
    if not ready:
        raise SystemExit("no authorised device on adb (plug the phone, accept USB debugging)")


def screen_size():
    match = re.search(r"(\d+)x(\d+)", adb("shell", "wm", "size"))
    return int(match[1]), int(match[2])


def density():
    match = re.search(r"(\d+)", adb("shell", "wm", "density").splitlines()[-1])
    return int(match[1]) / 160


def cold_start():
    adb("shell", "am", "force-stop", PACKAGE)
    adb("reverse", "tcp:8081", "tcp:8081")
    adb("shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", DEV_CLIENT_URL, PACKAGE)


class Node:
    def __init__(self, el):
        self.el = el
        self.cls = el.get("class") or ""
        self.text = el.get("text") or ""
        self.desc = el.get("content-desc") or ""
        self.label = self.desc or self.text
        self.clickable = el.get("clickable") == "true"
        self.enabled = el.get("enabled") != "false"
        self.scrollable = el.get("scrollable") == "true"
        x1, y1, x2, y2 = map(int, BOUNDS.match(el.get("bounds")).groups())
        self.box = (x1, y1, x2, y2)

    @property
    def center(self):
        x1, y1, x2, y2 = self.box
        return (x1 + x2) // 2, (y1 + y2) // 2

    @property
    def height(self):
        return self.box[3] - self.box[1]

    def __repr__(self):
        return f"<{self.cls.rsplit('.', 1)[-1]} {self.label[:40]!r} {self.box}>"


def dump(retries=6):
    """Current UI tree. Retries because uiautomator fails while the UI animates.

    A failed dump ("null root node", "could not get idle state") leaves the
    previous /sdcard/ui.xml in place, so reading the file without checking the
    command's output would return the tree of whatever was on screen before —
    for the first ~2 s after a cold start, that is the previous screen.
    """
    for attempt in range(retries):
        said = adb("shell", "uiautomator", "dump", "/sdcard/ui.xml")
        if "dumped to" in said:
            raw = adb("exec-out", "cat", "/sdcard/ui.xml")
            try:
                root = ET.fromstring(raw)
                return [Node(el) for el in root.iter("node") if el.get("bounds")]
            except ET.ParseError:
                pass
        time.sleep(0.4 * (attempt + 1))
    raise RuntimeError("uiautomator dump kept failing")


def ours(nodes):
    return [n for n in nodes if n.el.get("package") == PACKAGE]


def tap(node_or_xy):
    x, y = node_or_xy.center if isinstance(node_or_xy, Node) else node_or_xy
    adb("shell", "input", "tap", str(x), str(y))


def find(nodes, label=None, cls=None, pattern=None):
    out = []
    for n in nodes:
        if cls and n.cls != cls:
            continue
        if label is not None and n.label != label and n.text != label:
            continue
        if pattern is not None and not re.search(pattern, n.label or n.text):
            continue
        out.append(n)
    return out


def wait_for(predicate, timeout=15.0, interval=0.4):
    """Polls the UI until predicate(nodes) is truthy; returns (value, nodes)."""
    deadline = time.time() + timeout
    while True:
        nodes = dump()
        value = predicate(nodes)
        if value:
            return value, nodes
        if time.time() > deadline:
            return None, nodes
        time.sleep(interval)


def ad_node(nodes):
    """The banner: a WebView labelled as a test ad or any WebView in our window."""
    webviews = [n for n in nodes if n.cls == "android.webkit.WebView"]
    return min(webviews, key=lambda n: -n.box[1]) if webviews else None


def primary_button(nodes):
    """Bottom-most enabled Button of ours with a label: the screen's main action."""
    buttons = [n for n in ours(nodes) if n.cls == "android.widget.Button" and n.label]
    return max(buttons, key=lambda n: n.box[3]) if buttons else None


START_LABELS = r"\b(Começar|Comecar|Continuar|Fazer novo|Retomar|Start|Continue|Resume|Take|Empezar|Comenzar|Hacer)"


def start_button(nodes):
    """The button that starts or resumes a test on Home, by label in pt/en/es."""
    hits = [n for n in ours(nodes) if n.cls == "android.widget.Button" and re.search(START_LABELS, n.label)]
    return hits[0] if hits else None


def dismiss_logbox(nodes):
    for n in nodes:
        if n.desc.startswith("!,"):
            closers = [c for c in nodes if c is not n and c.clickable and _inside(c.box, n.box)]
            if closers:
                tap(closers[-1])
                return True
    return False


def progress(nodes):
    for n in nodes:
        match = PROGRESS.fullmatch((n.text or "").strip())
        if match:
            return int(match[1]), int(match[2])
    return None


def _inside(inner, outer):
    return inner[0] >= outer[0] and inner[1] >= outer[1] and inner[2] <= outer[2] and inner[3] <= outer[3]


def shots_dir():
    path = os.environ.get("SHOTS_DIR") or os.path.join(os.environ.get("TMPDIR", "/tmp"), "qi-shots")
    os.makedirs(path, exist_ok=True)
    return path
