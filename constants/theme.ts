/**
 * Design tokens do app.
 *
 * Fonte única de verdade para cor, espaçamento, raio e tipografia.
 * Nada de hex solto nas telas — sempre `useAppTheme()`.
 */

import { QuestionCategory } from "@/types";

export type ColorMode = "light" | "dark";

/** Par de cores de um gradiente, do início ao fim. */
export type GradientStops = readonly [string, string];

export interface Palette {
  /** Fundo da tela. */
  background: string;
  /** Cartões e superfícies elevadas sobre o fundo. */
  surface: string;
  /** Superfície secundária (inputs, chips, estados hover). */
  surfaceAlt: string;
  /** Divisores e contornos decorativos — não marca limite de nada clicável. */
  border: string;
  /**
   * Contorno de alternativa e campo não selecionados. Precisa de 3:1 sobre
   * `surface` e `background` (WCAG 1.4.11); `border` não chega nem a 1.5:1.
   */
  outline: string;

  /**
   * Fundo das figuras das questões. Os SVGs vêm com traço preto embutido, então
   * este fundo é claro nos dois modos — no escuro, preto sobre `surface` some.
   */
  paper: string;
  /** `paper` tingido de marca, para a alternativa selecionada. */
  paperSelected: string;
  /**
   * Tinta sobre `paper`: a letra do badge da alternativa, qualquer texto ao
   * lado de uma figura. Escura nos dois modos, como o traço dos SVGs — `text`
   * fica claro no escuro e sumiria sobre o papel.
   */
  onPaper: string;

  /** Texto principal. */
  text: string;
  /** Texto de apoio, legendas. */
  textMuted: string;
  /** Texto terciário, marcas d'água. */
  textFaint: string;

  /** Cor de marca. Botões primários, progresso, seleção — preenchimentos. */
  primary: string;
  /**
   * Cor de marca como TEXTO (links, dígitos do score, rótulos). Separada de
   * `primary` porque o violeta que serve de fundo para rótulo branco é escuro
   * demais para ser lido sobre o fundo do tema escuro.
   */
  primaryText: string;
  /** Fundo suave da cor de marca (chips, destaques). */
  primarySoft: string;
  /** Texto sobre `primary`. */
  onPrimary: string;
  /** Extremo escuro da marca. Âncora de gradiente e estado pressionado. */
  primaryDeep: string;
  /** Gradiente da marca: CTA primário, herói do resultado, cartão de compartilhar. */
  gradientBrand: GradientStops;
  /** Lavagem de cor no topo da tela, uma por tela. */
  gradientGlow: GradientStops;

  /** Halo de foco e seleção. Já vem com alfa. */
  ring: string;
  /** Véu atrás de modal e folha. Já vem com alfa. */
  overlay: string;

  /** Acento quente — sequências, conquistas, destaques. */
  accent: string;
  accentSoft: string;
  /** Texto sobre `accentSoft` (chip "Ponto forte"); `accent` puro não passa. */
  onAccentSoft: string;
  /**
   * Texto sobre `accent` cheio (balão "Você · 112" no marcador da curva).
   * Branco no claro; no escuro o acento é um âmbar claro, então a tinta é
   * escura.
   */
  onAccent: string;
  /**
   * Fundo de chip sobre `gradientBrand` (chip da faixa no herói do resultado).
   * Já vem com alfa; texto branco por cima passa em 6.64:1 no ponto claro.
   */
  gradientChip: string;

  /** Cor de ícone, barra e destaque de cada área avaliada. */
  category: Record<QuestionCategory, string>;

  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;

  /** Sombra base (varia por modo para não sumir no escuro). */
  shadow: string;
}

