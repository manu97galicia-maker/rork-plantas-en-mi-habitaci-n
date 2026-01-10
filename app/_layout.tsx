// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { MyPlantsProvider } from "@/contexts/MyPlantsContext";
import { PlantImagesProvider } from "@/contexts/PlantImagesContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="camera" options={{ headerShown: false }} />
      <Stack.Screen name="results" options={{ headerShown: false }} />
      <Stack.Screen name="plant-detail" options={{ headerShown: false }} />
      <Stack.Screen name="gallery" options={{ headerShown: false }} />
      <Stack.Screen name="identify-camera" options={{ headerShown: false }} />
      <Stack.Screen name="identify-plant" options={{ headerShown: false }} />
      <Stack.Screen name="my-plants" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="photo-gallery" options={{ headerShown: false }} />
      <Stack.Screen name="add-plant" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
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
  );
}
