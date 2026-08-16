import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMemo } from "react";
import { StorageData, StorageKeys } from "@/types/storage";

/**
 * Acesso tipado ao AsyncStorage.
 *
 * A referência retornada é estável entre renders — pode entrar em listas de
 * dependência de `useEffect`/`useFocusEffect` sem causar loop.
 */
export function useStorage() {
  return useMemo(
    () => ({
      async getItem<K extends StorageKeys>(key: K): Promise<StorageData[K] | null> {
        try {
          const value = await AsyncStorage.getItem(key);
          return value ? (JSON.parse(value) as StorageData[K]) : null;
        } catch (error) {
          console.error(`Error reading ${key}:`, error);
          return null;
        }
      },

      async setItem<K extends StorageKeys>(key: K, value: StorageData[K]): Promise<void> {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error(`Error writing ${key}:`, error);
        }
      },

      async removeItem(key: StorageKeys): Promise<void> {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          console.error(`Error removing ${key}:`, error);
        }
      },
    }),
    []
  );
}
