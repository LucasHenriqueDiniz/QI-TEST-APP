# Store images

Six screenshots per language (pt-BR, en-US, es-419), 1080×1920, and a
1024×500 feature graphic per language, made from a preview (release) build
on the Galaxy A15 so no dev-client button shows.

Each screenshot is a headline with one word in the accent colour, a
supporting line, the shot inside a tilted phone frame and a floating badge,
on the brand gradient with the 3×3 motif (`marketing.py`, rendered in
headless Chrome with the app's fonts).

| file | screen | pt-BR headline | badge |
|---|---|---|---|
| `1-result` | Results revealing a Detalhado result | Descubra seu **QI** | 124 · Superior |
| `2-pattern` | a pattern question | Desafie seu **raciocínio** | 5 áreas |
| `3-profile` | Results scrolled to the indices and areas | Conheça seus **pontos fortes** | Raciocínio 127 |
| `4-history` | History | Acompanhe sua **evolução** | Recorde 124 |
| `5-home` | Home with the record and the mode chooser | **3 modos** de teste | 20 · 40 · 90 |
| `6-settings` | Settings | Do seu **jeito** | Sem cadastro |

No price, ranking or duration words (decision D5; Play's listing rules ban
"free", "best", "#1" in images; the old `ASO.md` plan said "Grátis" and "em
10 minutos").

## Steps

1. Dev build installed: `python3 -I scripts/store/showcase.py write <backup>`
   copies the owner's storage to `<backup>` and writes `showcase.json`'s
   history (eight tests rising to a Detalhado 124).
2. `adb install -r <preview.apk>` over it (same package and signing key, so the
   data stays).
3. `python3 -I scripts/device/store_shots.py <raw>` (it sets `QI_RELEASE=1`):
   switches the language in Settings and saves the six raw shots per language.
4. `python3 -I scripts/store/marketing.py <raw> <out>`: the 18 screenshots and
   3 feature graphics, RGB without alpha; copy them into `store/screenshots/`
   and `store/feature-graphic-<locale>.png`.
5. `adb install -r <dev.apk>` and `python3 -I scripts/store/showcase.py restore
   <backup>`.

`showcase.json` is sample data: a plausible run of results so the screens are
not empty.
