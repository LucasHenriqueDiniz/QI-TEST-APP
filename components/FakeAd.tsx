import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useStorage } from "@/hooks/useStorage";

export function FakeAd() {
  const [hideAds, setHideAds] = React.useState(false);
  const storage = useStorage();

  React.useEffect(() => {
    checkAdStatus();
  }, []);

  const checkAdStatus = async () => {
    const purchases = await storage.getItem("userPurchases");
    setHideAds(!!purchases?.hideAds);
  };

  if (hideAds) return null;

  return (
    <View style={[styles.container]}>
      <ThemedText style={styles.text}>Ad Banner Here</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  text: {
    color: "#000",
    fontSize: 16,
  },
});
