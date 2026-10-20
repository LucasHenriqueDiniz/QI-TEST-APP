import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { patternImages } from "@/assets/questions/patterns";
import { ThemedText } from "@/components/ThemedText";
import { FigureOption, cellHeightFor, figureWidthFor } from "@/components/ui/FigureOption";
import { useAppTheme } from "@/context/ThemeContext";

/**
 * Proporção largura/altura dos SVGs. As 30 matrizes têm `viewBox="0 0 500 335"`
 * e as 120 alternativas `viewBox="0 0 173 105"` (conferido arquivo a arquivo em
 * 2026-10-19). Os arquivos não trazem width/height, então cada figura
 * preenche a caixa que recebe mantendo a proporção — a caixa é que precisa
 * vir na proporção certa para não sobrar faixa vazia.
 */
const MATRIX_ASPECT = 500 / 335;
const OPTION_ASPECT = 173 / 105;

/**
 * Altura da figura da matriz, em dp. Abaixo de 140 o traço fica ilegível;
 * acima de 220 a sobra não ajuda a ler e come o espaço das alternativas.
 */
const MATRIX_MIN_HEIGHT = 140;
const MATRIX_MAX_HEIGHT = 220;

const CARD_BORDER = 1;
const CARD_PAD = 8;
const CARD_GRID_GAP = 12;
const GRID_GAP = 10;
/** Folga entre a grade e o fio do rodapé, para as células não encostarem nele. */
const BOTTOM_GAP = 8;
const LETTERS = ["A", "B", "C", "D"];

interface PatternQuestionProps {
  /** Chave no formato `p12`. */
  questionKey: string;
  selected: number | null;
  onSelect: (index: number) => void;
  /** Largura disponível, em dp. Sem ela, a da janela menos as margens da tela. */
  width?: number;
  /**
   * Altura em que tudo precisa caber sem rolar, em dp (o viewport medido com
   * `onLayout`). Sem ela a matriz usa o máximo que a largura permite.
   */
  availableHeight?: number;
  /**
   * Modal de ampliação controlado de fora (o botão fica na linha da categoria,
   * na tela do teste). Sem estes dois, o componente cuida do próprio estado.
   */
  zoomed?: boolean;
  onZoomChange?: (zoomed: boolean) => void;
}

type PatternKey = keyof typeof patternImages;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Questão de matriz visual: enunciado em SVG e quatro alternativas em SVG.
 *
 * A grade de alternativas tem altura fixa pela largura; a matriz recebe o que
 * sobra do viewport, entre 140 e 220 dp, para a tela inteira caber sem rolar.
 * A instrução e o botão de ampliar não ficam aqui: as matrizes desenham até a
 * borda do viewBox, e um botão sobreposto esconderia um canto do estímulo —
 * a tela os põe na linha da categoria, acima deste componente. Tocar o
 * cartão também amplia.
 */
export function PatternQuestion({
  questionKey,
  selected,
  onSelect,
  width,
  availableHeight,
  zoomed: zoomedProp,
  onZoomChange,
}: PatternQuestionProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useAppTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [zoomedState, setZoomedState] = useState(false);
  const zoomed = zoomedProp ?? zoomedState;
  const setZoomed = (next: boolean) => {
    setZoomedState(next);
    onZoomChange?.(next);
  };

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

  const contentWidth = width ?? windowWidth - spacing.xl * 2;

  const cellWidth = Math.floor((contentWidth - GRID_GAP) / 2);
  const optionWidth = figureWidthFor(cellWidth);
  const optionHeight = Math.floor(optionWidth / OPTION_ASPECT);
  const cellHeight = cellHeightFor(optionHeight);
  const gridHeight = 2 * cellHeight + GRID_GAP;

  const matrixByWidth = (contentWidth - 2 * (CARD_PAD + CARD_BORDER)) / MATRIX_ASPECT;
  const matrixByHeight =
    availableHeight === undefined
      ? MATRIX_MAX_HEIGHT
      : availableHeight - 2 * (CARD_PAD + CARD_BORDER) - CARD_GRID_GAP - gridHeight - BOTTOM_GAP;
  const matrixHeight = Math.floor(Math.min(matrixByWidth, clamp(matrixByHeight, MATRIX_MIN_HEIGHT, MATRIX_MAX_HEIGHT)));
  const matrixWidth = Math.floor(matrixHeight * MATRIX_ASPECT);

  const zoomWidth = windowWidth - spacing.md * 2;

  return (
    <View>
      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel={t("questions.patterns.zoom")}
        onPress={() => setZoomed(true)}
        style={[styles.card, { backgroundColor: colors.paper, borderRadius: radius.lg, borderColor: colors.border }]}
      >
        <Prompt
          width={matrixWidth}
          height={matrixHeight}
        />
      </Pressable>

      <View style={styles.grid}>
        {Options.map((Option, index) => (
          <FigureOption
            key={index}
            letter={LETTERS[index]}
            selected={selected === index}
            onPress={() => onSelect(index)}
            accessibilityLabel={t("questions.patterns.option", { number: index + 1 })}
            width={cellWidth}
            height={cellHeight}
          >
            <Option
              width={optionWidth}
              height={optionHeight}
            />
          </FigureOption>
        ))}
      </View>

      <Modal
        visible={zoomed}
        transparent
        animationType="fade"
        onRequestClose={() => setZoomed(false)}
      >
        <Pressable
          style={[styles.zoomOverlay, { backgroundColor: colors.overlay }]}
          onPress={() => setZoomed(false)}
        >
          {/* A legenda vai dentro do cartão: sobre o véu, que é translúcido,
              nenhuma cor do tema lê bem nos dois modos. */}
          <View style={[styles.zoomCard, { backgroundColor: colors.paper, borderRadius: radius.xl }]}>
            <Prompt
              width={zoomWidth - 2 * spacing.lg}
              height={(zoomWidth - 2 * spacing.lg) / MATRIX_ASPECT}
            />
            <ThemedText
              variant="caption"
              color={colors.onPaper}
              center
            >
              {t("common.tapToClose")}
            </ThemedText>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: CARD_PAD,
    borderWidth: CARD_BORDER,
  },
  grid: {
    marginTop: CARD_GRID_GAP,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  zoomOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 12,
  },
  zoomCard: {
    padding: 16,
    gap: 12,
  },
});
