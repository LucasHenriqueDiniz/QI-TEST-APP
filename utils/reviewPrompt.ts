import * as StoreReview from "expo-store-review";
import type { StorageData, StorageKeys } from "@/types/storage";

/** No máximo um pedido de avaliação a cada 30 dias. */
export const REVIEW_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000;

interface Storage {
  getItem<K extends StorageKeys>(key: K): Promise<StorageData[K] | null>;
  setItem<K extends StorageKeys>(key: K, value: StorageData[K]): Promise<void>;
}

/**
 * Pede uma avaliação na própria Play Store (a folha do Google, sem sair do
 * app), se o último pedido tiver mais de 30 dias e o aparelho oferecer o
 * recurso. Quem chama decide o momento: depois da revelação de um resultado
 * que empata ou bate o recorde, nunca a partir do histórico. O Google ainda
 * pode não mostrar nada; o pedido conta do mesmo jeito.
 */
export async function maybeAskForReview(storage: Storage, now = Date.now()): Promise<void> {
  try {
    const last = (await storage.getItem("reviewPromptedAt")) ?? 0;
    if (now - last < REVIEW_INTERVAL_MS) {
      if (__DEV__) console.log("[review] skipped: asked less than 30 days ago");
      return;
    }
    if (!(await StoreReview.isAvailableAsync())) {
      if (__DEV__) console.log("[review] skipped: not available");
      return;
    }
    await storage.setItem("reviewPromptedAt", now);
    if (__DEV__) console.log("[review] requested");
    await StoreReview.requestReview();
  } catch (error) {
    console.error("Error asking for a review:", error);
  }
}
