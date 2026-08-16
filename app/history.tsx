import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { Sparkline } from "@/components/ui/Sparkline";
import { useAppTheme } from "@/context/ThemeContext";
import { useStorage } from "@/hooks/useStorage";
import { HistoryItem } from "@/types/storage";

/** Quantos testes a linha de evolução mostra. */
const TREND_LENGTH = 10;

export default function History() {
  const { t, i18n } = useTranslation();
  const { colors, spacing } = useAppTheme();
  const { width } = useWindowDimensions();
  const storage = useStorage();

  const [history, setHistory] = useState<HistoryItem[] | null>(null);

  useEffect(() => {
    storage
      .getItem("testHistory")
      .then((stored) => setHistory(stored ?? []))
      .catch((error) => {
        console.error("Error loading history:", error);
        setHistory([]);
      });
  }, [storage]);

  if (history === null) return <Screen />;

  if (history.length === 0) {
    return (
      <Screen contentStyle={styles.empty}>
        <Ionicons
          name="stats-chart-outline"
          size={52}
          color={colors.textFaint}
        />
        <ThemedText
          variant="subheading"
          center
        >
          {t("history.empty.title")}
        </ThemedText>
        <ThemedText
          variant="body"
          tone="muted"
          center
        >
          {t("history.empty.message")}
        </ThemedText>
        <Button
          title={t("home.start")}
          icon="flash"
          onPress={() => router.replace("/test")}
          style={styles.emptyButton}
        />
      </Screen>
    );
  }

  const scores = history.map((item) => item.iqScore);
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const best = Math.max(...scores);

  // O histórico é gravado do mais recente para o mais antigo; a linha de
  // evolução precisa da ordem inversa.
  const trend = history.slice(0, TREND_LENGTH).map((item) => item.iqScore).reverse();

  const dateFormatter = new Intl.DateTimeFormat(i18n.language, { day: "2-digit", month: "short", year: "numeric" });

  return (
    <Screen
      scroll
      adPlacement="history-bottom"
      contentStyle={styles.content}
    >
      <Card variant="outlined">
        <View style={styles.summary}>
          <Metric
            label={t("history.average")}
            value={String(average)}
            highlight
          />
          <Metric
            label={t("history.best")}
            value={String(best)}
          />
          <Metric
            label={t("history.count")}
            value={String(history.length)}
          />
        </View>

        {trend.length > 1 && (
          <View style={styles.chart}>
            <Sparkline
              values={trend}
              width={width - spacing.xl * 2 - spacing.lg * 2}
            />
          </View>
        )}
      </Card>

      <ThemedText
        variant="overline"
        tone="faint"
        style={styles.sectionTitle}
      >
        {t("history.allTests").toUpperCase()}
      </ThemedText>

      <View style={styles.list}>
        {history.map((item, index) => (
          <Card
            key={`${item.date}-${index}`}
            variant="soft"
            style={styles.item}
          >
            <View style={styles.itemMain}>
              <ThemedText
                variant="heading"
                tone="primary"
              >
                {item.iqScore}
              </ThemedText>
              <View style={styles.itemText}>
                <ThemedText variant="captionStrong">{dateFormatter.format(new Date(item.date))}</ThemedText>
                <ThemedText
                  variant="caption"
                  tone="muted"
                >
                  {t("history.itemDetail", {
                    correct: item.correctAnswers,
                    total: item.totalQuestions,
                    percentile: item.percentile,
                  })}
                </ThemedText>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.metric}>
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

const styles = StyleSheet.create({
  content: {
    paddingTop: 12,
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyButton: {
    marginTop: 12,
  },
  summary: {
    flexDirection: "row",
  },
  metric: {
    flex: 1,
  },
  chart: {
    marginTop: 16,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 10,
  },
  list: {
    gap: 8,
  },
  item: {
    paddingVertical: 14,
  },
  itemMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
});
