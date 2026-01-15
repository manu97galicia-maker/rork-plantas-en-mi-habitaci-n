import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  X,
  CheckCircle2,
  Globe,
  Sprout,
  TreeDeciduous,
  Users,
  Camera,
  Leaf,
  Images,
} from "lucide-react-native";
import { useUserPreferences, type Language, type CareLevel } from "@/contexts/UserPreferencesContext";
import { useMyPlants } from "@/contexts/MyPlantsContext";
import { Colors } from "@/constants/colors";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const {
    language,
    setLanguage,
    careLevel,
    setCareLevel,
    scanHistory,
    getRemainingScans,
  } = useUserPreferences();
  const { plants } = useMyPlants();
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showCareLevelOptions, setShowCareLevelOptions] = useState(false);

  const handleLanguageChange = async (newLanguage: Language) => {
    await setLanguage(newLanguage);
    setShowLanguageOptions(false);
  };

  const handleCareLevelChange = async (level: CareLevel) => {
    await setCareLevel(level);
    setShowCareLevelOptions(false);
  };

  const getCareLevelIcon = () => {
    switch (careLevel) {
      case "beginner":
        return <Sprout size={20} color={Colors.primary} />;
      case "intermediate":
        return <TreeDeciduous size={20} color={Colors.primary} />;
      case "expert":
        return <Users size={20} color={Colors.primary} />;
      default:
        return <Leaf size={20} color={Colors.primary} />;
    }
  };

  const getCareLevelText = () => {
    switch (careLevel) {
      case "beginner":
        return language === "es" ? "Principiante" : "Beginner";
      case "intermediate":
        return language === "es" ? "Intermedio" : "Intermediate";
      case "expert":
        return language === "es" ? "Experto" : "Expert";
      default:
        return language === "es" ? "No seleccionado" : "Not selected";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={40} tint="dark" style={styles.blur}>
          <TouchableOpacity
            style={styles.overlayTouch}
            activeOpacity={1}
            onPress={onClose}
          />
        </BlurView>
        <View style={styles.content}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>
              {language === "es" ? "Configuración" : "Settings"}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: Colors.mint }]}>
                <Camera size={18} color={Colors.forest} />
              </View>
              <Text style={styles.statValue}>{scanHistory.length}</Text>
              <Text style={styles.statLabel}>
                {language === "es" ? "Escaneos" : "Scans"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: Colors.primaryLight }]}>
                <Leaf size={18} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{plants.length}</Text>
              <Text style={styles.statLabel}>
                {language === "es" ? "Plantas" : "Plants"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: Colors.primaryLight }]}>
                <Images size={18} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{getRemainingScans()}</Text>
              <Text style={styles.statLabel}>
                {language === "es" ? "Restantes" : "Remaining"}
              </Text>
            </View>
          </View>

          {/* Language Section */}
          {!showCareLevelOptions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === "es" ? "Idioma" : "Language"}
              </Text>
              {!showLanguageOptions ? (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setShowLanguageOptions(true)}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: Colors.primaryLight }]}>
                    <Globe size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>
                      {language === "es" ? "Español" : "English"}
                    </Text>
                    <Text style={styles.menuSubtitle}>
                      {language === "es" ? "Toca para cambiar" : "Tap to change"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.optionsList}>
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      language === "en" && styles.optionItemActive,
                    ]}
                    onPress={() => handleLanguageChange("en")}
                  >
                    <Text style={styles.optionFlag}>🇺🇸</Text>
                    <View style={styles.optionTextWrap}>
                      <Text style={styles.optionTitle}>English</Text>
                    </View>
                    {language === "en" && (
                      <CheckCircle2 size={22} color={Colors.primary} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      language === "es" && styles.optionItemActive,
                    ]}
                    onPress={() => handleLanguageChange("es")}
                  >
                    <Text style={styles.optionFlag}>🇪🇸</Text>
                    <View style={styles.optionTextWrap}>
                      <Text style={styles.optionTitle}>Español</Text>
                    </View>
                    {language === "es" && (
                      <CheckCircle2 size={22} color={Colors.primary} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Care Level Section */}
          {!showLanguageOptions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === "es" ? "Nivel de experiencia" : "Experience Level"}
              </Text>
              {!showCareLevelOptions ? (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setShowCareLevelOptions(true)}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: Colors.mint }]}>
                    {getCareLevelIcon()}
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{getCareLevelText()}</Text>
                    <Text style={styles.menuSubtitle}>
                      {language === "es" ? "Toca para cambiar" : "Tap to change"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.optionsList}>
                  {[
                    { id: "beginner" as CareLevel, icon: Sprout, label: language === "es" ? "Principiante" : "Beginner" },
                    { id: "intermediate" as CareLevel, icon: TreeDeciduous, label: language === "es" ? "Intermedio" : "Intermediate" },
                    { id: "expert" as CareLevel, icon: Users, label: language === "es" ? "Experto" : "Expert" },
                  ].map((level) => (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.levelOption,
                        careLevel === level.id && styles.levelOptionActive,
                      ]}
                      onPress={() => handleCareLevelChange(level.id)}
                    >
                      <View
                        style={[
                          styles.levelIconBg,
                          careLevel === level.id && styles.levelIconBgActive,
                        ]}
                      >
                        <level.icon
                          size={20}
                          color={careLevel === level.id ? Colors.light : Colors.primary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.levelTitle,
                          careLevel === level.id && styles.levelTitleActive,
                        ]}
                      >
                        {level.label}
                      </Text>
                      {careLevel === level.id && (
                        <CheckCircle2 size={22} color={Colors.light} strokeWidth={2.5} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
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
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightTertiary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.lightSecondary,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text.secondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightSecondary,
    borderRadius: 16,
    padding: 14,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.lightSecondary,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionItemActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  optionFlag: {
    fontSize: 28,
    marginRight: 12,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  levelOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.lightSecondary,
    borderWidth: 2,
    borderColor: "transparent",
  },
  levelOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  levelIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  levelIconBgActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  levelTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  levelTitleActive: {
    color: Colors.light,
  },
});
