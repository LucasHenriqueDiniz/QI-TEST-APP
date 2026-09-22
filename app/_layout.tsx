import "@/config/i18n";

import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Manrope_600SemiBold, Manrope_700Bold, useFonts } from "@expo-google-fonts/manrope";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AdsProvider } from "@/context/AdsContext";
import { ThemeProvider, useAppTheme } from "@/context/ThemeContext";

function RootNavigator() {
  const { t } = useTranslation();
  const { colors, mode, typography, fonts } = useAppTheme();

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { ...typography.subheading, fontFamily: fonts.heading, color: colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="test"
          options={{ title: t("test.title") }}
        />
        <Stack.Screen
          name="results"
          options={{
            title: t("results.title"),
            // Impede voltar para o teste já finalizado.
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="history"
          options={{ title: t("history.title") }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: t("settings.title") }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  // Não bloqueamos a renderização esperando a fonte: a splash já cobre a
  // abertura, e travar aqui atrasaria a primeira tela em rede ruim. Enquanto
  // não carrega, o texto sai na fonte do sistema e troca sem piscar.
  useFonts({ Manrope_700Bold, Manrope_600SemiBold, Inter_400Regular });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AdsProvider>
            <RootNavigator />
          </AdsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
