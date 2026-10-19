"""Bank counts per category x difficulty, before and after the staged text items.

Usage: python3 -I scripts/bank/count.py

Reads data/questions.ts (regex, no TypeScript parser needed) and, when present,
data/staging/text-items.json. Prints the counts for the current bank, for the
bank plus the staged items, the key-position distribution of the staged items
(overall and per category), per category and language how many staged items
have the key as the longest option, and per language how many vocabulary items
contain an exact antonym of the key. STAGED CHECK fails when a cell count, a
key-position share, a longest-option share or the antonym count is out of bounds.
"""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
QUESTIONS_TS = ROOT / "data" / "questions.ts"
STAGED_JSON = ROOT / "data" / "staging" / "text-items.json"

CATEGORIES = ["patterns", "matrix", "similarities", "vocabulary", "comprehension"]
DIFFICULTIES = ["easy", "medium", "hard"]
LANGS = ("pt", "en", "es")
# Test-wise cue guards: share of staged items, per category, whose key is the longest option,
# and number of vocabulary items whose options include an exact antonym of the key
# (declared per item in text-items.json as `antonymOption: index | null`).
MAX_LONGEST_SHARE = 0.35
MAX_ANTONYM_ITEMS = 6

# Target for the text categories, from docs/research/scoring-modes/README.md §5.3.
STAGED_TARGET = {
    "matrix": {"easy": 7, "medium": 8, "hard": 1},
    "similarities": {"easy": 6, "medium": 4, "hard": 0},
    "vocabulary": {"easy": 8, "medium": 10, "hard": 0},
    "comprehension": {"easy": 8, "medium": 0, "hard": 2},
}

ITEM_RE = re.compile(
    r'category:\s*"(?P<category>\w+)".*?'
    r'difficulty:\s*"(?P<difficulty>\w+)".*?'
    r'correctAnswer:\s*(?P<key>\d)',
    re.S,
)


def read_existing():
    text = QUESTIONS_TS.read_text(encoding="utf-8")
    return [
        {"category": m["category"], "difficulty": m["difficulty"], "correctAnswer": int(m["key"])}
        for m in ITEM_RE.finditer(text)
    ]


def read_staged():
    if not STAGED_JSON.exists():
        return []
    return json.loads(STAGED_JSON.read_text(encoding="utf-8"))


def table(title, items):
    counts = Counter((it["category"], it["difficulty"]) for it in items)
    print(title)
    print(f"  {'category':<14}{'easy':>6}{'medium':>8}{'hard':>6}{'total':>7}")
    for cat in CATEGORIES:
        row = [counts.get((cat, d), 0) for d in DIFFICULTIES]
        print(f"  {cat:<14}{row[0]:>6}{row[1]:>8}{row[2]:>6}{sum(row):>7}")
    tot = [sum(counts.get((c, d), 0) for c in CATEGORIES) for d in DIFFICULTIES]
    print(f"  {'total':<14}{tot[0]:>6}{tot[1]:>8}{tot[2]:>6}{sum(tot):>7}")
    print()


def key_distribution(items, label):
    overall = Counter(it["correctAnswer"] for it in items)
    n = len(items)
    print(f"{label} ({n} items)")
    print(f"  {'':<14}" + "".join(f"{'pos ' + str(p):>8}" for p in range(4)))
    print(f"  {'all':<14}" + "".join(f"{overall.get(p, 0):>8}" for p in range(4)))
    for cat in CATEGORIES:
        sub = [it for it in items if it["category"] == cat]
        if not sub:
            continue
        c = Counter(it["correctAnswer"] for it in sub)
        cells = []
        for p in range(4):
            share = 100 * c.get(p, 0) / len(sub)
            cells.append(f"{c.get(p, 0):>3} ({share:3.0f}%)")
        print(f"  {cat:<14}" + "".join(f"{cell:>10}" for cell in cells))
    print()


def key_is_longest(it, lang):
    """True when the key is strictly longer (in characters) than every distractor."""
    opts = it[lang]["options"]
    k = it["correctAnswer"]
    return all(len(opts[k]) > len(o) for i, o in enumerate(opts) if i != k)


def longest_counts(staged):
    out = {}
    for cat in STAGED_TARGET:
        sub = [it for it in staged if it["category"] == cat]
        out[cat] = (len(sub), {lang: sum(key_is_longest(it, lang) for it in sub) for lang in LANGS})
    return out


