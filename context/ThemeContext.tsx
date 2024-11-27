import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { Theme, ThemeColors } from "@/types";

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme || "light");

  const colors = {
    light: {
      primary: "#007AFF",
      background: "#FFFFFF",
      card: "#F2F2F7",
      text: "#000000",
      border: "#C6C6C8",
      notification: "#FF3B30",
    },
    dark: {
      primary: "#0A84FF",
      background: "#000000",
      card: "#1C1C1E",
      text: "#FFFFFF",
      border: "#38383A",
      notification: "#FF453A",
    },
  };

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    setTheme(systemColorScheme || "light");
  }, [systemColorScheme]);

  return <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
