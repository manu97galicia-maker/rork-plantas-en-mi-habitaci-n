import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Settings, ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/colors";

interface TabHeaderProps {
  title: string;
  greeting?: string;
  showBack?: boolean;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  rightContent?: React.ReactNode;
}

export default function TabHeader({
  title,
  greeting,
  showBack = false,
  showSettings = true,
  onSettingsPress,
  rightContent,
}: TabHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
        ) : (
          <View>
            {greeting && <Text style={styles.greeting}>{greeting}</Text>}
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
      </View>

      {showBack && (
        <Text style={styles.centerTitle}>{title}</Text>
      )}

      <View style={styles.rightSection}>
        {rightContent}
        {showSettings && onSettingsPress && (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onSettingsPress}
          >
            <Settings size={22} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
        {showBack && !rightContent && !showSettings && <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  greeting: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  centerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  placeholder: {
    width: 44,
  },
});
