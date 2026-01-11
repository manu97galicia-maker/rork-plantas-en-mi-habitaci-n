import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const DEVICE_ID_KEY = "@device_id";
let cachedDeviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  try {
    const storedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (storedId) {
      cachedDeviceId = storedId;
      console.log("[DeviceID] Retrieved existing:", storedId.substring(0, 8) + "...");
      return storedId;
    }

    const newId = Crypto.randomUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    cachedDeviceId = newId;
    console.log("[DeviceID] Generated new:", newId.substring(0, 8) + "...");
    return newId;
  } catch (error) {
    console.error("[DeviceID] Error:", error);
    const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    cachedDeviceId = fallbackId;
    return fallbackId;
  }
}

export function getCachedDeviceId(): string | null {
  return cachedDeviceId;
}
