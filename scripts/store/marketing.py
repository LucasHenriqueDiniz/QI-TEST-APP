"""Renders the store's marketing screenshots and feature graphic in headless Chrome.

usage: marketing.py <raw-dir> <out-dir>

<raw-dir>/<lang>/<n>-<name>.png are the phone shots from
scripts/device/store_shots.py. For each language this writes, under
<out-dir>/<play-locale>/:
  1-result.png … 6-settings.png   1080x1920: a headline with one word in the
                                   accent colour, a supporting line, the shot
                                   in a tilted phone, a floating badge, on the
                                   brand gradient with the 3x3 motif
  feature-graphic.png              1024x500
All RGB without alpha. Copy carries no price, ranking or duration words
(decision D5; Play's listing rules ban "free", "best", "#1" in images).
Fonts are the app's (Manrope, Inter) from node_modules.
"""
import html
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONTS = os.path.join(ROOT, "node_modules", "@expo-google-fonts")
ICON = os.path.join(ROOT, "assets", "images", "brand-mark.png")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LOCALES = {"pt": "pt-BR", "en": "en-US", "es": "es-419"}
# The app's area in an A15 shot (1080x2340): below the status bar, above the banner.
APP_TOP, APP_BOTTOM = 80, 2037

# (shot, headline with *accent*, supporting line, badge, tilt in degrees)
SLIDES = {
    "pt": [
        ("1-result", "Descubra seu *QI*", "Resultado completo, com a faixa provável e a curva da população", "124 · Superior", -4),
        ("2-pattern", "Desafie seu *raciocínio*", "Matrizes visuais, lógica numérica, semelhanças e vocabulário", "5 áreas", 4),
        ("3-profile", "Conheça seus *pontos fortes*", "Perfil por área e os índices Verbal e Raciocínio", "Raciocínio 127", -4),
        ("4-history", "Acompanhe sua *evolução*", "Gráfico dos seus testes e o seu recorde pessoal", "Recorde 124", 4),
        ("5-home", "*3 modos* de teste", "Rápido com 20, Normal com 40 ou Detalhado com 90 questões", "20 · 40 · 90", -4),
        ("6-settings", "Do seu *jeito*", "Tema escuro, três idiomas e nenhum cadastro", "Sem cadastro", 4),
    ],
    "en": [
        ("1-result", "Discover your *IQ*", "A full result, with its likely range and the population curve", "124 · Superior", -4),
        ("2-pattern", "Challenge your *reasoning*", "Visual matrices, number logic, similarities and vocabulary", "5 areas", 4),
        ("3-profile", "Find your *strengths*", "Profile by area plus the Verbal and Reasoning indices", "Reasoning 127", -4),
        ("4-history", "Track your *progress*", "A chart of your tests and your personal record", "Record 124", 4),
        ("5-home", "*3 test* modes", "Quick with 20, Normal with 40 or Detailed with 90 questions", "20 · 40 · 90", -4),
        ("6-settings", "Your *way*", "Dark theme, three languages and no sign-up", "No sign-up", 4),
    ],
    "es": [
        ("1-result", "Descubre tu *CI*", "Resultado completo, con su rango probable y la curva de la población", "124 · Superior", -4),
        ("2-pattern", "Desafía tu *razonamiento*", "Matrices visuales, lógica numérica, semejanzas y vocabulario", "5 áreas", 4),
        ("3-profile", "Conoce tus *puntos fuertes*", "Perfil por área y los índices Verbal y Razonamiento", "Razonamiento 127", -4),
        ("4-history", "Sigue tu *evolución*", "Gráfico de tus tests y tu récord personal", "Récord 124", 4),
        ("5-home", "*3 modos* de test", "Rápido con 20, Normal con 40 o Detallado con 90 preguntas", "20 · 40 · 90", -4),
        ("6-settings", "A tu *manera*", "Tema oscuro, tres idiomas y sin registro", "Sin registro", 4),
    ],
}
FEATURE = {
    "pt": ("Descubra seu *QI*", "Raciocínio visual, lógica e vocabulário"),
    "en": ("Discover your *IQ*", "Visual reasoning, logic and vocabulary"),
    "es": ("Descubre tu *CI*", "Razonamiento visual, lógica y vocabulario"),
}

