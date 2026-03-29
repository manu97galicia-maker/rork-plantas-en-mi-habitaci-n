import { Tabs, useSegments } from "expo-router";
import { Sparkles, Scan, Leaf } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";

export default function TabLayout() {
  const { language } = useUserPreferences();
  const t = getTranslations(language);
  const segments = useSegments();

  // Hide tab bar on camera and results screens
  const hideTabBar = segments.includes("camera") || segments.includes("results");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: hideTabBar
          ? { display: "none" }
          : {
              backgroundColor: Colors.light,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              height: 85,
              paddingBottom: 28,
              paddingTop: 12,
              borderTopWidth: 0,
              position: "absolute",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 8,
            },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="decorate"
        options={{
          title: language === "es" ? "Decorar" : "Decorate",
          tabBarIcon: ({ color, size }) => (
            <Sparkles size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="identify"
        options={{
          title: language === "es" ? "Identificar" : "Identify",
          tabBarIcon: ({ color, size }) => (
            <Scan size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-plants"
        options={{
          title: t.myPlants.title,
          tabBarIcon: ({ color, size }) => (
            <Leaf size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
