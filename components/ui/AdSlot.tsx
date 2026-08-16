import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { AD_UNITS } from "@/constants/ads";
import { useAds } from "@/context/AdsContext";

interface AdSlotProps {
  /** Identifica o ponto de inserção nos logs. */
  placement: string;
}

/**
 * Banner adaptativo ancorado.
 *
 * Só ocupa espaço depois que o anúncio carrega — um contêiner de altura fixa
 * deixaria uma faixa vazia sempre que a requisição falhasse (offline, sem
 * preenchimento, consentimento negado), que é justamente quando o app precisa
 * parecer normal.
 */
export function AdSlot({ placement }: AdSlotProps) {
  const { ready } = useAds();
  const [loaded, setLoaded] = useState(false);

  if (!ready) return null;

  return (
    <View style={[styles.container, !loaded && styles.collapsed]}>
      <BannerAd
        unitId={AD_UNITS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={(error) => {
          setLoaded(false);
          console.error(`Ad failed at ${placement}:`, error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  collapsed: {
    height: 0,
    overflow: "hidden",
  },
});
