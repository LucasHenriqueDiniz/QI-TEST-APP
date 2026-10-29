import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, AppState, BackHandler, LayoutRectangle, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { PatternQuestion } from "@/components/PatternQuestion";
import { PauseSheet } from "@/components/PauseSheet";
import { AdSlot } from "@/components/ui/AdSlot";
import { Button } from "@/components/ui/Button";
import { MilestoneChip } from "@/components/ui/MilestoneChip";
import { OptionCard } from "@/components/ui/OptionCard";
import { SegmentedProgress } from "@/components/ui/SegmentedProgress";
import { TopBar } from "@/components/ui/TopBar";
import { CATEGORY_ICONS } from "@/constants/categories";
import { useAppTheme } from "@/context/ThemeContext";
import { useGatedInterstitial } from "@/hooks/useGatedInterstitial";
import { useQuestionData } from "@/hooks/useQuestionData";
import {
  buildCategoryRound,
  buildSingleItem,
  buildTest,
  isModeAvailable,
  markUsed,
  parseMode,
  restoreTest,
  RoundItem,
} from "@/hooks/useQuestionSelection";
import { useStorage } from "@/hooks/useStorage";
import { Answer, TestMode } from "@/types";
import { HistoryItem } from "@/types/storage";
import { createActiveTimer } from "@/utils/activeTimer";
import { evaluateTest } from "@/utils/iqCalculator";
import { inCountdown, Milestone, milestoneAt, remainingAfter } from "@/utils/progress";

/** Modo quando a rota não pede nenhum (o seletor da Home é a fatia 08). */
const DEFAULT_MODE: TestMode = "normal";

/** Quanto a questão desliza ao sair (para a esquerda) e ao entrar (da direita), em dp. */
const SLIDE = 24;

const LETTERS = ["A", "B", "C", "D"];
/** Lado do botão de ampliar da questão visual, em dp. */
const ZOOM_BUTTON = 32;

/**
 * Rodadas de conferência, só no bundle de desenvolvimento. `patterns` abre os
 * 30 itens visuais em ordem; `single` abre uma questão pelo id
 * (`/test?q=<id>`), para medir se cabe. Nenhuma lê ou grava progresso, uso
 * ou histórico.
 */
type DevMode = "patterns" | "single" | null;

