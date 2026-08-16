import { useCallback, useEffect, useRef } from "react";
import { useInterstitialAd } from "react-native-google-mobile-ads";
import { AD_UNITS, INTERSTITIAL_AFTER_TESTS, INTERSTITIAL_COOLDOWN_MS } from "@/constants/ads";
import { useAds } from "@/context/AdsContext";

/**
 * Último intersticial exibido, em ms desde a época.
 *
 * Vive no módulo, e não em state, para que o limite valha entre telas e
 * remontagens — mas não entre execuções do app, o que é intencional: reiniciar
 * o app é uma sessão nova.
 */
let lastShownAt = 0;

interface Options {
  /** Quantos testes o usuário já concluiu. */
  completedTests: number;
}

/**
 * Intersticial com trava de frequência.
 *
 * Devolve `run(action)`: mostra o anúncio e executa `action` ao fechar, ou
 * executa `action` na hora se o anúncio não estiver liberado. A ação **nunca**
 * é perdida — se o anúncio falhar, o usuário segue o fluxo normalmente.
 */
export function useGatedInterstitial({ completedTests }: Options) {
  const { ready } = useAds();
  const { isLoaded, isClosed, load, show, error } = useInterstitialAd(AD_UNITS.interstitial);

  const pendingAction = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  // Executa a ação represada quando o usuário fecha o anúncio.
  useEffect(() => {
    if (!isClosed) return;

    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();

    // Pré-carrega o próximo para a exibição seguinte não ter espera.
    load();
  }, [isClosed, load]);

  // Se o anúncio falhar depois de já termos prometido mostrá-lo, libera o
  // fluxo em vez de deixar o usuário travado numa tela sem resposta.
  useEffect(() => {
    if (!error) return;

    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }, [error]);

  const run = useCallback(
    (action: () => void) => {
      const withinCooldown = Date.now() - lastShownAt < INTERSTITIAL_COOLDOWN_MS;
      const tooEarly = completedTests < INTERSTITIAL_AFTER_TESTS;

      if (!isLoaded || withinCooldown || tooEarly) {
        action();
        return;
      }

      lastShownAt = Date.now();
      pendingAction.current = action;
      show();
    },
    [completedTests, isLoaded, show]
  );

  return { run };
}