CSS = """
@font-face { font-family: Manrope; font-weight: 800; src: url("file://%(fonts)s/manrope/800ExtraBold/Manrope_800ExtraBold.ttf"); }
@font-face { font-family: Manrope; font-weight: 700; src: url("file://%(fonts)s/manrope/700Bold/Manrope_700Bold.ttf"); }
@font-face { font-family: Inter; font-weight: 400; src: url("file://%(fonts)s/inter/400Regular/Inter_400Regular.ttf"); }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: %(w)dpx; height: %(h)dpx; overflow: hidden; }
body { position: relative; font-family: Inter; color: #fff;
  background: radial-gradient(1100px 700px at 85%% 10%%, #8B7BFF 0%%, rgba(139,123,255,0) 60%%),
              radial-gradient(900px 900px at 0%% 100%%, #2A1E9E 0%%, rgba(42,30,158,0) 70%%),
              linear-gradient(170deg, #6A5CF5 0%%, #4A3FD6 45%%, #241A8A 100%%); }
.tile { position: absolute; border-radius: 22%%; border: 3px solid rgba(255,255,255,.14); }
.tile.fill { background: rgba(255,255,255,.08); border: none; }
.tile.q { border: 3px dashed rgba(255,200,87,.55); }
h1 { font-family: Manrope; font-weight: 800; letter-spacing: -1px; line-height: 1.05; }
h1 em { font-style: normal; color: #FFC857; }
.sub { font-family: Inter; opacity: .9; line-height: 1.3; }
.phone { position: absolute; background: #0d0c1a;
  box-shadow: 0 60px 120px rgba(10,6,50,.55), 0 0 0 3px #2c2a4a inset, 0 0 0 2px rgba(255,255,255,.08); }
.screen { position: relative; overflow: hidden; background: #0f0f1a; }
.screen img { display: block; width: 100%%; }
.bar { display: flex; align-items: center; justify-content: space-between; font-family: Inter; color: #e9e8ff; }
.bar .dots { display: flex; align-items: center; }
.bar .dots i, .bar .dots b { display: block; background: #e9e8ff; opacity: .9; }
.bar .dots b { border-radius: 50%%; }
.punch { position: absolute; left: 50%%; border-radius: 50%%; background: #05050c; }
.badge { position: absolute; font-family: Manrope; font-weight: 800; color: #1c1450; background: #FFC857;
  border-radius: 999px; box-shadow: 0 24px 48px rgba(10,6,50,.4); white-space: nowrap; }
"""


def headline(text):
    parts = html.escape(text).split("*")
    return "".join(f"<em>{p}</em>" if i % 2 else p for i, p in enumerate(parts))


def motif(width, height, cells):
    out = []
    for x, y, size, kind in cells:
        out.append(f'<div class="tile {kind}" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px"></div>')
    return "".join(out)


def phone(shot, width, left, top, tilt):
    """A phone frame around the shot; every measure scales with the width (760 px is the reference)."""
    k = width / 760
    pad, inner = 20 * k, width - 40 * k
    dot, gap = 14 * k, 10 * k
    return (f'<div class="phone" style="left:{left}px;top:{top}px;width:{width}px;padding:{pad}px;'
            f'border-radius:{86 * k}px;transform:rotate({tilt}deg)">'
            f'<div class="screen" style="border-radius:{68 * k}px">'
            f'<div class="punch" style="top:{20 * k}px;width:{26 * k}px;height:{26 * k}px;margin-left:{-13 * k}px"></div>'
            f'<div class="bar" style="height:{64 * k}px;padding:0 {46 * k}px;font-size:{26 * k}px"><span>9:41</span>'
            f'<span class="dots" style="gap:{gap}px"><b style="width:{dot}px;height:{dot}px"></b>'
            f'<b style="width:{dot}px;height:{dot}px"></b>'
            f'<i style="width:{26 * k}px;height:{dot}px;border-radius:{4 * k}px"></i></span></div>'
            f'<img src="file://{shot}" style="width:{inner}px"></div></div>')


