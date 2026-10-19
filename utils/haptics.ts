import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { STORAGE_KEYS } from "@/types/storage";

/**
 * Único ponto do app que vibra.
 *
 * No Android tudo passa por `performAndroidHapticsAsync`: são as constantes
 * de feedback do próprio sistema, respeitam o ajuste "vibrar ao tocar" do
 * aparelho e não pedem permissão. `impactAsync`/`notificationAsync` no
 * Android viram `Vibrator.createWaveform` — um zumbido, não um clique — e por
 * isso só entram no caminho iOS.
 *
 * Em aparelhos com API < 34 o expo-haptics troca por uma constante antiga
 * quando existe e lança `HapticsNotSupportedException` quando não; nenhuma
 * dessas falhas pode chegar ao usuário, então toda chamada engole o erro.
 */

type Kind = "tick" | "confirm" | "press";

const ANDROID: Record<Kind, Haptics.AndroidHaptics> = {
  tick: Haptics.AndroidHaptics.Segment_Tick,
  confirm: Haptics.AndroidHaptics.Confirm,
  press: Haptics.AndroidHaptics.Virtual_Key,
};

const IOS: Record<Kind, () => Promise<void>> = {
  tick: () => Haptics.selectionAsync(),
  confirm: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  press: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
};

/**
 * Preferência "Vibração" dos Ajustes. Vive no módulo, e não em contexto, para
 * que `tick()` dentro de um handler de toque não precise de hook nem de
 * leitura assíncrona — a decisão tem de ser imediata.
 */
let enabled = true;

/** Lê a preferência gravada uma vez, na abertura do app. Ausente = ligada. */
export async function loadHapticsPreference(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.hapticsEnabled);
    if (stored !== null) enabled = JSON.parse(stored) === true;
  } catch (error) {
    console.error("Error loading haptics preference:", error);
  }
}

export function isHapticsEnabled(): boolean {
  return enabled;
}

/** Liga ou desliga e grava; vale na hora, sem esperar a escrita. */
export function setHapticsEnabled(next: boolean): void {
  enabled = next;
  AsyncStorage.setItem(STORAGE_KEYS.hapticsEnabled, JSON.stringify(next)).catch((error) =>
    console.error("Error saving haptics preference:", error)
  );
}

function fire(kind: Kind): void {
  if (!enabled) return;
  // Uma linha por vibração, para contar no logcat o que o aparelho sentiu.
  if (__DEV__) console.log(`[haptics] ${kind}`);

  const run =
    Platform.OS === "android"
      ? Haptics.performAndroidHapticsAsync(ANDROID[kind])
      : Platform.OS === "ios"
        ? IOS[kind]()
        : Promise.resolve();

  run.catch(() => {});
}

/** Alternativa selecionada ou trocada. */
export function tick(): void {
  fire("tick");
}

/** Resposta confirmada, teste concluído, resultado revelado. */
export function confirm(): void {
  fire("confirm");
}

/** Botão genérico. */
export function press(): void {
  fire("press");
}
