import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS, StorageKeys, StorageData } from "@/types/storage";

export function useStorage() {
  const getItem = async <K extends StorageKeys>(key: K): Promise<StorageData[K] | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  };

  const setItem = async <K extends StorageKeys>(key: K, value: StorageData[K]): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  };

  const removeItem = async (key: StorageKeys): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  };

  return {
    getItem,
    setItem,
    removeItem,
  };
}