def slide_html(shot, title, sub, badge, tilt):
    cells = [(-40, 1180, 150, ""), (900, 520, 120, "fill"), (960, 1500, 160, ""), (60, 1640, 110, "fill"),
             (870, 80, 90, "q"), (40, 470, 80, "")]
    return (f'<html><head><style>{CSS % {"fonts": FONTS, "w": 1080, "h": 1920}}'
            f'h1{{font-size:96px;margin:118px 72px 0}} .sub{{font-size:38px;margin:30px 72px 0;max-width:900px}}'
            f'.badge{{font-size:46px;padding:22px 40px}}</style></head><body>'
            f'{motif(1080, 1920, cells)}'
            f'<h1>{headline(title)}</h1><p class="sub">{html.escape(sub)}</p>'
            f'{phone(shot, 760, 160, 560, tilt)}'
            # Over the phone's upper corner, where the screen is plain: the
            # first version sat on the result's chip and percentile line.
            f'<div class="badge" style="top:{500 if tilt < 0 else 520}px;{"right" if tilt < 0 else "left"}:56px;'
            f'transform:rotate({tilt * -1.5}deg)">{html.escape(badge)}</div>'
            f'</body></html>')


def feature_html(shot, title, sub):
    cells = [(560, -30, 110, ""), (930, 360, 90, "fill"), (520, 380, 70, "q"), (20, 400, 60, "fill")]
    return (f'<html><head><style>{CSS % {"fonts": FONTS, "w": 1024, "h": 500}}'
            f'h1{{font-size:78px;position:absolute;left:64px;top:150px;width:520px}}'
            f'.sub{{font-size:28px;position:absolute;left:66px;top:330px;width:500px}}'
            f'.icon{{position:absolute;left:64px;top:56px;width:72px;height:72px;border-radius:18px}}'
            f'</style></head><body>{motif(1024, 500, cells)}'
            f'<img class="icon" src="file://{ICON}">'
            f'<h1>{headline(title)}</h1><p class="sub">{html.escape(sub)}</p>'
            f'{phone(shot, 330, 650, 40, -6)}</body></html>')


def render(page, width, height, out):
    with tempfile.TemporaryDirectory() as folder:
        source = os.path.join(folder, "page.html")
        open(source, "w", encoding="utf-8").write(page)
        shot = os.path.join(folder, "shot.png")
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                        "--allow-file-access-from-files", "--virtual-time-budget=4000",
                        f"--window-size={width},{height}", f"--screenshot={shot}", f"file://{source}"],
                       capture_output=True, check=True)
        subprocess.run(["magick", shot, "-crop", f"{width}x{height}+0+0", "+repage", "-alpha", "off",
                        "-define", "png:color-type=2", out], check=True)


def crop_app_area(raw, folder):
    out = os.path.join(folder, os.path.basename(os.path.dirname(raw)) + "-" + os.path.basename(raw))
    subprocess.run(["magick", raw, "-crop", f"1080x{APP_BOTTOM - APP_TOP}+0+{APP_TOP}", "+repage", out], check=True)
    return out


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    raw_dir, out_dir = sys.argv[1:]
    work = tempfile.mkdtemp(prefix="qi-marketing-")
    count = 0
    for lang, slides in SLIDES.items():
        target = os.path.join(out_dir, LOCALES[lang])
        os.makedirs(target, exist_ok=True)
        for name, title, sub, badge, tilt in slides:
            shot = crop_app_area(os.path.join(raw_dir, lang, f"{name}.png"), work)
            render(slide_html(shot, title, sub, badge, tilt), 1080, 1920, os.path.join(target, f"{name}.png"))
            count += 1
        title, sub = FEATURE[lang]
        shot = crop_app_area(os.path.join(raw_dir, lang, "1-result.png"), work)
        render(feature_html(shot, title, sub), 1024, 500, os.path.join(target, "feature-graphic.png"))
        count += 1
    print(f"{count} images in {out_dir}")


if __name__ == "__main__":
    main()
