import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MapPin, Thermometer, Droplets, Sun, Leaf, Globe, RefreshCw, Wind, Moon, Heart, CheckCircle, History } from "lucide-react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { generateObject } from "@rork-ai/toolkit-sdk";
import { z } from "zod";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Colors } from "@/constants/colors";

interface PlantIdentification {
  name: string;
  scientificName: string;
  family: string;
  origin: {
    region: string;
    countries: string[];
    climate: string;
  };
  description: string;
  care: {
    light: string;
    water: string;
    temperature: string;
    humidity: string;
    soil: string;
    fertilizer: string;
    pruning: string;
  };
  airPurification?: {
    score: number;
    description: string;
    descriptionEs: string;
  };
  wellnessBenefits?: {
    sleepScore: number;
    sleepDescription: string;
    sleepDescriptionEs: string;
    stressScore: number;
    stressDescription: string;
    stressDescriptionEs: string;
  };
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  tips: string[];
  toxicity?: string;
}

export default function IdentifyPlantScreen() {
  const params = useLocalSearchParams<{ imageData: string }>();
  const router = useRouter();
  const { language, addIdentification } = useUserPreferences();
  const [identification, setIdentification] = useState<PlantIdentification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const hasStartedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    
    const imageData = params.imageData;
    if (!imageData || typeof imageData !== 'string' || imageData.length < 100) {
      console.error('❌ Invalid or missing image data');
      setError(language === 'es' ? 'Datos de imagen inválidos. Por favor, intenta de nuevo.' : 'Invalid image data. Please try again.');
      setIsLoading(false);
      return;
    }
    
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      console.log('🌱 Starting plant identification...');
      identifyPlant();
    }
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const identifyPlant = useCallback(async () => {
    try {
      const imageData = params.imageData;
      if (!imageData || typeof imageData !== 'string' || imageData.length < 100) {
        setError(language === 'es' ? 'Datos de imagen inválidos' : 'Invalid image data');
        setIsLoading(false);
        return;
      }

      abortControllerRef.current = new AbortController();

    const schema = z.object({
      name: z.string(),
      scientificName: z.string(),
      family: z.string(),
      origin: z.object({
        region: z.string(),
        countries: z.array(z.string()),
        climate: z.string(),
      }),
      description: z.string(),
      care: z.object({
        light: z.string(),
        water: z.string(),
        temperature: z.string(),
        humidity: z.string(),
        soil: z.string(),
        fertilizer: z.string(),
        pruning: z.string(),
      }),
      airPurification: z.object({
        score: z.number(),
        description: z.string(),
        descriptionEs: z.string(),
      }),
      wellnessBenefits: z.object({
        sleepScore: z.number(),
        sleepDescription: z.string(),
        sleepDescriptionEs: z.string(),
        stressScore: z.number(),
        stressDescription: z.string(),
        stressDescriptionEs: z.string(),
      }),
      difficulty: z.enum(["Easy", "Moderate", "Advanced"]),
      tips: z.array(z.string()),
      toxicity: z.string().optional(),
    });

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("\n========== Identifying Plant with Gemini 2.0 Flash ==========");
      
      const languageInstruction = language === "es" 
        ? "\n\nIMPORTANTE: Responde TODA la información en ESPAÑOL (nombre común, descripción, instrucciones de cuidado, consejos, toxicidad). Solo el nombre científico debe estar en latín."
        : "";

      const prompt = `Identify this plant in the image and provide detailed information.${languageInstruction}

Carefully analyze the plant and provide:
- Common name ${language === "es" ? "in Spanish" : "in English"}
- Complete scientific name (genus and species)
- Botanical family
- Detailed geographical origin:
  * World region ${language === "es" ? "(ej. \"América Tropical\", \"Asia Oriental\", \"Mediterráneo\")" : "(e.g., \"Tropical America\", \"Eastern Asia\", \"Mediterranean\")"}
  * List of countries where it is native or typical
  * Climate type where it originates ${language === "es" ? "(ej. \"Tropical Húmedo\", \"Subtropical\", \"Templado\")" : "(e.g., \"Humid Tropical\", \"Subtropical\", \"Temperate\")"}
- Detailed description ${language === "es" ? "in Spanish" : "in English"} of the plant and its characteristics
- Specific care instructions ${language === "es" ? "in Spanish" : "in English"}:
  * Light: lighting requirements
  * Water: watering frequency and amount
  * Temperature: optimal ranges
  * Humidity: ambient humidity needs
  * Soil: ideal substrate type
  * Fertilizer: type and frequency
  * Pruning: when and how to prune
- Care difficulty: "Easy", "Moderate", or "Advanced"
- Useful tips ${language === "es" ? "in Spanish" : "in English"} (minimum 3-4 practical tips)
- Toxicity: indicate ${language === "es" ? "in Spanish" : "in English"} if toxic to humans or pets
- AIR PURIFICATION rating:
  * score: a number from 1-10 rating how well the plant purifies air (10 = excellent like Peace Lily, Snake Plant; 1 = minimal purification)
  * description: brief explanation in English of air purification benefits
  * descriptionEs: the same explanation in Spanish
- WELLNESS BENEFITS:
  * sleepScore: a number from 1-10 rating how well the plant helps with sleep (10 = excellent like Lavender, Snake Plant that release oxygen at night; 1 = minimal benefit)
  * sleepDescription: brief explanation in English of how it helps sleep
  * sleepDescriptionEs: the same explanation in Spanish
  * stressScore: a number from 1-10 rating how well the plant helps reduce stress (10 = excellent like Lavender with calming aromatherapy; 1 = minimal benefit)
  * stressDescription: brief explanation in English of stress-relief benefits
  * stressDescriptionEs: the same explanation in Spanish

Be specific and precise in the identification.`;

      console.log("Sending request to Gemini 2.0 Flash...");
      console.log("Request details:", {
        imageLength: params.imageData.length,
        promptLength: prompt.length
      });
      
      console.log('📤 Sending request to AI...');
      
      let result;
      const maxRetries = 4;
      let lastError: any = null;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            const delayMs = Math.min(2000 * Math.pow(2, attempt - 1), 16000);
            console.log(`🔄 Retry attempt ${attempt}/${maxRetries} after ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
          
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 60000);
          });
          
          const generatePromise = generateObject({
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image", image: params.imageData },
                ],
              },
            ],
            schema,
          });
          
          result = await Promise.race([generatePromise, timeoutPromise]);
          
          if (result && result.name) {
            console.log(`✅ Success on attempt ${attempt + 1}`);
            break;
          }
        } catch (genError: any) {
          const errorMsg = genError?.message || 'Unknown error';
          console.error(`generateObject error (attempt ${attempt + 1}):`, errorMsg);
          lastError = genError;
          
          const isRetryableError = errorMsg.includes('Network request failed') || 
                                  errorMsg.includes('Failed to fetch') ||
                                  errorMsg.includes('network') ||
                                  errorMsg.includes('timeout') ||
                                  errorMsg.includes('Request timeout') ||
                                  errorMsg.includes('429') ||
                                  errorMsg.includes('503') ||
                                  errorMsg.includes('502');
          
          if (attempt === maxRetries || !isRetryableError) {
            throw lastError;
          }
        }
      }
      
      if (!result) {
        throw new Error(lastError?.message || "Failed to identify plant");
      }
      
      console.log('📥 Response received');

      console.log("✅ Plant identified successfully:", result.name);
      setIdentification(result as PlantIdentification);

      // Save to history
      if (!hasSavedRef.current) {
        hasSavedRef.current = true;
        try {
          await addIdentification({
            plantName: result.name,
            scientificName: result.scientificName,
            family: result.family,
            difficulty: result.difficulty,
            description: result.description,
            imageData: params.imageData || '',
            care: result.care ? {
              light: result.care.light,
              water: result.care.water,
              temperature: result.care.temperature,
              humidity: result.care.humidity,
            } : undefined,
          });
          setSavedToHistory(true);
          console.log("✅ Identification saved to history");
        } catch (saveError) {
          console.error("❌ Error saving identification to history:", saveError);
        }
      }
    } catch (err: any) {
      console.error("\n❌ ERROR identifying plant:", err?.message || 'Unknown error');
      
      const errorMessage = err?.message || "";
      const errorString = String(err);
      const errorName = err?.name || "";
      
      if (errorMessage.includes("timeout") || errorString.includes("timeout")) {
        setError("⏱️ Request timed out. The image might be too large or the service is slow. Try again.");
      } else if (errorMessage.includes("429") || errorString.includes("429")) {
        setError("⏱️ Request limit reached. Wait a moment and try again.");
      } else if (errorMessage.includes("403") || errorString.includes("403")) {
        setError("🔑 Error 403: No permissions. Check your settings.");
      } else if (errorMessage.includes("401") || errorString.includes("401")) {
        setError("🔑 Error 401: Unauthorized. Check your settings.");
      } else if (errorMessage.includes("Network request failed") || errorString.includes("Network request failed")) {
        setError(language === "es" ? "🌐 Error de red. Verifica tu conexión a internet y vuelve a intentarlo. Si el problema persiste, el servicio podría estar temporalmente no disponible." : "🌐 Network error. Check your internet connection and try again. If the problem persists, the service might be temporarily unavailable.");
      } else if (errorMessage.includes("network") || errorString.includes("network") || errorName === "TypeError" && errorMessage.includes("failed")) {
        setError(language === "es" ? "🌐 Error de red. Verifica tu conexión a internet y vuelve a intentarlo." : "🌐 Network error. Check your internet connection and try again.");
      } else if (errorMessage.includes("Failed to fetch") || errorString.includes("Failed to fetch")) {
        setError(language === "es" ? "🌐 No se puede conectar al servicio. Verifica tu conexión a internet o intenta más tarde." : "🌐 Cannot connect to the service. Check your internet connection or try again later.");
      } else {
        setError(`❌ Error: ${errorMessage || errorString || "Unknown error occurred"}`);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
    } catch (outerError: any) {
      console.error('❌ Outer error in identifyPlant:', outerError);
      if (isMountedRef.current) {
        setIsLoading(false);
        setError(language === 'es' ? 'Error inesperado. Por favor, intenta de nuevo.' : 'Unexpected error. Please try again.');
      }
    }
  }, [params.imageData, language]);

  const retryIdentification = useCallback(() => {
    hasStartedRef.current = false;
    setError(null);
    setIsLoading(true);
    setIdentification(null);
    hasStartedRef.current = true;
    identifyPlant();
  }, [identifyPlant]);

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
    if (language === "es") {
      switch (difficulty) {
        case "Easy":
          return "Fácil";
        case "Moderate":
          return "Moderado";
        case "Advanced":
          return "Avanzado";
        default:
          return difficulty;
      }
    }
    return difficulty;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#1a4d2e", "#2d5f3f"]}
          style={styles.loadingGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContent}>
              <Leaf size={64} color="#a8d5ba" />
              <Text style={styles.loadingTitle}>
                {language === "es" ? "Identificando Planta" : "Identifying Plant"}
              </Text>
              <Text style={styles.loadingText}>
                {language === "es" ? "Analizando características de la planta..." : "Analyzing plant characteristics..."}
              </Text>
              <ActivityIndicator size="large" color="#52b788" style={{ marginTop: 20 }} />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  if (error || !identification) {
    return (
      <View style={styles.errorContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>{language === "es" ? "Error" : "Error"}</Text>
            <Text style={styles.errorText}>{error || (language === "es" ? "Error desconocido" : "Unknown error")}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={retryIdentification}
            >
              <RefreshCw size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.retryButtonText}>{language === "es" ? "Reintentar" : "Retry"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButtonSecondary}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>{language === "es" ? "Volver" : "Go Back"}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a4d2e", "#f8f9fa"]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {language === "es" ? "Planta Identificada" : "Plant Identified"}
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/(tabs)/identify")}
            >
              <History size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {savedToHistory && (
            <TouchableOpacity
              style={styles.successBanner}
              onPress={() => router.push("/(tabs)/identify")}
              activeOpacity={0.8}
            >
              <View style={styles.successBannerContent}>
                <CheckCircle size={20} color={Colors.status.success} />
                <Text style={styles.successBannerText}>
                  {language === "es" ? "Guardado en tu historial" : "Saved to your history"}
                </Text>
              </View>
              <Text style={styles.successBannerLink}>
                {language === "es" ? "Ver historial →" : "View history →"}
              </Text>
            </TouchableOpacity>
          )}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageCard}>
              {params.imageData && !imageError ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${params.imageData}` }}
                  style={styles.plantImage}
                  contentFit="cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <View style={[styles.plantImage, { backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }]}>
                  <Leaf size={48} color="#9ca3af" />
                  <Text style={{ color: '#6b7280', marginTop: 8 }}>{language === 'es' ? 'Imagen no disponible' : 'Image unavailable'}</Text>
                </View>
              )}
            </View>

            <View style={styles.identificationCard}>
              <View style={styles.identificationHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.plantName}>{identification.name}</Text>
                  <Text style={styles.scientificName}>{identification.scientificName}</Text>
                  <Text style={styles.family}>
                    {language === "es" ? "Familia" : "Family"}: {identification.family}
                  </Text>
                </View>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(identification.difficulty) },
                  ]}
                >
                  <Text style={styles.difficultyText}>
                    {getDifficultyText(identification.difficulty)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.description}>{identification.description}</Text>
            </View>

            <View style={styles.originCard}>
              <View style={styles.sectionHeader}>
                <Globe size={24} color="#52b788" />
                <Text style={styles.sectionTitle}>
                  {language === "es" ? "Origen" : "Origin"}
                </Text>
              </View>
              
              <View style={styles.originInfo}>
                <View style={styles.originItem}>
                  <MapPin size={18} color="#3b82f6" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.originLabel}>{language === "es" ? "Región" : "Region"}</Text>
                    <Text style={styles.originValue}>{identification.origin.region}</Text>
                  </View>
                </View>

                <View style={styles.originItem}>
                  <Globe size={18} color="#10b981" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.originLabel}>{language === "es" ? "Países" : "Countries"}</Text>
                    <Text style={styles.originValue}>{identification.origin.countries.join(", ")}</Text>
                  </View>
                </View>

                <View style={styles.originItem}>
                  <Thermometer size={18} color="#f59e0b" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.originLabel}>{language === "es" ? "Clima" : "Climate"}</Text>
                    <Text style={styles.originValue}>{identification.origin.climate}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.careCard}>
              <View style={styles.sectionHeader}>
                <Leaf size={24} color="#52b788" />
                <Text style={styles.sectionTitle}>
                  {language === "es" ? "Cómo Cuidarla" : "How to Care"}
                </Text>
              </View>

              <View style={styles.careGrid}>
                <View style={styles.careItem}>
                  <View style={styles.careIcon}>
                    <Sun size={20} color="#f59e0b" />
                  </View>
                  <Text style={styles.careLabel}>{language === "es" ? "Luz" : "Light"}</Text>
                  <Text style={styles.careValue}>{identification.care.light}</Text>
                </View>

                <View style={styles.careItem}>
                  <View style={styles.careIcon}>
                    <Droplets size={20} color="#3b82f6" />
                  </View>
                  <Text style={styles.careLabel}>{language === "es" ? "Riego" : "Water"}</Text>
                  <Text style={styles.careValue}>{identification.care.water}</Text>
                </View>

                <View style={styles.careItem}>
                  <View style={styles.careIcon}>
                    <Thermometer size={20} color="#ef4444" />
                  </View>
                  <Text style={styles.careLabel}>{language === "es" ? "Temperatura" : "Temperature"}</Text>
                  <Text style={styles.careValue}>{identification.care.temperature}</Text>
                </View>

                <View style={styles.careItem}>
                  <View style={styles.careIcon}>
                    <Droplets size={20} color="#06b6d4" />
                  </View>
                  <Text style={styles.careLabel}>{language === "es" ? "Humedad" : "Humidity"}</Text>
                  <Text style={styles.careValue}>{identification.care.humidity}</Text>
                </View>
              </View>

              <View style={styles.careDetails}>
                <View style={styles.careDetailItem}>
                  <Text style={styles.careDetailLabel}>🌱 {language === "es" ? "Sustrato" : "Soil"}</Text>
                  <Text style={styles.careDetailValue}>{identification.care.soil}</Text>
                </View>

                <View style={styles.careDetailItem}>
                  <Text style={styles.careDetailLabel}>🧪 {language === "es" ? "Fertilizante" : "Fertilizer"}</Text>
                  <Text style={styles.careDetailValue}>{identification.care.fertilizer}</Text>
                </View>

                <View style={styles.careDetailItem}>
                  <Text style={styles.careDetailLabel}>✂️ {language === "es" ? "Poda" : "Pruning"}</Text>
                  <Text style={styles.careDetailValue}>{identification.care.pruning}</Text>
                </View>
              </View>
            </View>

            {identification.tips.length > 0 && (
              <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>💡 {language === "es" ? "Consejos Útiles" : "Useful Tips"}</Text>
                {identification.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <View style={styles.tipBullet} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            {identification.airPurification && (
              <View style={styles.wellnessCard}>
                <View style={styles.sectionHeader}>
                  <Wind size={24} color="#16a34a" />
                  <Text style={styles.sectionTitle}>
                    {language === "es" ? "Purificación del Aire" : "Air Purification"}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreNumber}>{identification.airPurification.score}</Text>
                    <Text style={styles.scoreMax}>/10</Text>
                  </View>
                  <Text style={styles.scoreDescription}>
                    {language === "es" ? identification.airPurification.descriptionEs : identification.airPurification.description}
                  </Text>
                </View>
              </View>
            )}

            {identification.wellnessBenefits && (
              <View style={styles.wellnessCard}>
                <View style={styles.sectionHeader}>
                  <Heart size={24} color="#ec4899" />
                  <Text style={styles.sectionTitle}>
                    {language === "es" ? "Beneficios para el Bienestar" : "Wellness Benefits"}
                  </Text>
                </View>
                
                <View style={styles.wellnessGrid}>
                  <View style={styles.wellnessItem}>
                    <View style={[styles.wellnessIcon, { backgroundColor: "#eef2ff" }]}>
                      <Moon size={20} color="#6366f1" />
                    </View>
                    <Text style={styles.wellnessLabel}>{language === "es" ? "Sueño" : "Sleep"}</Text>
                    <View style={styles.wellnessScoreRow}>
                      <Text style={styles.wellnessScore}>{identification.wellnessBenefits.sleepScore}</Text>
                      <Text style={styles.wellnessScoreMax}>/10</Text>
                    </View>
                    <Text style={styles.wellnessDescription} numberOfLines={3}>
                      {language === "es" ? identification.wellnessBenefits.sleepDescriptionEs : identification.wellnessBenefits.sleepDescription}
                    </Text>
                  </View>

                  <View style={styles.wellnessItem}>
                    <View style={[styles.wellnessIcon, { backgroundColor: "#fdf2f8" }]}>
                      <Heart size={20} color="#ec4899" />
                    </View>
                    <Text style={styles.wellnessLabel}>{language === "es" ? "Estrés" : "Stress Relief"}</Text>
                    <View style={styles.wellnessScoreRow}>
                      <Text style={styles.wellnessScore}>{identification.wellnessBenefits.stressScore}</Text>
                      <Text style={styles.wellnessScoreMax}>/10</Text>
                    </View>
                    <Text style={styles.wellnessDescription} numberOfLines={3}>
                      {language === "es" ? identification.wellnessBenefits.stressDescriptionEs : identification.wellnessBenefits.stressDescription}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {identification.toxicity && (
              <View style={styles.toxicityCard}>
                <Text style={styles.toxicityTitle}>⚠️ {language === "es" ? "Toxicidad" : "Toxicity"}</Text>
                <Text style={styles.toxicityText}>{identification.toxicity}</Text>
                <Text style={styles.disclaimerText}>
                  {language === "es" 
                    ? "⚠️ Aviso: Esta información es orientativa. No nos hacemos responsables del uso de esta información. Consulte siempre a un profesional."
                    : "⚠️ Disclaimer: This information is for guidance only. We are not responsible for the use of this information. Always consult a professional."}
                </Text>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
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
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.status.successLight,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.status.success,
  },
  successBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  successBannerText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.status.success,
  },
  successBannerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.status.success,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  imageCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  plantImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
  },
  identificationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  identificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  plantName: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: "#1a4d2e",
    marginBottom: 6,
  },
  scientificName: {
    fontSize: 16,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 4,
  },
  family: {
    fontSize: 14,
    color: "#52b788",
    fontWeight: "600" as const,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  description: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
  },
  originCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
  },
  originInfo: {
    gap: 16,
  },
  originItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  originLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  originValue: {
    fontSize: 15,
    color: "#1a4d2e",
    lineHeight: 22,
  },
  careCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  careGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  careItem: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  careIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  careLabel: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  careValue: {
    fontSize: 13,
    color: "#1a4d2e",
    textAlign: "center",
    lineHeight: 18,
  },
  careDetails: {
    gap: 16,
  },
  careDetailItem: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
  },
  careDetailLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    marginBottom: 6,
  },
  careDetailValue: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
  },
  tipsCard: {
    backgroundColor: "#fffbeb",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fef3c7",
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#92400e",
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f59e0b",
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#78350f",
    lineHeight: 22,
  },
  toxicityCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fecaca",
  },
  toxicityTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#991b1b",
    marginBottom: 12,
  },
  toxicityText: {
    fontSize: 14,
    color: "#7f1d1d",
    lineHeight: 22,
  },
  disclaimerText: {
    fontSize: 11,
    color: "#991b1b",
    lineHeight: 16,
    marginTop: 12,
    fontStyle: "italic" as const,
  },
  wellnessCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scoreContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 16,
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0fdf4",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 3,
    borderColor: "#16a34a",
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#16a34a",
  },
  scoreMax: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  scoreDescription: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  wellnessGrid: {
    flexDirection: "row" as const,
    gap: 12,
  },
  wellnessItem: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 16,
    alignItems: "center" as const,
  },
  wellnessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 12,
  },
  wellnessLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#1a4d2e",
    marginBottom: 4,
  },
  wellnessScoreRow: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
    marginBottom: 8,
  },
  wellnessScore: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: "#1a4d2e",
  },
  wellnessScoreMax: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: "#6b7280",
  },
  wellnessDescription: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center" as const,
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#ffffff",
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  errorContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#1a4d2e",
  },
  errorText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#52b788",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  backButtonSecondary: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: "#52b788",
  },
});
