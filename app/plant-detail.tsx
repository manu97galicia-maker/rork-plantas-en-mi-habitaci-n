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
  Baby,
  Sparkles,
  Info,
  Clock,
  Zap,
  Brain,
  Activity,
} from "lucide-react-native";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Plant } from "@/types/plant";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";

export default function PlantDetailScreen() {
  const params = useLocalSearchParams<{ plantData: string; allPlants?: string; currentIndex?: string }>();
  const router = useRouter();
  const { language } = useUserPreferences();
  const t = getTranslations(language);

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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1a4d2e" />
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
            <ChevronLeft size={32} color={canGoBack ? "#1a4d2e" : "rgba(26,77,46,0.3)"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowRight, !canGoForward && styles.navArrowDisabled]}
            onPress={goToNextPlant}
            activeOpacity={canGoForward ? 0.8 : 1}
            disabled={!canGoForward}
          >
            <ChevronRight size={32} color={canGoForward ? "#1a4d2e" : "rgba(26,77,46,0.3)"} />
          </TouchableOpacity>
        </>
      )}

      <ScrollView
        style={styles.contentNoImage}
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

              <Text style={styles.sectionTitle}>{t.plantDetail.oxygenBenefits}</Text>
              
              <View style={styles.oxygenInfoCard}>
                <View style={styles.oxygenInfoHeader}>
                  <Info size={16} color="#0ea5e9" />
                  <Text style={styles.oxygenInfoText}>
                    {t.plantDetail.oxygenDescription}
                  </Text>
                </View>
              </View>

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
                
                <View style={styles.airBenefitsList}>
                  <View style={styles.airBenefitItem}>
                    <Wind size={16} color="#22c55e" />
                    <Text style={styles.airBenefitText}>
                      {language === 'es' 
                        ? 'Elimina toxinas del aire como formaldehído, benceno y tricloroetileno' 
                        : 'Removes air toxins like formaldehyde, benzene, and trichloroethylene'}
                    </Text>
                  </View>
                  <View style={styles.airBenefitItem}>
                    <Sparkles size={16} color="#22c55e" />
                    <Text style={styles.airBenefitText}>
                      {language === 'es' 
                        ? 'Aumenta los niveles de oxígeno, especialmente durante la fotosíntesis' 
                        : 'Increases oxygen levels, especially during photosynthesis'}
                    </Text>
                  </View>
                  <View style={styles.airBenefitItem}>
                    <Droplets size={16} color="#22c55e" />
                    <Text style={styles.airBenefitText}>
                      {language === 'es' 
                        ? 'Regula la humedad ambiental de forma natural' 
                        : 'Naturally regulates ambient humidity'}
                    </Text>
                  </View>
                  <View style={styles.airBenefitItem}>
                    <Zap size={16} color="#22c55e" />
                    <Text style={styles.airBenefitText}>
                      {language === 'es' 
                        ? 'Reduce los compuestos orgánicos volátiles (COV) de muebles y pinturas' 
                        : 'Reduces volatile organic compounds (VOCs) from furniture and paints'}
                    </Text>
                  </View>
                  <View style={styles.airBenefitItem}>
                    <Activity size={16} color="#22c55e" />
                    <Text style={styles.airBenefitText}>
                      {language === 'es' 
                        ? 'Mejora la concentración y productividad al aumentar el oxígeno disponible' 
                        : 'Improves concentration and productivity by increasing available oxygen'}
                    </Text>
                  </View>
                </View>

                <View style={styles.oxygenTipCard}>
                  <Text style={styles.oxygenTipTitle}>
                    {language === 'es' ? '💡 Consejo de Oxigenación' : '💡 Oxygen Tip'}
                  </Text>
                  <Text style={styles.oxygenTipText}>
                    {language === 'es' 
                      ? `Para maximizar la purificación del aire, coloca 1 planta por cada 10m² de espacio. Esta planta con puntuación ${plant.airPurification.score}/10 es ${plant.airPurification.score >= 8 ? 'excelente' : plant.airPurification.score >= 6 ? 'muy buena' : 'buena'} para mejorar la calidad del aire en tu hogar.`
                      : `To maximize air purification, place 1 plant per 100 sq ft of space. This plant with a ${plant.airPurification.score}/10 score is ${plant.airPurification.score >= 8 ? 'excellent' : plant.airPurification.score >= 6 ? 'very good' : 'good'} for improving air quality in your home.`}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t.plantDetail.wellnessBenefits}</Text>
          
          <View style={styles.oxygenInfoCard}>
            <View style={styles.oxygenInfoHeader}>
              <Info size={16} color="#8b5cf6" />
              <Text style={styles.oxygenInfoText}>
                {t.plantDetail.sleepDescription}
              </Text>
            </View>
          </View>

          <View style={styles.wellnessCard}>
            <View style={styles.wellnessItem}>
              <View style={styles.wellnessHeader}>
                <View style={styles.wellnessIconContainer}>
                  <Moon size={24} color="#ffffff" />
                </View>
                <View style={styles.wellnessScoreContainer}>
                  <Text style={styles.wellnessScoreLabel}>{t.plantDetail.sleepScore}</Text>
                  <View style={styles.wellnessScoreRow}>
                    <Text style={styles.wellnessScore}>{plant.wellnessBenefits?.sleepScore || 7}</Text>
                    <Text style={styles.wellnessScoreMax}>{t.plantDetail.outOf10}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.wellnessBar}>
                <View style={[styles.wellnessBarFillSleep, { width: `${(plant.wellnessBenefits?.sleepScore || 7) * 10}%` }]} />
              </View>
              <Text style={styles.wellnessDescription}>
                {plant.wellnessBenefits ? 
                  (language === 'es' ? plant.wellnessBenefits.sleepDescriptionEs : plant.wellnessBenefits.sleepDescription) :
                  (language === 'es' ? 'Esta planta ayuda a mejorar la calidad del sueño purificando el aire y creando un ambiente más relajante.' : 'This plant helps improve sleep quality by purifying the air and creating a more relaxing environment.')}
              </Text>
              
              <View style={styles.sleepBenefitsList}>
                <View style={styles.sleepBenefitItem}>
                  <CheckCircle2 size={14} color="#6366f1" />
                  <Text style={styles.sleepBenefitText}>
                    {language === 'es' 
                      ? 'Libera oxígeno durante la noche para un mejor descanso' 
                      : 'Releases oxygen at night for better rest'}
                  </Text>
                </View>
                <View style={styles.sleepBenefitItem}>
                  <CheckCircle2 size={14} color="#6366f1" />
                  <Text style={styles.sleepBenefitText}>
                    {language === 'es' 
                      ? 'Ayuda a regular los ciclos circadianos' 
                      : 'Helps regulate circadian cycles'}
                  </Text>
                </View>
                <View style={styles.sleepBenefitItem}>
                  <CheckCircle2 size={14} color="#6366f1" />
                  <Text style={styles.sleepBenefitText}>
                    {language === 'es' 
                      ? 'Reduce los niveles de CO2 en el dormitorio' 
                      : 'Reduces CO2 levels in the bedroom'}
                  </Text>
                </View>
                <View style={styles.sleepBenefitItem}>
                  <Clock size={14} color="#6366f1" />
                  <Text style={styles.sleepBenefitText}>
                    {language === 'es' 
                      ? 'Mejora la calidad del sueño REM y el descanso profundo' 
                      : 'Improves REM sleep quality and deep rest'}
                  </Text>
                </View>
                <View style={styles.sleepBenefitItem}>
                  <Brain size={14} color="#6366f1" />
                  <Text style={styles.sleepBenefitText}>
                    {language === 'es' 
                      ? 'Reduce el insomnio y facilita conciliar el sueño más rápido' 
                      : 'Reduces insomnia and helps fall asleep faster'}
                  </Text>
                </View>
              </View>

              <View style={styles.sleepTipCard}>
                <Text style={styles.sleepTipTitle}>
                  {language === 'es' ? '🌙 Consejo para Mejor Sueño' : '🌙 Better Sleep Tip'}
                </Text>
                <Text style={styles.sleepTipText}>
                  {language === 'es' 
                    ? 'Coloca esta planta en tu mesita de noche o cerca de la cama para maximizar sus beneficios. Evita regarla en exceso para prevenir humedad excesiva en el dormitorio.'
                    : 'Place this plant on your nightstand or near your bed to maximize its benefits. Avoid overwatering to prevent excess humidity in the bedroom.'}
                </Text>
              </View>
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
                    <Text style={[styles.wellnessScore, styles.wellnessScoreStress]}>{plant.wellnessBenefits?.stressScore || 8}</Text>
                    <Text style={styles.wellnessScoreMax}>{t.plantDetail.outOf10}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.wellnessBar}>
                <View style={[styles.wellnessBarFillStress, { width: `${(plant.wellnessBenefits?.stressScore || 8) * 10}%` }]} />
              </View>
              <Text style={styles.wellnessDescription}>
                {plant.wellnessBenefits ? 
                  (language === 'es' ? plant.wellnessBenefits.stressDescriptionEs : plant.wellnessBenefits.stressDescription) :
                  (language === 'es' ? 'Ayuda a reducir el estrés y la ansiedad mejorando la calidad del aire interior y proporcionando una conexión visual con la naturaleza.' : 'Helps reduce stress and anxiety by improving indoor air quality and providing a visual connection to nature.')}
              </Text>
              
              <View style={styles.sleepBenefitsList}>
                <View style={styles.sleepBenefitItem}>
                  <CheckCircle2 size={14} color="#ec4899" />
                  <Text style={styles.sleepBenefitText}>
                    {language === 'es' 
                      ? 'Reduce la ansiedad y promueve la calma mental' 
                      : 'Reduces anxiety and promotes mental calm'}
                  </Text>
                </View>
                <View style={styles.sleepBenefitItem}>
                  <CheckCircle2 size={14} color="#ec4899" />
                  <Text style={styles.sleepBenefitText}>
                    {language === 'es' 
                      ? 'Mejora la concentración y productividad' 
                      : 'Improves focus and productivity'}
                  </Text>
                </View>
                <View style={styles.sleepBenefitItem}>
                  <CheckCircle2 size={14} color="#ec4899" />
                  <Text style={styles.sleepBenefitText}>
                    {language === 'es' 
                      ? 'Conexión con la naturaleza que reduce el cortisol' 
                      : 'Nature connection that reduces cortisol'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t.plantDetail.careInstructions}</Text>
          <Text style={styles.careIntro}>
            {language === 'es' ? 
              'Sigue estas recomendaciones para mantener tu planta saludable y próspera:' : 
              'Follow these recommendations to keep your plant healthy and thriving:'}
          </Text>

          <View style={styles.careSection}>
            <View style={styles.careItem}>
              <View style={styles.careIconContainer}>
                <Sun size={24} color="#f59e0b" />
              </View>
              <View style={styles.careContent}>
                <Text style={styles.careTitle}>{t.plantDetail.light}</Text>
                <Text style={styles.careText}>
                  {plant.careInstructions?.light || plant.lightRequirement || 
                    (language === 'es' ? 'Luz indirecta brillante a media. Evita la luz solar directa que puede quemar las hojas.' : 'Bright to medium indirect light. Avoid direct sunlight which can burn the leaves.')}
                </Text>
              </View>
            </View>

            <View style={styles.careItem}>
              <View style={styles.careIconContainer}>
                <Droplets size={24} color="#3b82f6" />
              </View>
              <View style={styles.careContent}>
                <Text style={styles.careTitle}>{t.plantDetail.watering}</Text>
                <Text style={styles.careText}>
                  {plant.careInstructions?.water || plant.wateringSchedule || 
                    (language === 'es' ? 'Regar cuando la tierra esté seca al tacto. Evita el exceso de agua para prevenir la pudrición de raíces.' : 'Water when soil feels dry to touch. Avoid overwatering to prevent root rot.')}
                </Text>
              </View>
            </View>

            <View style={styles.careItem}>
              <View style={styles.careIconContainer}>
                <ThermometerSun size={24} color="#ef4444" />
              </View>
              <View style={styles.careContent}>
                <Text style={styles.careTitle}>{t.plantDetail.temperature}</Text>
                <Text style={styles.careText}>
                  {plant.careInstructions?.temperature || 
                    (language === 'es' ? 'Temperatura ideal entre 18-24°C. Proteger de corrientes de aire frío y calefacción directa.' : 'Ideal temperature between 18-24°C (65-75°F). Protect from cold drafts and direct heating.')}
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
                  {plant.careInstructions?.humidity || 
                    (language === 'es' ? 'Humedad media a alta. Rociar las hojas ocasionalmente o usar un humidificador si el aire es seco.' : 'Medium to high humidity. Mist leaves occasionally or use a humidifier if air is dry.')}
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
                  {plant.careInstructions?.fertilizer || 
                    (language === 'es' ? 'Fertilizar mensualmente durante la temporada de crecimiento (primavera-verano) con fertilizante líquido diluido.' : 'Fertilize monthly during growing season (spring-summer) with diluted liquid fertilizer.')}
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

          {plant.safetyInfo && (
            <>
              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t.plantDetail.safetyInfo}</Text>
              
              <View style={styles.safetyWarningBanner}>
                <AlertTriangle size={20} color="#f59e0b" />
                <Text style={styles.safetyWarningText}>
                  {t.plantDetail.safetyWarning}: {language === 'es' 
                    ? 'Siempre supervise a niños y mascotas cerca de las plantas. Consulte a un profesional si sospecha de ingestión.' 
                    : 'Always supervise children and pets around plants. Consult a professional if ingestion is suspected.'}
                </Text>
              </View>

              {(!plant.safetyInfo.petSafe || (plant.safetyInfo.childSafe !== undefined && !plant.safetyInfo.childSafe)) && (
                <View style={styles.dangerAlertBanner}>
                  <ShieldAlert size={22} color="#ffffff" />
                  <View style={styles.dangerAlertContent}>
                    <Text style={styles.dangerAlertTitle}>
                      {language === 'es' ? '⚠️ ADVERTENCIA IMPORTANTE' : '⚠️ IMPORTANT WARNING'}
                    </Text>
                    <Text style={styles.dangerAlertText}>
                      {language === 'es' 
                        ? 'Esta planta puede ser TÓXICA si se ingiere. Manténgala fuera del alcance de niños pequeños y mascotas. En caso de ingestión accidental, contacte inmediatamente con un centro de control de intoxicaciones o veterinario.'
                        : 'This plant can be TOXIC if ingested. Keep out of reach of young children and pets. In case of accidental ingestion, immediately contact a poison control center or veterinarian.'}
                    </Text>
                    <Text style={styles.emergencyText}>
                      {language === 'es' 
                        ? '📞 Emergencias: Llame al servicio de emergencias local'
                        : '📞 Emergency: Call your local emergency services'}
                    </Text>
                  </View>
                </View>
              )}

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
                  <View style={[
                    styles.safetyIconContainer,
                    (plant.safetyInfo.childSafe !== undefined ? plant.safetyInfo.childSafe : plant.safetyInfo.petSafe) ? styles.safetyIconSafe : styles.safetyIconDanger
                  ]}>
                    <Baby size={24} color="#ffffff" />
                  </View>
                  <View style={styles.safetyContent}>
                    <View style={styles.safetyHeader}>
                      {(plant.safetyInfo.childSafe !== undefined ? plant.safetyInfo.childSafe : plant.safetyInfo.petSafe) ? (
                        <ShieldCheck size={18} color="#16a34a" />
                      ) : (
                        <ShieldAlert size={18} color="#dc2626" />
                      )}
                      <Text style={[
                        styles.safetyTitle,
                        (plant.safetyInfo.childSafe !== undefined ? plant.safetyInfo.childSafe : plant.safetyInfo.petSafe) ? styles.safetyTitleSafe : styles.safetyTitleDanger
                      ]}>
                        {(plant.safetyInfo.childSafe !== undefined ? plant.safetyInfo.childSafe : plant.safetyInfo.petSafe) ? t.plantDetail.childSafe : t.plantDetail.notChildSafe}
                      </Text>
                    </View>
                    <Text style={styles.safetyDescription}>
                      {plant.safetyInfo.childSafeDescription 
                        ? (language === 'es' ? plant.safetyInfo.childSafeDescriptionEs : plant.safetyInfo.childSafeDescription)
                        : (language === 'es' 
                            ? (plant.safetyInfo.petSafe 
                                ? 'Esta planta es generalmente segura para niños, pero siempre supervise a los niños pequeños alrededor de las plantas.' 
                                : 'Esta planta puede ser peligrosa para los niños si se ingiere. Manténgala fuera del alcance de los niños pequeños.')
                            : (plant.safetyInfo.petSafe 
                                ? 'This plant is generally safe for children, but always supervise young children around plants.' 
                                : 'This plant may be harmful to children if ingested. Keep out of reach of young children.'))}
                    </Text>
                  </View>
                </View>

                <View style={styles.safetyDivider} />

                <View style={styles.safetyItem}>
                  <View style={[styles.safetyIconContainer, styles.safetyIconAllergen]}>
                    <Sparkles size={24} color="#ffffff" />
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

  safeArea: {
    backgroundColor: "#f8f9fa",
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
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  plantCounter: {
    backgroundColor: "#1a4d2e",
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
    top: 140,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  navArrowLeft: {
    left: 16,
  },
  navArrowRight: {
    right: 16,
  },
  navArrowDisabled: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
  },
  content: {
    flex: 1,
    marginTop: 300,
  },
  contentNoImage: {
    flex: 1,
    marginTop: 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 24,
    paddingTop: 12,
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
  careIntro: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
    marginBottom: 20,
    fontStyle: "italic" as const,
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
  oxygenInfoCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  oxygenInfoHeader: {
    flexDirection: "row" as const,
    gap: 10,
    alignItems: "flex-start" as const,
  },
  oxygenInfoText: {
    flex: 1,
    fontSize: 13,
    color: "#0369a1",
    lineHeight: 20,
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
  sleepBenefitsList: {
    marginTop: 12,
    gap: 8,
  },
  sleepBenefitItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  sleepBenefitText: {
    flex: 1,
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  airBenefitsList: {
    marginTop: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#dcfce7",
    paddingTop: 16,
  },
  airBenefitItem: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 10,
  },
  airBenefitText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
  },
  safetyWarningBanner: {
    flexDirection: "row" as const,
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 12,
    alignItems: "flex-start" as const,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  safetyWarningText: {
    flex: 1,
    fontSize: 13,
    color: "#92400e",
    lineHeight: 20,
    fontWeight: "500" as const,
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
  oxygenTipCard: {
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  oxygenTipTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#065f46",
    marginBottom: 6,
  },
  oxygenTipText: {
    fontSize: 13,
    color: "#047857",
    lineHeight: 20,
  },
  sleepTipCard: {
    backgroundColor: "#eef2ff",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  sleepTipTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#3730a3",
    marginBottom: 6,
  },
  sleepTipText: {
    fontSize: 13,
    color: "#4338ca",
    lineHeight: 20,
  },
  dangerAlertBanner: {
    flexDirection: "row" as const,
    backgroundColor: "#dc2626",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    alignItems: "flex-start" as const,
  },
  dangerAlertContent: {
    flex: 1,
  },
  dangerAlertTitle: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: "#ffffff",
    marginBottom: 6,
  },
  dangerAlertText: {
    fontSize: 13,
    color: "#fef2f2",
    lineHeight: 20,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#fecaca",
  },
});
