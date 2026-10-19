import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Pressable, StyleSheet, View } from "react-native";
import { AboutSheet } from "@/components/AboutSheet";
import { ThemedText } from "@/components/ThemedText";
import { AgePicker } from "@/components/ui/AgePicker";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { STORE_URL } from "@/constants/app";
import { useAds } from "@/context/AdsContext";
import { ThemePreference, useAppTheme } from "@/context/ThemeContext";
import { useStorage } from "@/hooks/useStorage";

const LANGUAGES = [
  { code: "pt", label: "Português" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { colors, radius, preference, setPreference } = useAppTheme();
  const { canShowPrivacyOptions, showPrivacyOptions } = useAds();
  const storage = useStorage();

  const [age, setAge] = useState<string | undefined>(undefined);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    storage
      .getItem("userData")
      .then((data) => setAge(data?.age))
      .catch((error) => console.error("Error loading user data:", error));
  }, [storage]);

  const handleAgeSelect = async (value: number) => {
    const next = String(value);
    setAge(next);
    setPickerOpen(false);
    await storage.setItem("userData", { age: next });
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code).catch((error) => console.error("Error changing language:", error));
  };

  const confirmClear = () => {
    Alert.alert(t("settings.clear.title"), t("settings.clear.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.clear.confirm"),
        style: "destructive",
        onPress: async () => {
          await storage.removeItem("testHistory");
          await storage.removeItem("testProgress");
          Alert.alert(t("settings.clear.done"));
        },
      },
    ]);
  };

  const themeOptions: { value: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: "system", label: t("settings.theme.system"), icon: "phone-portrait-outline" },
    { value: "light", label: t("settings.theme.light"), icon: "sunny-outline" },
    { value: "dark", label: t("settings.theme.dark"), icon: "moon-outline" },
  ];

  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <Screen
      scroll
      adPlacement="settings-bottom"
      contentStyle={styles.content}
    >
      <Section title={t("settings.section.test")}>
        <Row
          icon="person-outline"
          label={t("settings.age.label")}
          value={age ? t("settings.age.value", { age }) : t("settings.age.unset")}
          onPress={() => setPickerOpen(true)}
        />
        <ThemedText
          variant="caption"
          tone="faint"
          style={styles.hint}
        >
          {t("settings.age.hint")}
        </ThemedText>
      </Section>

      <Section title={t("settings.section.appearance")}>
        <View style={styles.segmented}>
          {themeOptions.map((option) => {
            const active = preference === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => setPreference(option.value)}
                style={[
                  styles.segment,
                  {
                    borderRadius: radius.md,
                    backgroundColor: active ? colors.primarySoft : colors.surface,
                    borderColor: active ? colors.primary : colors.outline,
                  },
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={18}
                  color={active ? colors.primaryText : colors.textMuted}
                />
                <ThemedText
                  variant="caption"
                  tone={active ? "primary" : "muted"}
                >
                  {option.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section title={t("settings.section.language")}>
        <Card
          variant="outlined"
          padded={false}
        >
          {LANGUAGES.map((language, index) => {
            const active = i18n.language?.startsWith(language.code);

            return (
              <Pressable
                key={language.code}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => changeLanguage(language.code)}
                style={[styles.row, index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}
              >
                <ThemedText style={styles.flex}>{language.label}</ThemedText>
                {active && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={colors.primaryText}
                  />
                )}
              </Pressable>
            );
          })}
        </Card>
      </Section>

      <Section title={t("settings.section.about")}>
        <Card
          variant="outlined"
          padded={false}
        >
          <PlainRow
            icon="information-circle-outline"
            label={t("about.title")}
            onPress={() => setAboutOpen(true)}
          />
          <PlainRow
            icon="star-outline"
            label={t("settings.rate")}
            divided
            onPress={() => Linking.openURL(STORE_URL).catch(() => {})}
          />
          {/* Só aparece onde o UMP exige — fora do EEE/Reino Unido não há
              formulário a reabrir e a linha seria um beco sem saída. */}
          {canShowPrivacyOptions && (
            <PlainRow
              icon="options-outline"
              label={t("settings.privacyOptions")}
              divided
              onPress={() => {
                showPrivacyOptions();
              }}
            />
          )}
          <PlainRow
            icon="trash-outline"
            label={t("settings.clear.button")}
            tone="danger"
            divided
            onPress={confirmClear}
          />
        </Card>

        <ThemedText
          variant="caption"
          tone="faint"
          center
          style={styles.version}
        >
          {t("settings.version", { version })}
        </ThemedText>
      </Section>

      <AgePicker
        visible={pickerOpen}
        selected={age ? Number(age) : undefined}
        onSelect={handleAgeSelect}
        onClose={() => setPickerOpen(false)}
      />

      <AboutSheet
        visible={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText
        variant="overline"
        tone="faint"
        style={styles.sectionTitle}
      >
        {title.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Card
      variant="outlined"
      padded={false}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={styles.row}
      >
        <Ionicons
          name={icon}
          size={20}
          color={colors.textMuted}
        />
        <ThemedText style={styles.flex}>{label}</ThemedText>
        <ThemedText tone="muted">{value}</ThemedText>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textFaint}
        />
      </Pressable>
    </Card>
  );
}

function PlainRow({
  icon,
  label,
  onPress,
  tone = "default",
  divided,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tone?: "default" | "danger";
  divided?: boolean;
}) {
  const { colors } = useAppTheme();
  const color = tone === "danger" ? colors.danger : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.row, divided && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={color}
      />
      <ThemedText
        style={styles.flex}
        tone={tone === "danger" ? "danger" : "default"}
      >
        {label}
      </ThemedText>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textFaint}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  hint: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  segmented: {
    flexDirection: "row",
    gap: 8,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    borderWidth: 1.5,
  },
  version: {
    marginTop: 16,
  },
});
