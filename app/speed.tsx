import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState, BackHandler, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { SpeedGlyph } from "@/components/ui/SpeedGlyph";
import { useAppTheme } from "@/context/ThemeContext";
import { useStorage } from "@/hooks/useStorage";
import type { HistoryItem } from "@/types/storage";
import * as haptics from "@/utils/haptics";
import { mulberry32 } from "@/utils/scoring/random";
import { PRACTICE_PAIRS, SPEED_DURATION_MS, makePair, speedScore, type SpeedPair } from "@/utils/speed";

type Phase = "offer" | "practice" | "ready" | "run";

/** Quanto o aviso de acerto/erro do treino fica na tela. */
const FEEDBACK_MS = 600;
const GLYPH_SIZE = 40;

const newSeed = () => Math.floor(Math.random() * 2 ** 31);

/**
 * Tarefa de velocidade opcional, entre a última resposta do Normal ou do
 * Detalhado e o momento de conclusão (pesquisa scoring-modes §3, D7).
 *
 * Oferta → 4 pares de treino, sem tempo e com retorno → 90 s valendo, um par
 * atrás do outro, acertos menos erros. O resultado do teste já está salvo
 * quando esta tela abre; aqui só se acrescenta `speed` a ele. Se o app sair da
 * tela durante os 90 s, o bloco é descartado e recomeça com pares novos: um
 * bloco interrompido não mede velocidade. Sem banner: é uma tarefa com tempo.
 * Pular, ou voltar, segue para a conclusão sem `speed`.
 */
