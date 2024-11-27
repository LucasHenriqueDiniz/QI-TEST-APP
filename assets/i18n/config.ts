import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { pt } from "./translations/pt";
import { en } from "./translations/en";

const resources = {
  en,
  pt,
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: Localization.locale.split("-")[0],
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem("user-language", language);
    await i18next.changeLanguage(language);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

export default i18next;
