import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title") }} />
      <Screen contentStyle={styles.content}>
        <ThemedText
          variant="heading"
          center
        >
          {t("notFound.title")}
        </ThemedText>
        <ThemedText
          variant="body"
          tone="muted"
          center
        >
          {t("notFound.message")}
        </ThemedText>
        <Button
          title={t("common.home")}
          onPress={() => router.replace("/")}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
});
