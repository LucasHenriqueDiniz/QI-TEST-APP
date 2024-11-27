import { Modal, StyleSheet, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutModal({ visible, onClose }: AboutModalProps) {
  const { t } = useTranslation();

  const benefitItems = t("home.about.benefits.items", { returnObjects: true }) as string[];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        <ScrollView style={styles.content}>
          <ThemedText type="title">{t("home.about.title")}</ThemedText>
          <ThemedText style={styles.description}>{t("home.about.description")}</ThemedText>

          <ThemedText type="subtitle">{t("home.about.benefits.title")}</ThemedText>
          {Array.isArray(benefitItems) &&
            benefitItems.map((item: string, index: number) => (
              <ThemedText
                key={index}
                style={styles.bulletPoint}
              >
                • {item}
              </ThemedText>
            ))}

          <ThemedText type="subtitle">{t("home.about.disclaimer.title")}</ThemedText>
          <ThemedText style={styles.description}>{t("home.about.disclaimer.text")}</ThemedText>
        </ScrollView>

        <Button
          title={t("common.close")}
          onPress={onClose}
          variant="primary"
        />
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  description: {
    marginVertical: 10,
  },
  bulletPoint: {
    marginLeft: 10,
    marginVertical: 5,
  },
});
