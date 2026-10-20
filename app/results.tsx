import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutRectangle, Share, StyleSheet, useWindowDimensions, View } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { ResultHero, HERO_OVERLAP, ResultHeroTimeline } from "@/components/ResultHero";
import { ThemedText } from "@/components/ThemedText";
import { BellCurve } from "@/components/ui/BellCurve";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CategoryBars, CategoryBarRow } from "@/components/ui/CategoryBars";
import { Confetti } from "@/components/ui/Confetti";
import { Screen } from "@/components/ui/Screen";
import { STORE_URL } from "@/constants/app";
import { CATEGORY_ICONS } from "@/constants/categories";
import { useAppTheme } from "@/context/ThemeContext";
import { useStorage } from "@/hooks/useStorage";
import { ScoreBand } from "@/types";
import { HistoryItem } from "@/types/storage";
import * as haptics from "@/utils/haptics";
import { getIQClassification } from "@/utils/iqCalculator";

/**
 * Linha do tempo da revelação, em ms a partir da montagem. Os números são os
 * da pesquisa (§5.5): a contagem termina em 1350, quando o chip pousa e o
 * aparelho vibra uma vez; a curva varre em seguida e as barras fecham.
 */
const TIMELINE: ResultHeroTimeline = { countDelayMs: 150, countMs: 1200, chipAtMs: 1350 };
const CURVE_AT_MS = 1400;
const BARS_AT_MS = 2200;

/** A partir deste percentil a linha de leitura fala em "melhor que N%"; abaixo, no ponto forte. */
const PERCENTILE_LINE_MIN = 30;
/** Primeiro resultado que já merece confete. */
const FIRST_SCORE_CELEBRATION = 110;

/** Altura da curva, em dp. */
const CURVE_HEIGHT = 128;

