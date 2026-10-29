import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";
import { isModeAvailable } from "@/hooks/useQuestionSelection";
import type { TestMode } from "@/types";
import { MODES, roundLength } from "@/utils/scoring/blueprints";
import * as haptics from "@/utils/haptics";

interface ModeChooserProps {
  value: TestMode;
  onChange: (mode: TestMode) => void;
}

/**
 * Fica no rodapé fixo da Home: o texto cresce com a fonte do sistema só até
 * 1,3×. A 2,0× o rodapé inteiro tomava ~80% da tela do A15 e cortava
 * "Detalh…", "40 ques…".
 */
const FOOTER_TEXT_MAX = 1.3;

/**
 * Rápido 20 · Normal 40 · Detalhado 90, como um controle segmentado, com uma
 * linha sobre o modo escolhido embaixo. Um modo que o banco não comporta
 * aparece desligado.
 */
export function ModeChooser({ value, onChange }: ModeChooserProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useAppTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      <View
        accessibilityRole="radiogroup"
        style={[styles.track, { backgroundColor: colors.surfaceAlt, borderRadius: radius.lg, padding: 4, gap: 4 }]}
      >
        {MODES.map((mode) => {
          const selected = mode === value;
          const available = isModeAvailable(mode);
          return (
            <Pressable
              key={mode}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: !available }}
              accessibilityLabel={t(`home.modes.${mode}.a11y`, { count: roundLength(mode) })}
              disabled={!available}
              onPress={() => {
                if (selected) return;
                haptics.tick();
                onChange(mode);
              }}
              style={[
                styles.segment,
                { borderRadius: radius.md, paddingVertical: spacing.sm },
                selected && { backgroundColor: colors.surface },
                !available && styles.disabled,
              ]}
            >
              <ThemedText
                variant="captionStrong"
                tone={selected ? "default" : "muted"}
                center
                numberOfLines={1}
                maxFontSizeMultiplier={FOOTER_TEXT_MAX}
              >
                {t(`home.modes.${mode}.label`)}
              </ThemedText>
              <ThemedText
                variant="overline"
                tone={selected ? "primary" : "faint"}
                center
                numberOfLines={1}
                maxFontSizeMultiplier={FOOTER_TEXT_MAX}
                style={styles.count}
              >
                {t("home.modes.count", { count: roundLength(mode) })}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      <ThemedText
        variant="caption"
        tone="muted"
        center
        maxFontSizeMultiplier={FOOTER_TEXT_MAX}
      >
        {t(`home.modes.${value}.description`)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
  },
  segment: {
    flex: 1,
    alignItems: "center",
  },
  count: {
    letterSpacing: 0.4,
  },
  disabled: {
    opacity: 0.4,
  },
});
