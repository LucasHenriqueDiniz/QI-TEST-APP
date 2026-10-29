import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Sparkline } from "@/components/ui/Sparkline";
import { useAppTheme } from "@/context/ThemeContext";
import type { HistoryItem } from "@/types/storage";
import { getIQClassification } from "@/utils/iqCalculator";

const WHITE = "#FFFFFF";
/** Testes mais recentes na linha de evolução. */
const SPARK_POINTS = 10;

interface RecordCardProps {
  /** Histórico, do mais recente para o mais antigo (como é gravado). */
  history: HistoryItem[];
}

/**
 * "Seu recorde": o melhor resultado em destaque sobre o gradiente da marca,
 * a faixa, a evolução dos últimos testes e o último resultado. É o motivo
 * para quem volta tentar de novo. Texto todo branco sólido, como no herói do
 * resultado.
 */
export function RecordCard({ history }: RecordCardProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useAppTheme();
  const [width, setWidth] = useState(0);

  const best = history.reduce((max, item) => Math.max(max, item.iqScore), 0);
  const latest = history[0];
  const series = history
    .slice(0, SPARK_POINTS)
    .map((item) => item.iqScore)
    .reverse();

  return (
    <LinearGradient
      colors={colors.gradientBrand}
      style={[styles.card, { borderRadius: radius.xl, padding: spacing.lg }]}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <ThemedText
            variant="overline"
            color={WHITE}
          >
            {t("home.record.overline").toUpperCase()}
          </ThemedText>
          <ThemedText
            variant="display"
            color={WHITE}
            style={styles.best}
            maxFontSizeMultiplier={1.2}
          >
            {best}
          </ThemedText>
          <View style={[styles.chip, { backgroundColor: colors.gradientChip, borderRadius: radius.pill }]}>
            <ThemedText
              variant="captionStrong"
              color={WHITE}
            >
              {t(getIQClassification(best))}
            </ThemedText>
          </View>
        </View>
        {series.length > 1 && width > 0 && (
          <Sparkline
            values={series}
            width={Math.min(140, width * 0.42)}
            height={64}
            color={WHITE}
            dotStroke={colors.gradientBrand[1]}
          />
        )}
      </View>
      <ThemedText
        variant="caption"
        color={WHITE}
        style={{ marginTop: spacing.sm }}
      >
        {t("home.record.summary", { last: latest.iqScore, count: history.length })}
      </ThemedText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    alignItems: "flex-start",
  },
  best: {
    fontSize: 56,
    lineHeight: 62,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
