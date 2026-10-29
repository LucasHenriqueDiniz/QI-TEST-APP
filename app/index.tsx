import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { AboutSheet } from "@/components/AboutSheet";
import { HomeHero } from "@/components/HomeHero";
import { ModeChooser } from "@/components/ModeChooser";
import { RecordCard } from "@/components/RecordCard";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmSheet } from "@/components/ui/ConfirmSheet";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Screen } from "@/components/ui/Screen";
import { useAppTheme } from "@/context/ThemeContext";
import { useStorage } from "@/hooks/useStorage";
import type { TestMode } from "@/types";
import { HistoryItem, TestProgress } from "@/types/storage";
import { roundLength } from "@/utils/scoring/blueprints";

/**
 * O 3×3 da primeira visita: 15% da altura da tela, entre 96 e 180 dp. A 20%
 * (166 dp no A15) as duas últimas promessas ficavam abaixo da dobra, atrás do
 * rodapé fixo.
 */
function heroSizeFor(windowHeight: number): number {
  return Math.round(Math.min(180, Math.max(96, windowHeight * 0.15)));
}

const TRUST: { icon: keyof typeof Ionicons.glyphMap; key: string }[] = [
  { icon: "lock-open-outline", key: "home.trust.complete" },
  { icon: "person-outline", key: "home.trust.noSignup" },
  { icon: "timer-outline", key: "home.trust.untimed" },
];

/**
 * Home em três variantes: primeira visita (o 3×3 do ícone, "Descubra seu
 * QI" e o que o app promete), quem volta (o recorde, para tentar bater) e
 * teste em andamento (anel de progresso, continuar ou recomeçar). O botão
 * principal e o seletor de modo ficam presos acima do banner, fora da
 * rolagem, para estarem sempre à vista, em qualquer tamanho de fonte.
 */
export default function Home() {
  const { t } = useTranslation();
  const { colors, spacing, radius } = useAppTheme();
  const { height } = useWindowDimensions();
  const storage = useStorage();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [progress, setProgress] = useState<TestProgress | null>(null);
  const [mode, setMode] = useState<TestMode>("normal");
  const [aboutVisible, setAboutVisible] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);

  // Recarrega ao voltar de /test ou /settings, não só na montagem.
  useFocusEffect(
    useCallback(() => {
      let active = true;

      Promise.all([storage.getItem("testHistory"), storage.getItem("testProgress")])
        .then(([storedHistory, storedProgress]) => {
          if (!active) return;
          setHistory(storedHistory ?? []);
          setProgress(storedProgress && storedProgress.savedAnswers.length > 0 ? storedProgress : null);
        })
        .catch((error) => console.error("Error loading home data:", error));

      return () => {
        active = false;
      };
    }, [storage])
  );

  const returning = history.length > 0;

  const start = () => router.push({ pathname: "/test", params: { mode } });
  // A retomada não passa modo: o teste segue o que está salvo.
  const resume = () => router.push("/test");

  const restart = async () => {
    setConfirmRestart(false);
    await storage.removeItem("testProgress");
    setProgress(null);
  };

  return (
    <Screen
      glow
      adPlacement="home-bottom"
      insetTop
      contentStyle={{ paddingTop: spacing.sm }}
    >
      <View style={styles.topBar}>
        {/* O mesmo desenho do ícone da loja: quem instalou reconhece o app. */}
        <View style={styles.brand}>
          <Image
            source={require("@/assets/images/brand-mark.png")}
            style={[styles.badge, { borderRadius: radius.sm }]}
            accessibilityIgnoresInvertColors
          />
          <ThemedText
            variant="subheading"
            accessibilityRole="header"
          >
            {t("home.title")}
          </ThemedText>
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

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scroll, { paddingVertical: spacing.lg, gap: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {returning ? (
          <>
            <RecordCard history={history} />
            <ThemedText
              tone="muted"
              center
            >
              {t("home.newQuestions")}
            </ThemedText>
          </>
        ) : (
          <View style={[styles.firstRun, { gap: spacing.md }]}>
            <HomeHero size={heroSizeFor(height)} />
            <ThemedText
              variant="display"
              center
              style={{ marginTop: spacing.sm }}
            >
              {t("home.tagline")}
            </ThemedText>
            <ThemedText
              tone="muted"
              center
            >
              {t("home.subtitle", { count: roundLength(mode) })}
            </ThemedText>
            <View style={[styles.trust, { columnGap: spacing.md, rowGap: spacing.xs }]}>
              {TRUST.map((item) => (
                <View
                  key={item.key}
                  style={styles.trustItem}
                >
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={colors.primaryText}
                  />
                  <ThemedText
                    variant="caption"
                    tone="muted"
                  >
                    {t(item.key)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={{ gap: spacing.md }}>
        {progress ? (
          <>
            <Card
              variant="outlined"
              style={[styles.progressCard, { gap: spacing.md }]}
            >
              <ProgressRing
                done={progress.savedAnswers.length}
                total={progress.questionIds.length}
                accessibilityLabel={t("home.progress.a11y", { done: progress.savedAnswers.length, total: progress.questionIds.length })}
              />
              <ThemedText
                variant="bodyStrong"
                style={styles.flex}
                maxFontSizeMultiplier={1.3}
              >
                {t("home.progress.label")}
              </ThemedText>
            </Card>
            <Button
              block
              size="large"
              icon="play"
              title={t("home.resume.button")}
              onPress={resume}
            />
            <Button
              block
              variant="ghost"
              title={t("home.progress.restart")}
              onPress={() => setConfirmRestart(true)}
            />
          </>
        ) : (
          <>
            <ModeChooser
              value={mode}
              onChange={setMode}
            />
            <Button
              block
              size="large"
              icon={returning ? "refresh" : "arrow-forward"}
              title={returning ? t("home.newTest") : t("home.start")}
              onPress={start}
            />
          </>
        )}

        <View style={styles.footerLine}>
          {/* No rodapé fixo, como o seletor de modo: cresce só até 1,3×. A 2,0×
              o aviso quebrava no meio da palavra ("entreten / imento"). */}
          <ThemedText
            variant="caption"
            tone="faint"
            style={styles.flex}
            maxFontSizeMultiplier={1.3}
          >
            {t("about.disclaimerShort")}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            onPress={() => setAboutVisible(true)}
            style={styles.link}
          >
            <ThemedText
              variant="captionStrong"
              tone="primary"
              maxFontSizeMultiplier={1.3}
            >
              {t("home.howItWorks")}
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <AboutSheet
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
      />
      <ConfirmSheet
        visible={confirmRestart}
        title={t("home.progress.confirm.title")}
        message={t("home.progress.confirm.message")}
        confirmLabel={t("home.progress.confirm.confirm")}
        cancelLabel={t("home.progress.confirm.cancel")}
        onConfirm={restart}
        onCancel={() => setConfirmRestart(false)}
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
      hitSlop={4}
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    width: 36,
    height: 36,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  firstRun: {
    alignItems: "center",
  },
  trust: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  // 48 dp de alvo de toque, mesmo sendo um link de uma linha.
  link: {
    minHeight: 48,
    justifyContent: "center",
  },
  footerLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
