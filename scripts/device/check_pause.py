"""Checks the pause flow of the test: back opens the sheet, leaving keeps the progress.

usage: check_pause.py [--answers N] [--seed N]

From a cold start: begins a fresh round from Home ("Começar de novo" if a
round was in progress), answers N questions (default 5), presses the system
back and expects the pause sheet; chooses "Continuar o teste" and expects the
same question; presses back again, chooses "Sair e continuar depois" and
expects Home with "Continuar teste"; taps it, confirms "CONTINUAR" on the
resume prompt and expects the counter to read N+1/total. Prints each step with
the texts it saw and `PASS`/`FAIL`; exit 0 on PASS. Leaves the round in
progress at question N+1 (Home shows "Continuar teste").
"""
import argparse
import os
import random
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import answer_all  # noqa: E402
import ui  # noqa: E402

RADIO = "android.widget.RadioButton"
SHEET_TITLE = r"(?i)^(Pausar o teste\?|Pause the test\?|¿Pausar el test\?)$"
RESUME_LABELS = r"(?i)^(Continuar o teste|Keep going|Seguir con el test)$"
LEAVE_LABELS = r"(?i)^(Sair e continuar depois|Leave and continue later|Salir y continuar después)$"
CONTINUE_HOME = r"(?i)^(Continuar teste|Continue test|Continuar test)$"


def radios(nodes):
    return [n for n in ui.ours(nodes) if n.cls == RADIO]


def button(nodes, pattern):
    # A Button with an icon reads "<glyph>, <title>" (Ionicons glyphs live in
    # the private-use area): Home's "Continuar teste" is ', Continuar teste'.
    hits = [
        n
        for n in ui.ours(nodes)
        if n.cls == "android.widget.Button" and re.search(pattern, re.sub(r"^[-]+,\s*", "", n.label.strip()))
    ]
    return hits[0] if hits else None


def sheet_texts(nodes):
    """Texts of the pause sheet, for the report."""
    title = ui.find(ui.ours(nodes), pattern=SHEET_TITLE)
    if not title:
        return None
    top = title[0].box[1] - 200
    return [n.text for n in ui.ours(nodes) if n.text and n.box[1] >= top]


def expect_sheet():
    found, nodes = ui.wait_for(lambda ns: ui.find(ui.ours(ns), pattern=SHEET_TITLE), timeout=8)
    return (sheet_texts(nodes) if found else None), nodes


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--answers", type=int, default=5)
    parser.add_argument("--seed", type=int, default=7)
    args = parser.parse_args()
    ui.require_device()
    rng = random.Random(args.seed)
    failures = []

    def step(name, ok, detail=""):
        print(f"{'ok  ' if ok else 'FAIL'} {name}" + (f": {detail}" if detail else ""))
        if not ok:
            failures.append(name)

    ui.cold_start()
    start, _ = ui.wait_for(ui.start_button, timeout=45)
    if not start:
        sys.exit("Home did not appear after a cold start (is Metro running?)")
    ui.tap(start)
    time.sleep(1.0)
    restart = ui.restart_button(ui.dump())
    if restart:
        ui.tap(restart)
    options, nodes = ui.wait_for(radios, timeout=20)
    if not options:
        sys.exit("no question appeared")
    prog = ui.progress(nodes)
    step("fresh round starts at 1", bool(prog) and prog[0] == 1, f"counter {prog}")
    total = prog[1] if prog else None

    for i in range(args.answers):
        options, nodes = ui.wait_for(radios, timeout=10)
        if ui.dismiss_logbox(nodes):
            options, nodes = ui.wait_for(radios, timeout=10)
        choice = rng.randrange(len(options))
        ui.tap(answer_all.reveal(options[choice], nodes))
        time.sleep(0.35)
        primary = ui.primary_button(ui.dump())
        if primary is None or not primary.enabled:
            sys.exit(f"question {i + 1}: primary button missing or disabled")
        ui.tap(primary)
        time.sleep(0.6)
    options, nodes = ui.wait_for(radios, timeout=10)
    prog = ui.progress(nodes)
    step(f"answered {args.answers}", bool(prog) and prog[0] == args.answers + 1, f"counter {prog}")

    # Back → sheet → continue → same question.
    ui.back()
    texts, nodes = expect_sheet()
    step("system back opens the pause sheet", texts is not None, f"texts {texts}")
    resume = button(nodes, RESUME_LABELS)
    if resume:
        ui.tap(resume)
    found, nodes = ui.wait_for(radios, timeout=8)
    prog = ui.progress(nodes)
    step("'Continuar o teste' keeps the question", bool(found) and bool(prog) and prog[0] == args.answers + 1, f"counter {prog}")

    # Back → sheet → leave → Home with "Continuar teste".
    ui.back()
    texts, nodes = expect_sheet()
    step("back opens the sheet again", texts is not None, f"texts {texts}")
    leave = button(nodes, LEAVE_LABELS)
    if leave:
        ui.tap(leave)
    home, nodes = ui.wait_for(lambda ns: button(ns, CONTINUE_HOME), timeout=10)
    step("Home offers to continue", home is not None, f"button {home.label if home else None}")

    # Continue → resume prompt → question N+1.
    if home:
        ui.tap(home)
        time.sleep(1.0)
        prompt = ui.resume_button(ui.dump())
        step("resume prompt shows CONTINUAR", prompt is not None, f"button {prompt.text if prompt else None}")
        if prompt:
            ui.tap(prompt)
    found, nodes = ui.wait_for(radios, timeout=15)
    prog = ui.progress(nodes)
    expected = (args.answers + 1, total)
    step(f"counter reads {expected[0]}/{expected[1]} after resuming", bool(found) and prog == expected, f"counter {prog}")

    print("PASS" if not failures else f"FAIL ({len(failures)}: {', '.join(failures)})")
    sys.exit(0 if not failures else 1)


if __name__ == "__main__":
    main()