export default function Results() {
  const { t } = useTranslation();
  const { colors, spacing, radius } = useAppTheme();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ entry?: string; mode?: string }>();
  const storage = useStorage();
  const reducedMotion = useReducedMotion();

  const entry = useMemo<HistoryItem | null>(() => {
    if (!params.entry) return null;
    try {
      return JSON.parse(params.entry) as HistoryItem;
    } catch (error) {
      console.error("Error parsing result:", error);
      return null;
    }
  }, [params.entry]);

  // Do histórico a tela já abre pronta: nada a revelar, nada a comemorar.
  const historyMode = params.mode === "history";
  const revealing = !historyMode && !reducedMotion;

  const [skipped, setSkipped] = useState(false);
  const animate = revealing && !skipped;

  const hapticFired = useRef(false);
  const [celebrate, setCelebrate] = useState(false);
  const [confettiDue, setConfettiDue] = useState(false);
  const [heroLayout, setHeroLayout] = useState<LayoutRectangle | null>(null);

  // Uma vibração marca o resultado revelado: no fim da contagem, ou na hora
  // quando não há contagem. Do histórico, nenhuma.
  useEffect(() => {
    if (!entry || historyMode || hapticFired.current) return;
    if (!animate) {
      hapticFired.current = true;
      haptics.confirm();
      return;
    }
    const timer = setTimeout(() => {
      hapticFired.current = true;
      haptics.confirm();
    }, TIMELINE.chipAtMs);
    return () => clearTimeout(timer);
  }, [entry, historyMode, animate]);

  // Confete só para recorde pessoal com dois ou mais testes, ou para um
  // primeiro resultado alto. O teste já gravou esta entrada no histórico.
  useEffect(() => {
    if (!entry || !revealing) return;
    let active = true;
    storage
      .getItem("testHistory")
      .then((history) => {
        if (!active) return;
        const others = (history ?? []).filter((item) => item.date !== entry.date);
        const previousBest = others.reduce((best, item) => Math.max(best, item.iqScore), 0);
        const eligible = others.length >= 1 ? entry.iqScore > previousBest : entry.iqScore >= FIRST_SCORE_CELEBRATION;
        setCelebrate(eligible);
      })
      .catch((error) => console.error("Error reading history for the result:", error));
    return () => {
      active = false;
    };
  }, [entry, revealing, storage]);

  // O confete entra junto com o chip; pular antes disso cancela a festa.
  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setConfettiDue(true), TIMELINE.chipAtMs);
    return () => clearTimeout(timer);
  }, [animate]);

  if (!entry) {
    return (
      <Screen contentStyle={styles.centered}>
        <ThemedText
          tone="muted"
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

  const rows: CategoryBarRow[] = entry.categories.map((category) => ({
    key: category.category,
    label: t(`categories.${category.category}`),
    icon: CATEGORY_ICONS[category.category],
    colour: colors.category[category.category],
    correct: category.correct,
    total: category.total,
  }));

  const strongest = rows
    .filter((row) => row.total > 0)
    .reduce<CategoryBarRow | null>((best, row) => (!best || row.correct / row.total > best.correct / best.total ? row : best), null);

  const headline =
    entry.percentile >= PERCENTILE_LINE_MIN || !strongest
      ? t("results.betterThan", { percentile: entry.percentile })
      : t("results.strongest", { area: strongest.label, correct: strongest.correct, total: strongest.total });

  const strip = [t("results.strip.correct", { correct: entry.correctAnswers, total: entry.totalQuestions })];
  if (entry.durationSeconds !== undefined) strip.push(formatDuration(entry.durationSeconds, t));
  strip.push(t("results.strip.areas", { count: entry.categories.length }));

  const skip = () => {
    if (!animate) return;
    setSkipped(true);
    if (!hapticFired.current) {
      hapticFired.current = true;
      haptics.confirm();
    }
  };

  const goHome = () => router.replace("/");

  const handleShare = () => {
    // O link vai numa linha própria para os apps de mensagem gerarem a prévia
    // da loja — quem recebe o desafio instala dali mesmo.
    Share.share({
      message: `${t("results.shareMessage", { score: entry.iqScore, percentile: entry.percentile })}\n${STORE_URL}`,
    }).catch((error) => console.error("Error sharing:", error));
  };

  const gutter = spacing.xl;
  const cardPadding = spacing.lg;

  return (
    <Screen
      scroll
      adPlacement="results-bottom"
      contentStyle={styles.content}
    >
      {/* O herói é violeta nos dois temas; os ícones do sistema ficam claros. */}
      <StatusBar style="light" />

      <ResultHero
        score={entry.iqScore}
        band={entry.band ? bandHalfWidth(entry.iqScore, entry.band) : undefined}
        tierLabel={t(getIQClassification(entry.iqScore))}
        headline={headline}
        strip={strip}
        overline={t("results.overline")}
        closeLabel={t("common.close")}
        skipHint={t("results.skipReveal")}
        animate={animate}
        timeline={TIMELINE}
        onClose={goHome}
        onSkip={skip}
        onLayout={(event) => setHeroLayout(event.nativeEvent.layout)}
      >
        {confettiDue && celebrate && heroLayout && (
          <Confetti
            width={heroLayout.width}
            height={heroLayout.height}
            onDone={() => setConfettiDue(false)}
          />
        )}
      </ResultHero>

      <View style={[styles.below, { paddingHorizontal: gutter, marginTop: -HERO_OVERLAP }]}>
        <Card style={{ borderRadius: radius.xl }}>
          <ThemedText
            variant="bodyStrong"
            style={styles.cardTitle}
          >
            {t("results.whereYouAre")}
          </ThemedText>
          <BellCurve
            score={entry.iqScore}
            width={width - gutter * 2 - cardPadding * 2}
            height={CURVE_HEIGHT}
            label={t("results.you", { score: entry.iqScore })}
            animate={animate}
            delayMs={CURVE_AT_MS}
          />
          <ThemedText
            variant="caption"
            tone="faint"
            center
            style={styles.caption}
          >
            {t("results.populationMean")}
          </ThemedText>
        </Card>

        <View style={styles.actions}>
          <Button
            block
            size="large"
            icon="share-social-outline"
            title={t("results.share")}
            onPress={handleShare}
          />
          <Button
            block
            variant="outline"
            icon="refresh-outline"
            title={t("results.retake")}
            onPress={() => router.replace({ pathname: "/test", params: { mode: entry.mode ?? "normal" } })}
          />
        </View>

        <Card style={{ borderRadius: radius.xl }}>
          <ThemedText
            variant="subheading"
            style={styles.profileTitle}
          >
            {t("results.profile")}
          </ThemedText>
          <CategoryBars
            rows={rows}
            strengthLabel={t("results.strength")}
            animate={animate}
            delayMs={BARS_AT_MS}
          />
        </Card>

        <ThemedText
          variant="caption"
          tone="faint"
          center
        >
          {t("about.disclaimerShort")}
        </ThemedText>
      </View>
    </Screen>
  );
}

/**
 * Meia largura da faixa para o "± N" do herói. A faixa é simétrica em torno
 * do QI antes do limite 55–145; depois dele um dos lados pode ficar mais
 * curto, e o lado inteiro é o que ainda mede a incerteza.
 */
function bandHalfWidth(score: number, band: ScoreBand): number {
  return Math.max(score - band.lower, band.upper - score);
}

/** "11 min" a partir de um minuto; abaixo disso, segundos. */
function formatDuration(seconds: number, t: (key: string, options: { count: number }) => string): string {
  if (seconds >= 60) return t("results.strip.minutes", { count: Math.round(seconds / 60) });
  return t("results.strip.seconds", { count: Math.max(1, Math.round(seconds)) });
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  centered: {
    justifyContent: "center",
    gap: 16,
  },
  below: {
    gap: 16,
  },
  cardTitle: {
    marginBottom: 4,
  },
  caption: {
    marginTop: 2,
  },
  actions: {
    gap: 10,
  },
  profileTitle: {
    marginBottom: 14,
  },
});
