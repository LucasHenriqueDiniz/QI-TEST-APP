import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Modal, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/context/ThemeContext";

/** Arrasto (dp) ou velocidade (dp/s) que fecham a folha ao soltar. */
const CLOSE_DISTANCE = 110;
const CLOSE_VELOCITY = 900;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  /** Rótulo do véu, que fecha a folha ao toque. */
  closeLabel: string;
  children: React.ReactNode;
}

/**
 * Folha inferior: o véu esmaece enquanto a folha sobe de mola, em vez de os
 * dois subirem juntos como no `animationType="slide"` do Modal. Fecha com
 * voltar, com um toque no véu ou arrastando a alça para baixo. Com "remover
 * animações", aparece e some sem movimento.
 */
export function BottomSheet({ visible, onClose, closeLabel, children }: BottomSheetProps) {
  const { colors, radius, spacing, motion } = useAppTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(visible);

  const scrim = useSharedValue(0);
  const shown = useSharedValue(0);
  const drag = useSharedValue(0);
  const sheetHeight = useSharedValue(600);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      drag.value = 0;
      scrim.value = reducedMotion ? 1 : withSpring(1, motion.defaultEffects);
      shown.value = reducedMotion ? 1 : withSpring(1, motion.defaultSpatial);
      return;
    }
    if (!mounted) return;
    const duration = reducedMotion ? 0 : motion.durations.exit;
    scrim.value = withTiming(0, { duration });
    shown.value = withTiming(0, { duration }, (finished) => {
      if (finished) runOnJS(setMounted)(false);
    });
    // `mounted` só entra para o caso de fechar o que está montado.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, reducedMotion]);

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: scrim.value * (1 - Math.min(drag.value / sheetHeight.value, 1)),
  }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - shown.value) * sheetHeight.value + drag.value }],
  }));

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      drag.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > CLOSE_DISTANCE || event.velocityY > CLOSE_VELOCITY) {
        runOnJS(onClose)();
        return;
      }
      drag.value = withSpring(0, motion.fastSpatial);
    });

  const measure = (event: LayoutChangeEvent) => {
    sheetHeight.value = event.nativeEvent.layout.height;
  };

  if (!mounted) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Dentro de um Modal o Android precisa da própria raiz de gestos. */}
      <GestureHandlerRootView style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }, scrimStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
          />
        </Animated.View>

        <Animated.View
          onLayout={measure}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              paddingBottom: insets.bottom || spacing.lg,
            },
            sheetStyle,
          ]}
        >
          <GestureDetector gesture={pan}>
            <View style={styles.handleArea}>
              <View style={[styles.grabber, { backgroundColor: colors.border }]} />
            </View>
          </GestureDetector>
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "88%",
  },
  handleArea: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 14,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