def key_longest_table(staged):
    print("Staged items whose key is the longest option (strictly longer than every distractor)")
    print(f"  {'category':<14}" + "".join(f"{lang:>12}" for lang in LANGS))
    for cat, (n, per_lang) in longest_counts(staged).items():
        cells = [f"{per_lang[lang]:>2}/{n} ({100 * per_lang[lang] / n:3.0f}%)" for lang in LANGS]
        print(f"  {cat:<14}" + "".join(f"{cell:>12}" for cell in cells))
    print(f"  limit: {MAX_LONGEST_SHARE:.0%} per category in every language")
    print()


def antonym_counts(staged):
    """Per language: vocabulary items whose declared antonym option exists in that language."""
    voc = [it for it in staged if it["category"] == "vocabulary"]
    per_lang = {}
    for lang in LANGS:
        per_lang[lang] = sum(
            1 for it in voc
            if it.get("antonymOption") is not None and 0 <= it["antonymOption"] < len(it[lang]["options"])
        )
    return len(voc), per_lang


def antonym_table(staged):
    n, per_lang = antonym_counts(staged)
    print("Vocabulary items whose options contain an exact antonym of the key (antonymOption)")
    print(f"  {'':<14}" + "".join(f"{lang:>12}" for lang in LANGS))
    print(f"  {'vocabulary':<14}" + "".join(f"{per_lang[lang]:>2}/{n}".rjust(12) for lang in LANGS))
    ids = [it["id"] for it in staged if it.get("antonymOption") is not None]
    print(f"  items: {', '.join(ids) if ids else 'none'}")
    print(f"  limit: {MAX_ANTONYM_ITEMS}/{n} in every language")
    print()


def check_staged(staged):
    counts = Counter((it["category"], it["difficulty"]) for it in staged)
    problems = []
    for it in staged:
        ant = it.get("antonymOption")
        if ant is not None and (it["category"] != "vocabulary" or ant == it["correctAnswer"] or not 0 <= ant <= 3):
            problems.append(f"{it['id']}: invalid antonymOption {ant}")
    n_voc, per_lang = antonym_counts(staged)
    for lang, got in per_lang.items():
        if got > MAX_ANTONYM_ITEMS:
            problems.append(f"vocabulary {lang}: {got}/{n_voc} items contain an exact antonym of the key > {MAX_ANTONYM_ITEMS}")
    for cat, row in STAGED_TARGET.items():
        for diff, want in row.items():
            got = counts.get((cat, diff), 0)
            if got != want:
                problems.append(f"{cat}/{diff}: {got} staged, target {want}")
    overall = Counter(it["correctAnswer"] for it in staged)
    for p in range(4):
        if not 12 <= overall.get(p, 0) <= 15:
            problems.append(f"key position {p}: {overall.get(p, 0)} times, want 12-15")
    for cat in STAGED_TARGET:
        sub = [it for it in staged if it["category"] == cat]
        c = Counter(it["correctAnswer"] for it in sub)
        for p, got in c.items():
            if got / len(sub) > 0.40:
                problems.append(f"{cat}: key position {p} is {got}/{len(sub)} > 40%")
    for cat, (n, per_lang) in longest_counts(staged).items():
        for lang, got in per_lang.items():
            if got / n > MAX_LONGEST_SHARE:
                problems.append(f"{cat} {lang}: key is the longest option in {got}/{n} > {MAX_LONGEST_SHARE:.0%}")
    if problems:
        print("STAGED CHECK: FAIL")
        for p in problems:
            print(f"  - {p}")
    else:
        print("STAGED CHECK: OK (counts match the research table; key positions within limits; "
              f"key is the longest option in <= {MAX_LONGEST_SHARE:.0%} per category and language; "
              f"<= {MAX_ANTONYM_ITEMS} vocabulary items with an exact antonym)")


def main():
    existing = read_existing()
    staged = read_staged()
    table(f"data/questions.ts ({len(existing)} items)", existing)
    if not staged:
        print("data/staging/text-items.json not found; nothing staged.")
        return
    table(f"data/questions.ts + staged ({len(existing) + len(staged)} items)", existing + staged)
    table(f"staged only ({len(staged)} items)", staged)
    key_distribution(staged, "Key position of staged items")
    key_longest_table(staged)
    antonym_table(staged)
    check_staged(staged)


if __name__ == "__main__":
    main()
