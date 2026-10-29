"""Composes the store screenshots: a caption over the brand gradient, the phone shot below.

usage: compose.py <raw-dir> <out-dir>

Reads <raw-dir>/<lang>/<n>-<name>.png (from scripts/device/store_shots.py)
and writes <out-dir>/<play-locale>/<n>-<name>.png: 1080x1920, RGB with no
alpha, the caption in the top 18% (the listing guidance keeps text to at most
20% of the image) and the screenshot below it with rounded corners. The shot
is cut to the app itself, from below the status bar to the top of the banner
slot (A15 frames: status bar 0-80 px, banner from 2037 px): the test ad and
the phone's notifications have no place in a listing. Captions
carry no price, ranking or duration words (decision D5). Needs ImageMagick
and the Manrope font from node_modules.
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONT = os.path.join(ROOT, "node_modules", "@expo-google-fonts", "manrope", "800ExtraBold", "Manrope_800ExtraBold.ttf")
WIDTH, HEIGHT = 1080, 1920
CAPTION_H = 340  # 17.7% of the height
# The app's area on the A15 (1080x2340): below the status bar, above the banner.
APP_TOP, APP_BOTTOM = 80, 2037
TOP, BOTTOM = "#6A5CF5", "#2A2280"
LOCALES = {"pt": "pt-BR", "en": "en-US", "es": "es-419"}

CAPTIONS = {
    "pt": {
        "1-result": "Seu QI estimado,\ncom a faixa provável",
        "2-pattern": "Matrizes, lógica\ne vocabulário",
        "3-profile": "Veja seus\npontos fortes",
        "4-history": "Acompanhe\nsua evolução",
        "5-home": "Três modos:\n20, 40 ou 90 questões",
        "6-settings": "Tema escuro\ne três idiomas",
    },
    "en": {
        "1-result": "Your estimated IQ,\nwith its likely range",
        "2-pattern": "Matrices, logic\nand vocabulary",
        "3-profile": "See your\nstrongest areas",
        "4-history": "Track your\nprogress",
        "5-home": "Three modes:\n20, 40 or 90 questions",
        "6-settings": "Dark theme\nand three languages",
    },
    "es": {
        "1-result": "Tu CI estimado,\ncon su rango probable",
        "2-pattern": "Matrices, lógica\ny vocabulario",
        "3-profile": "Descubre tus\npuntos fuertes",
        "4-history": "Sigue tu\nevolución",
        "5-home": "Tres modos:\n20, 40 o 90 preguntas",
        "6-settings": "Tema oscuro\ny tres idiomas",
    },
}


def magick(*args):
    subprocess.run(["magick", *args], check=True)


def compose(raw, caption, out):
    phone_h = HEIGHT - CAPTION_H - 50
    phone_w = round(phone_h * 1080 / (APP_BOTTOM - APP_TOP))
    tmp = out + ".phone.png"
    # The app's area, scaled down, with rounded corners.
    magick(raw, "-crop", f"1080x{APP_BOTTOM - APP_TOP}+0+{APP_TOP}", "+repage", "-resize", f"{phone_w}x{phone_h}!",
           "(", "+clone", "-alpha", "extract", "-fill", "black", "-colorize", "100",
           "-fill", "white", "-draw", f"roundrectangle 0,0,{phone_w - 1},{phone_h - 1},44,44", ")",
           "-alpha", "off", "-compose", "CopyOpacity", "-composite", tmp)
    magick("-size", f"{WIDTH}x{HEIGHT}", f"gradient:{TOP}-{BOTTOM}",
           "-font", FONT, "-pointsize", "64", "-fill", "white", "-gravity", "north", "-interline-spacing", "6",
           "-annotate", "+0+92", caption,
           tmp, "-gravity", "north", "-geometry", f"+0+{CAPTION_H}", "-composite",
           "-alpha", "off", "-define", "png:color-type=2", out)
    os.remove(tmp)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    raw_dir, out_dir = sys.argv[1:]
    count = 0
    for lang, captions in CAPTIONS.items():
        target = os.path.join(out_dir, LOCALES[lang])
        os.makedirs(target, exist_ok=True)
        for name, caption in captions.items():
            raw = os.path.join(raw_dir, lang, f"{name}.png")
            if not os.path.exists(raw):
                print(f"missing {raw}")
                continue
            compose(raw, caption, os.path.join(target, f"{name}.png"))
            count += 1
    print(f"{count} screenshots in {out_dir}")


if __name__ == "__main__":
    main()
