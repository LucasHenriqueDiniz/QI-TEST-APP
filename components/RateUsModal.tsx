import React from "react";
import { Modal, StyleSheet, View, Linking } from "react-native";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RateUsModalProps {
  visible: boolean;
  onClose: () => void;
  onRate: () => void;
}

export function RateUsModal({ visible, onClose, onRate }: RateUsModalProps) {
  const { t } = useTranslation();

  const handleRate = async () => {
    try {
      // Marca como avaliado antes de abrir o link
      await AsyncStorage.setItem("hasRated", "true");
      onRate();

      // Substitua esta URL pela URL real da sua app na Play Store/App Store
      const storeUrl = "https://play.google.com/store/apps/details?id=your.app.id";
      await Linking.openURL(storeUrl);
    } catch (error) {
      console.error("Error handling rate:", error);
      // Se houver erro ao abrir o link, remove a marcação de avaliado
      await AsyncStorage.removeItem("hasRated");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Ionicons
            name="star"
            size={48}
            color="#FFD700"
            style={styles.icon}
          />

          <ThemedText
            type="title"
            style={styles.title}
          >
            {t("rateUs.title")}
          </ThemedText>

          <ThemedText style={styles.message}>{t("rateUs.message")}</ThemedText>

          <View style={styles.buttonContainer}>
            <Button
              title={t("rateUs.rateNow")}
              onPress={handleRate}
              style={styles.button}
            />
            <Button
              title={t("rateUs.later")}
              onPress={onClose}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 24,
    color: "#000",
  },
  message: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
