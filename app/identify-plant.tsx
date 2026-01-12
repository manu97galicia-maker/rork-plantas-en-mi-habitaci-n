import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MapPin, Thermometer, Droplets, Sun, Leaf, Globe, RefreshCw } from "lucide-react-native";
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
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  tips: string[];
  toxicity?: string;
}

export default function IdentifyPlantScreen() {
  const params = useLocalSearchParams<{ imageData: string }>();
  const router = useRouter();
  const { addScan, language } = useUserPreferences();
  const [identification, setIdentification] = useState<PlantIdentification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasStartedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (params.imageData && !hasStartedRef.current) {
      hasStartedRef.current = true;
      console.log('🌱 Starting plant identification...');
      identifyPlant();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.imageData]);

  const identifyPlant = useCallback(async () => {
    if (!params.imageData) {
      setError("Image not found");
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
      const maxRetries = 3;
      let lastError: any = null;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
            console.log(`🔄 Retry attempt ${attempt}/${maxRetries} after ${delayMs}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
          
          result = await generateObject({
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
          
          if (result && result.name) {
            console.log(`✅ Success on attempt ${attempt + 1}`);
            break;
          }
        } catch (genError: any) {
          const errorMsg = genError?.message || 'Unknown error';
          console.error(`generateObject error (attempt ${attempt + 1}):`, errorMsg);
          lastError = genError;
          
          const isNetworkError = errorMsg.includes('Network request failed') || 
                                  errorMsg.includes('Failed to fetch') ||
                                  errorMsg.includes('network') ||
                                  errorMsg.includes('timeout');
          
          if (attempt === maxRetries || (!isNetworkError && !errorMsg.includes('429'))) {
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

      const mapLightLevel = (light: string): 'Low' | 'Medium' | 'Bright' => {
        const lightLower = light.toLowerCase();
        if (lightLower.includes('low') || lightLower.includes('shade') || lightLower.includes('indirect')) return 'Low';
        if (lightLower.includes('bright') || lightLower.includes('direct') || lightLower.includes('full')) return 'Bright';
        return 'Medium';
      };

      try {
        await addScan({
          analysis: {
            lightLevel: mapLightLevel(result.care.light),
            spaceSize: 'Medium',
            suggestions: [
              {
                id: Date.now().toString(),
                name: result.name,
                scientificName: result.scientificName,
                lightRequirement: result.care.light,
                wateringSchedule: result.care.water,
                difficulty: result.difficulty,
                description: result.description,
                airPurification: result.airPurification,
                wellnessBenefits: result.wellnessBenefits,
                careInstructions: {
                  light: result.care.light,
                  water: result.care.water,
                  temperature: result.care.temperature,
                  humidity: result.care.humidity,
                  fertilizer: result.care.fertilizer,
                  tips: result.tips,
                },
              },
            ],
          },
          originalImage: '',
        });
        console.log('✅ Scan saved to history');
      } catch (saveError) {
        console.log('Error saving scan:', saveError);
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
      setIsLoading(false);
    }
  }, [params.imageData, language, addScan]);

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
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.imageCard}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${params.imageData}` }}
                style={styles.plantImage}
                contentFit="cover"
              />
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

            {identification.toxicity && (
              <View style={styles.toxicityCard}>
                <Text style={styles.toxicityTitle}>⚠️ {language === "es" ? "Toxicidad" : "Toxicity"}</Text>
                <Text style={styles.toxicityText}>{identification.toxicity}</Text>
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
