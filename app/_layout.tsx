// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { MyPlantsProvider } from "@/contexts/MyPlantsContext";
import { PlantImagesProvider } from "@/contexts/PlantImagesContext";
import { trpc, trpcClient } from "@/lib/trpc";
import { getDeviceId } from "@/lib/deviceId";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plant-detail" options={{ headerShown: false }} />
      <Stack.Screen name="paywall" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isDeviceIdReady, setIsDeviceIdReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await getDeviceId();
        console.log("[App] Device ID initialized");
      } catch (e) {
        console.error("[App] Device ID init error:", e);
      } finally {
        setIsDeviceIdReady(true);
        SplashScreen.hideAsync();
      }
    };
    init();
  }, []);

  if (!isDeviceIdReady) {
    return null;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserPreferencesProvider>
          <MyPlantsProvider>
            <PlantImagesProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </PlantImagesProvider>
          </MyPlantsProvider>
        </UserPreferencesProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
