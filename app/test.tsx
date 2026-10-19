import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, LayoutRectangle, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { PatternQuestion } from "@/components/PatternQuestion";
import { AdSlot } from "@/components/ui/AdSlot";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAppTheme } from "@/context/ThemeContext";
import { useGatedInterstitial } from "@/hooks/useGatedInterstitial";
import { useQuestionData } from "@/hooks/useQuestionData";
import { buildCategoryRound, buildTest, restoreTest } from "@/hooks/useQuestionSelection";
import { useStorage } from "@/hooks/useStorage";
import { Answer, Question } from "@/types";
import { HistoryItem } from "@/types/storage";
import { evaluateTest } from "@/utils/iqCalculator";

export default function Test() {
  const { t } = useTranslation();
  const { colors, spacing, radius } = useAppTheme();
  const storage = useStorage();
  const { getQuestionData } = useQuestionData();
  const params = useLocalSearchParams<{ only?: string }>();

  // Rodada de conferência, só no bundle de desenvolvimento: `/test?only=patterns`
  // abre os 30 itens visuais em ordem, sem ler nem gravar progresso. O
  // `__DEV__` na frente deixa o minificador descartar o ramo na release.
  const devRound = __DEV__ && params.only === "patterns";

  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
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
  const questionStartedAt = useRef(Date.now());
  const ageRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const [progress, userData, history] = await Promise.all([
        storage.getItem("testProgress"),
        storage.getItem("userData"),
        storage.getItem("testHistory"),
      ]);
      if (!active) return;

      setCompletedTests(history?.length ?? 0);

      // Só retoma se conseguirmos reconstruir exatamente o mesmo teste;
      // caso contrário as respostas salvas apontariam para outras questões.
      const restored = progress?.questionIds ? restoreTest(progress.questionIds) : [];

      if (devRound) {
        setTestQuestions(buildCategoryRound("patterns"));
      } else if (progress && restored.length === progress.questionIds.length && restored.length > 0) {
        setTestQuestions(restored);
        setIndex(progress.currentIndex);
        setAnswers(progress.savedAnswers);
      } else {
        setTestQuestions(buildTest());
      }

      ageRef.current = userData?.age;
      setLoading(false);
      questionStartedAt.current = Date.now();
    };

    bootstrap().catch((error) => {
      console.error("Error starting test:", error);
      if (active) {
        setTestQuestions(buildTest());
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [storage, devRound]);

  const current = testQuestions[index];
  const questionData = useMemo(() => (current ? getQuestionData(current.id) : null), [current, getQuestionData]);

  const finish = async (finalAnswers: Answer[]) => {
    const outcome = evaluateTest(finalAnswers, Number(ageRef.current) || undefined);

    const entry: HistoryItem = {
      date: new Date().toISOString(),
      iqScore: outcome.iq,
      percentile: outcome.percentile,
      correctAnswers: outcome.correct,
      totalQuestions: outcome.total,
      categories: outcome.categories,
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
    if (selected === null || !current) return;

    const answer: Answer = {
      questionId: current.id,
      isCorrect: selected === current.correctAnswer,
      timeSpent: (Date.now() - questionStartedAt.current) / 1000,
    };

    const nextAnswers = [...answers, answer];
    const nextIndex = index + 1;

    setAnswers(nextAnswers);
    setSelected(null);

    if (nextIndex >= testQuestions.length) {
      await finish(nextAnswers);
      return;
    }

    setIndex(nextIndex);
    questionStartedAt.current = Date.now();
    scrollRef.current?.scrollTo({ y: 0, animated: false });

    if (devRound) return;

    // Grava os valores já calculados — ler do state aqui salvaria a questão
    // anterior, porque `setState` só reflete no próximo render.
    await storage.setItem("testProgress", {
      currentIndex: nextIndex,
      savedAnswers: nextAnswers,
      questionIds: testQuestions.map((q) => q.id),
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

  const isImage = current.type === "image";

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
        <View style={styles.headerRow}>
          <Chip
            label={t(`categories.${current.category}`)}
            tone="primary"
          />
          <ThemedText
            variant="captionStrong"
            tone="muted"
          >
            {t("test.counter", { current: index + 1, total: testQuestions.length })}
          </ThemedText>
        </View>
        <ProgressBar value={index / testQuestions.length} />
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
            questionKey={current.questionKey}
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
          title={index + 1 === testQuestions.length ? t("test.finish") : t("test.confirm")}
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
