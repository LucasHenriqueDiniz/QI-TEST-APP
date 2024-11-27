import { HeaderBackButton } from "@react-navigation/elements";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function TestLayout() {
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
          headerTitle: t("test.title"),
          headerLeft: () => (
            <HeaderBackButton
              onPress={handleBack}
              label={t("common.back")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="purchase-options"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
