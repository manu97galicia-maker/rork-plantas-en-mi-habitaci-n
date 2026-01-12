import { useRouter } from "expo-router";
import { ChevronLeft, Search, Droplets, Sun, X } from "lucide-react-native";
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyPlants } from "@/contexts/MyPlantsContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";
import { COMMON_PLANTS } from "@/constants/commonPlants";
import { Plant } from "@/types/plant";
import * as Haptics from "expo-haptics";
import { usePlantImages } from "@/contexts/PlantImagesContext";
import { Image } from "expo-image";

export default function AddPlantScreen() {
  const router = useRouter();
  const { addPlant } = useMyPlants();
  const { language } = useUserPreferences();
  const t = getTranslations(language);
  const { getPlantImage } = usePlantImages();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [wateringDays, setWateringDays] = useState<string>("7");

  const filteredPlants = useMemo(() => {
    if (!searchQuery.trim()) {
      return COMMON_PLANTS;
    }
    const query = searchQuery.toLowerCase();
    return COMMON_PLANTS.filter(
      (plant) =>
        plant.name.toLowerCase().includes(query) ||
        plant.scientificName.toLowerCase().includes(query) ||
        plant.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setNickname("");
    
    const wateringScheduleLower = plant.wateringSchedule.toLowerCase();
    if (wateringScheduleLower.includes("weekly")) {
      setWateringDays("7");
    } else if (wateringScheduleLower.includes("bi-weekly") || wateringScheduleLower.includes("every 2")) {
      setWateringDays("14");
    } else if (wateringScheduleLower.includes("every 3")) {
      setWateringDays("3");
    } else if (wateringScheduleLower.includes("every 10")) {
      setWateringDays("10");
    } else {
      setWateringDays("7");
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleAddPlant = async () => {
    if (!selectedPlant) return;

    const frequency = parseInt(wateringDays, 10);
    if (isNaN(frequency) || frequency < 1) {
      return;
    }

    await addPlant(selectedPlant, frequency, nickname || undefined);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedPlant(null);
    router.back();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#10b981";
      case "Moderate":
        return "#f59e0b";
      case "Advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ChevronLeft size={28} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.addPlant.title}</Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="rgba(255,255,255,0.6)" strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder={t.addPlant.searchPlaceholder}
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={20} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredPlants.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>{t.addPlant.noResults}</Text>
              </View>
            ) : (
              <View style={styles.plantsList}>
                {filteredPlants.map((plant) => {
                  const plantImage = getPlantImage(plant.id, plant.name);
                  return (
                    <TouchableOpacity
                      key={plant.id}
                      style={styles.plantCard}
                      onPress={() => handleSelectPlant(plant)}
                      activeOpacity={0.7}
                    >
                      <LinearGradient
                        colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                        style={styles.plantCardGradient}
                      >
                        <View style={styles.plantCardContent}>
                          {plantImage && (
                            <Image
                              source={{ uri: plantImage }}
                              style={styles.plantCardImage}
                              contentFit="cover"
                            />
                          )}
                          <View style={styles.plantInfo}>
                            <Text style={styles.plantName}>{plant.name}</Text>
                            <Text style={styles.plantScientificName}>
                              {plant.scientificName}
                            </Text>
                            <Text style={styles.plantDescription} numberOfLines={2}>
                              {plant.description}
                            </Text>
                            
                            <View style={styles.plantTags}>
                              <View
                                style={[
                                  styles.difficultyTag,
                                  { backgroundColor: getDifficultyColor(plant.difficulty) },
                                ]}
                              >
                                <Text style={styles.tagText}>{plant.difficulty}</Text>
                              </View>
                              
                              <View style={styles.tag}>
                                <Sun size={12} color="#ffffff" strokeWidth={2} />
                                <Text style={styles.tagText}>{plant.lightRequirement}</Text>
                              </View>
                              
                              <View style={styles.tag}>
                                <Droplets size={12} color="#ffffff" strokeWidth={2} />
                                <Text style={styles.tagText}>{plant.wateringSchedule}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <Modal
        visible={selectedPlant !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPlant(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {selectedPlant?.name}
              </Text>
              <Text style={styles.modalScientificName}>
                {selectedPlant?.scientificName}
              </Text>

              {selectedPlant?.careInstructions && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>{t.addPlant.careInstructions}</Text>
                  
                  <View style={styles.careItem}>
                    <Text style={styles.careLabel}>{t.addPlant.light}:</Text>
                    <Text style={styles.careText}>{selectedPlant.careInstructions?.light || selectedPlant.lightRequirement || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.careItem}>
                    <Text style={styles.careLabel}>{t.addPlant.water}:</Text>
                    <Text style={styles.careText}>{selectedPlant.careInstructions?.water || selectedPlant.wateringSchedule || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.careItem}>
                    <Text style={styles.careLabel}>{t.addPlant.temperature}:</Text>
                    <Text style={styles.careText}>{selectedPlant.careInstructions?.temperature || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.careItem}>
                    <Text style={styles.careLabel}>{t.addPlant.humidity}:</Text>
                    <Text style={styles.careText}>{selectedPlant.careInstructions?.humidity || 'N/A'}</Text>
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t.addPlant.nickname}</Text>
                <TextInput
                  style={styles.input}
                  value={nickname}
                  onChangeText={setNickname}
                  placeholder={t.addPlant.nicknamePlaceholder}
                  placeholderTextColor="rgba(0,0,0,0.4)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t.addPlant.wateringFrequency}
                </Text>
                <TextInput
                  style={styles.input}
                  value={wateringDays}
                  onChangeText={setWateringDays}
                  keyboardType="number-pad"
                  placeholder="7"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setSelectedPlant(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>{t.addPlant.cancel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.addButton]}
                  onPress={handleAddPlant}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={["#10b981", "#059669"]}
                    style={styles.addButtonGradient}
                  >
                    <Text style={styles.addButtonText}>{t.addPlant.addToMyPlants}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
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
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500" as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  plantsList: {
    gap: 12,
  },
  plantCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  plantCardGradient: {
    padding: 16,
  },
  plantCardContent: {
    flexDirection: "row",
  },
  plantInfo: {
    flex: 1,
  },
  plantCardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#ffffff",
    marginBottom: 2,
  },
  plantScientificName: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic" as const,
    marginBottom: 8,
  },
  plantDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
    marginBottom: 12,
  },
  plantTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  difficultyTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: "#0f172a",
    marginBottom: 4,
  },
  modalScientificName: {
    fontSize: 16,
    color: "#64748b",
    fontStyle: "italic" as const,
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginBottom: 12,
  },
  careItem: {
    marginBottom: 12,
  },
  careLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#475569",
    marginBottom: 4,
  },
  careText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#0f172a",
    borderWidth: 2,
    borderColor: "transparent",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: "#e2e8f0",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#475569",
  },
  addButton: {
    elevation: 4,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonGradient: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
});
