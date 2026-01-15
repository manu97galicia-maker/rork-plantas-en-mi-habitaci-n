import { Stack } from "expo-router";

export default function DecorateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="results" />
    </Stack>
  );
}
