/**
 * Cronômetro de tempo ativo: para quando o app vai para segundo plano e
 * volta a contar quando retorna. Puro — recebe o relógio — para o tempo de
 * cada resposta significar tempo respondendo, não tempo com o app aberto.
 */
export interface ActiveTimer {
  /** O app voltou ao primeiro plano. */
  foreground(): void;
  /** O app saiu do primeiro plano. */
  background(): void;
  /** Segundos ativos desde o último `take`/`reset`; recomeça a contagem. */
  take(): number;
  /** Descarta o acumulado e recomeça. */
  reset(): void;
}

export function createActiveTimer(now: () => number = Date.now, inForeground = true): ActiveTimer {
  let accumulated = 0;
  let since: number | null = inForeground ? now() : null;

  return {
    foreground() {
      if (since === null) since = now();
    },
    background() {
      if (since !== null) {
        accumulated += now() - since;
        since = null;
      }
    },
    take() {
      const at = now();
      const total = accumulated + (since === null ? 0 : at - since);
      accumulated = 0;
      if (since !== null) since = at;
      return total / 1000;
    },
    reset() {
      accumulated = 0;
      if (since !== null) since = now();
    },
  };
}
