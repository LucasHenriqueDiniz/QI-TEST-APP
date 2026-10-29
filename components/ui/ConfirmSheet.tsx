import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/context/ThemeContext";

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmação de uma ação que não se desfaz (recomeçar o teste, apagar o
 * histórico), numa folha inferior em vez do `Alert` do sistema.
 */
export function ConfirmSheet({ visible, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmSheetProps) {
  const { spacing } = useAppTheme();

  return (
    <BottomSheet
      visible={visible}
      onClose={onCancel}
      closeLabel={cancelLabel}
    >
      <View style={[styles.body, { paddingHorizontal: spacing.xl, gap: spacing.sm }]}>
        <ThemedText
          variant="heading"
          accessibilityRole="header"
        >
          {title}
        </ThemedText>
        <ThemedText tone="muted">{message}</ThemedText>
        <View style={[styles.actions, { marginTop: spacing.lg, gap: spacing.sm }]}>
          <Button
            title={confirmLabel}
            onPress={onConfirm}
            size="large"
            block
          />
          <Button
            title={cancelLabel}
            onPress={onCancel}
            variant="ghost"
            block
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingBottom: 8,
  },
  actions: {},
});
