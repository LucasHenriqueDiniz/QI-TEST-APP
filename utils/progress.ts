/**
 * Progresso de uma rodada: os blocos da barra segmentada, os marcos de
 * incentivo e a contagem regressiva do contador. Puro, sem React nem i18n —
 * a tela só traduz o que sai daqui.
 *
 * A pesquisa (P2) manda mostrar a estrutura e encorajar nas trocas de bloco:
 * Rápido 2 × 10, Normal 4 × 10, Detalhado 3 × 30. A regra é derivada do
 * comprimento, não do modo, para qualquer rodada (a de conferência dos
 * padrões tem 30, uma questão isolada tem 1) ganhar blocos coerentes.
 */

/** Tamanho do bloco até esta quantidade de questões. */
const SHORT_BLOCK = 10;
/** Tamanho do bloco acima de `SHORT_ROUND_MAX` questões. */
const LONG_BLOCK = 30;
/** Maior rodada que ainda usa blocos de `SHORT_BLOCK`. */
const SHORT_ROUND_MAX = 40;

/** Nas últimas tantas questões o contador passa a ler "faltam N". */
export const COUNTDOWN_LAST = 5;

/** Depois desta resposta aparece o "Bom começo!". */
export const FIRST_MILESTONE = 3;

/** Comprimento de cada bloco de uma rodada de `total` questões. */
export function segmentsFor(total: number): number[] {
  if (!Number.isFinite(total) || total <= 0) return [];
  const block = total > SHORT_ROUND_MAX ? LONG_BLOCK : SHORT_BLOCK;
  const segments: number[] = [];
  for (let start = 0; start < total; start += block) {
    segments.push(Math.min(block, total - start));
  }
  return segments;
}

/** Preenchimento (0–1) de cada bloco quando `answered` questões já foram respondidas. */
export function segmentFills(total: number, answered: number): number[] {
  let start = 0;
  return segmentsFor(total).map((length) => {
    const fill = Math.min(Math.max((answered - start) / length, 0), 1);
    start += length;
    return fill;
  });
}

export type Milestone = { kind: "start" } | { kind: "block"; done: number; of: number; last: boolean };

/**
 * Marco a mostrar ao entrar na questão seguinte a `answered` respostas, ou
 * `null`. Ao fechar cada bloco menos o último, o bloco concluído (o penúltimo
 * avisa que falta pouco); depois da terceira resposta, o incentivo inicial.
 * Nada antes da primeira resposta nem depois da última.
 */
export function milestoneAt(answered: number, total: number): Milestone | null {
  if (answered <= 0 || answered >= total) return null;

  const segments = segmentsFor(total);
  let end = 0;
  for (let i = 0; i < segments.length - 1; i++) {
    end += segments[i];
    if (answered === end) {
      return { kind: "block", done: i + 1, of: segments.length, last: i === segments.length - 2 };
    }
  }

  return answered === FIRST_MILESTONE ? { kind: "start" } : null;
}

/** Questões depois da atual; `index` é a posição (base 0) da questão na tela. */
export function remainingAfter(index: number, total: number): number {
  return Math.max(0, total - index - 1);
}

/**
 * Se o contador desta questão lê "faltam N" em vez de "N/total": só nas
 * últimas `COUNTDOWN_LAST`, e só em rodadas maiores que isso — numa rodada
 * de uma questão não há o que contar.
 */
export function inCountdown(index: number, total: number): boolean {
  return total > COUNTDOWN_LAST && total - index <= COUNTDOWN_LAST;
}
