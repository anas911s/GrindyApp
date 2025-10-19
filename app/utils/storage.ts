// app/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveJSON(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('saveJSON error', key, e);
    // fallback: try removing and re-saving
    try {
      await AsyncStorage.removeItem(key);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e2) {
      console.error('saveJSON retry failed', key, e2);
    }
  }
}

export async function loadJSON<T = any>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('loadJSON error', key, e);
    return null;
  }
}