export default function SpeedScreen() {
  const { t } = useTranslation();
  const { colors, spacing, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const storage = useStorage();
  const params = useLocalSearchParams<{ entry?: string; completed?: string }>();

  const [phase, setPhase] = useState<Phase>("offer");
  const [pair, setPair] = useState<SpeedPair | null>(null);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [feedback, setFeedback] = useState<"right" | "wrong" | null>(null);
  const [restarted, setRestarted] = useState(false);
  const [remaining, setRemaining] = useState(SPEED_DURATION_MS);
  const rng = useRef(mulberry32(newSeed()));
  const counts = useRef({ correct: 0, wrong: 0 });
  const deadline = useRef(0);
  const leaving = useRef(false);

  const goOn = useCallback(
    (entry: string | undefined) => {
      if (leaving.current) return;
      leaving.current = true;
      router.replace({ pathname: "/finishing", params: { entry, completed: params.completed } });
    },
    [params.completed]
  );

  const skip = useCallback(() => goOn(params.entry), [goOn, params.entry]);

  const finishBlock = useCallback(async () => {
    const { correct, wrong } = counts.current;
    const speed = { correct, wrong, score: speedScore(correct, wrong), seconds: SPEED_DURATION_MS / 1000 };
    if (__DEV__) console.log(`[speed] stored ${correct}-${wrong}`);
    let entry = params.entry;
    try {
      const parsed = JSON.parse(params.entry ?? "") as HistoryItem;
      const updated: HistoryItem = { ...parsed, speed };
      const history = (await storage.getItem("testHistory")) ?? [];
      await storage.setItem(
        "testHistory",
        history.map((item) => (item.date === parsed.date ? updated : item))
      );
      entry = JSON.stringify(updated);
    } catch (error) {
      console.error("Error saving speed:", error);
    }
    goOn(entry);
  }, [goOn, params.entry, storage]);

  // Voltar não desfaz o teste: equivale a pular.
  useEffect(() => {
    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      skip();
      return true;
    });
    return () => back.remove();
  }, [skip]);

  // O relógio do bloco: conta pelo prazo, não por ticks, para não atrasar.
  useEffect(() => {
    if (phase !== "run") return;
    const timer = setInterval(() => {
      const left = Math.max(0, deadline.current - Date.now());
      setRemaining(left);
      if (left === 0) {
        clearInterval(timer);
        finishBlock();
      }
    }, 250);
    return () => clearInterval(timer);
  }, [phase, finishBlock]);

  // App fora da tela no meio do bloco: descarta e volta para "pronto".
  useEffect(() => {
    if (phase !== "run") return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") return;
      counts.current = { correct: 0, wrong: 0 };
      rng.current = mulberry32(newSeed());
      setRemaining(SPEED_DURATION_MS);
      setRestarted(true);
      setPhase("ready");
      if (__DEV__) console.log("[speed] restarted");
    });
    return () => subscription.remove();
  }, [phase]);

  const startPractice = () => {
    setPracticeIndex(0);
    setPair(makePair(rng.current));
    setPhase("practice");
  };

  const startBlock = () => {
    counts.current = { correct: 0, wrong: 0 };
    deadline.current = Date.now() + SPEED_DURATION_MS;
    setRemaining(SPEED_DURATION_MS);
    setRestarted(false);
    setPair(makePair(rng.current));
    setPhase("run");
  };

  const answer = (same: boolean) => {
    if (!pair || feedback) return;
    // Depois dos 90 s, um toque que chega antes da troca de tela não conta.
    if (phase === "run" && Date.now() >= deadline.current) return;
    haptics.tick();
    const right = same === pair.same;

    if (phase === "run") {
      if (right) counts.current.correct += 1;
      else counts.current.wrong += 1;
      setPair(makePair(rng.current));
      return;
    }

    // Treino: mostra se acertou e segue; não conta.
    setFeedback(right ? "right" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      if (practiceIndex + 1 >= PRACTICE_PAIRS) {
        setPhase("ready");
        return;
      }
      setPracticeIndex((index) => index + 1);
      setPair(makePair(rng.current));
    }, FEEDBACK_MS);
  };

  // Número do par na tela: no bloco, quantos já foram respondidos; no treino,
  // a posição dele.
  const serial = phase === "run" ? counts.current.correct + counts.current.wrong : practiceIndex;

  // Só no dev: o par e a resposta no logcat, para o script de conferência
  // responder sem ler a tela (o relógio redesenha a cada 250 ms e o
  // uiautomator nunca a encontra parada).
  useEffect(() => {
    if (__DEV__ && pair && (phase === "run" || phase === "practice")) {
      console.log(`[speed] pair ${serial} ${pair.same ? "same" : "different"}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair]);

  if (phase === "offer" || phase === "ready") {
    const offer = phase === "offer";
    return (
      <Screen
        glow
        insetTop
        contentStyle={styles.center}
      >
        <ThemedText
          variant="overline"
          tone="primary"
          center
        >
          {t("speed.overline")}
        </ThemedText>
        <ThemedText
          variant="heading"
          center
          accessibilityRole="header"
          style={{ marginTop: spacing.sm }}
        >
          {offer ? t("speed.offer.title") : t("speed.ready.title")}
        </ThemedText>
        {restarted && (
          <ThemedText
            tone="accent"
            center
            accessibilityLiveRegion="polite"
            style={{ marginTop: spacing.md }}
          >
            {t("speed.restarted")}
          </ThemedText>
        )}
        <ThemedText
          tone="muted"
          center
          style={{ marginTop: spacing.md }}
        >
          {offer ? t("speed.offer.body") : t("speed.ready.body")}
        </ThemedText>
        <View style={[styles.actions, { marginTop: spacing.xl, gap: spacing.sm }]}>
          <Button
            title={offer ? t("speed.offer.start") : t("speed.ready.start")}
            onPress={offer ? startPractice : startBlock}
            size="large"
            block
          />
          <Button
            title={t("speed.skip")}
            onPress={skip}
            variant="ghost"
            block
          />
        </View>
      </Screen>
    );
  }

  const seconds = Math.ceil(remaining / 1000);
  const progress = remaining / SPEED_DURATION_MS;

  return (
    <Screen insetTop>
      <View style={{ paddingTop: spacing.lg, gap: spacing.sm }}>
        {phase === "run" ? (
          <>
            <View
              style={[styles.track, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}
              accessibilityRole="progressbar"
              accessibilityLabel={t("speed.timeLeft", { seconds })}
            >
              <View
                style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: colors.primary, borderRadius: radius.pill }]}
              />
            </View>
            <ThemedText
              variant="captionStrong"
              tone="muted"
              center
            >
              {t("speed.timeLeft", { seconds })}
            </ThemedText>
          </>
        ) : (
          <ThemedText
            variant="captionStrong"
            tone="muted"
            center
          >
            {t("speed.practice", { current: practiceIndex + 1, total: PRACTICE_PAIRS })}
          </ThemedText>
        )}
      </View>

      <View style={styles.pairArea}>
        <ThemedText
          variant="subheading"
          center
        >
          {t("speed.question")}
        </ThemedText>
        {pair && (
          <View
            // Só no dev: o número do par e a resposta, para o script de
            // conferência saber que o par mudou e responder certo ou errado.
            testID={__DEV__ ? `speed-pair-${serial}-${pair.same ? "same" : "different"}` : undefined}
            style={[styles.pair, { marginTop: spacing.lg, gap: spacing.md }]}
          >
            {[pair.left, pair.right].map((row, side) => (
              <View
                key={side}
                style={[
                  styles.row,
                  { backgroundColor: colors.paper, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
                ]}
              >
                {row.map((glyph, index) => (
                  <SpeedGlyph
                    key={index}
                    glyph={glyph}
                    size={GLYPH_SIZE}
                    color={colors.onPaper}
                  />
                ))}
              </View>
            ))}
          </View>
        )}
        <ThemedText
          variant="bodyStrong"
          tone={feedback === "right" ? "success" : "accent"}
          center
          accessibilityLiveRegion="polite"
          style={[styles.feedback, { marginTop: spacing.md }]}
        >
          {feedback === "right" ? t("speed.right") : feedback === "wrong" ? t("speed.wrong") : ""}
        </ThemedText>
      </View>

      {/* Sem banner, ninguém reserva a barra de navegação: o recuo é daqui. */}
      <View style={[styles.answers, { gap: spacing.md, paddingBottom: insets.bottom }]}>
        <Button
          title={t("speed.same")}
          onPress={() => answer(true)}
          variant="secondary"
          size="large"
          haptic="none"
          style={styles.answer}
        />
        <Button
          title={t("speed.different")}
          onPress={() => answer(false)}
          variant="secondary"
          size="large"
          haptic="none"
          style={styles.answer}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    alignSelf: "stretch",
  },
  track: {
    height: 8,
    overflow: "hidden",
  },
  fill: {
    height: 8,
  },
  pairArea: {
    flex: 1,
    justifyContent: "center",
  },
  pair: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  feedback: {
    minHeight: 24,
  },
  answers: {
    flexDirection: "row",
  },
  answer: {
    flex: 1,
  },
});
