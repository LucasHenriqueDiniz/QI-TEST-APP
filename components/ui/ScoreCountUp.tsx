import React, { useEffect, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";

/**
 * Cada coluna empilha 0–9 e mais um 0 no fim: quando o dígito passa de 9, a
 * coluna rola até esse 0 extra em vez de saltar de volta ao topo. A troca
 * pelo 0 verdadeiro acontece no instante em que os dois ficam no mesmo lugar.
 */
const ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

interface ScoreCountUpProps {
  /** Número final. */
  target: number;
  /** `false` mostra o número final sem contagem (reduzir movimento, histórico, pulo). */
  animate: boolean;
  /** Espera antes de começar a contar, em ms. */
  delayMs?: number;
  /** Duração da contagem, em ms. */
  durationMs?: number;
  color: string;
}

/**
 * Posição da coluna de `place` (1, 10, 100…) para o valor contínuo `value`,
 * em linhas: 0 mostra o "0", 9.5 fica no meio entre "9" e "0".
 *
 * Funciona como um odômetro: a coluna das unidades rola o tempo todo; cada
 * coluna acima só gira quando a de baixo está passando de 9 para 0, e gira
 * junto com ela.
 */
function odometerPosition(value: number, place: number): number {
  "worklet";
  let position = value % 10;
  for (let p = 10; p <= place; p *= 10) {
    const digit = Math.floor(value / p) % 10;
    position = digit + Math.max(0, position - 9);
  }
  return position;
}

/**
 * Contagem do score como rolo de dígitos: uma coluna por dígito, 0–9
 * empilhados, movidos só com `translateY` (caminho rápido do Reanimated —
 * nenhum re-render do React e nenhum texto remedido por quadro).
 *
 * A fonte usa dígitos tabulares, então toda coluna tem a mesma largura e o
 * número não treme. Colunas à esquerda ficam invisíveis enquanto o valor ainda
 * não chega nelas ("079" nunca aparece) e o conjunto desliza para continuar
 * centralizado.
 */
export function ScoreCountUp({ target, animate, delayMs = 0, durationMs = 1200, color }: ScoreCountUpProps) {
  const { typography } = useAppTheme();
  const { fontScale } = useWindowDimensions();

  // A linha cresce com a escala de fonte do sistema até o teto da variante;
  // o rolo precisa da altura efetiva para alinhar cada dígito à janela.
  const rowHeight = typography.score.lineHeight * Math.min(fontScale, typography.score.maxFontSizeMultiplier);

  const value = useSharedValue(animate ? 0 : target);
  const places = Array.from({ length: Math.max(1, String(Math.floor(Math.abs(target))).length) }, (_, i) => 10 ** i).reverse();

  useEffect(() => {
    if (!animate) {
      cancelAnimation(value);
      value.value = target;
      return;
    }
    value.value = 0;
    value.value = withDelay(delayMs, withTiming(target, { duration: durationMs, easing: Easing.out(Easing.cubic) }));
    return () => cancelAnimation(value);
  }, [animate, delayMs, durationMs, target, value]);

  const [digitWidth, setDigitWidth] = useState(0);

  // Colunas à esquerda ainda apagadas deixam um vazio; o grupo desliza metade
  // desse vazio para o número visível continuar no centro.
  const centring = useAnimatedStyle(() => {
    let hidden = 0;
    for (const place of places) if (place > 1 && value.value < place) hidden += 1;
    return { transform: [{ translateX: (hidden * digitWidth) / 2 }] };
  });

  return (
    <Animated.View
      accessible
      accessibilityRole="text"
      accessibilityLabel={String(target)}
      style={[styles.row, centring]}
    >
      {places.map((place, index) => (
        <DigitColumn
          key={place}
          place={place}
          value={value}
          rowHeight={rowHeight}
          color={color}
          onWidth={index === 0 ? setDigitWidth : undefined}
        />
      ))}
    </Animated.View>
  );
}

interface DigitColumnProps {
  place: number;
  value: SharedValue<number>;
  rowHeight: number;
  color: string;
  onWidth?: (width: number) => void;
}

function DigitColumn({ place, value, rowHeight, color, onWidth }: DigitColumnProps) {
  const roll = useAnimatedStyle(() => ({
    transform: [{ translateY: -odometerPosition(Math.max(0, value.value), place) * rowHeight }],
    opacity: place === 1 || value.value >= place ? 1 : 0,
  }));

  return (
    <View
      style={[styles.window, { height: rowHeight }]}
      onLayout={onWidth ? (event) => onWidth(event.nativeEvent.layout.width) : undefined}
    >
      <Animated.View style={roll}>
        {ROWS.map((digit, index) => (
          <ThemedText
            key={index}
            variant="score"
            color={color}
            style={{ height: rowHeight }}
            importantForAccessibility="no"
          >
            {digit}
          </ThemedText>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  window: {
    overflow: "hidden",
  },
});
