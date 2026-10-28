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
# The counter's accessibility label ("Questão 37 de 40"): the visible text
# counts down ("faltam 3") on the last five questions since slice 06.
PROGRESS_DESC = re.compile(r"^\D*(\d+)\s*(?:de|/|of)\s*(\d+)\D*$")


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


# The round of every pattern item in the bank, in order; the branch exists only
# in a dev bundle (`__DEV__` in app/test.tsx) and saves nothing.
DEV_ROUND_URL = "testeqi://test?only=patterns"


def open_route(url):
    """Deep-links a route of the running app. The app must already be running
    its JS bundle (e.g. on Home after cold_start): on a cold process the dev
    client shows its launcher instead of the route."""
    adb("shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", url, PACKAGE)


def open_dev_round():
    """Deep-links the pattern-only round (see DEV_ROUND_URL)."""
    open_route(DEV_ROUND_URL)


def open_single_question(question_id, lang=None):
    """Deep-links one question by its bank id (`/test?q=<id>`, dev bundle only;
    nothing is saved). `lang` switches the app to that language while the
    question is open; the previous language comes back when it is left."""
    url = f"testeqi://test?q={question_id}" + (f"&lang={lang}" if lang else "")
    open_route(url)


def back():
    adb("shell", "input", "keyevent", "KEYCODE_BACK")


# Results has no stack header since slice 03; the hero's overline is the
# screen's first text, upper-cased in JS.
RESULTS_TITLE = r"(?i)^(Seu resultado|Your result|Tu resultado|Seu QI estimado|Your estimated IQ|Tu CI estimado)$"


def reach_results(timeout=45):
    """Waits for Results after the last answer, closing the interstitial on the way.

    Recognises Results by its title, not the share button, which can be below
    the fold. The interstitial runs in the app's own package (AdActivity), so
    it cannot be told apart by package; its close button appears top-right
    after a few seconds, so that spot is tapped between polls.
    """
    deadline = time.time() + timeout
    while time.time() < deadline:
        nodes = dump()
        if find(ours(nodes), pattern=RESULTS_TITLE):
            return True
        time.sleep(6)
        width, _ = screen_size()
        tap((width - 68, 150))
        time.sleep(1)
    return False


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


RESTART_LABELS = r"(?i)^(começar de novo|comecar de novo|start over|empezar de nuevo)$"


def restart_button(nodes):
    """The "Começar de novo" button of Home's resume prompt, or None."""
    for n in ours(nodes):
        if n.cls == "android.widget.Button" and re.fullmatch(RESTART_LABELS, n.text.strip()):
            return n
    return None


def resume_button(nodes):
    """The "Continuar" button of Home's resume prompt, or None when the prompt is not up.

    Only a Button whose whole text is the verb: the prompt's message ("Quer
    continuar de onde parou?") and Home's own "Continuar teste" button, which
    stays in the dump behind the Alert, also contain it. Android renders
    Alert buttons in upper case ("CONTINUAR").
    """
    for n in ours(nodes):
        if n.cls == "android.widget.Button" and re.fullmatch(r"(?i)(continuar|retomar|continue|resume)", n.text.strip()):
            return n
    return None


def dismiss_logbox(nodes):
    for n in nodes:
        if n.desc.startswith("!,"):
            closers = [c for c in nodes if c is not n and c.clickable and _inside(c.box, n.box)]
            if closers:
                tap(closers[-1])
                return True
    return False


def progress(nodes):
    """(current, total) from the test's counter: its text ("7/40", "7 de 40"),
    or its accessibility label when the text is counting down."""
    for n in nodes:
        match = PROGRESS.fullmatch((n.text or "").strip())
        if match:
            return int(match[1]), int(match[2])
    for n in ours(nodes):
        match = PROGRESS_DESC.match((n.desc or "").strip())
        if match:
            return int(match[1]), int(match[2])
    return None


def read_storage(key):
    """The app's AsyncStorage value for `key`, parsed from JSON, or None.

    AsyncStorage 2.x on Android is the SQLite file `databases/RKStorage`. The
    dev build is debuggable, so `run-as` can copy it out; the WAL comes along
    because a write the app just made may live only there.
    """
    import json
    import sqlite3
    import tempfile

    folder = tempfile.mkdtemp(prefix="rkstorage-")
    for suffix in ("", "-wal", "-shm"):
        raw = subprocess.run(
            ["adb", "exec-out", "run-as", PACKAGE, "cat", f"databases/RKStorage{suffix}"], capture_output=True
        ).stdout
        if raw and not raw.startswith(b"cat:") and not raw.startswith(b"run-as:"):
            with open(os.path.join(folder, f"RKStorage{suffix}"), "wb") as handle:
                handle.write(raw)
    path = os.path.join(folder, "RKStorage")
    if not os.path.exists(path):
        raise RuntimeError("could not copy RKStorage out of the app (is the dev build installed?)")
    with sqlite3.connect(path) as db:
        row = db.execute("SELECT value FROM catalystLocalStorage WHERE key = ?", (key,)).fetchone()
    return json.loads(row[0]) if row else None


def _inside(inner, outer):
    return inner[0] >= outer[0] and inner[1] >= outer[1] and inner[2] <= outer[2] and inner[3] <= outer[3]


def shots_dir():
    path = os.environ.get("SHOTS_DIR") or os.path.join(os.environ.get("TMPDIR", "/tmp"), "qi-shots")
    os.makedirs(path, exist_ok=True)
    return path
