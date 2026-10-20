import React, { useEffect } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { useAppTheme } from "@/context/ThemeContext";

/** De onde a folha sobe, em dp (mais que a própria altura, para entrar de fora). */
const RISE = 320;

interface PauseSheetProps {
  visible: boolean;
  /** Fechar a folha e seguir no teste: botão, véu e voltar do sistema. */
  onResume: () => void;
  /** Sair para a Home; o progresso já está salvo a cada resposta. */
  onLeave: () => void;
}

/**
 * Folha inferior "Pausar o teste?" — o que o X e o voltar do sistema abrem
 * durante o teste, no lugar de um Alert. Continuar é a ação principal; sair
 * é a secundária, em texto, porque quem perde progresso não volta.
 */
export function PauseSheet({ visible, onResume, onLeave }: PauseSheetProps) {
  const { t } = useTranslation();
  const { colors, radius, spacing, motion } = useAppTheme();
  const insets = useSafeAreaInsets();

  const rise = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    rise.value = 1;
    rise.value = withSpring(0, motion.defaultSpatial);
  }, [visible, rise, motion]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: RISE * rise.value }] }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onResume}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("test.pause.resume")}
          onPress={onResume}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
        />

        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingHorizontal: spacing.xl,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
            },
            sheetStyle,
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          <ThemedText
            variant="heading"
            accessibilityRole="header"
          >
            {t("test.pause.title")}
          </ThemedText>
          <ThemedText
            variant="body"
            tone="muted"
            style={styles.message}
          >
            {t("test.pause.message")}
          </ThemedText>

          <View style={styles.actions}>
            <Button
              block
              size="large"
              title={t("test.pause.resume")}
              onPress={onResume}
            />
            <Button
              block
              variant="ghost"
              title={t("test.pause.leave")}
              onPress={onLeave}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    paddingTop: 10,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  message: {
    marginTop: 6,
  },
  actions: {
    marginTop: 24,
    gap: 8,
  },
});
