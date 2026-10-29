import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { HomeHero } from "@/components/HomeHero";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HistoryChart } from "@/components/ui/HistoryChart";
import { Screen } from "@/components/ui/Screen";
import { useAppTheme } from "@/context/ThemeContext";
import { useStorage } from "@/hooks/useStorage";
import { HistoryItem } from "@/types/storage";
import { getIQClassification } from "@/utils/iqCalculator";

/** Quantos testes a linha de evolução mostra. */
const TREND_LENGTH = 10;
/** Diâmetro do selo com a pontuação de cada linha. */
const BADGE = 44;

/**
 * Histórico: o recorde com a evolução dos últimos testes, a média, a contagem
 * e o tempo médio, e uma linha por teste que abre o resultado dele (sem
 * revelação, anúncio nem confete). "Fazer novo teste" fica preso acima do
 * banner. Sem testes, o 3×3 da marca e o mesmo botão.
 */
export default function History() {
  const { t, i18n } = useTranslation();
  const { colors, spacing, radius } = useAppTheme();
  const storage = useStorage();

  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [chartWidth, setChartWidth] = useState(0);

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

  // Um teste novo no modo do último, ou no Normal.
  const newTest = () => router.replace({ pathname: "/test", params: { mode: history[0]?.mode ?? "normal" } });

  const startButton = (
    <Button
      block
      size="large"
      icon="refresh"
      title={t("home.newTest")}
      onPress={newTest}
    />
  );

  if (history.length === 0) {
    return (
      <Screen
        adPlacement="history-bottom"
        contentStyle={{ ...styles.empty, gap: spacing.md }}
      >
        <View style={styles.emptyBody}>
          <HomeHero size={96} />
          <ThemedText
            variant="subheading"
            center
            style={{ marginTop: spacing.lg }}
          >
            {t("history.empty.title")}
          </ThemedText>
          <ThemedText
            tone="muted"
            center
          >
            {t("history.empty.message")}
          </ThemedText>
        </View>
        {startButton}
      </Screen>
    );
  }

  const scores = history.map((item) => item.iqScore);
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const bestIndex = scores.indexOf(Math.max(...scores));
  const best = history[bestIndex];
  const timed = history.filter((item) => item.durationSeconds !== undefined);
  const averageMinutes = timed.length
    ? Math.max(1, Math.round(timed.reduce((sum, item) => sum + (item.durationSeconds ?? 0), 0) / timed.length / 60))
    : null;

  // O histórico é gravado do mais recente para o mais antigo; a linha de
  // evolução precisa da ordem inversa.
  const trend = history.slice(0, TREND_LENGTH).map((item) => item.iqScore).reverse();
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, { day: "2-digit", month: "short", year: "numeric" });

  return (
    <Screen
      adPlacement="history-bottom"
      contentStyle={{ paddingTop: spacing.md, gap: spacing.md }}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.sm }}
        showsVerticalScrollIndicator={false}
      >
        <Card style={{ borderRadius: radius.xl }}>
          <ThemedText
            variant="overline"
            tone="faint"
          >
            {t("home.record.overline").toUpperCase()}
          </ThemedText>
          <View style={[styles.recordRow, { gap: spacing.md }]}>
            <ThemedText
              variant="display"
              tone="primary"
              style={styles.recordScore}
              maxFontSizeMultiplier={1.2}
            >
              {best.iqScore}
            </ThemedText>
            <View style={styles.flex}>
              <ThemedText variant="bodyStrong">{t(getIQClassification(best.iqScore))}</ThemedText>
              <ThemedText
                variant="caption"
                tone="muted"
              >
                {dateFormatter.format(new Date(best.date))}
              </ThemedText>
            </View>
          </View>
          <View
            style={{ marginTop: spacing.sm }}
            onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
          >
            {chartWidth > 0 && (
              <HistoryChart
                values={trend}
                width={chartWidth}
                meanLabel={t("history.mean")}
              />
            )}
          </View>
          {history.length === 1 && (
            <ThemedText
              variant="caption"
              tone="muted"
              center
            >
              {t("history.oneTest")}
            </ThemedText>
          )}
        </Card>

        <View style={[styles.metrics, { gap: spacing.sm }]}>
          <Metric
            label={t("history.average")}
            value={String(average)}
          />
          <Metric
            label={t("history.count")}
            value={String(history.length)}
          />
          {averageMinutes !== null && (
            <Metric
              label={t("history.averageTime")}
              value={t("results.strip.minutes", { count: averageMinutes })}
            />
          )}
        </View>

        <ThemedText
          variant="overline"
          tone="faint"
          style={{ marginTop: spacing.sm }}
        >
          {t("history.allTests").toUpperCase()}
        </ThemedText>

        <View style={{ gap: spacing.sm }}>
          {history.map((item, index) => {
            const previous = history[index + 1];
            const delta = previous ? item.iqScore - previous.iqScore : 0;
            const date = dateFormatter.format(new Date(item.date));
            const detail = t("history.itemDetail", {
              correct: item.correctAnswers,
              total: item.totalQuestions,
              percentile: item.percentile,
            });
            const isBest = index === bestIndex;
            return (
              <Pressable
                key={`${item.date}-${index}`}
                accessibilityRole="button"
                accessibilityLabel={t("history.rowA11y", { score: item.iqScore, date, detail })}
                onPress={() => router.push({ pathname: "/results", params: { entry: JSON.stringify(item), mode: "history" } })}
                style={({ pressed }) => [
                  styles.row,
                  { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.md, gap: spacing.md },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: colors.primarySoft },
                    isBest && { borderWidth: 2, borderColor: colors.accent },
                  ]}
                >
                  <ThemedText
                    variant="bodyStrong"
                    color={colors.primaryText}
                    maxFontSizeMultiplier={1.2}
                  >
                    {item.iqScore}
                  </ThemedText>
                </View>
                <View style={styles.flex}>
                  <ThemedText variant="captionStrong">{date}</ThemedText>
                  <ThemedText
                    variant="caption"
                    tone="muted"
                    numberOfLines={1}
                  >
                    {detail}
                  </ThemedText>
                </View>
                {delta !== 0 && (
                  <ThemedText
                    variant="captionStrong"
                    tone={delta > 0 ? "success" : "muted"}
                  >
                    {delta > 0 ? `▲ ${delta}` : `▼ ${-delta}`}
                  </ThemedText>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textFaint}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {startButton}
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors, radius, spacing } = useAppTheme();
  return (
    <View style={[styles.metric, { backgroundColor: colors.surface, borderRadius: radius.lg, paddingVertical: spacing.md }]}>
      <ThemedText
        variant="subheading"
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
  flex: {
    flex: 1,
  },
  empty: {
    justifyContent: "center",
  },
  emptyBody: {
    alignItems: "center",
    gap: 8,
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordScore: {
    fontSize: 56,
    lineHeight: 62,
  },
  metrics: {
    flexDirection: "row",
  },
  metric: {
    flex: 1,
  },
  row: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
