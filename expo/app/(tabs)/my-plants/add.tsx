import { useRouter } from "expo-router";
import { ChevronLeft, Search, Droplets, Sun, X, Moon, Heart, Wind, PawPrint, Sparkles, Baby, AlertTriangle, Gauge, Plus, ChevronDown, ChevronUp, Leaf } from "lucide-react-native";
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
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useMyPlants } from "@/contexts/MyPlantsContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";
import { COMMON_PLANTS } from "@/constants/commonPlants";
import { Plant } from "@/types/plant";
import { Colors } from "@/constants/colors";
import * as Haptics from "expo-haptics";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AddPlantScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addPlant } = useMyPlants();
  const { language } = useUserPreferences();
  const t = getTranslations(language);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [wateringDays, setWateringDays] = useState<string>("7");
  const [showCareDetails, setShowCareDetails] = useState<boolean>(false);

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
    setShowCareDetails(false);

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
        return Colors.status.success;
      case "Moderate":
        return Colors.status.warning;
      case "Advanced":
        return Colors.status.error;
      default:
        return Colors.text.tertiary;
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

  // Compact score badge component
  const ScoreBadge = ({ score, icon, color }: { score: number; icon: React.ReactNode; color: string }) => (
    <View style={[styles.scoreBadge, { backgroundColor: `${color}15` }]}>
      {icon}
      <Text style={[styles.scoreBadgeText, { color }]}>{score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[Colors.lightSecondary, Colors.light]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ChevronLeft size={28} color={Colors.charcoal} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.addPlant.title}</Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color={Colors.text.secondary} strokeWidth={2} />
              <TextInput
                style={styles.searchInput}
                placeholder={t.addPlant.searchPlaceholder}
                placeholderTextColor={Colors.text.tertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={20} color={Colors.text.secondary} strokeWidth={2} />
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
                  <Gauge size={14} color={filterDifficulty === 'Easy' ? Colors.light : Colors.status.success} strokeWidth={2} />
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
                  <Gauge size={14} color={filterDifficulty === 'Moderate' ? Colors.light : Colors.status.warning} strokeWidth={2} />
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
                  <Gauge size={14} color={filterDifficulty === 'Advanced' ? Colors.light : Colors.status.error} strokeWidth={2} />
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
                  <Sparkles size={14} color={filterAllergyFriendly ? Colors.light : Colors.primary} strokeWidth={2} />
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
                  <X size={14} color={Colors.status.error} strokeWidth={2} />
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
                <Leaf size={40} color={Colors.text.tertiary} strokeWidth={1.5} />
                <Text style={styles.emptyText}>{t.addPlant.noResults}</Text>
              </View>
            ) : (
              <View style={styles.plantsList}>
                {filteredPlants.map((plant) => {
                  const sleepScore = plant.wellnessBenefits?.sleepScore || 0;
                  const stressScore = plant.wellnessBenefits?.stressScore || 0;
                  const airScore = plant.airPurification?.score || 0;
                  const isPetSafe = plant.safetyInfo?.petSafe;

                  return (
                    <TouchableOpacity
                      key={plant.id}
                      style={styles.plantCard}
                      onPress={() => handleSelectPlant(plant)}
                      activeOpacity={0.8}
                    >
                      {/* Card Header */}
                      <View style={styles.cardHeader}>
                        <View style={styles.cardTitleSection}>
                          <Text style={styles.plantName} numberOfLines={1}>{getPlantName(plant)}</Text>
                          <Text style={styles.plantScientificName} numberOfLines={1}>
                            {plant.scientificName}
                          </Text>
                        </View>
                        <View style={[
                          styles.difficultyBadge,
                          { backgroundColor: getDifficultyColor(plant.difficulty) },
                        ]}>
                          <Text style={styles.difficultyBadgeText}>{getDifficultyText(plant.difficulty)}</Text>
                        </View>
                      </View>

                      {/* Quick Info Pills */}
                      <View style={styles.quickPillsRow}>
                        <View style={styles.quickPill}>
                          <Sun size={12} color="#f59e0b" strokeWidth={2} />
                          <Text style={styles.quickPillText}>{getLightRequirement(plant)}</Text>
                        </View>
                        <View style={styles.quickPill}>
                          <Droplets size={12} color="#3b82f6" strokeWidth={2} />
                          <Text style={styles.quickPillText}>{getWateringSchedule(plant)}</Text>
                        </View>
                      </View>

                      {/* Scores Row - Compact */}
                      {(sleepScore > 0 || stressScore > 0 || airScore > 0) && (
                        <View style={styles.scoresRow}>
                          {airScore > 0 && (
                            <View style={styles.scoreItem}>
                              <Wind size={12} color="#16a34a" strokeWidth={2} />
                              <Text style={[styles.scoreText, { color: '#16a34a' }]}>{airScore}</Text>
                            </View>
                          )}
                          {sleepScore > 0 && (
                            <View style={styles.scoreItem}>
                              <Moon size={12} color="#7c3aed" strokeWidth={2} />
                              <Text style={[styles.scoreText, { color: '#7c3aed' }]}>{sleepScore}</Text>
                            </View>
                          )}
                          {stressScore > 0 && (
                            <View style={styles.scoreItem}>
                              <Heart size={12} color="#db2777" strokeWidth={2} />
                              <Text style={[styles.scoreText, { color: '#db2777' }]}>{stressScore}</Text>
                            </View>
                          )}
                        </View>
                      )}

                      {/* Safety Indicator */}
                      <View style={styles.safetyIndicator}>
                        {isPetSafe ? (
                          <View style={styles.safeIndicator}>
                            <PawPrint size={12} color={Colors.status.success} strokeWidth={2} />
                            <Text style={styles.safeIndicatorText}>
                              {language === 'es' ? 'Segura' : 'Safe'}
                            </Text>
                          </View>
                        ) : plant.safetyInfo && (
                          <View style={styles.toxicIndicator}>
                            <AlertTriangle size={12} color={Colors.status.error} strokeWidth={2} />
                            <Text style={styles.toxicIndicatorText}>
                              {language === 'es' ? 'Tóxica' : 'Toxic'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* REDESIGNED MODAL - Clean, Actions at Top */}
      <Modal
        visible={selectedPlant !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPlant(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
            {/* Drag Handle */}
            <View style={styles.modalHandle} />

            {/* STICKY HEADER WITH ACTIONS */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setSelectedPlant(null)}
                activeOpacity={0.7}
              >
                <X size={20} color={Colors.text.secondary} strokeWidth={2.5} />
              </TouchableOpacity>

              <View style={styles.modalHeaderCenter}>
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                  {selectedPlant ? getPlantName(selectedPlant) : ''}
                </Text>
                <Text style={styles.modalHeaderSubtitle} numberOfLines={1}>
                  {selectedPlant?.scientificName}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddPlant}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={Colors.gradient.primary}
                  style={styles.modalAddButtonGradient}
                >
                  <Plus size={18} color={Colors.light} strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {/* Quick Stats Row - Compact Visual Summary */}
              <View style={styles.quickStatsRow}>
                {/* Difficulty */}
                <View style={styles.quickStatItem}>
                  <View style={[styles.quickStatIcon, { backgroundColor: `${getDifficultyColor(selectedPlant?.difficulty || 'Easy')}20` }]}>
                    <Gauge size={18} color={getDifficultyColor(selectedPlant?.difficulty || 'Easy')} strokeWidth={2} />
                  </View>
                  <Text style={styles.quickStatLabel}>{language === 'es' ? 'Dificultad' : 'Difficulty'}</Text>
                  <Text style={[styles.quickStatValue, { color: getDifficultyColor(selectedPlant?.difficulty || 'Easy') }]}>
                    {getDifficultyText(selectedPlant?.difficulty || 'Easy')}
                  </Text>
                </View>

                {/* Light */}
                <View style={styles.quickStatItem}>
                  <View style={[styles.quickStatIcon, { backgroundColor: '#fef3c720' }]}>
                    <Sun size={18} color="#f59e0b" strokeWidth={2} />
                  </View>
                  <Text style={styles.quickStatLabel}>{language === 'es' ? 'Luz' : 'Light'}</Text>
                  <Text style={styles.quickStatValue} numberOfLines={1}>
                    {selectedPlant ? getLightRequirement(selectedPlant) : ''}
                  </Text>
                </View>

                {/* Water */}
                <View style={styles.quickStatItem}>
                  <View style={[styles.quickStatIcon, { backgroundColor: '#dbeafe20' }]}>
                    <Droplets size={18} color="#3b82f6" strokeWidth={2} />
                  </View>
                  <Text style={styles.quickStatLabel}>{language === 'es' ? 'Riego' : 'Water'}</Text>
                  <Text style={styles.quickStatValue} numberOfLines={1}>
                    {selectedPlant ? getWateringSchedule(selectedPlant) : ''}
                  </Text>
                </View>
              </View>

              {/* Safety Banner - Only if toxic */}
              {selectedPlant?.safetyInfo && !selectedPlant.safetyInfo.petSafe && (
                <View style={styles.toxicBanner}>
                  <AlertTriangle size={16} color={Colors.status.error} strokeWidth={2.5} />
                  <Text style={styles.toxicBannerText}>
                    {language === 'es'
                      ? 'Tóxica para mascotas y niños'
                      : 'Toxic to pets and children'}
                  </Text>
                </View>
              )}

              {/* Safety Badges - Compact */}
              {selectedPlant?.safetyInfo && (
                <View style={styles.safetyRow}>
                  <View style={[
                    styles.safetyChip,
                    selectedPlant.safetyInfo.petSafe ? styles.safetyChipSafe : styles.safetyChipDanger
                  ]}>
                    <PawPrint size={14} color={selectedPlant.safetyInfo.petSafe ? Colors.status.success : Colors.status.error} strokeWidth={2} />
                    <Text style={[
                      styles.safetyChipText,
                      selectedPlant.safetyInfo.petSafe ? styles.safetyChipTextSafe : styles.safetyChipTextDanger
                    ]}>
                      {selectedPlant.safetyInfo.petSafe
                        ? (language === 'es' ? 'Mascotas' : 'Pet Safe')
                        : (language === 'es' ? 'No mascotas' : 'Not Pet Safe')}
                    </Text>
                  </View>

                  <View style={[
                    styles.safetyChip,
                    (selectedPlant.safetyInfo.childSafe ?? selectedPlant.safetyInfo.petSafe) ? styles.safetyChipSafe : styles.safetyChipDanger
                  ]}>
                    <Baby size={14} color={(selectedPlant.safetyInfo.childSafe ?? selectedPlant.safetyInfo.petSafe) ? Colors.status.success : Colors.status.error} strokeWidth={2} />
                    <Text style={[
                      styles.safetyChipText,
                      (selectedPlant.safetyInfo.childSafe ?? selectedPlant.safetyInfo.petSafe) ? styles.safetyChipTextSafe : styles.safetyChipTextDanger
                    ]}>
                      {(selectedPlant.safetyInfo.childSafe ?? selectedPlant.safetyInfo.petSafe)
                        ? (language === 'es' ? 'Niños' : 'Child Safe')
                        : (language === 'es' ? 'No niños' : 'Not Child Safe')}
                    </Text>
                  </View>

                  {selectedPlant.safetyInfo.allergyFriendly && (
                    <View style={[styles.safetyChip, styles.safetyChipSafe]}>
                      <Sparkles size={14} color={Colors.status.success} strokeWidth={2} />
                      <Text style={[styles.safetyChipText, styles.safetyChipTextSafe]}>
                        {language === 'es' ? 'Hipoalergénica' : 'Hypoallergenic'}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Wellness Scores - Compact Horizontal */}
              {(selectedPlant?.wellnessBenefits || selectedPlant?.airPurification) && (
                <View style={styles.wellnessSection}>
                  <Text style={styles.sectionLabel}>{language === 'es' ? 'Beneficios' : 'Benefits'}</Text>
                  <View style={styles.wellnessScoresRow}>
                    {selectedPlant?.airPurification?.score && selectedPlant.airPurification.score > 0 && (
                      <View style={styles.wellnessScoreItem}>
                        <View style={[styles.wellnessScoreIcon, { backgroundColor: '#dcfce7' }]}>
                          <Wind size={16} color="#16a34a" strokeWidth={2} />
                        </View>
                        <View style={styles.wellnessScoreContent}>
                          <Text style={styles.wellnessScoreLabel}>{language === 'es' ? 'Aire' : 'Air'}</Text>
                          <Text style={[styles.wellnessScoreValue, { color: '#16a34a' }]}>{selectedPlant.airPurification.score}/10</Text>
                        </View>
                      </View>
                    )}

                    {selectedPlant?.wellnessBenefits?.sleepScore && selectedPlant.wellnessBenefits.sleepScore > 0 && (
                      <View style={styles.wellnessScoreItem}>
                        <View style={[styles.wellnessScoreIcon, { backgroundColor: '#ede9fe' }]}>
                          <Moon size={16} color="#7c3aed" strokeWidth={2} />
                        </View>
                        <View style={styles.wellnessScoreContent}>
                          <Text style={styles.wellnessScoreLabel}>{language === 'es' ? 'Sueño' : 'Sleep'}</Text>
                          <Text style={[styles.wellnessScoreValue, { color: '#7c3aed' }]}>{selectedPlant.wellnessBenefits.sleepScore}/10</Text>
                        </View>
                      </View>
                    )}

                    {selectedPlant?.wellnessBenefits?.stressScore && selectedPlant.wellnessBenefits.stressScore > 0 && (
                      <View style={styles.wellnessScoreItem}>
                        <View style={[styles.wellnessScoreIcon, { backgroundColor: '#fce7f3' }]}>
                          <Heart size={16} color="#db2777" strokeWidth={2} />
                        </View>
                        <View style={styles.wellnessScoreContent}>
                          <Text style={styles.wellnessScoreLabel}>{language === 'es' ? 'Estrés' : 'Stress'}</Text>
                          <Text style={[styles.wellnessScoreValue, { color: '#db2777' }]}>{selectedPlant.wellnessBenefits.stressScore}/10</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Customize Section - Inputs */}
              <View style={styles.customizeSection}>
                <Text style={styles.sectionLabel}>{language === 'es' ? 'Personalizar' : 'Customize'}</Text>

                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>{t.addPlant.nickname}</Text>
                    <TextInput
                      style={styles.input}
                      value={nickname}
                      onChangeText={setNickname}
                      placeholder={t.addPlant.nicknamePlaceholder}
                      placeholderTextColor={Colors.text.tertiary}
                    />
                  </View>

                  <View style={[styles.inputWrapper, { flex: 0.5 }]}>
                    <Text style={styles.inputLabel}>{language === 'es' ? 'Días' : 'Days'}</Text>
                    <TextInput
                      style={styles.input}
                      value={wateringDays}
                      onChangeText={setWateringDays}
                      keyboardType="number-pad"
                      placeholder="7"
                      placeholderTextColor={Colors.text.tertiary}
                    />
                  </View>
                </View>
              </View>

              {/* Expandable Care Details */}
              {selectedPlant?.careInstructions && (
                <TouchableOpacity
                  style={styles.expandableSection}
                  onPress={() => setShowCareDetails(!showCareDetails)}
                  activeOpacity={0.7}
                >
                  <View style={styles.expandableHeader}>
                    <Leaf size={18} color={Colors.primary} strokeWidth={2} />
                    <Text style={styles.expandableTitle}>
                      {language === 'es' ? 'Instrucciones de cuidado' : 'Care Instructions'}
                    </Text>
                    {showCareDetails ? (
                      <ChevronUp size={20} color={Colors.text.secondary} strokeWidth={2} />
                    ) : (
                      <ChevronDown size={20} color={Colors.text.secondary} strokeWidth={2} />
                    )}
                  </View>

                  {showCareDetails && (
                    <View style={styles.expandableContent}>
                      {getCareLight(selectedPlant) && (
                        <View style={styles.careDetailRow}>
                          <Sun size={14} color="#f59e0b" strokeWidth={2} />
                          <Text style={styles.careDetailText}>{getCareLight(selectedPlant)}</Text>
                        </View>
                      )}
                      {getCareWater(selectedPlant) && (
                        <View style={styles.careDetailRow}>
                          <Droplets size={14} color="#3b82f6" strokeWidth={2} />
                          <Text style={styles.careDetailText}>{getCareWater(selectedPlant)}</Text>
                        </View>
                      )}
                      {getCareTemperature(selectedPlant) && (
                        <View style={styles.careDetailRow}>
                          <View style={styles.tempIcon}>
                            <Text style={styles.tempIconText}>°C</Text>
                          </View>
                          <Text style={styles.careDetailText}>{getCareTemperature(selectedPlant)}</Text>
                        </View>
                      )}
                      {getCareHumidity(selectedPlant) && (
                        <View style={styles.careDetailRow}>
                          <Wind size={14} color="#06b6d4" strokeWidth={2} />
                          <Text style={styles.careDetailText}>{getCareHumidity(selectedPlant)}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              )}

              {/* Bottom Action Button - Large, Clear */}
              <TouchableOpacity
                style={styles.bottomAddButton}
                onPress={handleAddPlant}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={Colors.gradient.primary}
                  style={styles.bottomAddButtonGradient}
                >
                  <Plus size={20} color={Colors.light} strokeWidth={2.5} />
                  <Text style={styles.bottomAddButtonText}>{t.addPlant.addToMyPlants}</Text>
                </LinearGradient>
              </TouchableOpacity>
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
    backgroundColor: Colors.softWhite,
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
    backgroundColor: Colors.warmGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.charcoal,
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.warmGray,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.charcoal,
    fontWeight: "500",
  },
  filtersContainer: {
    marginTop: 12,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.warmGray,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipEasy: {
    backgroundColor: Colors.status.success,
    borderColor: Colors.status.success,
  },
  filterChipModerate: {
    backgroundColor: Colors.status.warning,
    borderColor: Colors.status.warning,
  },
  filterChipAdvanced: {
    backgroundColor: Colors.status.error,
    borderColor: Colors.status.error,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: Colors.light,
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
    gap: 4,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.status.error,
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
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.text.tertiary,
    textAlign: "center",
  },
  plantsList: {
    gap: 10,
  },
  plantCard: {
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardTitleSection: {
    flex: 1,
    marginRight: 10,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.charcoal,
  },
  plantScientificName: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontStyle: "italic",
    marginTop: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.light,
  },
  quickPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  quickPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.softWhite,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 5,
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text.secondary,
  },
  scoresRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "700",
  },
  safetyIndicator: {
    flexDirection: "row",
  },
  safeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  safeIndicatorText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.status.success,
  },
  toxicIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  toxicIndicatorText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.status.error,
  },

  // ========== REDESIGNED MODAL STYLES ==========
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay.dark,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.warmGray,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warmGray,
    gap: 12,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeaderCenter: {
    flex: 1,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.charcoal,
    letterSpacing: -0.3,
  },
  modalHeaderSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontStyle: "italic",
    marginTop: 2,
  },
  modalAddButton: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modalAddButtonGradient: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  modalScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },

  // Quick Stats Row
  quickStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.softWhite,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.warmGray,
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickStatLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.text.tertiary,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  quickStatValue: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.charcoal,
    textAlign: "center",
  },

  // Toxic Banner
  toxicBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.status.errorLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.status.error,
  },
  toxicBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.status.error,
  },

  // Safety Row
  safetyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  safetyChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
    borderWidth: 1,
  },
  safetyChipSafe: {
    backgroundColor: Colors.status.successLight,
    borderColor: Colors.status.success,
  },
  safetyChipDanger: {
    backgroundColor: Colors.status.errorLight,
    borderColor: Colors.status.error,
  },
  safetyChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  safetyChipTextSafe: {
    color: Colors.status.success,
  },
  safetyChipTextDanger: {
    color: Colors.status.error,
  },

  // Wellness Section
  wellnessSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  wellnessScoresRow: {
    flexDirection: "row",
    gap: 10,
  },
  wellnessScoreItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.softWhite,
    borderRadius: 12,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.warmGray,
  },
  wellnessScoreIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  wellnessScoreContent: {
    flex: 1,
  },
  wellnessScoreLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.text.tertiary,
  },
  wellnessScoreValue: {
    fontSize: 14,
    fontWeight: "800",
  },

  // Customize Section
  customizeSection: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.softWhite,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.charcoal,
    borderWidth: 1,
    borderColor: Colors.warmGray,
    fontWeight: "500",
  },

  // Expandable Section
  expandableSection: {
    backgroundColor: Colors.softWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.warmGray,
    marginBottom: 16,
    overflow: "hidden",
  },
  expandableHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 10,
  },
  expandableTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.charcoal,
  },
  expandableContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.warmGray,
    paddingTop: 12,
  },
  careDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  careDetailText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  tempIcon: {
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tempIconText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ef4444",
  },

  // Bottom Add Button
  bottomAddButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomAddButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  bottomAddButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light,
  },

  // Score Badge
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
