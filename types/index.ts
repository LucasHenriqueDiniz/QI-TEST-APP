export type QuestionCategory = "similarities" | "vocabulary" | "matrix" | "comprehension" | "patterns";

export type Difficulty = "easy" | "medium" | "hard";

/** Modos de teste: 20, 40 e 90 questões (decisão D8). */
export type TestMode = "rapido" | "normal" | "detalhado";

export interface Question {
  id: string;
  category: QuestionCategory;
  questionKey: string;
  difficulty: Difficulty;
  correctAnswer: number;
  weight: number;
  type?: "text" | "image";
}

export interface Answer {
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

/** Desempenho agregado em uma categoria de questões. */
export interface CategoryScore {
  category: QuestionCategory;
  correct: number;
  total: number;
  weightEarned: number;
  weightTotal: number;
}

/** Faixa provável do QI (90%, alargada ×1,25), com as bordas já limitadas a 55–145. */
export interface ScoreBand {
  lower: number;
  upper: number;
}

/** Domínios dos índices: Raciocínio (patterns + matrix) e Verbal (as outras três). */
export type IndexDomain = "reasoning" | "verbal";

/** Índice de um domínio na escala do QI. Só existe com ≥ 30 itens respondidos no domínio. */
export interface IndexScore {
  score: number;
  band: ScoreBand;
  /** Itens respondidos no domínio. */
  items: number;
}

/** Resultado consolidado de um teste. */
export interface TestOutcome {
  iq: number;
  band: ScoreBand;
  /** Posição estimada na população, de 1 a 99. */
  percentile: number;
  /** Chave de tradução, ex.: `classifications.average`. */
  classification: string;
  correct: number;
  total: number;
  categories: CategoryScore[];
  /** Presente só quando algum domínio alcançou o mínimo de itens (Detalhado). */
  indices?: Partial<Record<IndexDomain, IndexScore>>;
}

/** Última rodada em que cada questão apareceu; é o que a seleção LRU consulta. */
export interface ItemUsage {
  /** Rodadas já sorteadas; a próxima recebe este número. */
  round: number;
  /** Id da questão → número da última rodada em que saiu. */
  lastUsed: Record<string, number>;
}
