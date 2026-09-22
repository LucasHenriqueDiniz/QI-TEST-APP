/**
 * Design tokens do app.
 *
 * Fonte única de verdade para cor, espaçamento, raio e tipografia.
 * Nada de hex solto nas telas — sempre `useAppTheme()`.
 */

export type ColorMode = "light" | "dark";

export interface Palette {
  /** Fundo da tela. */
  background: string;
  /** Cartões e superfícies elevadas sobre o fundo. */
  surface: string;
  /** Superfície secundária (inputs, chips, estados hover). */
  surfaceAlt: string;
  /** Divisores e contornos. */
  border: string;

  /** Texto principal. */
  text: string;
  /** Texto de apoio, legendas. */
  textMuted: string;
  /** Texto terciário, marcas d'água. */
  textFaint: string;

  /** Cor de marca. Botões primários, progresso, seleção. */
  primary: string;
  /** Fundo suave da cor de marca (chips, destaques). */
  primarySoft: string;
  /** Texto sobre `primary`. */
  onPrimary: string;
  /** Extremo escuro da marca. Âncora de gradiente e estado pressionado. */
  primaryDeep: string;

  /** Halo de foco e seleção. Já vem com alfa. */
  ring: string;
  /** Véu atrás de modal e folha. Já vem com alfa. */
  overlay: string;

  /** Acento quente — sequências, conquistas, destaques. */
  accent: string;
  accentSoft: string;

  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;

  /** Sombra base (varia por modo para não sumir no escuro). */
  shadow: string;
}

const light: Palette = {
  background: "#FFFFFF",
  surface: "#F7F7FC",
  surfaceAlt: "#EFEFF7",
  border: "#E4E4EF",

  text: "#14142B",
  textMuted: "#63637E",
  textFaint: "#9797AF",

  primary: "#5B4FE9",
  primarySoft: "#EDEBFE",
  onPrimary: "#FFFFFF",
  primaryDeep: "#3F35C9",

  ring: "rgba(91, 79, 233, 0.22)",
  overlay: "rgba(20, 20, 43, 0.45)",

  accent: "#E8890C",
  accentSoft: "#FDF0DC",

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

  text: "#F3F3F8",
  textMuted: "#A2A2C0",
  textFaint: "#6E6E8E",

  primary: "#6E63F0",
  primarySoft: "#221F44",
  onPrimary: "#FFFFFF",
  primaryDeep: "#8A7FF5",

  ring: "rgba(110, 99, 240, 0.30)",
  overlay: "rgba(0, 0, 0, 0.60)",

  accent: "#F0A93C",
  accentSoft: "#33260F",

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
  display: { fontSize: 44, lineHeight: 50, fontWeight: "800" },
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
 * foi desenhada para leitura em tela pequena.
 *
 * As chaves batem com os nomes registrados no `useFonts` de `app/_layout.tsx`.
 * Enquanto as fontes não carregam, o app cai na do sistema — por isso nenhum
 * componente deve assumir que `fontFamily` existe.
 */
export const fonts = {
  display: "Manrope_700Bold",
  heading: "Manrope_700Bold",
  strong: "Manrope_600SemiBold",
  body: "Inter_400Regular",
} as const;

/** Qual família cada variante tipográfica usa. */
export const fontByVariant: Record<TypographyVariant, keyof typeof fonts> = {
  display: "display",
  title: "display",
  heading: "heading",
  subheading: "heading",
  body: "body",
  bodyStrong: "strong",
  caption: "body",
  captionStrong: "strong",
  overline: "strong",
};

/**
 * Presets de animação.
 *
 * Existem para que movimento no app inteiro tenha a mesma sensação. Duração
 * solta em cada tela é o que faz interface parecer remendada.
 */
export const motion = {
  /** Reação a toque: entra rápido e assenta. */
  spring: { damping: 18, stiffness: 220, mass: 0.9 },
  /** Entrada de conteúdo: mais macio, sem sobressalto. */
  springGentle: { damping: 26, stiffness: 140, mass: 1 },
  fast: 160,
  base: 280,
  slow: 460,
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
