import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { useStorage } from "@/hooks/useStorage";
import { Ionicons } from "@expo/vector-icons";
import { UserPurchases } from "@/types/storage";
import { LinearGradient } from "expo-linear-gradient";

export default function Store() {
  const { t } = useTranslation();
  const storage = useStorage();
  const [purchases, setPurchases] = useState<UserPurchases>({
    availableTests: 0,
    unlimitedTests: false,
    hideAds: false,
  });

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    const data = await storage.getItem("userPurchases");
    if (data) {
      setPurchases(data);
    }
  };

  const handlePurchase = async (type: "unlimited" | "tests" | "hideAds", amount?: number) => {
    // Aqui você implementaria a lógica real de compra
    // Por enquanto, vamos apenas simular
    try {
      const newPurchases = { ...purchases };

      switch (type) {
        case "unlimited":
          newPurchases.unlimitedTests = true;
          break;
        case "tests":
          newPurchases.availableTests += amount || 0;
          break;
        case "hideAds":
          newPurchases.hideAds = true;
          break;
      }

      await storage.setItem("userPurchases", newPurchases);
      setPurchases(newPurchases);
      Alert.alert(t("store.purchaseSuccess"));
    } catch (error) {
      console.error("Error processing purchase:", error);
      Alert.alert(t("store.purchaseError"));
    }
  };

  const handleWatchAd = async () => {
    // Aqui você implementaria a lógica real de exibição do ad
    // Por enquanto, vamos apenas simular
    try {
      const lastWatch = purchases.lastAdWatchDate ? new Date(purchases.lastAdWatchDate) : null;
      const now = new Date();

      if (lastWatch && now.getTime() - lastWatch.getTime() < 24 * 60 * 60 * 1000) {
        Alert.alert(t("store.adWatchLimit"));
        return;
      }

      const newPurchases = {
        ...purchases,
        availableTests: purchases.availableTests + 1,
        lastAdWatchDate: now.toISOString(),
      };

      await storage.setItem("userPurchases", newPurchases);
      setPurchases(newPurchases);
      Alert.alert(t("store.testEarned"));
    } catch (error) {
      console.error("Error processing ad watch:", error);
      Alert.alert(t("store.error"));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["rgba(0, 122, 255, 0.12)", "rgba(255, 255, 255, 0)", "rgba(0, 122, 255, 0.06)"]}
        style={styles.gradient}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.statsCard}>
        <Card style={styles.card}>
          <ThemedText type="subtitle">{t("store.availableTests")}</ThemedText>
          <View style={styles.statsRow}>
            <Ionicons
              name="infinite"
              size={24}
              color={purchases.unlimitedTests ? "#007AFF" : "#666"}
            />
            <ThemedText style={styles.statsText}>{purchases.unlimitedTests ? t("store.unlimited") : purchases.availableTests}</ThemedText>
          </View>
        </Card>
      </View>

      <Card style={styles.section}>
        <ThemedText type="subtitle">{t("store.unlimitedTests")}</ThemedText>
        <ThemedText style={styles.description}>{t("store.unlimitedDescription")}</ThemedText>
        <Button
          title={t("store.buyUnlimited", { price: "$4.99" })}
          onPress={() => handlePurchase("unlimited")}
          disabled={purchases.unlimitedTests}
        />
      </Card>

      <Card style={styles.section}>
        <ThemedText type="subtitle">{t("store.buyTests")}</ThemedText>
        <View style={styles.buttonGroup}>
          <Button
            title={t("store.buyTestsPack", { amount: 5, price: "$0.99" })}
            onPress={() => handlePurchase("tests", 5)}
            style={styles.packButton}
          />
          <Button
            title={t("store.buyTestsPack", { amount: 10, price: "$1.99" })}
            onPress={() => handlePurchase("tests", 10)}
            style={styles.packButton}
          />
        </View>
      </Card>

      <Card style={styles.section}>
        <ThemedText type="subtitle">{t("store.watchAd")}</ThemedText>
        <ThemedText style={styles.description}>{t("store.watchAdDescription")}</ThemedText>
        <Button
          title={t("store.watchAdButton")}
          onPress={handleWatchAd}
          variant="outline"
        />
      </Card>

      <Card style={styles.section}>
        <ThemedText type="subtitle">{t("store.removeAds")}</ThemedText>
        <ThemedText style={styles.description}>{t("store.removeAdsDescription")}</ThemedText>
        <Button
          title={t("store.buyRemoveAds", { price: "$2.99" })}
          onPress={() => handlePurchase("hideAds")}
          disabled={purchases.hideAds}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    marginBottom: 20,
  },
  card: {
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  statsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  section: {
    marginBottom: 20,
    padding: 20,
  },
  description: {
    marginVertical: 10,
    color: "#666",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  packButton: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 500,
  },
});
