import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/context/ThemeContext";
import { AdSlot } from "@/components/ui/AdSlot";

interface ScreenProps {
  /** Opcional para permitir uma tela vazia enquanto os dados carregam. */
  children?: React.ReactNode;
  /** Envolve o conteúdo num ScrollView. Desligue em telas que já rolam sozinhas. */
  scroll?: boolean;
  /** Brilho suave da cor de marca no topo. */
  glow?: boolean;
  /** Renderiza o slot de anúncio fixo no rodapé. */
  adPlacement?: string;
  contentStyle?: ViewStyle;
}

export function Screen({ children, scroll = false, glow = false, adPlacement, contentStyle }: ScreenProps) {
  const { colors, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  };

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[padding, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padding, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      {glow && (
        <LinearGradient
          colors={[colors.primarySoft, colors.background]}
          style={styles.glow}
          pointerEvents="none"
        />
      )}

      {body}

      {adPlacement && (
        <View style={[styles.adBar, { paddingBottom: insets.bottom || spacing.sm, paddingHorizontal: spacing.xl }]}>
          <AdSlot placement={adPlacement} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 320,
  },
  adBar: {
    paddingTop: 4,
  },
});
