import React, { useMemo } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useAppTheme } from "@/context/ThemeContext";

const MIN_AGE = 6;
const MAX_AGE = 99;
const ROW_HEIGHT = 52;

interface AgePickerProps {
  visible: boolean;
  selected?: number;
  onSelect: (age: number) => void;
  onClose: () => void;
}

/** Seletor de idade em folha inferior. */
export function AgePicker({ visible, selected, onSelect, onClose }: AgePickerProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing } = useAppTheme();
  const insets = useSafeAreaInsets();

  const ages = useMemo(() => Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i), []);

  const initialIndex = selected ? Math.max(ages.indexOf(selected) - 3, 0) : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        {/* Bloqueia o toque de fechar dentro do conteúdo. */}
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingBottom: insets.bottom || spacing.lg,
            },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          <ThemedText
            variant="subheading"
            center
            style={styles.title}
          >
            {t("settings.age.label")}
          </ThemedText>

          <FlatList
            data={ages}
            keyExtractor={(age) => String(age)}
            initialScrollIndex={initialIndex}
            getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const active = item === selected;

              return (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  onPress={() => onSelect(item)}
                  style={({ pressed }) => [
                    styles.row,
                    { backgroundColor: active ? colors.primarySoft : "transparent", borderRadius: radius.md },
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <ThemedText
                    variant={active ? "bodyStrong" : "body"}
                    tone={active ? "primary" : "default"}
                  >
                    {item}
                  </ThemedText>
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    maxHeight: "70%",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
  },
  title: {
    marginTop: 14,
    marginBottom: 12,
  },
  row: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});
