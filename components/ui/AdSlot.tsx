import React from "react";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";
import { ThemedText } from "@/components/ThemedText";

/** Alturas padrão do AdMob, em dp. */
const HEIGHTS = {
  banner: 50,
  largeBanner: 100,
  mediumRectangle: 250,
} as const;

interface AdSlotProps {
  size?: keyof typeof HEIGHTS;
  /** Identifica o ponto de inserção nos logs e na futura configuração de ad units. */
  placement: string;
}

/**
 * Ponto de inserção de anúncio.
 *
 * O AdMob ainda não está integrado — este componente marca *onde* o banner
 * vai entrar sem renderizar nada em produção, para não ocupar espaço com uma
 * caixa vazia (e para não parecer um anúncio falso na revisão da Play Store).
 *
 * Para ligar: instalar `react-native-google-mobile-ads`, adicionar o plugin no
 * app.json com o App ID, e trocar o corpo abaixo por um `<BannerAd />` usando
 * `placement` para escolher a ad unit.
 */
export function AdSlot({ size = "banner", placement }: AdSlotProps) {
  const { colors, radius } = useAppTheme();

  if (!__DEV__) return null;

  return (
    <View
      style={[
        styles.placeholder,
        {
          height: HEIGHTS[size],
          borderColor: colors.border,
          borderRadius: radius.md,
        },
      ]}
      pointerEvents="none"
    >
      <ThemedText
        variant="overline"
        tone="faint"
      >
        AD · {placement}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
});
