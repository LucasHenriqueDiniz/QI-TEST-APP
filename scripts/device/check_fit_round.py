"""Checks that every question of a round fits on screen, answering through it.

usage: check_fit_round.py [--only patterns | --longest-text] [--seed N] [--max N]

  --only patterns   open the dev-only round of every pattern item, in order
                    (testeqi://test?only=patterns; the branch exists only in a
                    dev bundle and saves nothing). Without it a normal round
                    starts from Home, resuming a saved one when asked.
  --longest-text    instead of a round, open the longest text question of each
                    language (pt, en, es: most characters in question + options,
                    read from assets/i18n/translations/*.ts) one at a time with
                    the dev-only `/test?q=<id>&lang=<code>` route, check that it
                    fits, and close it with the X. `3/3 fit`; nothing is saved
                    and the app's language is back to what it was.

Cold-starts the app, opens the round and, for each question: waits until the
layout settles (two consecutive dumps with the same option boxes), applies
check_fit's rules to that dump (imported, not copied), then answers it (random
option, primary button). Prints one line per question, lists the failing ones
with their progress number and problems, then `N/N fit`; exits 0 only when
every question of the round fit. Ends on Results (the interstitial is closed
on the way), so the round is finished.
"""
import argparse
import os
import random
import re
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import answer_all  # noqa: E402
import check_fit  # noqa: E402
import ui  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RADIO = "android.widget.RadioButton"
LANGUAGES = ("pt", "en", "es")
# A JS string literal in either quote style: groups 2 (double) or 4 (single) hold the text.
STRING = r"(?:(\")((?:[^\"\\]|\\.)*)\"|(')((?:[^'\\]|\\.)*)')"
# The X of the test's top bar, by its accessibility label in the three languages.
PAUSE_LABELS = r"(?i)^(Pausar o teste|Pause the test|Pausar el test)$"


def radios(nodes):
    return [n for n in ui.ours(nodes) if n.cls == RADIO]


def open_round(only):
    ui.cold_start()
    start, _ = ui.wait_for(ui.start_button, timeout=45)
    if not start:
        sys.exit("Home did not appear after a cold start (is Metro running?)")
    if only == "patterns":
        ui.open_dev_round()
    else:
        ui.tap(start)
        time.sleep(1.0)
        resume = ui.resume_button(ui.dump())
        if resume:
            ui.tap(resume)
    found, _ = ui.wait_for(radios, timeout=20)
    if not found:
        sys.exit("no question appeared")


def settled(timeout=6.0):
    """Dumps until two consecutive dumps show the same option boxes.

    The pattern question sizes itself from an onLayout measurement, so its
    first frame can differ from the settled one; a check on the first frame
    would judge a layout the user never sees.
    """
    previous = None
    deadline = time.time() + timeout
    while True:
        nodes = ui.dump()
        boxes = [n.box for n in radios(nodes)]
        if boxes and boxes == previous:
            return nodes
        if time.time() > deadline:
            return nodes
        previous = boxes
        time.sleep(0.4)


# --- the longest text question per language -------------------------------

def text_bank(path):
    """(category, questionKey) -> id for the text questions of data/questions.ts."""
    source = open(path, encoding="utf-8").read()
    bank = {}
    for block in re.findall(r"\{([^{}]*)\}", source):
        fields = dict(re.findall(r"(\w+):\s*\"([^\"]*)\"", block))
        if {"id", "category", "questionKey"} <= fields.keys() and fields.get("type") != "image":
            bank[(fields["category"], fields["questionKey"])] = fields["id"]
    return bank


def translated_items(path):
    """[(category, key, question, [options])] from one translation file.

    Reads the `questions.items` tree by indentation: categories at 8 spaces,
    keys at 10, each key holding one `question:` line and one `options:` line.
    Strings come in double or single quotes (a question that quotes a word
    uses the other kind).
    """
    items = []
    category = key = question = None
    inside = False
    for line in open(path, encoding="utf-8"):
        if re.match(r"^      items: \{", line):
            inside = True
            continue
        if not inside:
            continue
        if re.match(r"^      \},?\s*$", line):
            break
        m = re.match(r"^        (\w+): \{", line)
        if m:
            category = m[1]
            continue
        m = re.match(r"^          (\w+): \{", line)
        if m:
            key, question = m[1], None
            continue
        m = re.match(r"^            question: " + STRING, line)
        if m:
            question = m[2] if m[2] is not None else m[4]
            continue
        m = re.match(r"^            options: \[(.*)\]", line)
        if m and category and key and question is not None:
            options = [a if a is not None else b for _, a, _, b in re.findall(STRING, m[1])]
            items.append((category, key, question, options))
    return items


