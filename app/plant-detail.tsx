import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sun,
  Droplets,
  ThermometerSun,
  Wind,
  Sprout,
  CheckCircle2,
  Leaf,
  Moon,
  Heart,
  PawPrint,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react-native";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { Plant } from "@/types/plant";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";
import { usePlantImages } from "@/contexts/PlantImagesContext";

const { width } = Dimensions.get("window");

export default function PlantDetailScreen() {
  const params = useLocalSearchParams<{ plantData: string; allPlants?: string; currentIndex?: string }>();
  const router = useRouter();
  const { language } = useUserPreferences();
  const t = getTranslations(language);
  const { getPlantImage } = usePlantImages();

  const [currentPlantIndex, setCurrentPlantIndex] = useState(() => {
    return params.currentIndex ? parseInt(params.currentIndex, 10) : 0;
  });

  const allPlants: Plant[] = React.useMemo(() => {
    if (params.allPlants) {
      try {
        return JSON.parse(params.allPlants);
      } catch {
        return [];
      }
    }
    return [];
  }, [params.allPlants]);

  const getCurrentPlant = useCallback((): Plant | null => {
    if (allPlants.length > 0 && currentPlantIndex < allPlants.length) {
      return allPlants[currentPlantIndex];
    }
    if (params.plantData) {
      try {
        const plantDataStr = typeof params.plantData === 'string' ? params.plantData : JSON.stringify(params.plantData);
        return JSON.parse(plantDataStr);
      } catch {
        return null;
      }
    }
    return null;
  }, [allPlants, currentPlantIndex, params.plantData]);

  const plant = getCurrentPlant();
  const hasMultiplePlants = allPlants.length > 1;
  const canGoBack = currentPlantIndex > 0;
  const canGoForward = currentPlantIndex < allPlants.length - 1;

  const goToPreviousPlant = useCallback(() => {
    if (canGoBack) {
      setCurrentPlantIndex(prev => prev - 1);
    }
  }, [canGoBack]);

  const goToNextPlant = useCallback(() => {
    if (canGoForward) {
      setCurrentPlantIndex(prev => prev + 1);
    }
  }, [canGoForward]);

  if (!params.plantData && allPlants.length === 0) {
    return null;
  }

  if (!plant) {
    try {
      const plantDataStr = typeof params.plantData === 'string' ? params.plantData : JSON.stringify(params.plantData);
      const fallbackPlant = JSON.parse(plantDataStr);
      if (!fallbackPlant || typeof fallbackPlant !== 'object') {
        throw new Error('Invalid plant data structure');
      }
    } catch (error) {
      console.error("Error parsing plant data:", error);
      return (
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#ef4444', marginBottom: 16 }}>{t.plantDetail.errorLoading}</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#52b788', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
              onPress={() => router.back()}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600' as const }}>{t.plantDetail.goBack}</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      );
    }
  }

  if (!plant) {
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#52b788";
      case "Moderate":
        return "#f59e0b";
      case "Advanced":
        return "#ef4444";
      default:
        return "#52b788";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return t.plantDetail.easy;
      case "Moderate":
        return t.plantDetail.moderate;
      case "Advanced":
        return t.plantDetail.advanced;
      default:
        return difficulty;
    }
  };

  const plantImage = getPlantImage(plant.id, plant.name) || plant.imageUrl;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: plantImage || 'https://images.unsplash.com/photo-1463320898484-cdcfb6d08e12?w=400&q=70' }}
        style={styles.headerImage}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={200}
        placeholder={{ blurhash: "LGF5?xYk^6#M@-5c,1J5@[or[Q6." }}
        onError={(error) => {
          console.error(`Error loading image of ${plant.name}:`, error.error || error);
        }}
      />
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.6)"]}
        style={styles.headerGradient}
      />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          
          {hasMultiplePlants && (
            <View style={styles.plantCounter}>
              <Text style={styles.plantCounterText}>
                {currentPlantIndex + 1} / {allPlants.length}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>

      {hasMultiplePlants && (
        <>
          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowLeft, !canGoBack && styles.navArrowDisabled]}
            onPress={goToPreviousPlant}
            activeOpacity={canGoBack ? 0.8 : 1}
            disabled={!canGoBack}
          >
            <ChevronLeft size={32} color={canGoBack ? "#ffffff" : "rgba(255,255,255,0.3)"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowRight, !canGoForward && styles.navArrowDisabled]}
            onPress={goToNextPlant}
            activeOpacity={canGoForward ? 0.8 : 1}
            disabled={!canGoForward}
          >
            <ChevronRight size={32} color={canGoForward ? "#ffffff" : "rgba(255,255,255,0.3)"} />
          </TouchableOpacity>
        </>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.plantHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.plantScientific}>{plant.scientificName}</Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(plant.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>
                {getDifficultyText(plant.difficulty)}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{plant.description}</Text>

          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Sun size={20} color="#f59e0b" />
              <Text style={styles.quickInfoText}>{plant.lightRequirement}</Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Droplets size={20} color="#3b82f6" />
              <Text style={styles.quickInfoText}>{plant.wateringSchedule}</Text>
            </View>
          </View>

          {plant.airPurification && (
            <>
              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t.plantDetail.airPurification}</Text>

              <View style={styles.airPurificationCard}>
                <View style={styles.airPurificationHeader}>
                  <View style={styles.airPurificationIconContainer}>
                    <Leaf size={28} color="#ffffff" />
                  </View>
                  <View style={styles.airPurificationScoreContainer}>
                    <Text style={styles.airPurificationScoreLabel}>{t.plantDetail.airPurificationScore}</Text>
                    <View style={styles.airPurificationScoreRow}>
                      <Text style={styles.airPurificationScore}>{plant.airPurification.score}</Text>
                      <Text style={styles.airPurificationScoreMax}>{t.plantDetail.outOf10}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.airPurificationBar}>
                  <View style={[styles.airPurificationBarFill, { width: `${plant.airPurification.score * 10}%` }]} />
                </View>
                <Text style={styles.airPurificationDescription}>
                  {language === 'es' ? plant.airPurification.descriptionEs : plant.airPurification.description}
                </Text>
              </View>
            </>
          )}

          {plant.wellnessBenefits && (
            <>
              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t.plantDetail.wellnessBenefits}</Text>

              <View style={styles.wellnessCard}>
                <View style={styles.wellnessItem}>
                  <View style={styles.wellnessHeader}>
                    <View style={styles.wellnessIconContainer}>
                      <Moon size={24} color="#ffffff" />
                    </View>
                    <View style={styles.wellnessScoreContainer}>
                      <Text style={styles.wellnessScoreLabel}>{t.plantDetail.sleepScore}</Text>
                      <View style={styles.wellnessScoreRow}>
                        <Text style={styles.wellnessScore}>{plant.wellnessBenefits.sleepScore}</Text>
                        <Text style={styles.wellnessScoreMax}>{t.plantDetail.outOf10}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.wellnessBar}>
                    <View style={[styles.wellnessBarFillSleep, { width: `${plant.wellnessBenefits.sleepScore * 10}%` }]} />
                  </View>
                  <Text style={styles.wellnessDescription}>
                    {language === 'es' ? plant.wellnessBenefits.sleepDescriptionEs : plant.wellnessBenefits.sleepDescription}
                  </Text>
                </View>

                <View style={styles.wellnessDivider} />

                <View style={styles.wellnessItem}>
                  <View style={styles.wellnessHeader}>
                    <View style={[styles.wellnessIconContainer, styles.wellnessIconStress]}>
                      <Heart size={24} color="#ffffff" />
                    </View>
                    <View style={styles.wellnessScoreContainer}>
                      <Text style={styles.wellnessScoreLabel}>{t.plantDetail.stressScore}</Text>
                      <View style={styles.wellnessScoreRow}>
                        <Text style={[styles.wellnessScore, styles.wellnessScoreStress]}>{plant.wellnessBenefits.stressScore}</Text>
                        <Text style={styles.wellnessScoreMax}>{t.plantDetail.outOf10}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.wellnessBar}>
                    <View style={[styles.wellnessBarFillStress, { width: `${plant.wellnessBenefits.stressScore * 10}%` }]} />
                  </View>
                  <Text style={styles.wellnessDescription}>
                    {language === 'es' ? plant.wellnessBenefits.stressDescriptionEs : plant.wellnessBenefits.stressDescription}
                  </Text>
                </View>
              </View>
            </>
          )}

          {(plant.careInstructions || plant.lightRequirement) && (
            <>
              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t.plantDetail.careInstructions}</Text>

              <View style={styles.careSection}>
                <View style={styles.careItem}>
                  <View style={styles.careIconContainer}>
                    <Sun size={24} color="#f59e0b" />
                  </View>
                  <View style={styles.careContent}>
                    <Text style={styles.careTitle}>{t.plantDetail.light}</Text>
                    <Text style={styles.careText}>{plant.careInstructions?.light || plant.lightRequirement || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.careItem}>
                  <View style={styles.careIconContainer}>
                    <Droplets size={24} color="#3b82f6" />
                  </View>
                  <View style={styles.careContent}>
                    <Text style={styles.careTitle}>{t.plantDetail.watering}</Text>
                    <Text style={styles.careText}>{plant.careInstructions?.water || plant.wateringSchedule || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.careItem}>
                  <View style={styles.careIconContainer}>
                    <ThermometerSun size={24} color="#ef4444" />
                  </View>
                  <View style={styles.careContent}>
                    <Text style={styles.careTitle}>{t.plantDetail.temperature}</Text>
                    <Text style={styles.careText}>
                      {plant.careInstructions?.temperature || 'N/A'}
                    </Text>
                  </View>
                </View>

                <View style={styles.careItem}>
                  <View style={styles.careIconContainer}>
                    <Wind size={24} color="#06b6d4" />
                  </View>
                  <View style={styles.careContent}>
                    <Text style={styles.careTitle}>{t.plantDetail.humidity}</Text>
                    <Text style={styles.careText}>
                      {plant.careInstructions?.humidity || 'N/A'}
                    </Text>
                  </View>
                </View>

                <View style={styles.careItem}>
                  <View style={styles.careIconContainer}>
                    <Sprout size={24} color="#52b788" />
                  </View>
                  <View style={styles.careContent}>
                    <Text style={styles.careTitle}>{t.plantDetail.fertilizer}</Text>
                    <Text style={styles.careText}>
                      {plant.careInstructions?.fertilizer || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>

              {plant.careInstructions?.tips && plant.careInstructions.tips.length > 0 && (
                <>
                  <View style={styles.divider} />

                  <Text style={styles.sectionTitle}>{t.plantDetail.additionalTips}</Text>

                  <View style={styles.tipsContainer}>
                    {plant.careInstructions.tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <CheckCircle2 size={20} color="#52b788" />
                        <Text style={styles.tipText}>{tip || ''}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </>
          )}

          {plant.safetyInfo && (
            <>
              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t.plantDetail.safetyInfo}</Text>

              <View style={styles.safetyCard}>
                <View style={styles.safetyItem}>
                  <View style={[
                    styles.safetyIconContainer,
                    plant.safetyInfo.petSafe ? styles.safetyIconSafe : styles.safetyIconDanger
                  ]}>
                    <PawPrint size={24} color="#ffffff" />
                  </View>
                  <View style={styles.safetyContent}>
                    <View style={styles.safetyHeader}>
                      {plant.safetyInfo.petSafe ? (
                        <ShieldCheck size={18} color="#16a34a" />
                      ) : (
                        <ShieldAlert size={18} color="#dc2626" />
                      )}
                      <Text style={[
                        styles.safetyTitle,
                        plant.safetyInfo.petSafe ? styles.safetyTitleSafe : styles.safetyTitleDanger
                      ]}>
                        {plant.safetyInfo.petSafe ? t.plantDetail.petSafe : t.plantDetail.notPetSafe}
                      </Text>
                    </View>
                    <Text style={styles.safetyDescription}>
                      {language === 'es' ? plant.safetyInfo.petSafeDescriptionEs : plant.safetyInfo.petSafeDescription}
                    </Text>
                  </View>
                </View>

                <View style={styles.safetyDivider} />

                <View style={styles.safetyItem}>
                  <View style={[styles.safetyIconContainer, styles.safetyIconAllergen]}>
                    <AlertTriangle size={24} color="#ffffff" />
                  </View>
                  <View style={styles.safetyContent}>
                    <Text style={styles.safetyTitleAllergen}>{t.plantDetail.allergens}</Text>
                    <Text style={styles.safetyDescription}>
                      {language === 'es' ? plant.safetyInfo.allergenInfoEs : plant.safetyInfo.allergenInfo}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              {t.plantDetail.disclaimer}
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerImage: {
    width: width,
    height: 360,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#e5e7eb",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 360,
  },
  safeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  plantCounter: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  plantCounterText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  navArrow: {
    position: "absolute",
    top: 180,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(26, 77, 46, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  navArrowLeft: {
    left: 16,
  },
  navArrowRight: {
    right: 16,
  },
  navArrowDisabled: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    flex: 1,
    marginTop: 300,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: "100%",
  },
  plantHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  plantName: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 6,
  },
  plantScientific: {
    fontSize: 16,
    color: "#6b7280",
    fontStyle: "italic",
  },
  difficultyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  description: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 26,
    marginBottom: 20,
  },
  quickInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  quickInfoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 12,
  },
  quickInfoText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500" as const,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 20,
  },
  careSection: {
    gap: 20,
  },
  careItem: {
    flexDirection: "row",
    gap: 16,
  },
  careIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  careContent: {
    flex: 1,
  },
  careTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    marginBottom: 4,
  },
  careText: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  airPurificationCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  airPurificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 16,
  },
  airPurificationIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  airPurificationScoreContainer: {
    flex: 1,
  },
  airPurificationScoreLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  airPurificationScoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  airPurificationScore: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: "#16a34a",
  },
  airPurificationScoreMax: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  airPurificationBar: {
    height: 8,
    backgroundColor: "#dcfce7",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden" as const,
  },
  airPurificationBarFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  airPurificationDescription: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
  },
  wellnessCard: {
    backgroundColor: "#faf5ff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  wellnessItem: {
    marginBottom: 0,
  },
  wellnessHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
    gap: 16,
  },
  wellnessIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#6366f1",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  wellnessIconStress: {
    backgroundColor: "#ec4899",
  },
  wellnessScoreContainer: {
    flex: 1,
  },
  wellnessScoreLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  wellnessScoreRow: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
  },
  wellnessScore: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: "#6366f1",
  },
  wellnessScoreStress: {
    color: "#ec4899",
  },
  wellnessScoreMax: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  wellnessBar: {
    height: 8,
    backgroundColor: "#f3e8ff",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden" as const,
  },
  wellnessBarFillSleep: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  wellnessBarFillStress: {
    height: "100%",
    backgroundColor: "#ec4899",
    borderRadius: 4,
  },
  wellnessDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  wellnessDivider: {
    height: 1,
    backgroundColor: "#e9d5ff",
    marginVertical: 16,
  },
  safetyCard: {
    backgroundColor: "#fefce8",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#fef08a",
  },
  safetyItem: {
    flexDirection: "row" as const,
    gap: 16,
  },
  safetyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  safetyIconSafe: {
    backgroundColor: "#16a34a",
  },
  safetyIconDanger: {
    backgroundColor: "#dc2626",
  },
  safetyIconAllergen: {
    backgroundColor: "#f59e0b",
  },
  safetyContent: {
    flex: 1,
  },
  safetyHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 6,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  safetyTitleSafe: {
    color: "#16a34a",
  },
  safetyTitleDanger: {
    color: "#dc2626",
  },
  safetyTitleAllergen: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#b45309",
    marginBottom: 6,
  },
  safetyDescription: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  safetyDivider: {
    height: 1,
    backgroundColor: "#fef08a",
    marginVertical: 16,
  },
  disclaimerContainer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  disclaimerText: {
    fontSize: 11,
    color: "#9ca3af",
    lineHeight: 16,
    textAlign: "center" as const,
    fontStyle: "italic" as const,
  },
});
