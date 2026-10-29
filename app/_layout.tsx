import "@/config/i18n";

import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold, useFonts } from "@expo-google-fonts/manrope";
import { NavigationBar } from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AdsProvider } from "@/context/AdsContext";
import { ThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { loadHapticsPreference } from "@/utils/haptics";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { t } = useTranslation();
  const { colors, mode, typography, fonts } = useAppTheme();

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      {/* Com o véu de contraste desligado (plugin no app.json), a cor dos
          botões do Android é nossa: segue o tema do app, não o do sistema. */}
      <NavigationBar style={mode === "dark" ? "light" : "dark"} />
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
          // A tela traz a própria barra (X, progresso em blocos, contador); o
          // cabeçalho da pilha só repetiria o nome do app em cima dela.
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="speed"
          // Tarefa com tempo: sem cabeçalho, e voltar equivale a pular.
          options={{ headerShown: false, gestureEnabled: false, animation: "fade" }}
        />
        <Stack.Screen
          name="finishing"
          // Sem cabeçalho e sem voltar: o teste acabou e o resultado vem já.
          options={{ headerShown: false, gestureEnabled: false, animation: "fade" }}
        />
        <Stack.Screen
          name="results"
          options={{
            title: t("results.title"),
            // O herói ocupa o topo inteiro e traz o próprio X; o cabeçalho
            // da pilha sairia por cima do gradiente.
            headerShown: false,
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
  // A primeira tela só sai com as fontes registradas. No Android o texto é
  // medido uma vez: medido na fonte do sistema e pintado em Manrope, que é mais
  // larga, ele sai cortado ("Começar te…"). As fontes vêm do próprio APK, não
  // da rede, então a espera é de milissegundos — e a splash cobre.
  const [fontsLoaded, fontError] = useFonts({
    Manrope_800ExtraBold,
    Manrope_700Bold,
    Manrope_600SemiBold,
    Inter_400Regular,
  });
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // A preferência de vibração vai para uma flag de módulo; ler aqui, uma vez,
  // evita que cada toque consulte o storage.
  useEffect(() => {
    loadHapticsPreference();
  }, []);

  // Se a fonte falhar, segue com a do sistema: texto medido e pintado na mesma
  // fonte não corta.
  if (!ready) return null;

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