def longest_text_questions():
    """{lang: (id, 'category.key', characters)} for the longest text question of each language."""
    bank = text_bank(os.path.join(ROOT, "data", "questions.ts"))
    out = {}
    for lang in LANGUAGES:
        items = translated_items(os.path.join(ROOT, "assets", "i18n", "translations", f"{lang}.ts"))
        items = [it for it in items if (it[0], it[1]) in bank]
        if not items:
            sys.exit(f"no translated text questions found for {lang}")
        category, key, question, options = max(items, key=lambda it: len(it[2]) + sum(len(o) for o in it[3]))
        out[lang] = (bank[(category, key)], f"{category}.{key}", len(question) + sum(len(o) for o in options))
    return out


def close_question():
    """Taps the top bar's X (dev single question: leaves at once) and waits for Home."""
    nodes = ui.dump()
    x = ui.find(ui.ours(nodes), pattern=PAUSE_LABELS)
    if not x:
        ui.back()
    else:
        ui.tap(x[0])
    found, _ = ui.wait_for(ui.start_button, timeout=15)
    return bool(found)


def run_longest_text():
    targets = longest_text_questions()
    for lang, (qid, name, chars) in targets.items():
        print(f"{lang}: longest text question is id {qid} ({name}, {chars} characters)")

    ui.cold_start()
    start, _ = ui.wait_for(ui.start_button, timeout=45)
    if not start:
        sys.exit("Home did not appear after a cold start (is Metro running?)")

    results = []
    for lang, (qid, name, _) in targets.items():
        ui.open_single_question(qid, lang)
        options, nodes = ui.wait_for(radios, timeout=15)
        if ui.dismiss_logbox(nodes):
            options, nodes = ui.wait_for(radios, timeout=15)
        if not options:
            sys.exit(f"{lang}: question {qid} did not appear")
        nodes = settled()
        problems, summary = check_fit.check(nodes)
        label = f"{lang} q={qid} ({name})"
        results.append((label, problems))
        print(f"{label}: {'FIT' if not problems else 'NO FIT'}  ({summary})")
        for p in problems:
            print("   FAIL", p)
        if not close_question():
            sys.exit(f"{lang}: Home did not come back after closing the question")

    failing = [(label, problems) for label, problems in results if problems]
    if failing:
        print("\nquestions that need scrolling:")
        for label, problems in failing:
            print(f"  {label}: " + "; ".join(problems))
    print(f"{len(results) - len(failing)}/{len(targets)} fit")
    sys.exit(0 if not failing else 1)


# --- a whole round ---------------------------------------------------------

def run_round(only, seed, maximum):
    rng = random.Random(seed)
    open_round(only)

    results = []
    total = None
    for _ in range(maximum):
        options, nodes = ui.wait_for(radios, timeout=10)
        if ui.dismiss_logbox(nodes):
            options, nodes = ui.wait_for(radios, timeout=10)
        if not options:
            break
        nodes = settled()
        if not radios(nodes):
            # The app left the screen between two dumps: another app came to
            # the front, or the process was killed. Not a layout verdict.
            front = {n.el.get("package") for n in nodes} - {None}
            sys.exit(f"round interrupted after {len(results)} questions: no options on screen (in front: {sorted(front)})")
        prog = ui.progress(nodes)
        if prog and total is None:
            total = prog[1]
        label = f"{prog[0]}/{prog[1]}" if prog else f"#{len(results) + 1}"

        problems, summary = check_fit.check(nodes)
        results.append((label, problems))
        print(f"{label}: {'FIT' if not problems else 'NO FIT'}  ({summary})")
        for p in problems:
            print("   FAIL", p)

        options = radios(nodes)
        choice = rng.randrange(len(options))
        ui.tap(answer_all.reveal(options[choice], nodes))
        time.sleep(0.35)
        button = ui.primary_button(ui.dump())
        if button is None or not button.enabled:
            sys.exit(f"{label}: primary button missing or disabled after picking an option")
        ui.tap(button)

        # Next question (progress advanced) or the round ended (no options).
        current = prog[0] if prog else None
        ui.wait_for(lambda ns: not radios(ns) or (ui.progress(ns) or (None,))[0] != current, timeout=10)

    if not ui.reach_results():
        print("note: Results did not appear after the last answer")

    total = total or len(results)
    failing = [(label, problems) for label, problems in results if problems]
    if failing:
        print("\nquestions that need scrolling:")
        for label, problems in failing:
            print(f"  {label}: " + "; ".join(problems))
    print(f"{len(results) - len(failing)}/{total} fit")
    sys.exit(0 if not failing and len(results) == total and total > 0 else 1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", choices=["patterns"])
    parser.add_argument("--longest-text", action="store_true")
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--max", type=int, default=100)
    args = parser.parse_args()
    ui.require_device()

    if args.longest_text:
        run_longest_text()
    else:
        run_round(args.only, args.seed, args.max)


if __name__ == "__main__":
    main()
