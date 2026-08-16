import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

/**
 * Ad unit IDs do AdMob.
 *
 * Enquanto as variáveis de ambiente não estiverem preenchidas, tudo usa os IDs
 * de teste oficiais do Google. Isso é proposital: servir anúncio real num build
 * de desenvolvimento é violação dos termos do AdMob e é o caminho mais rápido
 * para ter a conta suspensa por tráfego inválido.
 *
 * Para ligar os IDs reais, crie `.env.local` (ignorado pelo git) com:
 *
 *   EXPO_PUBLIC_ADMOB_BANNER_ANDROID=ca-app-pub-XXXX/YYYY
 *   EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID=ca-app-pub-XXXX/YYYY
 *
 * O App ID (formato `ca-app-pub-XXXX~YYYY`, com til) é outra coisa e vai no
 * app.json, não aqui.
 */

/** Em desenvolvimento nunca servimos anúncio real, mesmo com os IDs definidos. */
function resolve(real: string | undefined, test: string): string {
  if (__DEV__) return test;
  return real && real.startsWith("ca-app-pub-") ? real : test;
}

export const AD_UNITS = {
  banner: resolve(
    Platform.select({
      android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID,
      ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS,
    }),
    TestIds.BANNER
  ),
  interstitial: resolve(
    Platform.select({
      android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID,
      ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS,
    }),
    TestIds.INTERSTITIAL
  ),
} as const;

/** Intervalo mínimo entre dois intersticiais, em ms. */
export const INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000;

/**
 * Nº de testes concluídos antes do primeiro intersticial aparecer.
 *
 * A primeira sessão define se a pessoa fica ou desinstala, e taxa de
 * desinstalação pesa no ranqueamento da Play Store. O primeiro teste é sagrado.
 */
export const INTERSTITIAL_AFTER_TESTS = 1;
