import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedText } from "@/components/ThemedText";
import { GridLoader } from "@/components/ui/GridLoader";
import { Screen } from "@/components/ui/Screen";
import { useAppTheme } from "@/context/ThemeContext";
import { useGatedInterstitial } from "@/hooks/useGatedInterstitial";
import type { QuestionCategory } from "@/types";

/** As cinco áreas, na ordem em que aparecem marcadas. */
const AREAS: QuestionCategory[] = ["patterns", "matrix", "similarities", "vocabulary", "comprehension"];
/** Uma área marcada a cada 350 ms: as cinco em ~1,8 s. */
const AREA_STEP_MS = 350;
/** Quando a tela entrega para o anúncio (ou direto para o resultado). */
const LEAVE_AFTER_MS = 2000;

/**
 * Momento de conclusão, entre a última resposta e o resultado.
 *
 * O resultado já está salvo quando esta tela abre (o teste salva antes de
 * navegar); aqui nada é gravado. Mostra "Teste concluído!", o 3×3 da marca
 * como espera e as cinco áreas sendo marcadas, sem banner e sem voltar. Aos
 * ~2 s mostra o intersticial pré-carregado, se estiver pronto e liberado, e
 * vai para o resultado quando ele fecha; sem anúncio, vai direto. Nunca
 * depois de o resultado aparecer.
 */
export default function FinishingScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useAppTheme();
  const params = useLocalSearchParams<{ entry?: string; completed?: string }>();
  const { run, willShow } = useGatedInterstitial({ completedTests: Number(params.completed) || 0 });
  const [checked, setChecked] = useState(0);
  // Decidido uma vez, na abertura: a linha não pode aparecer e sumir.
  const [adNotice] = useState(willShow);
  const entry = useRef(params.entry);

  useEffect(() => {
    if (__DEV__) console.log("[finishing] shown");
    // Sem volta: o teste acabou e o resultado vem em seguida.
    const back = BackHandler.addEventListener("hardwareBackPress", () => true);
    const tick = setInterval(() => setChecked((count) => Math.min(count + 1, AREAS.length)), AREA_STEP_MS);
    const leave = setTimeout(() => {
      if (__DEV__) console.log(`[finishing] leaving ad=${willShow()}`);
      run(() => router.replace({ pathname: "/results", params: { entry: entry.current } }));
    }, LEAVE_AFTER_MS);
    return () => {
      back.remove();
      clearInterval(tick);
      clearTimeout(leave);
    };
    // Uma vez por abertura; `run` e `willShow` leem o estado do anúncio na hora.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen
      glow
      insetTop
      contentStyle={styles.center}
    >
      <GridLoader size={72} />

      <ThemedText
        variant="heading"
        center
        accessibilityRole="header"
        accessibilityLiveRegion="polite"
        style={{ marginTop: spacing.xl }}
      >
        {t("finishing.title")}
      </ThemedText>

      <View style={[styles.areas, { marginTop: spacing.lg, gap: spacing.sm }]}>
        {AREAS.map((area, index) => {
          const done = index < checked;
          return (
            <View
              key={area}
              style={[styles.area, { gap: spacing.sm }]}
            >
              <Ionicons
                name={done ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={done ? colors.success : colors.textFaint}
              />
              <ThemedText tone={done ? "default" : "muted"}>{t(`categories.${area}`)}</ThemedText>
            </View>
          );
        })}
      </View>

      {adNotice && (
        <ThemedText
          variant="caption"
          tone="muted"
          center
          style={{ marginTop: spacing.xl }}
        >
          {t("finishing.adNotice")}
        </ThemedText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  areas: {
    alignSelf: "center",
  },
  area: {
    flexDirection: "row",
    alignItems: "center",
  },
});
