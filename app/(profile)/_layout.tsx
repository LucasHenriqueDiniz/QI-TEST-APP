import { HeaderBackButton } from "@react-navigation/elements";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "index" }],
      })
    );
  };

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: t("profile.title"),
          headerLeft: () => (
            <HeaderBackButton
              onPress={handleBack}
              label={t("common.back")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: t("profile.settings.title"),
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.goBack()}
              label={t("common.back")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          headerTitle: t("profile.history.title"),
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => navigation.goBack()}
              label={t("common.back")}
            />
          ),
        }}
      />
    </Stack>
  );
}
