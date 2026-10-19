import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ScoreCurve } from "@/components/ui/ScoreCurve";
import { Screen } from "@/components/ui/Screen";
import { STORE_URL } from "@/constants/app";
import { useAppTheme } from "@/context/ThemeContext";
import { HistoryItem } from "@/types/storage";
import { getIQClassification } from "@/utils/iqCalculator";

/** Duração da contagem animada do score, em ms. */
const REVEAL_MS = 900;

export default function Results() {
  const { t } = useTranslation();
  const { colors, spacing } = useAppTheme();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ entry?: string }>();

  const entry = useMemo<HistoryItem | null>(() => {
    if (!params.entry) return null;
    try {
      return JSON.parse(params.entry) as HistoryItem;
    } catch (error) {
      console.error("Error parsing result:", error);
      return null;
    }
  }, [params.entry]);

  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!entry) return;

    const target = entry.iqScore;
    const startedAt = Date.now();
    let frame: number;

    const tick = () => {
      const progress = Math.min((Date.now() - startedAt) / REVEAL_MS, 1);
      // Ease-out cúbico: acelera na largada e assenta no número final.
      const eased = 1 - Math.pow(1 - progress, 3);
      setRevealed(Math.round(target * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [entry]);

  if (!entry) {
    return (
      <Screen contentStyle={styles.centered}>
        <ThemedText
          tone="danger"
          center
        >
          {t("results.missing")}
        </ThemedText>
        <Button
          title={t("common.home")}
          variant="outline"
          onPress={() => router.replace("/")}
        />
      </Screen>
    );
  }

  const accuracy = entry.totalQuestions > 0 ? entry.correctAnswers / entry.totalQuestions : 0;

  const handleShare = () => {
    // O link vai numa linha própria para os apps de mensagem gerarem a prévia
    // da loja — quem recebe o desafio instala dali mesmo.
    Share.share({
      message: `${t("results.shareMessage", { score: entry.iqScore, percentile: entry.percentile })}\n${STORE_URL}`,
    }).catch((error) => console.error("Error sharing:", error));
  };

  return (
    <Screen
      scroll
      glow
      adPlacement="results-bottom"
      contentStyle={styles.content}
    >
      <View style={styles.scoreBlock}>
        <ThemedText
          variant="overline"
          tone="faint"
          center
        >
          {t("results.yourScore").toUpperCase()}
        </ThemedText>
        <ThemedText
          variant="display"
          tone="primary"
          center
          style={styles.score}
        >
          {revealed}
        </ThemedText>
        <Chip
          label={t(getIQClassification(entry.iqScore))}
          tone="primary"
          style={styles.selfCenter}
        />
      </View>

      <Card variant="outlined">
        <ThemedText
          variant="bodyStrong"
          center
        >
          {t("results.percentile", { percentile: entry.percentile })}
        </ThemedText>
        <ScoreCurve
          score={entry.iqScore}
          width={width - spacing.xl * 2 - spacing.lg * 2}
        />
        <ThemedText
          variant="caption"
          tone="faint"
          center
        >
          {t("results.curveCaption")}
        </ThemedText>
      </Card>

      <Card variant="outlined">
        <View style={styles.cardHeader}>
          <ThemedText variant="subheading">{t("results.accuracy")}</ThemedText>
          <ThemedText
            variant="subheading"
            tone="primary"
          >
            {entry.correctAnswers}/{entry.totalQuestions}
          </ThemedText>
        </View>
        <ProgressBar value={accuracy} />
      </Card>

      <Card variant="outlined">
        <ThemedText
          variant="subheading"
          style={styles.cardTitle}
        >
          {t("results.byCategory")}
        </ThemedText>

        <View style={styles.categories}>
          {entry.categories.map((category) => {
            const ratio = category.total > 0 ? category.correct / category.total : 0;

            return (
              <View
                key={category.category}
                style={styles.categoryRow}
              >
                <View style={styles.categoryLabel}>
                  <ThemedText variant="caption">{t(`categories.${category.category}`)}</ThemedText>
                  <ThemedText
                    variant="captionStrong"
                    tone={ratio >= 0.6 ? "success" : ratio >= 0.4 ? "muted" : "danger"}
                  >
                    {category.correct}/{category.total}
                  </ThemedText>
                </View>
                <ProgressBar
                  value={ratio}
                  height={6}
                />
              </View>
            );
          })}
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          block
          size="large"
          icon="share-social-outline"
          title={t("common.share")}
          onPress={handleShare}
        />
        <Button
          block
          variant="outline"
          icon="refresh-outline"
          title={t("results.retake")}
          onPress={() => router.replace("/test")}
        />
        <Button
          block
          variant="ghost"
          title={t("common.home")}
          onPress={() => router.replace("/")}
        />
      </View>

      <ThemedText
        variant="caption"
        tone="faint"
        center
      >
        {t("about.disclaimerShort")}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    gap: 16,
  },
  centered: {
    justifyContent: "center",
    gap: 16,
  },
  scoreBlock: {
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  score: {
    fontSize: 76,
    lineHeight: 84,
  },
  selfCenter: {
    alignSelf: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    marginBottom: 16,
  },
  categories: {
    gap: 14,
  },
  categoryRow: {
    gap: 6,
  },
  categoryLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
});