// Os valores são verificados por `scripts/device/check_contrast.py`, que lê
// estas duas paletas linha a linha (`chave: "#RRGGBB"`). Mantenha o formato.
const light: Palette = {
  background: "#FFFFFF",
  surface: "#F7F7FC",
  surfaceAlt: "#EFEFF7",
  border: "#E4E4EF",
  outline: "#8A8AA6",

  paper: "#FFFFFF",
  paperSelected: "#EDEBFE",
  onPaper: "#14142B",

  text: "#14142B",
  textMuted: "#63637E",
  textFaint: "#6E6E8A",

  primary: "#5B4FE9",
  primaryText: "#5B4FE9",
  primarySoft: "#EDEBFE",
  onPrimary: "#FFFFFF",
  primaryDeep: "#3F35C9",
  gradientBrand: ["#6A5CF5", "#4A3FD6"],
  gradientGlow: ["#EDEBFE", "#FFFFFF"],

  ring: "rgba(91, 79, 233, 0.22)",
  overlay: "rgba(20, 20, 43, 0.45)",

  accent: "#A35F00",
  accentSoft: "#FDF0DC",
  onAccentSoft: "#8F5600",
  onAccent: "#FFFFFF",
  gradientChip: "rgba(0, 0, 0, 0.20)",

  category: {
    patterns: "#5B4FE9",
    matrix: "#1F6FD1",
    similarities: "#0B7F67",
    vocabulary: "#A35F00",
    comprehension: "#C2365F",
  },

  success: "#0F9D58",
  successSoft: "#E3F5EC",
  danger: "#D92D46",
  dangerSoft: "#FCE8EC",

  shadow: "#14142B",
};

const dark: Palette = {
  background: "#0D0D18",
  surface: "#171728",
  surfaceAlt: "#1F1F36",
  border: "#2C2C48",
  outline: "#62628A",

  paper: "#DCDCE8",
  paperSelected: "#D6D2FC",
  onPaper: "#14142B",

  text: "#F3F3F8",
  textMuted: "#A2A2C0",
  textFaint: "#8A8AAD",

  // Ponto claro do `gradientBrand`: o `#6E63F0` anterior dava 4.46:1 com o
  // rótulo branco, abaixo do 4.5 exigido para texto.
  primary: "#6A5CF5",
  primaryText: "#9D94FF",
  primarySoft: "#221F44",
  onPrimary: "#FFFFFF",
  primaryDeep: "#8A7FF5",
  gradientBrand: ["#6A5CF5", "#4A3FD6"],
  gradientGlow: ["#2A1F6B", "#0D0D18"],

  ring: "rgba(106, 92, 245, 0.30)",
  overlay: "rgba(0, 0, 0, 0.60)",

  accent: "#F0A93C",
  accentSoft: "#33260F",
  onAccentSoft: "#F0A93C",
  onAccent: "#14142B",
  gradientChip: "rgba(0, 0, 0, 0.20)",

  category: {
    patterns: "#8B7CFF",
    matrix: "#4DA3FF",
    similarities: "#2CC7A0",
    vocabulary: "#F2B33D",
    comprehension: "#FF7A9C",
  },

  success: "#2DBE7B",
  successSoft: "#102C20",
  danger: "#F2536B",
  dangerSoft: "#33141B",

  shadow: "#000000",
};

export const palettes: Record<ColorMode, Palette> = { light, dark };

/** Escala de espaçamento em passos de 4. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Escala tipográfica. `lineHeight` sempre explícito — o padrão do Android
 * corta acentos em pt/es quando a fonte cresce.
 */
export const typography = {
  /**
   * Pontuação do resultado. Dígitos tabulares para a contagem não tremer, e
   * escala de fonte travada em 1.2× — em 200% um número de 96 pt não cabe na
   * largura do A15.
   */
  score: { fontSize: 96, lineHeight: 104, fontWeight: "800", fontVariant: ["tabular-nums"], maxFontSizeMultiplier: 1.2 },
  display: { fontSize: 36, lineHeight: 42, fontWeight: "800" },
  title: { fontSize: 30, lineHeight: 38, fontWeight: "800" },
  heading: { fontSize: 22, lineHeight: 30, fontWeight: "700" },
  subheading: { fontSize: 18, lineHeight: 26, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: "600" },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
  captionStrong: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  overline: { fontSize: 12, lineHeight: 16, fontWeight: "700", letterSpacing: 0.8 },
} as const;

