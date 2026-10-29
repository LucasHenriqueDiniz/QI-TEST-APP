import { LinearGradient } from "expo-linear-gradient";
import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { fonts } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";
import type { HistoryItem } from "@/types/storage";
import { getIQClassification } from "@/utils/iqCalculator";

/** O cartão em dp; capturado a 3× vira 1080×1920 (9:16, o mínimo do Instagram é 720×1280). */
export const SHARE_CARD_WIDTH = 360;
export const SHARE_CARD_HEIGHT = 640;

const WHITE = "#FFFFFF";
/** Marcador da curva: 3,06:1 sobre o ponto claro do gradiente. */
const MARKER = "#FFC857";

const CURVE_WIDTH = 260;
const CURVE_HEIGHT = 64;
const CURVE_MIN = 55;
const CURVE_MAX = 145;

interface ShareCardProps {
  entry: HistoryItem;
  /** Área de maior acerto, já traduzida; sem valor, a linha some. */
  strongestArea?: string;
}

/** Abaixo deste percentil o cartão não fala em "melhor que", como o herói. */
const PERCENTILE_LINE_MIN = 30;

/**
 * Cartão de compartilhamento: fica fora da tela e só existe para ser
 * capturado em PNG (`react-native-view-shot`). Gradiente da marca de borda a
 * borda e texto todo branco sólido, que passa 4,71:1 no ponto claro — é uma
 * imagem de texto e vai ser vista em miniatura numa conversa. Leva o nome do
 * app e a loja, para quem recebe chegar até ele.
 */
export const ShareCard = forwardRef<View, ShareCardProps>(function ShareCard({ entry, strongestArea }, ref) {
  const { t } = useTranslation();
  const { colors, radius } = useAppTheme();

  return (
    <View
      ref={ref}
      collapsable={false}
      style={styles.card}
    >
      <LinearGradient
        colors={colors.gradientBrand}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.brand}>
        <Image
          source={require("@/assets/images/brand-mark.png")}
          style={[styles.mark, { borderRadius: radius.md }]}
        />
        <Text style={[styles.text, styles.appName]}>{t("home.title")}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={[styles.text, styles.overline]}>{t("share.overline")}</Text>
        <Text style={[styles.text, styles.score]}>{entry.iqScore}</Text>
        {entry.band && (
          <Text style={[styles.text, styles.band]}>{t("results.band", { lower: entry.band.lower, upper: entry.band.upper })}</Text>
        )}
        <View style={[styles.chip, { backgroundColor: colors.gradientChip, borderRadius: radius.pill }]}>
          <Text style={[styles.text, styles.chipText]}>{t(getIQClassification(entry.iqScore))}</Text>
        </View>
        {entry.percentile >= PERCENTILE_LINE_MIN && (
          <Text style={[styles.text, styles.line]}>{t("share.betterThan", { percentile: entry.percentile })}</Text>
        )}
        <MiniCurve score={entry.iqScore} />
        {strongestArea && <Text style={[styles.text, styles.line]}>{t("share.strength", { area: strongestArea })}</Text>}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.text, styles.cta]}>{t("share.cta")}</Text>
        <Text style={[styles.text, styles.disclaimer]}>{t("about.disclaimerShort")}</Text>
      </View>
    </View>
  );
});

/** Curva normal em traço branco, com o marcador na pontuação. */
function MiniCurve({ score }: { score: number }) {
  const x = (value: number) => ((value - CURVE_MIN) / (CURVE_MAX - CURVE_MIN)) * CURVE_WIDTH;
  const y = (value: number) => {
    const z = (value - 100) / 15;
    return CURVE_HEIGHT - 4 - Math.exp(-0.5 * z * z) * (CURVE_HEIGHT - 12);
  };
  const points = Array.from({ length: 61 }, (_, i) => CURVE_MIN + (i * (CURVE_MAX - CURVE_MIN)) / 60);
  const d = points.map((value, i) => `${i === 0 ? "M" : "L"}${x(value).toFixed(1)} ${y(value).toFixed(1)}`).join(" ");
  const clamped = Math.min(Math.max(score, CURVE_MIN), CURVE_MAX);

  return (
    <Svg
      width={CURVE_WIDTH}
      height={CURVE_HEIGHT}
      style={styles.curve}
    >
      <Path
        d={d}
        stroke={WHITE}
        strokeWidth={2}
        fill="none"
      />
      <Line
        x1={x(clamped)}
        x2={x(clamped)}
        y1={y(clamped)}
        y2={CURVE_HEIGHT - 2}
        stroke={MARKER}
        strokeWidth={2}
      />
      <Circle
        cx={x(clamped)}
        cy={y(clamped)}
        r={5}
        fill={MARKER}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SHARE_CARD_WIDTH,
    height: SHARE_CARD_HEIGHT,
    paddingHorizontal: 28,
    paddingVertical: 32,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  text: {
    color: WHITE,
    textAlign: "center",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mark: {
    width: 40,
    height: 40,
  },
  appName: {
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 26,
  },
  middle: {
    alignItems: "center",
  },
  overline: {
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  score: {
    fontFamily: fonts.display,
    fontSize: 140,
    lineHeight: 150,
    fontVariant: ["tabular-nums"],
    includeFontPadding: false,
  },
  band: {
    fontFamily: fonts.strong,
    fontSize: 16,
    lineHeight: 22,
  },
  chip: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: {
    fontFamily: fonts.strong,
    fontSize: 15,
    lineHeight: 20,
  },
  line: {
    marginTop: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  curve: {
    marginTop: 14,
  },
  footer: {
    alignItems: "center",
    gap: 6,
  },
  cta: {
    fontFamily: fonts.heading,
    fontSize: 16,
    lineHeight: 22,
  },
  // Pequeno de propósito (pedido do dono): está lá, mas não disputa com o
  // resultado. Branco a 85% ainda passa 4,5:1 no ponto escuro do gradiente.
  disclaimer: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 12,
    opacity: 0.85,
  },
});
