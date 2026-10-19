import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AD_UNITS } from "@/constants/ads";
import { useAds } from "@/context/AdsContext";
import { useAppTheme } from "@/context/ThemeContext";

interface AdSlotProps {
  /** Identifica o ponto de inserção nos logs. */
  placement: string;
}

/** Faixa sem nada clicável entre a ação principal e o anúncio, em dp. */
const GAP_HEIGHT = 24;

/**
 * Altura mínima reservada para o banner, em dp. O adaptativo ancorado varia de
 * 50 a 90 dp conforme a largura da tela; num celular comum fica entre 50 e 60.
 */
const MIN_BANNER_HEIGHT = 60;

/**
 * Maior altura de banner já medida nesta execução. Vive no módulo, não no
 * estado, para que a próxima tela já reserve a altura certa antes de o anúncio
 * dela carregar. Guarda o máximo, não a última medida: se a altura variar
 * entre requisições, o espaço nunca encolhe de volta.
 */
let largestBannerHeight = MIN_BANNER_HEIGHT;

/**
 * Banner adaptativo ancorado com espaço fixo (decisão D2 da arquitetura).
 *
 * Reserva `max(60 dp, maior banner já medido)` sempre: antes de o SDK
 * inicializar, enquanto o anúncio carrega, quando a requisição falha e
 * offline. A versão anterior colapsava a 0 até o anúncio chegar, para a faixa
 * não ficar vazia quando a requisição falhasse; o custo era o layout inteiro
 * pular quando o banner aparecia, e o AdMob pede um espaço fixo que não
 * desloque o conteúdo. Uma faixa vazia na cor do fundo é o preço — e é
 * invisível: nada de texto ou placeholder nela.
 *
 * Acima do banner há 24 dp sem nada clicável e um fio divisor, para o anúncio
 * nunca encostar no botão principal (política de anúncios adjacentes a ações).
 * O componente é ancorado na borda inferior, acima do inset do sistema; fica
 * fora de qualquer conteúdo que rola e existe uma vez por tela.
 */
export function AdSlot({ placement }: AdSlotProps) {
  const { ready } = useAds();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [reservedHeight, setReservedHeight] = useState(largestBannerHeight);

  // Chamado no carregamento e em cada mudança de tamanho. Só cresce: outra
  // tela pode já ter medido um banner maior enquanto esta estava montada.
  const reserve = ({ width, height }: { width: number; height: number }) => {
    largestBannerHeight = Math.max(largestBannerHeight, Math.ceil(height));
    setReservedHeight((current) => Math.max(current, largestBannerHeight));
    console.log(`Ad loaded at ${placement}: ${width}x${height} dp, reserving ${largestBannerHeight} dp`);
  };

  return (
    <View style={{ backgroundColor: colors.background, paddingBottom: insets.bottom }}>
      <View
        pointerEvents="none"
        style={[styles.gap, { borderBottomColor: colors.border }]}
      />
      <View style={[styles.banner, { height: reservedHeight }]}>
        {ready && (
          <BannerAd
            unitId={AD_UNITS.banner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            onAdLoaded={reserve}
            onSizeChange={reserve}
            onAdFailedToLoad={(error) => {
              console.error(`Ad failed at ${placement}:`, error);
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: {
    height: GAP_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  banner: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
