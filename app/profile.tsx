import { useRouter } from "expo-router";
import { User, Globe, Leaf, Camera, Images, ChevronRight, ChevronLeft, Sprout, TreeDeciduous, Users, CheckCircle2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useUserPreferences, type Language, type CareLevel } from "@/contexts/UserPreferencesContext";
import { useMyPlants } from "@/contexts/MyPlantsContext";
import { Colors } from "@/constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    language, 
    setLanguage, 
    careLevel, 
    setCareLevel,
    scanHistory, 
    getRemainingScans 
  } = useUserPreferences();
  const { plants } = useMyPlants();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCareLevelModal, setShowCareLevelModal] = useState(false);

  const handleLanguageChange = async (newLanguage: Language) => {
    await setLanguage(newLanguage);
    setShowLanguageModal(false);
  };

  const handleCareLevelChange = async (level: CareLevel) => {
    await setCareLevel(level);
    setShowCareLevelModal(false);
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
    <View style={styles.container}>
      <LinearGradient colors={[Colors.lightSecondary, Colors.light]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {language === "es" ? "Mi Perfil" : "My Profile"}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.avatarSection}>
              <View style={styles.avatarOuter}>
                <LinearGradient
                  colors={Colors.gradient.primary}
                  style={styles.avatarContainer}
                >
                  <User size={44} color={Colors.light} strokeWidth={1.5} />
                </LinearGradient>
              </View>
              <Text style={styles.welcomeText}>
                {language === "es" ? "Bienvenido" : "Welcome"}
              </Text>
              <Text style={styles.subtitleText}>
                {language === "es" ? "Amante de las plantas y flores" : "Plant & flower lover"}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: Colors.mint }]}>
                  <Camera size={20} color={Colors.forest} />
                </View>
                <Text style={styles.statValue}>{scanHistory.length}</Text>
                <Text style={styles.statLabel}>
                  {language === "es" ? "Escaneos" : "Scans"}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: Colors.primaryLight }]}>
                  <Leaf size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{plants.length}</Text>
                <Text style={styles.statLabel}>
                  {language === "es" ? "Plantas" : "Plants"}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconBg, { backgroundColor: Colors.primaryLight }]}>
                  <Images size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statValue}>{getRemainingScans()}</Text>
                <Text style={styles.statLabel}>
                  {language === "es" ? "Restantes" : "Remaining"}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === "es" ? "Configuración" : "Settings"}
              </Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setShowLanguageModal(true)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBg, { backgroundColor: Colors.primaryLight }]}>
                  <Globe size={20} color={Colors.primary} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>
                    {language === "es" ? "Idioma" : "Language"}
                  </Text>
                  <Text style={styles.menuValue}>
                    {language === "es" ? "Español" : "English"}
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setShowCareLevelModal(true)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBg, { backgroundColor: Colors.mint }]}>
                  {getCareLevelIcon()}
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>
                    {language === "es" ? "Nivel de experiencia" : "Experience Level"}
                  </Text>
                  <Text style={styles.menuValue}>{getCareLevelText()}</Text>
                </View>
                <ChevronRight size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {language === "es" ? "Accesos rápidos" : "Quick Access"}
              </Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/photo-gallery" as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBg, { backgroundColor: Colors.accentTertiary }]}>
                  <Images size={20} color={Colors.moss} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>
                    {language === "es" ? "Galería de Fotos" : "Photo Gallery"}
                  </Text>
                  <Text style={styles.menuValue}>
                    {language === "es" ? "Ver y organizar álbumes" : "View & organize albums"}
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push("/my-plants")}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconBg, { backgroundColor: Colors.primaryLight }]}>
                  <Leaf size={20} color={Colors.primary} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>
                    {language === "es" ? "Mis Plantas y Flores" : "My Plants & Flowers"}
                  </Text>
                  <Text style={styles.menuValue}>
                    {plants.length} {language === "es" ? "en tu colección" : "in your collection"}
                  </Text>
                </View>
                <ChevronRight size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          <Modal
            visible={showLanguageModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowLanguageModal(false)}
          >
            <View style={styles.modalOverlay}>
              <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
                <TouchableOpacity
                  style={styles.modalOverlayTouch}
                  activeOpacity={1}
                  onPress={() => setShowLanguageModal(false)}
                />
              </BlurView>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {language === "es" ? "Cambiar Idioma" : "Change Language"}
                  </Text>
                  <TouchableOpacity 
                    style={styles.modalClose}
                    onPress={() => setShowLanguageModal(false)}
                  >
                    <X size={20} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.optionList}>
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      language === "en" && styles.optionItemActive,
                    ]}
                    onPress={() => handleLanguageChange("en")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionFlag}>🇺🇸</Text>
                    <View style={styles.optionTextWrap}>
                      <Text style={styles.optionTitle}>English</Text>
                      <Text style={styles.optionSubtitle}>English</Text>
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
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionFlag}>🇪🇸</Text>
                    <View style={styles.optionTextWrap}>
                      <Text style={styles.optionTitle}>Español</Text>
                      <Text style={styles.optionSubtitle}>Spanish</Text>
                    </View>
                    {language === "es" && (
                      <CheckCircle2 size={22} color={Colors.primary} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showCareLevelModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCareLevelModal(false)}
          >
            <View style={styles.modalOverlay}>
              <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
                <TouchableOpacity
                  style={styles.modalOverlayTouch}
                  activeOpacity={1}
                  onPress={() => setShowCareLevelModal(false)}
                />
              </BlurView>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {language === "es" ? "Nivel de Experiencia" : "Experience Level"}
                  </Text>
                  <TouchableOpacity 
                    style={styles.modalClose}
                    onPress={() => setShowCareLevelModal(false)}
                  >
                    <X size={20} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.optionList}>
                  <TouchableOpacity
                    style={[
                      styles.levelOption,
                      careLevel === "beginner" && styles.levelOptionActive,
                    ]}
                    onPress={() => handleCareLevelChange("beginner")}
                    activeOpacity={0.7}
                  >
                    <View style={styles.levelHeader}>
                      <View style={[styles.levelIconBg, careLevel === "beginner" && styles.levelIconBgActive]}>
                        <Sprout size={22} color={careLevel === "beginner" ? Colors.light : Colors.primary} />
                      </View>
                      <View style={styles.levelTextWrap}>
                        <Text style={[styles.levelTitle, careLevel === "beginner" && styles.levelTitleActive]}>
                          {language === "es" ? "Principiante" : "Beginner"}
                        </Text>
                        <Text style={[styles.levelDesc, careLevel === "beginner" && styles.levelDescActive]}>
                          {language === "es" 
                            ? "Plantas fáciles con cuidado mínimo" 
                            : "Easy plants with minimal care"}
                        </Text>
                      </View>
                    </View>
                    {careLevel === "beginner" && (
                      <CheckCircle2 size={22} color={Colors.light} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.levelOption,
                      careLevel === "intermediate" && styles.levelOptionActive,
                    ]}
                    onPress={() => handleCareLevelChange("intermediate")}
                    activeOpacity={0.7}
                  >
                    <View style={styles.levelHeader}>
                      <View style={[styles.levelIconBg, careLevel === "intermediate" && styles.levelIconBgActive]}>
                        <TreeDeciduous size={22} color={careLevel === "intermediate" ? Colors.light : Colors.primary} />
                      </View>
                      <View style={styles.levelTextWrap}>
                        <Text style={[styles.levelTitle, careLevel === "intermediate" && styles.levelTitleActive]}>
                          {language === "es" ? "Intermedio" : "Intermediate"}
                        </Text>
                        <Text style={[styles.levelDesc, careLevel === "intermediate" && styles.levelDescActive]}>
                          {language === "es" 
                            ? "Algo de experiencia con plantas" 
                            : "Some experience with plants"}
                        </Text>
                      </View>
                    </View>
                    {careLevel === "intermediate" && (
                      <CheckCircle2 size={22} color={Colors.light} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.levelOption,
                      careLevel === "expert" && styles.levelOptionActive,
                    ]}
                    onPress={() => handleCareLevelChange("expert")}
                    activeOpacity={0.7}
                  >
                    <View style={styles.levelHeader}>
                      <View style={[styles.levelIconBg, careLevel === "expert" && styles.levelIconBgActive]}>
                        <Users size={22} color={careLevel === "expert" ? Colors.light : Colors.primary} />
                      </View>
                      <View style={styles.levelTextWrap}>
                        <Text style={[styles.levelTitle, careLevel === "expert" && styles.levelTitleActive]}>
                          {language === "es" ? "Experto" : "Expert"}
                        </Text>
                        <Text style={[styles.levelDesc, careLevel === "expert" && styles.levelDescActive]}>
                          {language === "es" 
                            ? "Plantas exóticas y desafiantes" 
                            : "Exotic and challenging plants"}
                        </Text>
                      </View>
                    </View>
                    {careLevel === "expert" && (
                      <CheckCircle2 size={22} color={Colors.light} strokeWidth={2.5} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
  },
  avatarOuter: {
    padding: 4,
    borderRadius: 56,
    backgroundColor: Colors.light,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 15,
    color: Colors.text.secondary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.light,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: 14,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  menuValue: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalOverlayTouch: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: Colors.light,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightTertiary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.text.primary,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  optionList: {
    gap: 10,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.lightSecondary,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionItemActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  optionFlag: {
    fontSize: 32,
    marginRight: 14,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  levelOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.lightSecondary,
    borderWidth: 2,
    borderColor: "transparent",
  },
  levelOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  levelHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  levelIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  levelIconBgActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  levelTextWrap: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  levelTitleActive: {
    color: Colors.light,
  },
  levelDesc: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  levelDescActive: {
    color: "rgba(255,255,255,0.85)",
  },
});
