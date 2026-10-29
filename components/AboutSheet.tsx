import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { PRIVACY_POLICY_URL } from "@/constants/app";
import { CATEGORY_ICONS, CATEGORY_ORDER } from "@/constants/categories";
import { useAppTheme } from "@/context/ThemeContext";

interface AboutSheetProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Folha "Sobre o teste": o que o teste é, o que ele mede (as cinco áreas,
 * cada uma com uma linha) e o que ele não é.
 *
 * O aviso de que isto não é uma avaliação psicológica é requisito de política
 * da Play Store para apps de QI — mantenha-o visível, não o esconda atrás de
 * outro toque.
 */
export function AboutSheet({ visible, onClose }: AboutSheetProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useAppTheme();

  const bullets = t("about.bullets", { returnObjects: true });
  const items = Array.isArray(bullets) ? (bullets as string[]) : [];

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      closeLabel={t("common.close")}
    >
      <ScrollView
        contentContainerStyle={[styles.body, { paddingHorizontal: spacing.xl, gap: spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText
          variant="heading"
          accessibilityRole="header"
        >
          {t("about.title")}
        </ThemedText>
        <ThemedText tone="muted">{t("about.intro")}</ThemedText>

        <ThemedText
          variant="overline"
          tone="faint"
          style={{ marginTop: spacing.sm }}
        >
          {t("about.measures").toUpperCase()}
        </ThemedText>
        <View style={{ gap: spacing.sm }}>
          {CATEGORY_ORDER.map((category) => (
            <View
              key={category}
              style={[styles.area, { gap: spacing.md }]}
            >
              <View style={[styles.areaIcon, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
                <Ionicons
                  name={CATEGORY_ICONS[category]}
                  size={18}
                  color={colors.category[category]}
                />
              </View>
              <View style={styles.flex}>
                <ThemedText variant="captionStrong">{t(`categories.${category}`)}</ThemedText>
                <ThemedText
                  variant="caption"
                  tone="muted"
                >
                  {t(`about.areas.${category}`)}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.bullets, { marginTop: spacing.sm }]}>
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
          accessibilityRole="link"
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

      <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.sm }}>
        <Button
          block
          title={t("common.close")}
          variant="secondary"
          onPress={onClose}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  body: {
    paddingBottom: 12,
  },
  area: {
    flexDirection: "row",
    alignItems: "center",
  },
  areaIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 8,
  },
  notice: {
    padding: 14,
    gap: 4,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 48,
  },
});
