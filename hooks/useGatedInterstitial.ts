import { useCallback, useEffect } from "react";
import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";
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

/**
 * Um anúncio só, no módulo: o teste começa a carregar e a tela de conclusão
 * (`/finishing`) mostra. Com um anúncio por tela, como era com
 * `useInterstitialAd`, o de `/finishing` só começaria a carregar ali e
 * raramente estaria pronto nos ~2 s que a tela dura.
 */
let ad: InterstitialAd | null = null;
let loaded = false;
let loading = false;
/** A navegação represada enquanto o anúncio está na tela. */
let pendingAction: (() => void) | null = null;

function release() {
  const action = pendingAction;
  pendingAction = null;
  action?.();
}

function instance(): InterstitialAd {
  if (ad) return ad;
  ad = InterstitialAd.createForAdRequest(AD_UNITS.interstitial);
  ad.addAdEventListener(AdEventType.LOADED, () => {
    loaded = true;
    loading = false;
  });
  // Se o anúncio falhar depois de já termos prometido mostrá-lo, libera o
  // fluxo em vez de deixar o usuário travado numa tela sem resposta.
  ad.addAdEventListener(AdEventType.ERROR, () => {
    loaded = false;
    loading = false;
    release();
  });
  ad.addAdEventListener(AdEventType.CLOSED, () => {
    loaded = false;
    release();
    // Pré-carrega o próximo para a exibição seguinte não ter espera.
    load();
  });
  return ad;
}

function load() {
  if (loaded || loading) return;
  loading = true;
  instance().load();
}

interface Options {
  /** Quantos testes o usuário já concluiu. */
  completedTests: number;
}

/**
 * Intersticial com trava de frequência.
 *
 * Carrega assim que os anúncios estão liberados e devolve `willShow()`, se
 * `run` mostraria o anúncio agora, e `run(action)`: mostra o anúncio e executa
 * `action` ao fechar, ou executa `action` na hora se o anúncio não estiver
 * liberado. A ação **nunca** é perdida — se o anúncio falhar, o usuário segue
 * o fluxo normalmente.
 */
export function useGatedInterstitial({ completedTests }: Options) {
  const { ready } = useAds();

  useEffect(() => {
    if (ready) load();
  }, [ready]);

  const willShow = useCallback(() => {
    const withinCooldown = Date.now() - lastShownAt < INTERSTITIAL_COOLDOWN_MS;
    const tooEarly = completedTests < INTERSTITIAL_AFTER_TESTS;
    return ready && loaded && !withinCooldown && !tooEarly;
  }, [completedTests, ready]);

  const run = useCallback(
    (action: () => void) => {
      if (!willShow()) {
        action();
        return;
      }

      lastShownAt = Date.now();
      pendingAction = action;
      instance()
        .show()
        .catch(() => release());
    },
    [willShow]
  );

  return { run, willShow };
}
