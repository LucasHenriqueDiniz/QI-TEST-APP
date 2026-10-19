import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { PRIVACY_POLICY_URL } from "@/constants/app";
import { useAppTheme } from "@/context/ThemeContext";

interface AboutSheetProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Folha "Sobre o teste".
 *
 * O aviso de que isto não é uma avaliação psicológica é requisito de política
 * da Play Store para apps de QI — mantenha-o visível, não o esconda atrás de
 * outro toque.
 */
export function AboutSheet({ visible, onClose }: AboutSheetProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  const bullets = t("about.bullets", { returnObjects: true });
  const items = Array.isArray(bullets) ? (bullets as string[]) : [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingBottom: insets.bottom || spacing.lg,
            },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText variant="heading">{t("about.title")}</ThemedText>
            <ThemedText
              variant="body"
              tone="muted"
            >
              {t("about.intro")}
            </ThemedText>

            <View style={styles.bullets}>
              {items.map((item) => (
                <View
                  key={item}
                  style={styles.bulletRow}
                >
                  <Ionicons
                    name="ellipse"
                    size={6}
                    color={colors.primary}
                    style={styles.dot}
                  />
                  <ThemedText
                    variant="caption"
                    tone="muted"
                    style={styles.flex}
                  >
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>

            <View style={[styles.notice, { backgroundColor: colors.accentSoft, borderRadius: radius.lg }]}>
              <ThemedText
                variant="captionStrong"
                color={colors.onAccentSoft}
              >
                {t("about.disclaimerTitle")}
              </ThemedText>
              <ThemedText
                variant="caption"
                tone="muted"
              >
                {t("about.disclaimerFull")}
              </ThemedText>
            </View>

            <Pressable
              onPress={() => Linking.openURL(PRIVACY_POLICY_URL).catch(() => {})}
              style={styles.link}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={colors.primaryText}
              />
              <ThemedText
                variant="caption"
                tone="primary"
              >
                {t("about.privacy")}
              </ThemedText>
            </Pressable>
          </ScrollView>

          <Button
            block
            title={t("common.close")}
            variant="secondary"
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    maxHeight: "85%",
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
  },
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    gap: 14,
  },
  bullets: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  dot: {
    marginTop: 7,
  },
  notice: {
    gap: 6,
    padding: 16,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
});
