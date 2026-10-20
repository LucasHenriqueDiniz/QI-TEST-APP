import type { Difficulty, Question, QuestionCategory, TestMode } from "../../types/index.ts";

export const CATEGORIES: readonly QuestionCategory[] = ["patterns", "matrix", "similarities", "vocabulary", "comprehension"];
export const DIFFICULTIES: readonly Difficulty[] = ["easy", "medium", "hard"];
export const MODES: readonly TestMode[] = ["rapido", "normal", "detalhado"];

/** Quantas questões de cada categoria × dificuldade uma rodada tem. */
export type Blueprint = Record<QuestionCategory, Record<Difficulty, number>>;

/**
 * Composição de cada modo (pesquisa scoring-modes §5.1): metade raciocínio
 * (patterns + matrix), metade verbal; cerca de 30/40/30 por dificuldade, para
 * os três modos medirem a mesma faixa.
 */
export const BLUEPRINTS: Record<TestMode, Blueprint> = {
  rapido: {
    patterns: { easy: 2, medium: 2, hard: 2 },
    matrix: { easy: 1, medium: 2, hard: 1 },
    similarities: { easy: 1, medium: 2, hard: 1 },
    vocabulary: { easy: 1, medium: 1, hard: 1 },
    comprehension: { easy: 1, medium: 1, hard: 1 },
  },
  normal: {
    patterns: { easy: 4, medium: 4, hard: 4 },
    matrix: { easy: 2, medium: 4, hard: 2 },
    similarities: { easy: 2, medium: 3, hard: 2 },
    vocabulary: { easy: 2, medium: 3, hard: 2 },
    comprehension: { easy: 2, medium: 2, hard: 2 },
  },
  detalhado: {
    patterns: { easy: 8, medium: 11, hard: 8 },
    matrix: { easy: 5, medium: 8, hard: 5 },
    similarities: { easy: 4, medium: 6, hard: 5 },
    vocabulary: { easy: 4, medium: 6, hard: 5 },
    comprehension: { easy: 5, medium: 6, hard: 4 },
  },
};

/**
 * Formas alternativas completas que cada célula do banco precisa comportar
 * para o modo ser oferecido. Detalhado exige 2: com menos, dois testes
 * consecutivos repetem a maior parte dos itens (D8). Rápido e Normal saem
 * com o banco de hoje e o preenchimento por categoria (pesquisa §5.4).
 */
const FORMS_REQUIRED: Record<TestMode, number> = { rapido: 0, normal: 0, detalhado: 2 };

export function blueprintLength(blueprint: Blueprint): number {
  return CATEGORIES.reduce((total, category) => total + DIFFICULTIES.reduce((sum, difficulty) => sum + blueprint[category][difficulty], 0), 0);
}

/** Quantas questões o modo tem quando o banco comporta o blueprint. */
export function roundLength(mode: TestMode): number {
  return blueprintLength(BLUEPRINTS[mode]);
}

/** Lê um modo vindo de fora (parâmetro de rota, storage); `null` se não for um. */
export function parseMode(value: unknown): TestMode | null {
  return typeof value === "string" && (MODES as readonly string[]).includes(value) ? (value as TestMode) : null;
}

export function cellCount(bank: readonly Question[], category: QuestionCategory, difficulty: Difficulty): number {
  return bank.filter((q) => q.category === category && q.difficulty === difficulty).length;
}

/** Uma célula em que o banco tem menos itens do que o blueprint pede. */
export interface CellShortfall {
  category: QuestionCategory;
  difficulty: Difficulty;
  wanted: number;
  available: number;
}

/** Células que a seleção precisa completar com outras dificuldades da mesma categoria. */
export function cellShortfalls(blueprint: Blueprint, bank: readonly Question[]): CellShortfall[] {
  const shortfalls: CellShortfall[] = [];
  for (const category of CATEGORIES) {
    for (const difficulty of DIFFICULTIES) {
      const wanted = blueprint[category][difficulty];
      const available = cellCount(bank, category, difficulty);
      if (available < wanted) shortfalls.push({ category, difficulty, wanted, available });
    }
  }
  return shortfalls;
}

/** Se o banco comporta o modo: `FORMS_REQUIRED` formas completas em toda célula. */
export function isModeAvailable(mode: TestMode, bank: readonly Question[]): boolean {
  const forms = FORMS_REQUIRED[mode];
  if (forms === 0) return true;
  const blueprint = BLUEPRINTS[mode];
  return CATEGORIES.every((category) =>
    DIFFICULTIES.every((difficulty) => cellCount(bank, category, difficulty) >= forms * blueprint[category][difficulty])
  );
}
