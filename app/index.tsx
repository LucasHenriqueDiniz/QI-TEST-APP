import AsyncStorage from "@react-native-async-storage/async-storage";
import { AboutModal } from "components/AboutModal";
import { ThemedText } from "components/ThemedText";
import { ThemedView } from "components/ThemedView";
import { Button } from "components/ui/Button";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, StyleSheet, View } from "react-native";
import { WelcomeModal } from "components/WelcomeModal";
import { RateUsModal } from "components/RateUsModal";

export default function Home() {
  const { t } = useTranslation();
  const [hasProgress, setHasProgress] = useState<boolean>(false);
  const [isAboutVisible, setIsAboutVisible] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    checkProgress();
    checkFirstVisit();
    checkRateUs();
  }, []);

  const checkProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem("testProgress");
      setHasProgress(!!progress);
    } catch (error) {
      console.error("Error checking progress:", error);
    }
  };

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem("hasVisited");
      if (!hasVisited) {
        setShowWelcome(true);
        await AsyncStorage.setItem("hasVisited", "true");
      }
    } catch (error) {
      console.error("Error checking first visit:", error);
    }
  };

  const checkRateUs = async () => {
    try {
      const hasRated = await AsyncStorage.getItem("hasRated");
      if (hasRated) {
        setHasRated(true);
        return;
      }

      const lastRatePrompt = await AsyncStorage.getItem("lastRatePrompt");
      const now = Date.now();

      if (!lastRatePrompt || now - Number(lastRatePrompt) > 24 * 60 * 60 * 1000) {
        setShowRateUs(true);
        await AsyncStorage.setItem("lastRatePrompt", now.toString());
      }
    } catch (error) {
      console.error("Error checking rate us:", error);
    }
  };

  const handleStart = async () => {
    if (hasProgress) {
      Alert.alert(t("home.continueTest.title"), t("home.continueTest.message"), [
        {
          text: t("home.continueTest.continue"),
          onPress: () => router.replace("/(test)"),
        },
        {
          text: t("home.continueTest.restart"),
          onPress: async () => {
            await AsyncStorage.removeItem("testProgress");
            router.push("/(test)");
          },
          style: "destructive",
        },
        {
          text: t("common.cancel"),
          style: "cancel",
        },
      ]);
    } else {
      router.push("/(test)");
    }
  };

  const handleRate = async () => {
    setHasRated(true);
    setShowRateUs(false);
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 122, 255, 0.1)", "rgba(0, 122, 255, 0)"]}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText
            type="title"
            style={styles.title}
          >
            {t("home.title")}
          </ThemedText>
          <ThemedText style={styles.subtitle}>{t("home.subtitle")}</ThemedText>
        </View>

        <Image
          source={require("@/assets/images/ico.webp")}
          style={styles.illustration}
          resizeMode="contain"
        />

        <View style={styles.buttonContainer}>
          <Button
            title={hasProgress ? t("home.continueTest.button") : t("home.startTest")}
            onPress={handleStart}
            size="large"
            style={styles.mainButton}
          />
          <Button
            title={t("home.about.title")}
            onPress={() => setIsAboutVisible(true)}
            variant="outline"
            size="large"
          />
        </View>
      </View>

      <WelcomeModal
        visible={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

      {!hasRated && (
        <RateUsModal
          visible={showRateUs}
          onClose={() => setShowRateUs(false)}
          onRate={handleRate}
        />
      )}

      <AboutModal
        visible={isAboutVisible}
        onClose={() => setIsAboutVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    fontSize: 18,
    lineHeight: 24,
    maxWidth: "80%",
  },
  illustration: {
    width: "100%",
    height: 150,
    marginVertical: 32,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  mainButton: {
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
