import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import {
  ColorMode,
  Palette,
  elevation,
  fontByVariant,
  fonts,
  motion,
  palettes,
  radius,
  spacing,
  typography,
} from "@/constants/theme";

/** Preferência do usuário. `system` acompanha o aparelho. */
export type ThemePreference = ColorMode | "system";

const STORAGE_KEY = "themePreference";

interface ThemeContextValue {
  /** Modo efetivo, já resolvido a partir da preferência + sistema. */
  mode: ColorMode;
  preference: ThemePreference;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  fonts: typeof fonts;
  fontByVariant: typeof fontByVariant;
  motion: typeof motion;
  /** Sombra pronta para o modo atual. */
  shadow: (level: 0 | 1 | 2 | 3) => object;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemMode = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored === "light" || stored === "dark" || stored === "system") {
          setPreferenceState(stored);
        }
      })
      .catch((error) => console.error("Error loading theme preference:", error));
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) => console.error("Error saving theme preference:", error));
  }, []);

  const mode: ColorMode = preference === "system" ? (systemMode === "dark" ? "dark" : "light") : preference;

  const value = useMemo<ThemeContextValue>(() => {
    const colors = palettes[mode];
    return {
      mode,
      preference,
      colors,
      spacing,
      radius,
      typography,
      fonts,
      fontByVariant,
      motion,
      shadow: (level) => elevation(level, colors.shadow),
      setPreference,
    };
  }, [mode, preference, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme precisa estar dentro de <ThemeProvider>");
  }
  return context;
}
