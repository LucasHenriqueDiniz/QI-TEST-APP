import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import mobileAds, { AdsConsent, AdsConsentPrivacyOptionsRequirementStatus, MaxAdContentRating } from "react-native-google-mobile-ads";

interface AdsContextValue {
  /** O SDK terminou de inicializar e pode servir anúncios. */
  ready: boolean;
  /** O usuário está numa região que exige consentimento e pode revogá-lo. */
  canShowPrivacyOptions: boolean;
  /** Reabre o formulário de consentimento (link "Opções de privacidade"). */
  showPrivacyOptions: () => Promise<void>;
}

const AdsContext = createContext<AdsContextValue>({
  ready: false,
  canShowPrivacyOptions: false,
  showPrivacyOptions: async () => {},
});

/**
 * Inicializa o Google Mobile Ads depois de resolver o consentimento (UMP).
 *
 * A ordem importa: o SDK precisa ser inicializado *após* `gatherConsent`, senão
 * a primeira requisição sai sem a base legal correta no EEE e no Reino Unido.
 */
export function AdsProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [canShowPrivacyOptions, setCanShowPrivacyOptions] = useState(false);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        // Mostra o formulário do UMP se a região exigir; resolve na hora nas
        // demais. Nunca deve derrubar o app — daí o try/catch amplo.
        const info = await AdsConsent.gatherConsent();
        if (!active) return;
        setCanShowPrivacyOptions(info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED);
      } catch (error) {
        console.error("Error gathering ads consent:", error);
      }

      try {
        await mobileAds().setRequestConfiguration({
          // O app é classificado como Livre; conteúdo adulto quebraria isso.
          maxAdContentRating: MaxAdContentRating.G,
          tagForChildDirectedTreatment: false,
          tagForUnderAgeOfConsent: false,
        });
        await mobileAds().initialize();
        if (active) setReady(true);
      } catch (error) {
        console.error("Error initializing ads:", error);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const showPrivacyOptions = useCallback(async () => {
    try {
      await AdsConsent.showPrivacyOptionsForm();
    } catch (error) {
      console.error("Error showing privacy options:", error);
    }
  }, []);

  return <AdsContext.Provider value={{ ready, canShowPrivacyOptions, showPrivacyOptions }}>{children}</AdsContext.Provider>;
}

export function useAds() {
  return useContext(AdsContext);
}