export type TypographyVariant = keyof typeof typography;

/**
 * Famílias tipográficas.
 *
 * Manrope carrega os títulos, Inter o texto corrido — Manrope tem contraste
 * alto e cabe bem em número grande (a pontuação do resultado), enquanto Inter
 * foi desenhada para leitura em tela pequena. O peso 800 fica só para o
 * display e o score; títulos menores em 800 engordam demais.
 *
 * As chaves batem com os nomes registrados no `useFonts` de `app/_layout.tsx`.
 * Enquanto as fontes não carregam, o app cai na do sistema — por isso nenhum
 * componente deve assumir que `fontFamily` existe.
 */
export const fonts = {
  display: "Manrope_800ExtraBold",
  heading: "Manrope_700Bold",
  strong: "Manrope_600SemiBold",
  body: "Inter_400Regular",
} as const;

/** Qual família cada variante tipográfica usa. */
export const fontByVariant: Record<TypographyVariant, keyof typeof fonts> = {
  score: "display",
  display: "display",
  title: "heading",
  heading: "heading",
  subheading: "heading",
  body: "body",
  bodyStrong: "strong",
  caption: "body",
  captionStrong: "strong",
  overline: "strong",
};

/**
 * Presets de animação — as molas do Material 3 Expressive, convertidas para
 * `withSpring`.
 *
 * Existem para que movimento no app inteiro tenha a mesma sensação. Duração
 * solta em cada tela é o que faz interface parecer remendada.
 *
 * `mass: 1` está explícito em todas: o Reanimated 4.5 usa `GentleSpringConfig`
 * (massa 4) como padrão, e uma mola sem `mass` herdaria isso em silêncio,
 * ficando quatro vezes mais lenta do que o token promete.
 *
 * `*Spatial` move coisas (transform) e pode passar do alvo e voltar;
 * `*Effects` troca cor e opacidade sem sobressalto.
 */
export const motion = {
  /** Toque, pop de seleção, chip, marcador caindo. */
  fastSpatial: { mass: 1, stiffness: 800, damping: 33.9 },
  /** Questão entrando, folha inferior, cartão entrando. */
  defaultSpatial: { mass: 1, stiffness: 380, damping: 31.2 },
  /** Herói de tela inteira entrando. */
  slowSpatial: { mass: 1, stiffness: 200, damping: 22.6 },
  fastEffects: { mass: 1, stiffness: 3800, damping: 123.3 },
  defaultEffects: { mass: 1, stiffness: 1600, damping: 80 },
  slowEffects: { mass: 1, stiffness: 800, damping: 56.6 },
  /** Durações para `withTiming`, em ms. */
  durations: {
    /** Resposta a um toque — acima de ~100 ms já parece atraso. */
    feedback: 100,
    /** Saída de conteúdo: mais curta, porque ninguém olha o que vai embora. */
    exit: 150,
    /** Entrada de conteúdo. */
    enter: 250,
  },
} as const;

/** Sombras já resolvidas para iOS (shadow*) e Android (elevation). */
export function elevation(level: 0 | 1 | 2 | 3, shadowColor: string) {
  if (level === 0) return {};
  const config = {
    1: { opacity: 0.06, radius: 6, offset: 2, elevation: 2 },
    2: { opacity: 0.1, radius: 14, offset: 5, elevation: 5 },
    3: { opacity: 0.16, radius: 24, offset: 10, elevation: 10 },
  }[level];

  return {
    shadowColor,
    shadowOpacity: config.opacity,
    shadowRadius: config.radius,
    shadowOffset: { width: 0, height: config.offset },
    elevation: config.elevation,
  };
}
