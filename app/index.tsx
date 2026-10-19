import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { AboutSheet } from "@/components/AboutSheet";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { useAppTheme } from "@/context/ThemeContext";
import { TEST_LENGTH } from "@/hooks/useQuestionSelection";
import { useStorage } from "@/hooks/useStorage";
import { QuestionCategory } from "@/types";
import { HistoryItem } from "@/types/storage";

/** Áreas avaliadas, na ordem em que aparecem na home. */
const CATEGORY_ICONS: { category: QuestionCategory; icon: keyof typeof Ionicons.glyphMap }[] = [
  { category: "patterns", icon: "grid-outline" },
  { category: "matrix", icon: "calculator-outline" },
  { category: "similarities", icon: "git-compare-outline" },
  { category: "vocabulary", icon: "book-outline" },
  { category: "comprehension", icon: "bulb-outline" },
];

export default function Home() {
  const { t } = useTranslation();
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const storage = useStorage();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [hasProgress, setHasProgress] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);

  // Recarrega ao voltar de /test ou /settings, não só na montagem.
  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([storage.getItem("testHistory"), storage.getItem("testProgress")])
        .then(([storedHistory, progress]) => {
          if (!active) return;
          setHistory(storedHistory ?? []);
          setHasProgress(!!progress && progress.savedAnswers.length > 0);
        })
        .catch((error) => console.error("Error loading home data:", error));

      return () => {
        active = false;
      };
    }, [storage])
  );

  const latest = history[0];
  const best = history.reduce((max, item) => Math.max(max, item.iqScore), 0);

  const startFresh = async () => {
    await storage.removeItem("testProgress");
    router.push("/test");
  };

  const handleStart = () => {
    if (!hasProgress) {
      router.push("/test");
      return;
    }

    Alert.alert(t("home.resume.title"), t("home.resume.message"), [
      { text: t("home.resume.continue"), onPress: () => router.push("/test") },
      { text: t("home.resume.restart"), style: "destructive", onPress: startFresh },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  };

  return (
    <Screen
      scroll
      glow
      adPlacement="home-bottom"
      contentStyle={{ paddingTop: insets.top + spacing.sm }}
    >
      <View style={styles.topBar}>
        <View style={[styles.badge, { backgroundColor: colors.primary, borderRadius: radius.md }]}>
          <Ionicons
            name="bulb"
            size={20}
            color={colors.onPrimary}
          />
        </View>

        <View style={styles.topActions}>
          <IconButton
            icon="stats-chart-outline"
            label={t("history.title")}
            onPress={() => router.push("/history")}
          />
          <IconButton
            icon="settings-outline"
            label={t("settings.title")}
            onPress={() => router.push("/settings")}
          />
        </View>
      </View>

      <View style={styles.hero}>
        <ThemedText variant="display">{t("home.title")}</ThemedText>
        <ThemedText
          variant="body"
          tone="muted"
          style={styles.subtitle}
        >
          {t("home.subtitle", { count: TEST_LENGTH })}
        </ThemedText>
      </View>

      {latest ? (
        <Card
          variant="outlined"
          style={styles.statsCard}
        >
          <Stat
            label={t("home.stats.last")}
            value={String(latest.iqScore)}
            highlight
          />
          <Divider />
          <Stat
            label={t("home.stats.best")}
            value={String(best)}
          />
          <Divider />
          <Stat
            label={t("home.stats.taken")}
            value={String(history.length)}
          />
        </Card>
      ) : (
        <Card
          variant="soft"
          style={styles.pitchCard}
        >
          {[t("home.pitch.free"), t("home.pitch.offline"), t("home.pitch.categories")].map((line) => (
            <View
              key={line}
              style={styles.pitchRow}
            >
              <Ionicons
                name="checkmark-circle"
                size={19}
                color={colors.primary}
              />
              <ThemedText
                variant="caption"
                tone="muted"
                style={styles.flex}
              >
                {line}
              </ThemedText>
            </View>
          ))}
        </Card>
      )}

      <View style={styles.measures}>
        <ThemedText
          variant="overline"
          tone="faint"
        >
          {t("home.measures").toUpperCase()}
        </ThemedText>

        <View style={styles.measureGrid}>
          {CATEGORY_ICONS.map(({ category, icon }) => (
            <View
              key={category}
              style={[styles.measureChip, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md }]}
            >
              <Ionicons
                name={icon}
                size={15}
                color={colors.primary}
              />
              <ThemedText variant="caption">{t(`categories.${category}`)}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.spacer} />

      <View style={styles.actions}>
        <Button
          block
          size="large"
          icon={hasProgress ? "play" : "flash"}
          title={hasProgress ? t("home.resume.button") : t("home.start")}
          onPress={handleStart}
        />
        <Button
          block
          variant="ghost"
          title={t("about.title")}
          onPress={() => setAboutVisible(true)}
        />
        <ThemedText
          variant="caption"
          tone="faint"
          center
        >
          {t("about.disclaimerShort")}
        </ThemedText>
      </View>

      <AboutSheet
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
      />
    </Screen>
  );
}

function IconButton({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  const { colors, radius } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: colors.surfaceAlt, borderRadius: radius.md },
        pressed && { opacity: 0.6 },
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={colors.text}
      />
    </Pressable>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.flex}>
      <ThemedText
        variant="title"
        tone={highlight ? "primary" : "default"}
        center
      >
        {value}
      </ThemedText>
      <ThemedText
        variant="overline"
        tone="faint"
        center
      >
        {label.toUpperCase()}
      </ThemedText>
    </View>
  );
}

function Divider() {
  const { colors } = useAppTheme();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    marginTop: 40,
    gap: 12,
  },
  subtitle: {
    maxWidth: 320,
  },
  statsCard: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  pitchCard: {
    marginTop: 32,
    gap: 12,
  },
  pitchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    marginHorizontal: 8,
  },
  measures: {
    marginTop: 28,
    gap: 10,
  },
  measureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  measureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  actions: {
    gap: 10,
  },
});
