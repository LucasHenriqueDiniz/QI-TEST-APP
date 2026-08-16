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

/**
 * Intervalo mínimo entre dois intersticiais, em ms.
 *
 * Rede de segurança: um teste leva bem mais que isso, então na prática nunca
 * dispara — só protege contra alguém atravessar o teste no chute.
 */
export const INTERSTITIAL_COOLDOWN_MS = 3 * 60 * 1000;

/**
 * Nº de testes concluídos antes do primeiro intersticial aparecer.
 *
 * Zero — o anúncio aparece já no primeiro teste.
 *
 * Teste de QI é app de sessão única: a maioria faz o teste uma vez e não
 * volta. Poupar o primeiro teste, como se faria num app de uso recorrente,
 * significaria não monetizar quase ninguém.
 *
 * O custo é real e vale monitorar: anúncio na primeira experiência aumenta a
 * chance de avaliação de 1 estrela, e nota média pesa no ranqueamento. Se as
 * avaliações começarem a reclamar de anúncio, subir para 1 reverte a decisão.
 */
export const INTERSTITIAL_AFTER_TESTS = 0;
