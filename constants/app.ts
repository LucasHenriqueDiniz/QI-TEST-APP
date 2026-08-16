/** Identidade do app usada em links externos e textos. */

export const PACKAGE_NAME = "com.lhdiniz.testeqi";

/** Abre direto na ficha da Play Store (ou no navegador, se a loja não estiver instalada). */
export const STORE_URL = `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`;

/**
 * Política de privacidade — obrigatória na ficha da Play Store e linkada
 * dentro do app, na folha "Sobre o teste".
 *
 * A página pronta está em `store/privacy-page/index.html`. Ajuste este valor se
 * publicar em outro endereço; o link precisa continuar vivo enquanto o app
 * estiver na loja (link quebrado é violação de política).
 */
export const PRIVACY_POLICY_URL = "https://lucashdo.com/teste-de-qi/privacy";

export const SUPPORT_EMAIL = "lucas.diniz.hdo@gmail.com";
