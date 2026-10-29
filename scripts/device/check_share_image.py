"""Checks the share image: its size, its weight and that the Sharesheet shows it.

usage: check_share_image.py

Opens Results by link with a Detalhado entry (`mode=history`, nothing saved),
taps "Compartilhar resultado", takes the PNG's path from the dev logcat line
`[share] image <uri>`, copies it out with `run-as` and reads its size from the
PNG header. Then looks at the Android Sharesheet: it must show an image
preview, not "Compartilhando texto" (the text-only share). Prints
`<w>x<h> <size> KB OK` when the image is 1080x1920 and under 500 KB and the
Sharesheet carries it; exits 1 otherwise. Closes the Sharesheet with back.
"""
import json
import os
import re
import struct
import subprocess
import sys
import time
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_results_band  # noqa: E402
import ui  # noqa: E402

SHARE = r"(?i)^(Compartilhar resultado|Share result|Compartir resultado)$"
LOGGED = re.compile(r"\[share\] image (\S+)")
SHEET_PACKAGES = {"android", "com.android.intentresolver", "com.samsung.android.intentresolver"}
TEXT_ONLY = r"(?i)(Compartilhando texto|Sharing text|Compartiendo texto)"


def image_path():
    deadline = time.time() + 15
    while time.time() < deadline:
        found = LOGGED.findall(ui.adb("logcat", "-d", "-v", "raw", "-s", "ReactNativeJS:*"))
        if found:
            return urllib.parse.unquote(found[-1].replace("file://", ""))
        time.sleep(0.5)
    return None


def png_size(data):
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return struct.unpack(">II", data[16:24])


def main():
    ui.require_device()
    ui.cold_start()
    if not ui.wait_for(ui.start_button, timeout=45)[0]:
        sys.exit("Home did not appear after a cold start")
    entry = check_results_band.ENTRIES["detalhado"]
    ui.open_route("testeqi://results?mode=history&entry=" + urllib.parse.quote(json.dumps(entry, ensure_ascii=False), safe=""))
    share, _ = ui.wait_for(lambda n: [x for x in ui.ours(n) if re.search(SHARE, re.sub(r"^[-]+,\s*", "", x.label))], timeout=15)
    if not share:
        sys.exit("no share button on Results")
    ui.adb("logcat", "-c")
    ui.tap(share[0])

    path = image_path()
    if not path:
        sys.exit("no [share] image line in logcat: the capture failed and the text share ran")
    data = subprocess.run(["adb", "exec-out", "run-as", ui.PACKAGE, "cat", path], capture_output=True).stdout
    size = png_size(data)

    sheet, nodes = ui.wait_for(lambda n: [x for x in n if x.el.get("package") in SHEET_PACKAGES], timeout=10)
    text_only = ui.find(nodes, pattern=TEXT_ONLY)
    preview = [x for x in nodes if x.el.get("package") in SHEET_PACKAGES and x.cls == "android.widget.ImageView" and x.height > 100]
    ui.back()

    kb = len(data) / 1024
    ok = size == (1080, 1920) and kb < 500 and bool(sheet) and not text_only and bool(preview)
    width, height = size or (0, 0)
    print(f"{width}x{height} {kb:.0f} KB {'OK' if ok else 'FAIL'}"
          f" (Sharesheet {'open' if sheet else 'missing'}, image preview {'shown' if preview else 'missing'}"
          f"{', text-only share' if text_only else ''}; {path})")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
