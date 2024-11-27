import React from "react";
import { View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";

export default function PurchaseOptions() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();

  const handleUnlockWithAd = () => {
    router.push({
      pathname: "/(test)/results",
      params: params,
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{t("test.unlockResults")}</ThemedText>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>{t("test.unlimitedTests")}</ThemedText>
          <ThemedText style={styles.price}>$4.99</ThemedText>
          <Button
            title={t("test.buyNow")}
            onPress={() => {}}
            style={styles.cardButton}
          />
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>{t("test.singleResult")}</ThemedText>
          <ThemedText style={styles.price}>$0.99</ThemedText>
          <Button
            title={t("test.buyNow")}
            onPress={() => {}}
            style={styles.cardButton}
          />
        </View>
      </View>

      <View style={styles.adCard}>
        <ThemedText style={styles.adCardTitle}>{t("test.watchAdUnlock")}</ThemedText>
        <Button
          title={t("test.watchAd")}
          onPress={handleUnlockWithAd}
          variant="outline"
          style={styles.adButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#495057",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007AFF",
  },
  cardButton: {
    width: "100%",
  },
  adCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginTop: 20,
  },
  adCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#495057",
  },
  adButton: {
    width: "80%",
  },
});
