import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, AppState, LayoutRectangle, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { PatternQuestion } from "@/components/PatternQuestion";
import { AdSlot } from "@/components/ui/AdSlot";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAppTheme } from "@/context/ThemeContext";
import { useGatedInterstitial } from "@/hooks/useGatedInterstitial";
import { useQuestionData } from "@/hooks/useQuestionData";
import { buildCategoryRound, buildTest, isModeAvailable, markUsed, parseMode, restoreTest, RoundItem } from "@/hooks/useQuestionSelection";
import { useStorage } from "@/hooks/useStorage";
import { Answer, TestMode } from "@/types";
import { HistoryItem } from "@/types/storage";
import { createActiveTimer } from "@/utils/activeTimer";
import { evaluateTest } from "@/utils/iqCalculator";

/** Modo quando a rota não pede nenhum (o seletor da Home é a fatia 08). */
const DEFAULT_MODE: TestMode = "normal";

export default function Test() {
  const { t } = useTranslation();
  const { colors, spacing, radius } = useAppTheme();
  const storage = useStorage();
  const { getQuestionData } = useQuestionData();
  const params = useLocalSearchParams<{ only?: string; mode?: string }>();

  // Rodada de conferência, só no bundle de desenvolvimento: `/test?only=patterns`
  // abre os itens visuais em ordem, sem ler nem gravar progresso. O
  // `__DEV__` na frente deixa o minificador descartar o ramo na release.
  const devRound = __DEV__ && params.only === "patterns";
  const requestedMode = parseMode(params.mode);

  const [items, setItems] = useState<RoundItem[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTests, setCompletedTests] = useState(0);
  // Viewport da rolagem, para a questão visual se dimensionar e caber sem rolar.
  const [viewport, setViewport] = useState<LayoutRectangle | null>(null);

  // O anúncio começa a carregar assim que o teste abre, então já está pronto
  // quando o usuário chega na última questão — sem espera na hora de mostrar.
  const { run } = useGatedInterstitial({ completedTests });

  const scrollRef = useRef<ScrollView>(null);
  const modeRef = useRef<TestMode>(DEFAULT_MODE);
  const ageRef = useRef<string | undefined>(undefined);

  // Tempo de cada resposta só conta com o app em primeiro plano: a duração
  // gravada no histórico é tempo respondendo, não tempo com o app aberto.
  const [timer] = useState(() => createActiveTimer());
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") timer.foreground();
      else timer.background();
    });
    return () => subscription.remove();
  }, [timer]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const [progress, userData, history, usage] = await Promise.all([
        storage.getItem("testProgress"),
        storage.getItem("userData"),
        storage.getItem("testHistory"),
        storage.getItem("itemUsage"),
      ]);
      if (!active) return;

      setCompletedTests(history?.length ?? 0);

      if (devRound) {
        setItems(buildCategoryRound("patterns"));
      } else {
        // Retoma o teste salvo, a não ser que a rota peça explicitamente outro
        // modo (o deep link de conferência). Só retoma se conseguirmos
        // reconstruir exatamente o mesmo teste; caso contrário as respostas
        // salvas apontariam para outras questões.
        const resumable = progress && (requestedMode === null || progress.mode === requestedMode);
        const restored = resumable ? restoreTest(progress) : null;

        if (restored && progress) {
          modeRef.current = restored.mode;
          setItems(restored.items);
          setIndex(Math.min(progress.currentIndex, restored.items.length - 1));
          setAnswers(progress.savedAnswers);
        } else {
          const mode = requestedMode && isModeAvailable(requestedMode) ? requestedMode : DEFAULT_MODE;
          if (__DEV__ && requestedMode && mode !== requestedMode) {
            console.warn(`[test] mode "${requestedMode}" is not available on this bank; starting "${mode}"`);
          }
          const round = buildTest(mode, usage);
          modeRef.current = round.mode;
          setItems(round.items);
          await storage.setItem("itemUsage", markUsed(usage, round));
        }
      }

      ageRef.current = userData?.age;
      setLoading(false);
      timer.reset();
    };

    bootstrap().catch((error) => {
      console.error("Error starting test:", error);
      if (active) {
        const round = buildTest(DEFAULT_MODE, null);
        modeRef.current = round.mode;
        setItems(round.items);
        setLoading(false);
        timer.reset();
      }
    });

    return () => {
      active = false;
    };
  }, [storage, devRound, requestedMode, timer]);

  const current = items[index];
  const questionData = useMemo(
    () => (current ? getQuestionData(current.question.id, current.optionOrder) : null),
    [current, getQuestionData]
  );

  const finish = async (finalAnswers: Answer[]) => {
    const outcome = evaluateTest(finalAnswers, Number(ageRef.current) || undefined);

    const entry: HistoryItem = {
      date: new Date().toISOString(),
      iqScore: outcome.iq,
      percentile: outcome.percentile,
      correctAnswers: outcome.correct,
      totalQuestions: outcome.total,
      categories: outcome.categories,
      durationSeconds: Math.round(finalAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0)),
      mode: modeRef.current,
      band: outcome.band,
      ...(outcome.indices && { indices: outcome.indices }),
    };

    // A rodada de conferência não entra no histórico nem mexe no progresso
    // de um teste de verdade que esteja pela metade.
    if (!devRound) {
      const existing = (await storage.getItem("testHistory")) ?? [];
      await storage.setItem("testHistory", [entry, ...existing]);
      await storage.removeItem("testProgress");
    }

    // O resultado já está salvo no histórico neste ponto. Se o anúncio falhar
    // ou o usuário matar o app durante ele, nada se perde — a navegação é o
    // único passo represado, e `run` a executa mesmo em caso de erro.
    run(() => router.replace({ pathname: "/results", params: { entry: JSON.stringify(entry) } }));
  };

  const handleConfirm = async () => {
    if (selected === null || !current || !questionData) return;

    // `questionData.correctAnswer` já está na ordem exibida, então a comparação
    // é posição com posição.
    const answer: Answer = {
      questionId: current.question.id,
      isCorrect: selected === questionData.correctAnswer,
      timeSpent: timer.take(),
    };

    const nextAnswers = [...answers, answer];
    const nextIndex = index + 1;

    setAnswers(nextAnswers);
    setSelected(null);

    if (nextIndex >= items.length) {
      await finish(nextAnswers);
      return;
    }

    setIndex(nextIndex);
    scrollRef.current?.scrollTo({ y: 0, animated: false });

    if (devRound) return;

    // Grava os valores já calculados — ler do state aqui salvaria a questão
    // anterior, porque `setState` só reflete no próximo render.
    await storage.setItem("testProgress", {
      mode: modeRef.current,
      currentIndex: nextIndex,
      savedAnswers: nextAnswers,
      questionIds: items.map((item) => item.question.id),
      optionOrders: items.map((item) => item.optionOrder),
    });
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  if (!current || !questionData) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ThemedText
          tone="danger"
          center
        >
          {t("test.error")}
        </ThemedText>
      </View>
    );
  }

  const isImage = current.question.type === "image";

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <View style={styles.headerRow}>
          <Chip
            label={t(`categories.${current.question.category}`)}
            tone="primary"
          />
          <ThemedText
            variant="captionStrong"
            tone="muted"
          >
            {t("test.counter", { current: index + 1, total: items.length })}
          </ThemedText>
        </View>
        <ProgressBar value={index / items.length} />
      </View>

      {/* A questão visual se dimensiona pelo viewport medido aqui e dispensa a
          folga inferior: o que a separa do botão é o recuo do rodapé. */}
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        onLayout={(event) => setViewport(event.nativeEvent.layout)}
        contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: isImage ? 0 : spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        {isImage ? (
          <PatternQuestion
            questionKey={current.question.questionKey}
            selected={selected}
            onSelect={setSelected}
            width={viewport ? viewport.width - spacing.xl * 2 : undefined}
            availableHeight={viewport?.height}
          />
        ) : (
          <>
            <ThemedText
              variant="heading"
              style={styles.prompt}
            >
              {questionData.question}
            </ThemedText>

            <View style={styles.options}>
              {questionData.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex;

                return (
                  <Pressable
                    key={optionIndex}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelected(optionIndex)}
                    style={({ pressed }) => [
                      styles.option,
                      {
                        borderRadius: radius.lg,
                        backgroundColor: isSelected ? colors.primarySoft : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.outline,
                      },
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <View
                      style={[
                        styles.bullet,
                        {
                          borderColor: isSelected ? colors.primary : colors.outline,
                          backgroundColor: isSelected ? colors.primary : "transparent",
                        },
                      ]}
                    >
                      {isSelected && <View style={[styles.bulletDot, { backgroundColor: colors.onPrimary }]} />}
                    </View>

                    <ThemedText
                      variant={isSelected ? "bodyStrong" : "body"}
                      tone={isSelected ? "primary" : "default"}
                      style={styles.flex}
                    >
                      {option}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: spacing.xl,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Button
          block
          size="large"
          title={index + 1 === items.length ? t("test.finish") : t("test.confirm")}
          onPress={handleConfirm}
          disabled={selected === null}
        />
      </View>

      {/* Abaixo do botão, nunca entre ele e as alternativas (decisão D2). Um
          só por tela: não depende da questão, então não é recriado a cada
          resposta. */}
      <AdSlot placement="test-bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  prompt: {
    marginBottom: 24,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderWidth: 1.5,
  },
  bullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
