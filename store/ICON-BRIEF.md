# Briefing do ícone

## Por que não uma lâmpada ou um cérebro

São o clichê da categoria — busque "teste de QI" na Play Store e metade dos
resultados é lâmpada ou cérebro. Num grid de busca, isso vira ruído: o usuário
não distingue seu app dos outros.

O conceito abaixo usa uma **matriz 3×3 com uma célula faltando**, que é
literalmente o que o app faz (as 150 matrizes de padrão em
`assets/questions/patterns/`). Lê como "quebra-cabeça de padrão" em qualquer
tamanho e não parece nenhum concorrente.

---

## Prompt principal — copie isto

```
A flat vector app icon for a logic and IQ test app. The design is a 3x3 grid of
rounded squares on a solid deep violet background (#5B4FE9). Eight cells are
filled with simple white geometric glyphs — a circle, a triangle, a square, a
half-circle, a diamond — arranged so they read as a visual pattern sequence.
The ninth cell, bottom-right, is empty and outlined with a dashed white stroke,
suggesting a missing piece to be solved.

Style: flat 2D vector, geometric, high contrast, bold thick shapes, generous
negative space. Pure white shapes on flat violet. No gradients, no drop shadows,
no 3D effects, no glow, no texture, no bevels. No text, no letters, no numbers.
No border, no frame, no rounded corners on the outer canvas — the violet
background must fill the entire square edge to edge.

Composition: the grid is centered and occupies about 60% of the canvas width,
leaving even margin on all four sides. Perfectly symmetrical. Square 1:1 aspect
ratio.

Reference aesthetic: modern minimalist mobile app icon, Material Design 3,
Google Play featured app icon. Clean, confident, geometric.
```

## Prompt alternativo — se quiser algo mais "mente"

```
A flat vector app icon for an IQ and logic test app. A single bold white
lightbulb glyph centered on a solid deep violet background (#5B4FE9). The bulb's
interior is drawn as a small 2x2 grid of geometric shapes instead of a filament,
merging the idea of "idea" with "pattern puzzle".

Style: flat 2D vector, thick uniform stroke weight, geometric construction,
high contrast. Pure white on flat violet. No gradients, no shadows, no 3D, no
glow, no texture. No text, no letters, no numbers. No outer border or frame —
the violet fills the entire square edge to edge.

Composition: glyph centered, occupying about 55% of the canvas, even margins.
Square 1:1 aspect ratio.

Reference aesthetic: modern minimalist mobile app icon, Material Design 3.
```

---

## Como corrigir o que o gerador vai errar

Modelos de imagem quase sempre desobedecem em três pontos. Peça correção com
estas frases:

| Problema | Correção a pedir |
|---|---|
| Adicionou cantos arredondados ou moldura | *"Remove the rounded corners and any frame — the background color must extend to all four edges of the square."* |
| Adicionou sombra, brilho ou degradê | *"Make it completely flat — remove all gradients, shadows, glows and highlights. Solid single-color background, solid white shapes."* |
| Inventou texto ou números | *"Remove all text, letters and numbers from the icon."* |
| Detalhe fino demais | *"Simplify — make the shapes thicker and bolder so the icon stays legible at 48×48 pixels."* |

**Teste decisivo:** reduza o resultado para 48×48 e olhe. Se virar borrão, está
detalhado demais — volte e simplifique.

---

## O que fazer com o arquivo depois

O gerador entrega 1024×1024. Você precisa de três recortes:

| Arquivo | Tamanho | Regra |
|---|---|---|
| Upload na Play Store | 512×512 PNG | 32 bits, **sem transparência**, **sem cantos arredondados** (a loja arredonda sozinha) |
| `assets/images/icon.png` | 1024×1024 PNG | Ícone completo, usado no iOS e como fallback |
| `assets/images/adaptive-icon.png` | 1024×1024 PNG | **Só o símbolo**, centralizado, ocupando no máximo 66% da largura — o Android corta as bordas em formatos variados |

O `adaptive-icon` é o que mais gente erra: o Android recorta em círculo,
squircle ou gota conforme o launcher. Qualquer coisa fora do círculo central de
66% pode sumir. O fundo violeta já está definido no `app.json`
(`adaptiveIcon.backgroundColor: "#5B4FE9"`), então esse arquivo deve ter **só o
símbolo branco em fundo transparente**.

Também vale regerar `assets/images/splash-icon.png` (o símbolo sozinho, ~180px
de largura visual) e `favicon.png` (48×48).

---

## Feature graphic — 1024×500, obrigatório

É a faixa no topo da ficha. Prompt sugerido:

```
A 1024x500 horizontal banner for a mobile app store listing. Solid deep violet
background (#5B4FE9). On the left third, a large flat white 3x3 grid of
geometric shapes with one empty dashed cell. The right two thirds are empty
violet space, left clear for text to be added later. Flat 2D vector style, no
gradients, no shadows, no text. Wide 1024:500 aspect ratio.
```

Deixe a direita vazia de propósito — você sobrepõe "Teste de QI · 30 questões
de lógica" depois, num editor, com fonte legível. Texto gerado por modelo de
imagem sai deformado.
