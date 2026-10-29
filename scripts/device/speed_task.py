"""Plays the optional speed task after a Normal round and checks what it stored.

usage: speed_task.py [--restart]

Cold-starts the app, opens a Normal round by link, answers its 40 questions
with answer_all.py, accepts the speed task, answers the 4 practice pairs and
then the 90 s block, answering wrong on purpose every fifth pair. Practice
pairs are read from the dev-only testID (`speed-pair-<n>-same|different`);
the block's from the dev logcat line `[speed] pair <n> same|different`,
tapping the button positions taken during practice: the block's clock
redraws every 250 ms, so uiautomator never finds the screen idle and its
dumps fail (the first version read 0 answers in 90 s that way). n is the
number of pairs already answered, so no pair is answered twice.
Prints `speed stored: <correct>-<wrong>` from the newest history entry, the
counts it tapped, and `PASS` when they match. The last tap can land after the
90 s are over, which the app ignores; then the stored counts are the tapped
ones minus that tap, and the line says so.

--restart instead presses HOME a few pairs into the block, brings the app
back after 3 s and prints `restarted` when the task shows its restart notice
with a fresh 90 s block (the dev build can be killed in the background on
this phone; then it prints what is on screen instead).
"""
import argparse
import os
import re
import selectors
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
PAIR = re.compile(r"speed-pair-(\d+)-(same|different)$")
LOGGED_PAIR = re.compile(r"\[speed\] pair (\d+) (same|different)")
OFFER = r"(?i)^(Fazer o teste de velocidade|Take the speed test|Hacer el test de velocidad)$"
START = r"(?i)^(Começar|Start|Empezar)$"
SAME = r"(?i)^(Iguais|Same|Iguales)$"
DIFFERENT = r"(?i)^(Diferentes|Different)$"
RESTARTED = r"(?i)(bloco recomeçou|block started over|bloque empezó de nuevo)"
MAIN_ACTIVITY = f"{ui.PACKAGE}/.MainActivity"


def button(nodes, pattern):
    found = [n for n in ui.ours(nodes) if re.search(pattern, re.sub(r"^[-]+,\s*", "", n.label))]
    return found[0] if found else None


def pair_of(nodes):
    for n in ui.ours(nodes):
        m = PAIR.search(n.el.get("resource-id") or "")
        if m:
            return int(m[1]), m[2] == "same"
    return None


def reach_offer():
    ui.cold_start()
    home, _ = ui.wait_for(ui.start_button, timeout=45)
    if not home:
        sys.exit("Home did not appear after a cold start")
    ui.open_route("testeqi://test?mode=normal")
    _, nodes = ui.wait_for(lambda n: ui.progress(n), timeout=15)
    if ui.progress(nodes) != (1, 40):
        sys.exit(f"the link did not open a fresh Normal round: {ui.progress(nodes)}")
    subprocess.run([sys.executable, "-I", os.path.join(HERE, "answer_all.py"), "--max", "40"], capture_output=True)
    offer, _ = ui.wait_for(lambda n: button(n, OFFER), timeout=15)
    if not offer:
        sys.exit("the speed task was not offered after the 40th answer")
    return offer


def answer(expected_serial, deliberately_wrong, timeout=6):
    """Waits for pair number `expected_serial`, answers it; returns whether it answered right, or None if no pair."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        nodes = ui.dump()
        found = pair_of(nodes)
        if found is None:
            return None
        serial, same = found
        if serial == expected_serial:
            right = not deliberately_wrong
            target = button(nodes, SAME if same == right else DIFFERENT)
            ui.tap(target)
            return right
        time.sleep(0.1)
    return None


def practice():
    """Answers the 4 practice pairs; returns the (same, different) button centres."""
    nodes = ui.dump()
    buttons = button(nodes, SAME), button(nodes, DIFFERENT)
    if not all(buttons):
        sys.exit("no Iguais/Diferentes buttons on the practice screen")
    for index in range(4):
        if answer(index, False) is None:
            sys.exit(f"practice pair {index + 1} did not appear")
        time.sleep(0.8)  # the practice feedback stays 600 ms
    start, _ = ui.wait_for(lambda n: button(n, START), timeout=10)
    if not start:
        sys.exit("no Start button after the practice")
    ui.adb("logcat", "-c")
    ui.tap(start)
    return buttons[0].center, buttons[1].center


def run_block(same_at, different_at, limit=None):
    """Answers the block's pairs as the app logs them; returns (correct, wrong)."""
    log = subprocess.Popen(["adb", "logcat", "-v", "raw", "-s", "ReactNativeJS:*"], stdout=subprocess.PIPE, text=True)
    watch = selectors.DefaultSelector()
    watch.register(log.stdout, selectors.EVENT_READ)
    correct = wrong = 0
    last = None
    try:
        while limit is None or correct + wrong < limit:
            if not watch.select(timeout=8):
                break
            line = log.stdout.readline()
            if "[speed] stored" in line:
                break
            m = LOGGED_PAIR.search(line)
            if not m or int(m[1]) != correct + wrong:
                continue
            right = (correct + wrong) % 5 != 4
            same = m[2] == "same"
            ui.tap(same_at if same == right else different_at)
            correct += right
            wrong += not right
            last = right
    finally:
        log.kill()
    return correct, wrong, last


def check_stored():
    ui.tap(reach_offer())
    correct, wrong, last = run_block(*practice())
    time.sleep(2)
    newest = (ui.read_storage("testHistory") or [{}])[0]
    speed = newest.get("speed") or {}
    stored = (speed.get("correct"), speed.get("wrong"))
    late = (correct - last, wrong - (not last)) if last is not None else None
    note = "; the last tap came after the 90 s" if stored == late else ""
    print(f"speed stored: {stored[0]}-{stored[1]} (tapped {correct}-{wrong}{note}; mode {newest.get('mode')}, score {speed.get('score')})")
    ok = stored in ((correct, wrong), late) and newest.get("mode") == "normal"
    print("PASS" if ok else "FAIL")
    return ok


def check_restart():
    ui.tap(reach_offer())
    run_block(*practice(), limit=5)
    ui.adb("shell", "input", "keyevent", "KEYCODE_HOME")
    time.sleep(3)
    ui.adb("shell", "am", "start", "-n", MAIN_ACTIVITY)
    try:
        notice, nodes = ui.wait_for(lambda n: ui.find(ui.ours(n), pattern=RESTARTED), timeout=10)
    except RuntimeError:
        # Dumps fail while the block's clock redraws: it kept running.
        print("not restarted: the screen never settled, the block's clock kept running")
        return False
    start = button(nodes, START)
    if notice and start:
        print("restarted")
        return True
    print("not restarted; on screen:", [n.label for n in ui.ours(nodes) if n.label][:8])
    return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--restart", action="store_true")
    args = parser.parse_args()
    ui.require_device()
    ok = check_restart() if args.restart else check_stored()
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
