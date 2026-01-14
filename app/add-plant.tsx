import { useRouter } from "expo-router";
import { ChevronLeft, Search, Droplets, Sun, X, Moon, Heart, Wind, PawPrint, Sparkles, Baby, AlertTriangle, Gauge } from "lucide-react-native";
import React, { useState, useMemo, useCallback } from "react";
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

export default function AddPlantScreen() {
  const router = useRouter();
  const { addPlant } = useMyPlants();
  const { language } = useUserPreferences();
  const t = getTranslations(language);
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [wateringDays, setWateringDays] = useState<string>("7");
  
  const [filterAllergyFriendly, setFilterAllergyFriendly] = useState<boolean>(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  
  const hasActiveFilters = filterAllergyFriendly || filterDifficulty !== null;
  
  const clearFilters = useCallback(() => {
    setFilterAllergyFriendly(false);
    setFilterDifficulty(null);
  }, []);

  const filteredPlants = useMemo(() => {
    let plants = COMMON_PLANTS;
    
    if (filterAllergyFriendly) {
      plants = plants.filter((plant) => {
        const allergenInfo = plant.safetyInfo?.allergenInfo?.toLowerCase() || '';
        return allergenInfo.includes('safe') || 
               allergenInfo.includes('hypoallergenic') || 
               plant.safetyInfo?.allergyFriendly === true ||
               !allergenInfo.includes('allergic') && !allergenInfo.includes('irritation');
      });
    }
    
    if (filterDifficulty) {
      plants = plants.filter((plant) => plant.difficulty === filterDifficulty);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      plants = plants.filter(
        (plant) =>
          plant.name.toLowerCase().includes(query) ||
          plant.scientificName.toLowerCase().includes(query) ||
          plant.description.toLowerCase().includes(query) ||
          (plant.nameEs && plant.nameEs.toLowerCase().includes(query)) ||
          (plant.descriptionEs && plant.descriptionEs.toLowerCase().includes(query))
      );
    }
    
    return plants;
  }, [searchQuery, filterAllergyFriendly, filterDifficulty]);



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

  const getDifficultyText = (difficulty: string) => {
    if (language === 'es') {
      switch (difficulty) {
        case "Easy":
          return "Fácil";
        case "Moderate":
          return "Moderada";
        case "Advanced":
          return "Avanzada";
        default:
          return difficulty;
      }
    }
    return difficulty;
  };

  const getPlantName = (plant: Plant) => {
    return language === 'es' && plant.nameEs ? plant.nameEs : plant.name;
  };

  const getPlantDescription = (plant: Plant) => {
    return language === 'es' && plant.descriptionEs ? plant.descriptionEs : plant.description;
  };

  const getLightRequirement = (plant: Plant) => {
    return language === 'es' && plant.lightRequirementEs ? plant.lightRequirementEs : plant.lightRequirement;
  };

  const getWateringSchedule = (plant: Plant) => {
    return language === 'es' && plant.wateringScheduleEs ? plant.wateringScheduleEs : plant.wateringSchedule;
  };

  const getCareLight = (plant: Plant) => {
    return language === 'es' && plant.careInstructions?.lightEs ? plant.careInstructions.lightEs : plant.careInstructions?.light;
  };

  const getCareWater = (plant: Plant) => {
    return language === 'es' && plant.careInstructions?.waterEs ? plant.careInstructions.waterEs : plant.careInstructions?.water;
  };

  const getCareTemperature = (plant: Plant) => {
    return language === 'es' && plant.careInstructions?.temperatureEs ? plant.careInstructions.temperatureEs : plant.careInstructions?.temperature;
  };

  const getCareHumidity = (plant: Plant) => {
    return language === 'es' && plant.careInstructions?.humidityEs ? plant.careInstructions.humidityEs : plant.careInstructions?.humidity;
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
            
            <View style={styles.filtersContainer}>
              <Text style={styles.filterSectionLabel}>
                {language === 'es' ? 'Dificultad' : 'Difficulty'}
              </Text>
              <View style={styles.filtersRow}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterDifficulty === 'Easy' && styles.filterChipEasy
                  ]}
                  onPress={() => setFilterDifficulty(filterDifficulty === 'Easy' ? null : 'Easy')}
                  activeOpacity={0.7}
                >
                  <Gauge size={14} color={filterDifficulty === 'Easy' ? "#ffffff" : "#10b981"} strokeWidth={2} />
                  <Text style={[
                    styles.filterChipText,
                    filterDifficulty === 'Easy' && styles.filterChipTextActive
                  ]}>{language === 'es' ? 'Fácil' : 'Easy'}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterDifficulty === 'Moderate' && styles.filterChipModerate
                  ]}
                  onPress={() => setFilterDifficulty(filterDifficulty === 'Moderate' ? null : 'Moderate')}
                  activeOpacity={0.7}
                >
                  <Gauge size={14} color={filterDifficulty === 'Moderate' ? "#ffffff" : "#f59e0b"} strokeWidth={2} />
                  <Text style={[
                    styles.filterChipText,
                    filterDifficulty === 'Moderate' && styles.filterChipTextActive
                  ]}>{language === 'es' ? 'Moderada' : 'Moderate'}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterDifficulty === 'Advanced' && styles.filterChipAdvanced
                  ]}
                  onPress={() => setFilterDifficulty(filterDifficulty === 'Advanced' ? null : 'Advanced')}
                  activeOpacity={0.7}
                >
                  <Gauge size={14} color={filterDifficulty === 'Advanced' ? "#ffffff" : "#ef4444"} strokeWidth={2} />
                  <Text style={[
                    styles.filterChipText,
                    filterDifficulty === 'Advanced' && styles.filterChipTextActive
                  ]}>{language === 'es' ? 'Avanzada' : 'Advanced'}</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.filterSectionLabel, { marginTop: 12 }]}>
                {language === 'es' ? 'Alergias' : 'Allergies'}
              </Text>
              <View style={styles.filtersRow}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    filterAllergyFriendly && styles.filterChipActive
                  ]}
                  onPress={() => setFilterAllergyFriendly(!filterAllergyFriendly)}
                  activeOpacity={0.7}
                >
                  <Sparkles size={14} color={filterAllergyFriendly ? "#ffffff" : "rgba(255,255,255,0.8)"} strokeWidth={2} />
                  <Text style={[
                    styles.filterChipText,
                    filterAllergyFriendly && styles.filterChipTextActive
                  ]}>{t.addPlant.allergyFriendly}</Text>
                </TouchableOpacity>
              </View>
              
              {hasActiveFilters && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={clearFilters}
                  activeOpacity={0.7}
                >
                  <X size={14} color="#f87171" strokeWidth={2} />
                  <Text style={styles.clearFiltersText}>{t.addPlant.clearFilters}</Text>
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
                  const sleepScore = plant.wellnessBenefits?.sleepScore || 0;
                  const stressScore = plant.wellnessBenefits?.stressScore || 0;
                  const airScore = plant.airPurification?.score || 0;
                  
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
                          <View style={styles.plantInfo}>
                            <Text style={styles.plantName}>{getPlantName(plant)}</Text>
                            <Text style={styles.plantScientificName}>
                              {plant.scientificName}
                            </Text>
                            <Text style={styles.plantDescription} numberOfLines={2}>
                              {getPlantDescription(plant)}
                            </Text>
                            
                            {/* Safety Badges Row */}
                            <View style={styles.safetyBadgesRow}>
                              {plant.safetyInfo?.petSafe && (
                                <View style={styles.safeBadge}>
                                  <PawPrint size={10} color="#16a34a" strokeWidth={2.5} />
                                  <Text style={styles.safeBadgeText}>{language === 'es' ? 'Mascotas' : 'Pets'}</Text>
                                </View>
                              )}
                              {(plant.safetyInfo?.childSafe || (plant.safetyInfo?.childSafe === undefined && plant.safetyInfo?.petSafe)) && (
                                <View style={styles.safeBadge}>
                                  <Baby size={10} color="#16a34a" strokeWidth={2.5} />
                                  <Text style={styles.safeBadgeText}>{language === 'es' ? 'Niños' : 'Kids'}</Text>
                                </View>
                              )}
                              {plant.safetyInfo?.allergyFriendly && (
                                <View style={styles.safeBadge}>
                                  <Sparkles size={10} color="#16a34a" strokeWidth={2.5} />
                                  <Text style={styles.safeBadgeText}>{language === 'es' ? 'Alérgicos' : 'Allergies'}</Text>
                                </View>
                              )}
                              {!plant.safetyInfo?.petSafe && plant.safetyInfo && (
                                <View style={styles.unsafeBadge}>
                                  <AlertTriangle size={10} color="#dc2626" strokeWidth={2.5} />
                                  <Text style={styles.unsafeBadgeText}>{language === 'es' ? 'Tóxica' : 'Toxic'}</Text>
                                </View>
                              )}
                            </View>
                            
                            {/* Wellness Benefits Row */}
                            <View style={styles.wellnessRow}>
                              {sleepScore > 0 && (
                                <View style={styles.wellnessTag}>
                                  <Moon size={10} color="#a78bfa" strokeWidth={2.5} />
                                  <Text style={styles.wellnessText}>{sleepScore}/10</Text>
                                </View>
                              )}
                              {stressScore > 0 && (
                                <View style={styles.wellnessTag}>
                                  <Heart size={10} color="#f472b6" strokeWidth={2.5} />
                                  <Text style={styles.wellnessText}>{stressScore}/10</Text>
                                </View>
                              )}
                              {airScore > 0 && (
                                <View style={styles.wellnessTag}>
                                  <Wind size={10} color="#34d399" strokeWidth={2.5} />
                                  <Text style={styles.wellnessText}>{airScore}/10</Text>
                                </View>
                              )}
                            </View>
                            
                            <View style={styles.plantTags}>
                              <View
                                style={[
                                  styles.difficultyTag,
                                  { backgroundColor: getDifficultyColor(plant.difficulty) },
                                ]}
                              >
                                <Text style={styles.tagText}>{getDifficultyText(plant.difficulty)}</Text>
                              </View>
                              
                              <View style={styles.tag}>
                                <Sun size={12} color="#ffffff" strokeWidth={2} />
                                <Text style={styles.tagText}>{getLightRequirement(plant)}</Text>
                              </View>
                              
                              <View style={styles.tag}>
                                <Droplets size={12} color="#ffffff" strokeWidth={2} />
                                <Text style={styles.tagText}>{getWateringSchedule(plant)}</Text>
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
                {selectedPlant ? getPlantName(selectedPlant) : ''}
              </Text>
              <Text style={styles.modalScientificName}>
                {selectedPlant?.scientificName}
              </Text>

              {/* Safety Information Section */}
              {selectedPlant?.safetyInfo && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>🛡️ {language === 'es' ? 'Información de Seguridad' : 'Safety Information'}</Text>
                  
                  {!selectedPlant.safetyInfo.petSafe && (
                    <View style={styles.dangerWarningBox}>
                      <AlertTriangle size={18} color="#dc2626" strokeWidth={2} />
                      <Text style={styles.dangerWarningText}>
                        {language === 'es' 
                          ? '⚠️ Esta planta puede ser TÓXICA para mascotas y niños si se ingiere.' 
                          : '⚠️ This plant may be TOXIC to pets and children if ingested.'}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.safetyInfoRow}>
                    <View style={[
                      styles.safetyInfoItem,
                      selectedPlant.safetyInfo.petSafe ? styles.safetyInfoItemSafe : styles.safetyInfoItemDanger
                    ]}>
                      <PawPrint size={16} color={selectedPlant.safetyInfo.petSafe ? "#16a34a" : "#dc2626"} strokeWidth={2} />
                      <Text style={[
                        styles.safetyInfoText,
                        selectedPlant.safetyInfo.petSafe ? styles.safetyInfoTextSafe : styles.safetyInfoTextDanger
                      ]}>
                        {selectedPlant.safetyInfo.petSafe 
                          ? (language === 'es' ? 'Seguro para mascotas' : 'Pet Safe')
                          : (language === 'es' ? 'No seguro para mascotas' : 'Not Pet Safe')}
                      </Text>
                    </View>
                    
                    <View style={[
                      styles.safetyInfoItem,
                      (selectedPlant.safetyInfo.childSafe ?? selectedPlant.safetyInfo.petSafe) ? styles.safetyInfoItemSafe : styles.safetyInfoItemDanger
                    ]}>
                      <Baby size={16} color={(selectedPlant.safetyInfo.childSafe ?? selectedPlant.safetyInfo.petSafe) ? "#16a34a" : "#dc2626"} strokeWidth={2} />
                      <Text style={[
                        styles.safetyInfoText,
                        (selectedPlant.safetyInfo.childSafe ?? selectedPlant.safetyInfo.petSafe) ? styles.safetyInfoTextSafe : styles.safetyInfoTextDanger
                      ]}>
                        {(selectedPlant.safetyInfo.childSafe ?? selectedPlant.safetyInfo.petSafe)
                          ? (language === 'es' ? 'Seguro para niños' : 'Child Safe')
                          : (language === 'es' ? 'No seguro para niños' : 'Not Child Safe')}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.allergenInfoBox}>
                    <Sparkles size={16} color="#f59e0b" strokeWidth={2} />
                    <View style={styles.allergenInfoContent}>
                      <Text style={styles.allergenInfoTitle}>{language === 'es' ? 'Información de Alergias' : 'Allergy Information'}</Text>
                      <Text style={styles.allergenInfoText}>
                        {language === 'es' ? selectedPlant.safetyInfo.allergenInfoEs : selectedPlant.safetyInfo.allergenInfo}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Wellness Benefits Section */}
              {(selectedPlant?.wellnessBenefits || selectedPlant?.airPurification) && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>🌿 {language === 'es' ? 'Beneficios de Bienestar' : 'Wellness Benefits'}</Text>
                  
                  {selectedPlant?.wellnessBenefits?.sleepScore && selectedPlant.wellnessBenefits.sleepScore > 0 && (
                    <View style={styles.wellnessBenefitItem}>
                      <View style={styles.wellnessBenefitHeader}>
                        <Moon size={16} color="#a78bfa" strokeWidth={2} />
                        <Text style={styles.wellnessBenefitTitle}>{language === 'es' ? 'Calidad del Sueño' : 'Sleep Quality'}</Text>
                        <View style={styles.scoreContainer}>
                          <Text style={styles.scoreText}>{selectedPlant.wellnessBenefits.sleepScore}/10</Text>
                        </View>
                      </View>
                      <Text style={styles.wellnessBenefitDesc}>
                        {language === 'es' 
                          ? selectedPlant.wellnessBenefits.sleepDescriptionEs 
                          : selectedPlant.wellnessBenefits.sleepDescription}
                      </Text>
                    </View>
                  )}
                  
                  {selectedPlant?.wellnessBenefits?.stressScore && selectedPlant.wellnessBenefits.stressScore > 0 && (
                    <View style={styles.wellnessBenefitItem}>
                      <View style={styles.wellnessBenefitHeader}>
                        <Heart size={16} color="#f472b6" strokeWidth={2} />
                        <Text style={styles.wellnessBenefitTitle}>{language === 'es' ? 'Reducción del Estrés' : 'Stress Relief'}</Text>
                        <View style={styles.scoreContainer}>
                          <Text style={styles.scoreText}>{selectedPlant.wellnessBenefits.stressScore}/10</Text>
                        </View>
                      </View>
                      <Text style={styles.wellnessBenefitDesc}>
                        {language === 'es' 
                          ? selectedPlant.wellnessBenefits.stressDescriptionEs 
                          : selectedPlant.wellnessBenefits.stressDescription}
                      </Text>
                    </View>
                  )}
                  
                  {selectedPlant?.airPurification?.score && selectedPlant.airPurification.score > 0 && (
                    <View style={styles.wellnessBenefitItem}>
                      <View style={styles.wellnessBenefitHeader}>
                        <Wind size={16} color="#34d399" strokeWidth={2} />
                        <Text style={styles.wellnessBenefitTitle}>{language === 'es' ? 'Purificación del Aire' : 'Air Purification'}</Text>
                        <View style={styles.scoreContainer}>
                          <Text style={styles.scoreText}>{selectedPlant.airPurification.score}/10</Text>
                        </View>
                      </View>
                      <Text style={styles.wellnessBenefitDesc}>
                        {language === 'es' 
                          ? selectedPlant.airPurification.descriptionEs 
                          : selectedPlant.airPurification.description}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {selectedPlant?.careInstructions && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>{t.addPlant.careInstructions}</Text>
                  
                  <View style={styles.careItem}>
                    <Text style={styles.careLabel}>{t.addPlant.light}:</Text>
                    <Text style={styles.careText}>{getCareLight(selectedPlant) || getLightRequirement(selectedPlant) || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.careItem}>
                    <Text style={styles.careLabel}>{t.addPlant.water}:</Text>
                    <Text style={styles.careText}>{getCareWater(selectedPlant) || getWateringSchedule(selectedPlant) || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.careItem}>
                    <Text style={styles.careLabel}>{t.addPlant.temperature}:</Text>
                    <Text style={styles.careText}>{getCareTemperature(selectedPlant) || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.careItem}>
                    <Text style={styles.careLabel}>{t.addPlant.humidity}:</Text>
                    <Text style={styles.careText}>{getCareHumidity(selectedPlant) || 'N/A'}</Text>
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
    paddingBottom: 8,
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
  filtersContainer: {
    marginTop: 12,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  filtersRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  filterChipActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  filterChipEasy: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  filterChipModerate: {
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  },
  filterChipAdvanced: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.8)",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  clearFiltersButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    alignSelf: "flex-start" as const,
    marginTop: 8,
    gap: 4,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: "#f87171",
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
    marginBottom: 8,
  },
  wellnessRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 6,
    marginBottom: 8,
  },
  wellnessTag: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  wellnessText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.9)",
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
  wellnessBenefitItem: {
    marginBottom: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
  },
  wellnessBenefitHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 8,
    gap: 8,
  },
  wellnessBenefitTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#334155",
    flex: 1,
  },
  scoreContainer: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: "#475569",
  },
  wellnessBenefitDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 19,
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
  safetyBadgesRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 6,
    marginBottom: 6,
  },
  safeBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(22, 163, 74, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(22, 163, 74, 0.3)",
  },
  safeBadgeText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: "#22c55e",
  },
  unsafeBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(220, 38, 38, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.3)",
  },
  unsafeBadgeText: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: "#f87171",
  },
  dangerWarningBox: {
    flexDirection: "row" as const,
    backgroundColor: "#fef2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 10,
    alignItems: "flex-start" as const,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  dangerWarningText: {
    flex: 1,
    fontSize: 13,
    color: "#991b1b",
    lineHeight: 19,
    fontWeight: "500" as const,
  },
  safetyInfoRow: {
    flexDirection: "row" as const,
    gap: 10,
    marginBottom: 12,
  },
  safetyInfoItem: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  safetyInfoItemSafe: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  safetyInfoItemDanger: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  safetyInfoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  safetyInfoTextSafe: {
    color: "#16a34a",
  },
  safetyInfoTextDanger: {
    color: "#dc2626",
  },
  allergenInfoBox: {
    flexDirection: "row" as const,
    backgroundColor: "#fffbeb",
    borderRadius: 10,
    padding: 12,
    gap: 10,
    alignItems: "flex-start" as const,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  allergenInfoContent: {
    flex: 1,
  },
  allergenInfoTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#92400e",
    marginBottom: 4,
  },
  allergenInfoText: {
    fontSize: 12,
    color: "#a16207",
    lineHeight: 18,
  },
});
