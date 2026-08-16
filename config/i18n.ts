import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "@/assets/i18n/translations/en";
import { es } from "@/assets/i18n/translations/es";
import { pt } from "@/assets/i18n/translations/pt";

const STORAGE_KEY = "userLanguage";
const FALLBACK = "en";

const resources = {
  en: { translation: en.translation },
  pt: { translation: pt.translation },
  es: { translation: es.translation },
};

function deviceLanguage(): string {
  try {
    const code = Localization.getLocales()[0]?.languageCode;
    return code && code in resources ? code : FALLBACK;
  } catch (error) {
    console.error("Error reading device locale:", error);
    return FALLBACK;
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage(),
  fallbackLng: FALLBACK,
  interpolation: { escapeValue: false },
  // O React já protege contra XSS e nada aqui renderiza HTML.
  returnEmptyString: false,
});

// Aplica o idioma salvo assim que o AsyncStorage responder. A inicialização
// acima é síncrona de propósito: sem ela, a primeira tela renderizaria com as
// chaves cruas em vez do texto.
AsyncStorage.getItem(STORAGE_KEY)
  .then((stored) => {
    if (stored && stored in resources && stored !== i18n.language) {
      return i18n.changeLanguage(stored);
    }
  })
  .catch((error) => console.error("Error loading saved language:", error));

i18n.on("languageChanged", (language) => {
  AsyncStorage.setItem(STORAGE_KEY, language).catch((error) => console.error("Error saving language:", error));
});

export default i18n;
