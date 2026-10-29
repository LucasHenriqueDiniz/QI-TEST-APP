# Estratégia de ASO — Teste de QI

ASO (*App Store Optimization*) é o "SEO da Play Store". Este documento registra
o raciocínio por trás dos textos em `listing-*.md` — leia antes de mudá-los.

---

## 1. Como a Play Store indexa (e o que isso muda)

A Play Store **não tem campo de keywords** (isso é da App Store da Apple). Ela
indexa texto de três lugares, em ordem de peso:

| Campo | Limite | Peso | Observação |
|---|---|---|---|
| Título | 30 caracteres | **Altíssimo** | Match exato aqui vale mais que qualquer outra coisa |
| Descrição curta | 80 caracteres | **Alto** | Também é o texto que aparece antes do "Ler mais" |
| Descrição completa | 4.000 caracteres | Médio | Densidade importa, mas *stuffing* é punido |
| Nome do desenvolvedor | 50 caracteres | Baixo | Indexado — vale ter uma palavra-chave |

Fora de texto, os fatores que mais pesam são **comportamentais**: velocidade de
instalação, retenção D1/D7/D30, taxa de desinstalação e nota média. Nenhum texto
compensa um app que as pessoas desinstalam no primeiro dia — por isso o
redesign veio antes da listing.

### A alavanca que você já tem

**Cada idioma é um índice separado.** Uma listing em pt-BR não compete com uma
em en-US; são rankings independentes. O app já tem pt/en/es completos, então
são **3 mercados indexados** pelo preço de um. A maioria dos apps pequenos
publica só em inglês e perde isso.

Ordem de prioridade sugerida:

1. **pt-BR** — competição muito menor, você escreve nativamente, eCPM baixo mas volume acessível
2. **es-419 / es-ES** — mercado grande, competição média, tradução já pronta
3. **en-US** — maior volume e maior eCPM, mas competição brutal; entre por último

---

## 2. Palavras-chave escolhidas

### pt-BR (mercado principal)

| Termo | Volume | Competição | Onde entra |
|---|---|---|---|
| `teste de qi` | Alto | Média | **Título** (match exato) |
| `quiz de lógica` | Médio | Baixa | **Título** (match exato) |
| `teste de inteligência` | Médio | Média | Descrição curta + completa |
| `raciocínio lógico` | Médio | Baixa | Descrição completa (repetido) |
| `teste de qi grátis` | Médio | Baixa | Descrição curta (cauda longa) |
| `desafio mental` | Baixo | Muito baixa | Descrição completa |
| `treinar o cérebro` | Médio | Alta | Descrição completa (1x) |

O par `teste de qi` + `quiz de lógica` no título cobre os dois grandes grupos de
intenção: quem quer *medir* (QI, inteligência) e quem quer *jogar* (quiz,
lógica, desafio). Cauda longa como "teste de qi grátis" tem conversão muito
melhor do que o termo genérico e quase ninguém disputa.

### Termos deliberadamente evitados

- **"teste de QI oficial", "certificado", "profissional", "Mensa"** — atraem
  busca, mas são alegação enganosa. Reprovação na revisão e risco de suspensão.
- **"WAIS", "Wechsler", "Raven"** — marcas registradas de instrumentos
  psicométricos reais. Não use, nem no corpo do texto.
- **"melhor teste de QI", "nº 1"** — a política proíbe superlativos de
  ranqueamento e referências a posição na loja.

---

## 3. Título — regras de composição

Formato: `<palavra-chave principal> - <palavra-chave secundária>`

```
pt-BR   Teste de QI - Quiz de Lógica      (28 / 30)
es-419  Test de CI - Quiz de Lógica       (27 / 30)
en-US   IQ Test - Logic & Pattern Quiz    (29 / 30)
```

Sem nome de marca inventado na frente: para um app sem verba de mídia, gastar
caracteres do título com uma marca que ninguém busca é jogar fora o ativo de
ASO mais valioso que existe. Marca se constrói depois, quando há tráfego.

---

## 4. Ícone e capturas de tela

Ícone e as **duas primeiras capturas** aparecem direto no resultado de busca.
Elas não são indexadas por texto, mas determinam a taxa de clique — e CTR
alimenta o ranqueamento. Na prática, capturas ruins derrubam mais um app do que
uma descrição ruim.

Especificações obrigatórias:

- **Ícone**: 512×512 PNG, 32 bits, sem transparência, sem cantos arredondados
  (a loja arredonda), sem texto pequeno
- **Feature graphic**: 1024×500 PNG/JPG — obrigatório, aparece no topo da ficha
- **Capturas de celular**: mínimo 2, máximo 8. 16:9 ou 9:16, lado menor ≥ 320px
  e maior ≤ 3840px

### Roteiro sugerido das 6 capturas

Cada uma com uma legenda curta sobreposta (a loja não traduz imagem — gere um
jogo por idioma):

| # | Tela | Legenda pt-BR |
|---|---|---|
| 1 | Resultado com a curva | "Descubra seu QI em 10 minutos" |
| 2 | Questão de padrão visual | "30 questões de raciocínio" |
| 3 | Desempenho por área | "Veja seus pontos fortes" |
| 4 | Histórico com evolução | "Acompanhe sua evolução" |
| 5 | Home | "Grátis, sem cadastro" |
| 6 | Ajustes (tema escuro) | "Modo escuro e 3 idiomas" |

Ordem proposital: a captura 1 mostra a **recompensa**, não a tela inicial. O
usuário decide instalar pelo que vai ganhar.

> As capturas finais estão em `store/screenshots/` (2026-10-29), tiradas do
> build preview no Galaxy A15 e legendadas por `scripts/store/compose.py`. A
> ordem e as legendas mudaram em relação ao roteiro acima: sem "Grátis" (a
> Play pede nada de promoção na imagem, decisão D5), sem "em 10 minutos" (não
> prometemos duração antes de medir) e sem "30 questões" (são três modos: 20,
> 40 e 90). A tabela de legendas está em `scripts/store/README.md`.

---

## 5. Sinais que valem mais que texto

Em ordem de impacto:

1. **Nota média e volume de avaliações.** Peça avaliação *depois* de um bom
   resultado, nunca antes do teste. O gancho natural é a tela de resultado.
2. **Retenção.** O histórico com gráfico de evolução existe para dar motivo de
   voltar. É o recurso com maior efeito indireto em ASO no app.
3. **Compartilhamento.** Cada resultado compartilhado é uma instalação orgânica
   potencial. O botão está em destaque na tela de resultado de propósito.
4. **Velocidade de instalação nos primeiros dias.** Um pico inicial ensina o
   algoritmo. Vale concentrar a divulgação em vez de espalhar.

---

## 6. Erros que custam caro

- **Trocar o título toda semana.** Cada mudança reseta o aprendizado do
  algoritmo. Defina e deixe rodar 30 dias antes de avaliar.
- **Traduzir a listing com tradução automática.** Idioma ruim derruba conversão
  e o Google detecta texto de baixa qualidade.
- **Repetir a palavra-chave 20 vezes na descrição.** *Keyword stuffing* é
  violação explícita da política de metadados.
- **Mudar o `package name`.** Impossível. Ele já está travado em
  `com.lhdiniz.testeqi` — confira antes do primeiro upload, porque não há
  segunda chance.
