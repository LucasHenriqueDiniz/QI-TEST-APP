import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "components/ThemedText";
import { Button } from "components/ui/Button";
import { Card } from "components/ui/Card";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, ScrollView, StyleSheet, View, Pressable, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const languages = [
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
    { code: "es", name: "Español" },
  ];

  const changeLanguage = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      setCurrentLanguage(langCode);
      await AsyncStorage.setItem("userLanguage", langCode);
    } catch (error) {
      console.error("Error changing language:", error);
      Alert.alert(t("common.error"));
    }
  };

  const clearHistory = async () => {
    Alert.alert(t("profile.settings.clearHistory.title"), t("profile.settings.clearHistory.message"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("profile.settings.clearHistory.confirm"),
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("testHistory");
            Alert.alert(t("profile.settings.clearHistory.success"));
          } catch (error) {
            console.error("Error clearing history:", error);
            Alert.alert(t("common.error"));
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 122, 255, 0.08)", "rgba(255, 255, 255, 0)", "rgba(0, 122, 255, 0.03)"]}
        style={styles.gradient}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <Card style={styles.section}>
        <ThemedText type="subtitle">{t("profile.settings.language")}</ThemedText>
        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              style={[styles.languageButton, currentLanguage === lang.code && styles.languageButtonActive]}
              onPress={() => changeLanguage(lang.code)}
            >
              <ThemedText style={[styles.languageText, currentLanguage === lang.code && styles.languageTextActive]}>{lang.name}</ThemedText>
              {currentLanguage === lang.code && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color="#fff"
                />
              )}
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText type="subtitle">{t("profile.settings.data")}</ThemedText>
        <View style={styles.buttonContainer}>
          <Button
            title={t("profile.settings.clearHistory.button")}
            onPress={clearHistory}
            variant="outline"
            size="medium"
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText type="subtitle">{t("profile.settings.about")}</ThemedText>
        <ThemedText style={styles.version}>{t("profile.settings.version", { version: "1.0.0" })}</ThemedText>
        <Pressable onPress={() => Linking.openURL("https://github.com/LucasHenriqueDiniz")}>
          <ThemedText style={styles.version}>{t("profile.settings.author", { author: "Sora Project" })}</ThemedText>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
    padding: 15,
  },
  buttonContainer: {
    marginTop: 15,
  },
  version: {
    marginTop: 10,
    opacity: 0.7,
  },
  languageContainer: {
    flexDirection: "column",
    gap: 10,
    marginTop: 15,
  },
  languageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    gap: 8,
  },
  languageButtonActive: {
    backgroundColor: "#007AFF",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
  languageTextActive: {
    color: "#fff",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 400,
  },
});
