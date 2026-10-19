import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";
import * as haptics from "@/utils/haptics";

/** Altura da barra, em dp. */
export const TOP_BAR_HEIGHT = 56;
/** Lado do botão de ícone: 48 dp é o alvo de toque mínimo do Android. */
const ICON_BUTTON = 48;

export interface TopBarAction {
  icon: keyof typeof Ionicons.glyphMap;
  /** Rótulo de acessibilidade; o botão não tem texto. */
  label: string;
  onPress: () => void;
}

interface TopBarProps {
  leading?: TopBarAction;
  trailing?: TopBarAction;
  /** Título centralizado; omitido quando a tela tem um herói com o próprio título. */
  title?: string;
  /** Qualquer coisa no lugar do título (a barra de progresso do teste). */
  children?: React.ReactNode;
  /**
   * Cor dos ícones e do título. O padrão é `text`; sobre um gradiente passe
   * `onPrimary`. A barra em si é sempre transparente.
   */
  color?: string;
}

/**
 * Barra superior das telas sem cabeçalho de pilha: 56 dp, transparente, botões
 * de ícone de 48 dp nas pontas e um espaço central opcional.
 */
export function TopBar({ leading, trailing, title, children, color }: TopBarProps) {
  const { colors } = useAppTheme();
  const tint = color ?? colors.text;

  return (
    <View style={styles.bar}>
      <Slot
        action={leading}
        tint={tint}
      />
      <View style={styles.centre}>
        {children ??
          (title ? (
            <ThemedText
              variant="subheading"
              color={tint}
              numberOfLines={1}
              accessibilityRole="header"
            >
              {title}
            </ThemedText>
          ) : null)}
      </View>
      <Slot
        action={trailing}
        tint={tint}
      />
    </View>
  );
}

/** Um botão de ícone, ou um espaço do mesmo tamanho para o centro não deslocar. */
function Slot({ action, tint }: { action?: TopBarAction; tint: string }) {
  const { radius } = useAppTheme();

  if (!action) return <View style={styles.iconButton} />;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.label}
      hitSlop={4}
      onPress={() => {
        haptics.press();
        action.onPress();
      }}
      style={({ pressed }) => [styles.iconButton, { borderRadius: radius.pill }, pressed && styles.pressed]}
    >
      <Ionicons
        name={action.icon}
        size={26}
        color={tint}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: TOP_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: ICON_BUTTON,
    height: ICON_BUTTON,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
