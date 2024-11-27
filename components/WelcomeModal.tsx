import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

export function WelcomeModal({ visible, onClose }: WelcomeModalProps) {
  const { t } = useTranslation();

  const handleGoToProfile = () => {
    onClose();
    router.push("/(profile)");
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
          <ThemedText
            type="title"
            style={styles.title}
          >
            {t("welcome.title")}
          </ThemedText>

          <ThemedText style={styles.message}>{t("welcome.message")}</ThemedText>

          <ThemedText style={styles.description}>{t("welcome.description")}</ThemedText>

          <View style={styles.buttonContainer}>
            <Button
              title={t("welcome.goToProfile")}
              onPress={handleGoToProfile}
              style={styles.button}
            />
            <Button
              title={t("welcome.understand")}
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
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 24,
    color: "#000",
  },
  message: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
  },
  description: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 20,
    color: "#000",
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    width: "100%",
  },
});
