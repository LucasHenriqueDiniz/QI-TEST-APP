import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { patternImages } from "@/assets/questions/patterns";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";

interface PatternQuestionProps {
  /** Chave no formato `p12`. */
  questionKey: string;
  selected: number | null;
  onSelect: (index: number) => void;
}

type PatternKey = keyof typeof patternImages;

/** Questão de matriz visual: um enunciado em SVG e quatro alternativas em SVG. */
export function PatternQuestion({ questionKey, selected, onSelect }: PatternQuestionProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useAppTheme();
  const { width } = useWindowDimensions();
  const [zoomed, setZoomed] = useState(false);

  const slot = questionKey.replace(/^p/, "").padStart(2, "0");
  const Prompt = patternImages[`${slot}_q_01` as PatternKey];
  const Options = [1, 2, 3, 4].map((n) => patternImages[`${slot}_a_0${n}` as PatternKey]);

  if (!Prompt || Options.some((option) => !option)) {
    return (
      <ThemedText
        tone="danger"
        center
      >
        {t("test.error")}
      </ThemedText>
    );
  }

  const contentWidth = width - spacing.xl * 2;
  const optionSize = (contentWidth - spacing.md) / 2;

  return (
    <View style={styles.container}>
      <ThemedText
        variant="subheading"
        center
      >
        {t("questions.patterns.prompt")}
      </ThemedText>

      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel={t("questions.patterns.zoom")}
        onPress={() => setZoomed(true)}
        style={[styles.promptBox, { backgroundColor: colors.surface, borderRadius: radius.lg, borderColor: colors.border }]}
      >
        <Prompt
          width={contentWidth - spacing.xl}
          height={190}
        />
        <View style={[styles.zoomHint, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
          <Ionicons
            name="expand-outline"
            size={13}
            color={colors.textMuted}
          />
          <ThemedText
            variant="overline"
            tone="faint"
          >
            {t("questions.patterns.zoom").toUpperCase()}
          </ThemedText>
        </View>
      </Pressable>

      <View style={styles.grid}>
        {Options.map((Option, index) => {
          const isSelected = selected === index;

          return (
            <Pressable
              key={index}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={t("questions.patterns.option", { number: index + 1 })}
              onPress={() => onSelect(index)}
              style={({ pressed }) => [
                styles.option,
                {
                  width: optionSize,
                  height: optionSize,
                  borderRadius: radius.lg,
                  backgroundColor: isSelected ? colors.primarySoft : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.75 },
              ]}
            >
              <Option
                width="78%"
                height="78%"
              />
              {isSelected && (
                <View style={[styles.check, { backgroundColor: colors.primary }]}>
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color={colors.onPrimary}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Modal
        visible={zoomed}
        transparent
        animationType="fade"
        onRequestClose={() => setZoomed(false)}
      >
        <Pressable
          style={styles.zoomOverlay}
          onPress={() => setZoomed(false)}
        >
          <View style={[styles.zoomCard, { backgroundColor: colors.surface, borderRadius: radius.xl }]}>
            <Prompt
              width={width * 0.8}
              height={width * 0.8}
            />
          </View>
          <ThemedText
            variant="caption"
            color="#FFFFFF"
          >
            {t("common.tapToClose")}
          </ThemedText>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  promptBox: {
    alignItems: "center",
    paddingVertical: 20,
    borderWidth: 1,
  },
  zoomHint: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  check: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  zoomCard: {
    padding: 16,
  },
});
