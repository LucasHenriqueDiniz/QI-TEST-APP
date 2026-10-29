import type { Answer, CategoryScore, IndexDomain, IndexScore, ItemUsage, ScoreBand, TestMode } from ".";

export const STORAGE_KEYS = {
  testProgress: "testProgress",
  testHistory: "testHistory",
  userData: "userData",
  hapticsEnabled: "hapticsEnabled",
  itemUsage: "itemUsage",
} as const;

export type StorageKeys = keyof typeof STORAGE_KEYS;

export interface HistoryItem {
  /** ISO 8601. */
  date: string;
  iqScore: number;
  percentile: number;
  correctAnswers: number;
  totalQuestions: number;
  categories: CategoryScore[];
  /**
   * Tempo respondendo, em segundos: soma do `timeSpent` de cada resposta, que
   * recomeça a cada questão e para enquanto o app está em segundo plano.
   * Ausente nos testes gravados antes de o campo existir.
   */
  durationSeconds?: number;
  /** Ausente nos testes anteriores aos modos (o teste único de 30 questões). */
  mode?: TestMode;
  /** Faixa provável do QI. Ausente nos testes pontuados pela fórmula antiga. */
  band?: ScoreBand;
  /** Índices Verbal e Raciocínio; só gravados quando o domínio teve ≥ 30 itens. */
  indices?: Partial<Record<IndexDomain, IndexScore>>;
  /** Tarefa de velocidade opcional (Normal e Detalhado); fora do QI. */
  speed?: SpeedResult;
}

/** Bloco de 90 s de "Iguais ou diferentes?". */
export interface SpeedResult {
  correct: number;
  wrong: number;
  /** Acertos menos erros, nunca abaixo de zero. */
  score: number;
  /** Duração do bloco, em segundos. */
  seconds: number;
}

export interface UserData {
  name?: string;
  /** Guardado como string por vir de um seletor; converta com `Number()`. */
  age?: string;
}

export interface TestProgress {
  currentIndex: number;
  savedAnswers: Answer[];
  /** Ids das questões sorteadas, para retomar exatamente o mesmo teste. */
  questionIds: string[];
  /**
   * Modo da rodada. Ausente num progresso anterior aos modos, que não é
   * retomado: o blueprint que o gerou não existe mais.
   */
  mode?: TestMode;
  /**
   * Ordem de exibição das alternativas de cada questão, alinhada a
   * `questionIds`, para a retomada mostrar as mesmas posições. Ausente num
   * progresso anterior ao embaralhamento.
   */
  optionOrders?: number[][];
}

export interface StorageData {
  testProgress: TestProgress;
  testHistory: HistoryItem[];
  userData: UserData;
  /** Preferência "Vibração"; lida e gravada por `utils/haptics.ts`. */
  hapticsEnabled: boolean;
  /** Recência de uso de cada questão, para a seleção evitar repetir itens entre rodadas. */
  itemUsage: ItemUsage;
}
