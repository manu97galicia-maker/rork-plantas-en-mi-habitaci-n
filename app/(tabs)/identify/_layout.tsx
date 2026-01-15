import { Stack } from "expo-router";

export default function IdentifyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="results" />
      <Stack.Screen name="detail" />
    </Stack>
  );
}
