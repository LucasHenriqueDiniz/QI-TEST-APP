import { FakeAd } from "@/components/FakeAd";
import { Ionicons } from "@expo/vector-icons";
import "config/i18n";
import { ThemeProvider } from "context/ThemeContext";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <View style={styles.container}>
          <View style={styles.content}>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerRight: () => (
                    <View style={styles.headerRight}>
                      <Pressable
                        onPress={() => router.push("/store")}
                        style={styles.headerButton}
                      >
                        <Ionicons
                          name="cart-outline"
                          size={24}
                          color="#007AFF"
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => router.push("/(profile)")}
                        style={styles.headerButton}
                      >
                        <Ionicons
                          name="person-outline"
                          size={24}
                          color="#007AFF"
                        />
                      </Pressable>
                    </View>
                  ),
                  headerStyle: {
                    backgroundColor: "transparent",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="(profile)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(test)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="store"
                options={{
                  headerTitle: t("store.title"),
                  headerLeft: () => (
                    <Pressable
                      onPress={() => router.back()}
                      style={styles.headerButton}
                    >
                      <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#007AFF"
                      />
                    </Pressable>
                  ),
                }}
              />
            </Stack>
          </View>
          <View style={styles.adContainer}>
            <FakeAd />
          </View>
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 60, // Espaço para o ad
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
    marginRight: 15,
  },
  headerButton: {
    padding: 5,
  },
  adContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
});
