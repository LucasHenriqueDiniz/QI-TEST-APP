import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import { en } from "assets/i18n/translations/en";
import { pt } from "assets/i18n/translations/pt";
import { es } from "assets/i18n/translations/es";

const resources = {
  en: { translation: en.translation },
  pt: { translation: pt.translation },
  es: { translation: es.translation },
};

let lng: string | undefined;

try {
  lng = Localization.getLocales()[0].languageCode ?? "en";
} catch (error) {
  console.error("Error getting locale:", error);
}

const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    resources,
    lng: lng ?? "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n().catch(console.error);

export default i18n;
