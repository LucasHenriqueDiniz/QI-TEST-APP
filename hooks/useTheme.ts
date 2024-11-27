import { useColorScheme } from "react-native";

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    colors: {
      text: isDark ? "#FFFFFF" : "#000000",
      background: isDark ? "#000000" : "#FFFFFF",
      inputBackground: isDark ? "#1C1C1E" : "#FFFFFF",
      border: isDark ? "#333333" : "#DDDDDD",
      placeholderText: isDark ? "#666666" : "#999999",
      // ... outras cores necessárias
    },
  };
}
