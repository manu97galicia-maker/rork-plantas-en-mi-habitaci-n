import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import { MoodEmoji, MOOD_EMOJIS, MOOD_LABELS } from "@/types/plant";
import { Colors } from "@/constants/colors";

interface MoodPickerProps {
  visible: boolean;
  onSelect: (mood: MoodEmoji) => void;
  onSkip: () => void;
  onClose: () => void;
  plantName: string;
  language: "en" | "es";
}

export default function MoodPicker({
  visible,
  onSelect,
  onSkip,
  onClose,
  plantName,
  language,
}: MoodPickerProps) {
  const moods: MoodEmoji[] = ["happy", "relaxed", "neutral", "sad", "stressed"];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={40} tint="dark" style={styles.blur}>
          <TouchableOpacity style={styles.overlayTouch} activeOpacity={1} onPress={onClose} />
        </BlurView>
        <View style={styles.content}>
          <View style={styles.handle} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <Text style={styles.title}>
            {language === "es" ? "¿Cómo te sientes hoy?" : "How are you feeling today?"}
          </Text>
          <Text style={styles.subtitle}>
            {language === "es"
              ? `Regando ${plantName}`
              : `Watering ${plantName}`}
          </Text>

          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood}
                style={styles.moodButton}
                onPress={() => onSelect(mood)}
                activeOpacity={0.7}
              >
                <Text style={styles.moodEmoji}>{MOOD_EMOJIS[mood]}</Text>
                <Text style={styles.moodLabel}>
                  {language === "es" ? MOOD_LABELS[mood].es : MOOD_LABELS[mood].en}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>
              {language === "es" ? "Omitir por ahora" : "Skip for now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTouch: {
    flex: 1,
  },
  content: {
    backgroundColor: Colors.light,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightTertiary,
    borderRadius: 2,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 28,
    textAlign: "center",
  },
  moodGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  moodButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: Colors.lightSecondary,
    minWidth: 60,
  },
  moodEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.text.secondary,
    textAlign: "center",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.tertiary,
  },
});
