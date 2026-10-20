import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useAppTheme } from "@/context/ThemeContext";
import { ThemedText } from "@/components/ThemedText";
import * as haptics from "@/utils/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "medium" | "large";
/** Qual vibração o toque dispara; `confirm` é para a ação que fecha uma resposta. */
type Haptic = "press" | "confirm" | "none";

/** Escala do botão pressionado. */
const PRESSED_SCALE = 0.96;

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  /** Ocupa toda a largura disponível. */
  block?: boolean;
  /** Vibração do toque. Uma por ação: quem já vibra por outro caminho passa `none`. */
  haptic?: Haptic;
  style?: ViewStyle;
}

/**
 * Botão do app. O primário é o gradiente da marca (DS-5); desabilitado vira
 * `surfaceAlt` com rótulo `textMuted` em vez de meia opacidade, que no escuro
 * deixava o violeta lavado sobre o fundo (`textFaint`, o que o DS-5 pedia, dá
 * 4,31:1 sobre `surfaceAlt` no claro e não passa). Pressionar assenta de mola.
 */
export function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  icon,
  disabled,
  loading,
  block,
  haptic = "press",
  style,
}: ButtonProps) {
  const { colors, radius, shadow, motion } = useAppTheme();

  const isDisabled = disabled || loading;
  const gradient = variant === "primary" && !isDisabled;

  // Mola em vez de degrau: o botão assenta ao ser pressionado e volta com
  // inércia. `transform` estático dá um salto seco que lê como travamento.
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const surfaces: Record<Variant, ViewStyle> = {
    // A cor lisa fica por baixo do gradiente: é o que aparece se ele falhar.
    primary: { backgroundColor: colors.primary, ...shadow(2) },
    secondary: { backgroundColor: colors.surfaceAlt },
    outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.outline },
    ghost: { backgroundColor: "transparent" },
  };

  const contentColors: Record<Variant, string> = {
    primary: colors.onPrimary,
    secondary: colors.text,
    outline: colors.text,
    ghost: colors.primaryText,
  };

  // Preenchidos, desabilitados trocam de superfície; os sem fundo só apagam.
  const filled = variant === "primary" || variant === "secondary";
  const disabledSurface: ViewStyle = filled ? { backgroundColor: colors.surfaceAlt } : styles.faded;
  const contentColor = isDisabled && filled ? colors.textMuted : contentColors[variant];

  const handlePress = () => {
    if (haptic === "press") haptics.press();
    if (haptic === "confirm") haptics.confirm();
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      onPress={handlePress}
      onPressIn={() => {
        if (!isDisabled) scale.value = withSpring(PRESSED_SCALE, motion.fastSpatial);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.fastSpatial);
      }}
      disabled={isDisabled}
      style={[
        styles.base,
        size === "large" ? styles.large : styles.medium,
        { borderRadius: radius.lg },
        isDisabled ? [surfaces[variant], disabledSurface, styles.flat] : surfaces[variant],
        block && styles.block,
        animatedStyle,
        style,
      ]}
    >
      {gradient && (
        <LinearGradient
          colors={colors.gradientBrand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: radius.lg }]}
        />
      )}
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={size === "large" ? 20 : 18}
              color={contentColor}
            />
          )}
          <ThemedText
            variant={size === "large" ? "subheading" : "bodyStrong"}
            color={contentColor}
            numberOfLines={1}
          >
            {title}
          </ThemedText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 60,
  },
  block: {
    alignSelf: "stretch",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  faded: {
    opacity: 0.45,
  },
  // Desabilitado não flutua: sem sombra nem elevação.
  flat: {
    shadowOpacity: 0,
    elevation: 0,
  },
});