export default function Test() {
  const { t, i18n } = useTranslation();
  const { colors, spacing, radius, motion } = useAppTheme();
  const insets = useSafeAreaInsets();
  const storage = useStorage();
  const { getQuestionData } = useQuestionData();
  const params = useLocalSearchParams<{ only?: string; mode?: string; q?: string; lang?: string }>();

  // O `__DEV__` na frente deixa o minificador descartar os ramos na release.
  const devMode: DevMode = __DEV__ ? (params.only === "patterns" ? "patterns" : params.q ? "single" : null) : null;
  const devQuestionId = devMode === "single" ? String(params.q) : null;
  // `/test?q=<id>&lang=es` confere o item em outro idioma e devolve o idioma
  // anterior ao sair da tela.
  const devLanguage = __DEV__ && typeof params.lang === "string" ? params.lang : null;
  const requestedMode = parseMode(params.mode);

  const [items, setItems] = useState<RoundItem[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTests, setCompletedTests] = useState(0);
  // Viewport da rolagem, para a questão visual se dimensionar e caber sem rolar.
  const [viewport, setViewport] = useState<LayoutRectangle | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [milestone, setMilestone] = useState<string | null>(null);
  // Entre a resposta confirmada e a questão seguinte na tela (150 ms): o
  // botão fica travado para um toque duplo não responder duas vezes.
  const [transitioning, setTransitioning] = useState(false);

  // O anúncio começa a carregar assim que o teste abre, então já está pronto
  // quando o usuário chega na última questão — sem espera na hora de mostrar.
  // Aqui só carrega o anúncio; quem mostra é `/finishing`, ao fim do teste.
  useGatedInterstitial({ completedTests });

  const scrollRef = useRef<ScrollView>(null);
  const modeRef = useRef<TestMode>(DEFAULT_MODE);
  const ageRef = useRef<string | undefined>(undefined);
  const pausedRef = useRef(false);
  // Trava síncrona do "Ver meu resultado": dois toques no mesmo quadro passam
  // pelo `transitioning`, que só muda no render seguinte, e gravariam o
  // resultado duas vezes no histórico.
  const finishingRef = useRef(false);

  // A questão atual sai para a esquerda apagando e a próxima entra da direita.
  const slide = useSharedValue(0);
  const fade = useSharedValue(1);
  const slideStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateX: slide.value }],
  }));

  // Tempo de cada resposta só conta com o app em primeiro plano e sem a folha
  // de pausa aberta: a duração gravada é tempo respondendo.
  const [timer] = useState(() => createActiveTimer());
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        if (!pausedRef.current) timer.foreground();
      } else {
        timer.background();
      }
    });
    return () => subscription.remove();
  }, [timer]);

  useEffect(() => {
    if (!devLanguage) return;
    const previous = i18n.language;
    i18n.changeLanguage(devLanguage).catch((error) => console.error("Error switching language:", error));
    return () => {
      i18n.changeLanguage(previous).catch((error) => console.error("Error restoring language:", error));
    };
  }, [devLanguage, i18n]);

  useEffect(() => {
    let active = true;

    // Um link para /test com a tela já aberta troca só os parâmetros, sem
    // remontar: a rodada nova começa do zero, não na posição da anterior.
    setIndex(0);
    setAnswers([]);
    setSelected(null);
    setTransitioning(false);
    finishingRef.current = false;

    const bootstrap = async () => {
      if (devMode === "single") {
        const item = devQuestionId ? buildSingleItem(devQuestionId) : null;
        if (!item && __DEV__) console.warn(`[test] no question with id "${devQuestionId}"`);
        setItems(item ? [item] : []);
        setLoading(false);
        timer.reset();
        return;
      }

      const [progress, userData, history, usage] = await Promise.all([
        storage.getItem("testProgress"),
        storage.getItem("userData"),
        storage.getItem("testHistory"),
        storage.getItem("itemUsage"),
      ]);
      if (!active) return;

      setCompletedTests(history?.length ?? 0);

      if (devMode === "patterns") {
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
  }, [storage, devMode, devQuestionId, requestedMode, timer]);

  const current = items[index];
  const total = items.length;
  const questionData = useMemo(
    () => (current ? getQuestionData(current.question.id, current.optionOrder) : null),
    [current, getQuestionData]
  );

  // Sair da tela: para a Home, de onde o teste foi aberto. O progresso já
  // está gravado a cada resposta confirmada.
  const leave = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, []);

  // O X e o voltar do sistema param no mesmo lugar: a folha de pausa. As
  // rodadas de conferência não gravam nada, então saem direto.
  const requestPause = useCallback(() => {
    if (devMode) {
      leave();
      return;
    }
    pausedRef.current = true;
    timer.background();
    setPaused(true);
  }, [devMode, leave, timer]);

  const resume = () => {
    pausedRef.current = false;
    timer.foreground();
    setPaused(false);
  };

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        requestPause();
        return true;
      });
      return () => subscription.remove();
    }, [requestPause])
  );

  const describeMilestone = (found: Milestone): string => {
    if (found.kind === "start") return t("test.milestones.start");
    if (found.last) return t("test.milestones.blockLast", { done: found.done, total: found.of });
    if (found.done === 1) return t("test.milestones.blockOne", { total: found.of });
    return t("test.milestones.block", { done: found.done, total: found.of });
  };

  const finish = async (finalAnswers: Answer[]) => {
    if (devMode === "single") {
      leave();
      return;
    }

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
    if (!devMode) {
      const existing = (await storage.getItem("testHistory")) ?? [];
      await storage.setItem("testHistory", [entry, ...existing]);
      await storage.removeItem("testProgress");
    }

    // A rodada de conferência vai direto ao resultado, sem anúncio.
    if (devMode) {
      router.replace({ pathname: "/results", params: { entry: JSON.stringify(entry) } });
      return;
    }

    // O resultado já está salvo no histórico neste ponto; `/finishing` mostra
    // o anúncio, se houver, e segue para o resultado. Se o anúncio falhar ou
    // o usuário matar o app durante ele, nada se perde. (A vibração de
    // conclusão já sai do botão, `haptic="confirm"`.)
    if (__DEV__) console.log("[finish] last answer");
    router.replace({
      pathname: "/finishing",
      params: { entry: JSON.stringify(entry), completed: String(completedTests) },
    });
  };

  // Segunda metade da troca de questão, depois de a atual ter sumido: mostra
  // a próxima entrando da direita e, se for um marco, o chip.
  const advanceTo = (nextIndex: number) => {
    setIndex(nextIndex);
    setSelected(null);
    setTransitioning(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    slide.value = withSpring(0, motion.defaultSpatial);
    fade.value = withSpring(1, motion.fastEffects);

    const found = milestoneAt(nextIndex, total);
    if (found) setMilestone(describeMilestone(found));
  };

  const handleConfirm = async () => {
    if (selected === null || !current || !questionData || transitioning || finishingRef.current) return;

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

    if (nextIndex >= total) {
      finishingRef.current = true;
      setTransitioning(true);
      await finish(nextAnswers);
      return;
    }

    setTransitioning(true);
    fade.value = withTiming(0, { duration: motion.durations.exit });
    slide.value = withTiming(-SLIDE, { duration: motion.durations.exit }, () => {
      // Já na UI: a próxima começa fora, à direita, antes de o React trocá-la.
      slide.value = SLIDE;
      runOnJS(advanceTo)(nextIndex);
    });

    if (devMode) return;

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
      <View style={[styles.centered, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  if (!current || !questionData) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background, paddingTop: insets.top }]}>
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
  const isLast = index + 1 === total;
  const category = current.question.category;
  const categoryColor = colors.category[category];

  // Nas últimas cinco o contador vira contagem regressiva (P2); o rótulo de
  // acessibilidade continua dizendo a posição completa.
  const remaining = remainingAfter(index, total);
  const counter = !inCountdown(index, total)
    ? t("test.counter", { current: index + 1, total })
    : remaining === 0
      ? t("test.lastQuestion")
      : remaining === 1
        ? t("test.remainingOne")
        : t("test.remaining", { count: remaining });

  return (
    <View style={[styles.flex, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <TopBar
        leading={{ icon: "close", label: t("test.pause.open"), onPress: requestPause }}
        accessory={
          <ThemedText
            variant="captionStrong"
            tone="muted"
            style={styles.counter}
            accessibilityLabel={t("test.counterA11y", { current: index + 1, total })}
          >
            {counter}
          </ThemedText>
        }
      >
        <SegmentedProgress
          total={total}
          answered={index}
          style={styles.progress}
        />
      </TopBar>

      <Animated.View style={[styles.flex, slideStyle]}>
        {/* Linha da categoria: ícone e nome na cor da área; na questão visual
            traz também a instrução e o botão de ampliar. O chip de marco
            aparece por cima dela, sem mexer na altura. */}
        <View style={[styles.categoryRow, { paddingHorizontal: spacing.xl }]}>
          <Ionicons
            name={CATEGORY_ICONS[category]}
            size={16}
            color={categoryColor}
          />
          <ThemedText
            variant="captionStrong"
            color={categoryColor}
            numberOfLines={2}
            style={styles.categoryText}
          >
            {t(`categories.${category}`)}
            {isImage && (
              <ThemedText
                variant="caption"
                tone="muted"
              >
                {` · ${t("questions.patterns.prompt")}`}
              </ThemedText>
            )}
          </ThemedText>
          {isImage && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("questions.patterns.zoom")}
              hitSlop={8}
              onPress={() => setZoomed(true)}
              style={({ pressed }) => [
                styles.zoomButton,
                { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill },
                pressed && { opacity: 0.6 },
              ]}
            >
              <Ionicons
                name="expand-outline"
                size={18}
                color={colors.text}
              />
            </Pressable>
          )}
          {/* Cobre o ícone e o nome da área; na questão visual para antes do
              botão de ampliar, que continua à vista e tocável. */}
          <MilestoneChip
            label={milestone}
            onHidden={() => setMilestone(null)}
            style={{ left: spacing.xl, right: spacing.xl + (isImage ? ZOOM_BUTTON + 8 : 0) }}
          />
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
              zoomed={zoomed}
              onZoomChange={setZoomed}
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
                {questionData.options.map((option, optionIndex) => (
                  <OptionCard
                    key={optionIndex}
                    letter={LETTERS[optionIndex]}
                    label={option}
                    selected={selected === optionIndex}
                    onPress={() => setSelected(optionIndex)}
                  />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </Animated.View>

      <View style={[styles.footer, { paddingHorizontal: spacing.xl }]}>
        <Button
          block
          size="large"
          haptic="confirm"
          title={isLast ? t("test.finish") : t("test.confirm")}
          onPress={handleConfirm}
          disabled={selected === null || transitioning}
        />
      </View>

      {/* Abaixo do botão, nunca entre ele e as alternativas (decisão D2). Um
          só por tela: não depende da questão, então não é recriado a cada
          resposta. */}
      <AdSlot placement="test-bottom" />

      <PauseSheet
        visible={paused}
        onResume={resume}
        onLeave={() => {
          setPaused(false);
          leave();
        }}
      />
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
  progress: {
    alignSelf: "stretch",
    marginLeft: 4,
    marginRight: 12,
  },
  counter: {
    // O X fica a 4 dp da borda; o contador alinha com a margem do conteúdo.
    paddingRight: 20,
    fontVariant: ["tabular-nums"],
  },
  categoryRow: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 4,
    marginBottom: 12,
  },
  categoryText: {
    flexShrink: 1,
  },
  zoomButton: {
    width: ZOOM_BUTTON,
    height: ZOOM_BUTTON,
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  prompt: {
    marginBottom: 20,
  },
  options: {
    gap: 10,
  },
  footer: {
    paddingTop: 12,
  },
});
