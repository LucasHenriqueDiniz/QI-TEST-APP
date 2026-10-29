"""Checks the band, indices and speed on Results for each kind of entry.

usage: check_results_band.py

Opens Results by link with four history entries written here (Rápido,
Normal with a speed result, Detalhado with both indices and speed, and a
legacy entry from before the modes, with no band) as
`testeqi://results?mode=history&entry=<json>`, so nothing is saved and no
reveal runs. For each: `check_fit`'s rules with "Compartilhar resultado"
required on the first screen (and no options: the strip's "13/20 acertos"
reads like a question counter); the band text equals the entry's band (none
for the legacy one; the hero repeats it in its own label, so it is counted
once); in Detalhado both index scores are shown; with `speed`, its counts.
The profile and speed cards sit below the fold, so the text is gathered
over three scroll positions. Prints one line per
entry and `N/4 match`; exits 0 only at 4/4.
"""
import json
import os
import re
import sys
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_fit  # noqa: E402
import ui  # noqa: E402

SHARE = "Compartilhar resultado"
BAND = re.compile(r"Faixa provável: (\d+)–(\d+)")


def category(name, correct, total):
    return {"category": name, "correct": correct, "total": total, "weightEarned": correct, "weightTotal": total}


BASE = {"date": "2026-10-29T12:00:00.000Z", "percentile": 75, "durationSeconds": 900}
ENTRIES = {
    "rapido": {**BASE, "mode": "rapido", "iqScore": 108, "correctAnswers": 13, "totalQuestions": 20,
               "band": {"lower": 97, "upper": 119},
               "categories": [category("patterns", 4, 6), category("matrix", 3, 4), category("similarities", 2, 3),
                              category("vocabulary", 2, 3), category("comprehension", 2, 4)]},
    "normal": {**BASE, "mode": "normal", "iqScore": 112, "correctAnswers": 27, "totalQuestions": 40,
               "band": {"lower": 104, "upper": 121},
               "speed": {"correct": 41, "wrong": 3, "score": 38, "seconds": 90},
               "categories": [category("patterns", 9, 12), category("matrix", 6, 8), category("similarities", 4, 7),
                              category("vocabulary", 4, 6), category("comprehension", 4, 7)]},
    "detalhado": {**BASE, "mode": "detalhado", "iqScore": 117, "correctAnswers": 63, "totalQuestions": 90,
                  "band": {"lower": 111, "upper": 124},
                  "indices": {"reasoning": {"score": 121, "band": {"lower": 112, "upper": 130}, "items": 45},
                              "verbal": {"score": 109, "band": {"lower": 100, "upper": 118}, "items": 45}},
                  "speed": {"correct": 52, "wrong": 6, "score": 46, "seconds": 90},
                  "categories": [category("patterns", 20, 27), category("matrix", 13, 18), category("similarities", 10, 15),
                                 category("vocabulary", 10, 15), category("comprehension", 10, 15)]},
    "legacy": {"date": "2026-09-01T12:00:00.000Z", "iqScore": 104, "percentile": 60, "correctAnswers": 18, "totalQuestions": 30,
               "categories": [category("patterns", 6, 10), category("matrix", 4, 6), category("similarities", 3, 5),
                              category("vocabulary", 3, 5), category("comprehension", 2, 4)]},
}


def texts(nodes):
    return [n.label for n in ui.ours(nodes) if n.label]


def check_entry(name, entry):
    url = "testeqi://results?mode=history&entry=" + urllib.parse.quote(json.dumps(entry, ensure_ascii=False), safe="")
    ui.open_route(url)
    found, nodes = ui.wait_for(lambda n: ui.find(ui.ours(n), pattern=ui.RESULTS_TITLE), timeout=15)
    if not found:
        return False, "Results did not open"
    nodes = ui.dump()
    problems, _ = check_fit.check(nodes, require=(SHARE,), options=0)
    labels = texts(nodes)
    width, height = ui.screen_size()
    for _ in range(3):
        ui.adb("shell", "input", "swipe", str(width // 2), str(height * 3 // 4), str(width // 2), str(height // 4), "300")
        labels += texts(ui.dump())
    shown = {(int(m[1]), int(m[2])) for m in (BAND.search(label) for label in labels) if m}
    shown = sorted(shown)
    stored = (entry["band"]["lower"], entry["band"]["upper"]) if "band" in entry else None
    band_ok = shown == ([stored] if stored else [])
    notes = [f"band on screen {shown or 'none'}, stored {stored or 'none'}"]
    ok = band_ok and not problems
    if "indices" in entry:
        scores = [str(entry["indices"][d]["score"]) for d in ("reasoning", "verbal")]
        indices_ok = all(score in labels for score in scores) and "Raciocínio" in labels and "Verbal" in labels
        notes.append(f"indices {'shown' if indices_ok else 'missing'}")
        ok = ok and indices_ok
    if "speed" in entry:
        speed = entry["speed"]
        counts = f"{speed['correct']} acertos e {speed['wrong']} erros em {speed['seconds']} s"
        speed_ok = any(counts in label for label in labels) and "Velocidade (experimental)" in labels
        notes.append(f"speed {'shown' if speed_ok else 'missing'}")
        ok = ok and speed_ok
    if problems:
        notes.append("fit: " + "; ".join(problems))
    return ok, ", ".join(notes)


def main():
    ui.require_device()
    ui.cold_start()
    if not ui.wait_for(ui.start_button, timeout=45)[0]:
        sys.exit("Home did not appear after a cold start")
    passed = 0
    for name, entry in ENTRIES.items():
        ok, detail = check_entry(name, entry)
        passed += ok
        print(f"{name}: {'match' if ok else 'MISMATCH'} ({detail})", flush=True)
        ui.back()
        ui.wait_for(ui.start_button, timeout=10)
    print(f"{passed}/{len(ENTRIES)} match")
    sys.exit(0 if passed == len(ENTRIES) else 1)


if __name__ == "__main__":
    main()
