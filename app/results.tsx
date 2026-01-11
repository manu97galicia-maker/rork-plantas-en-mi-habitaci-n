import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Sun, ThermometerSun, Sparkles, MapPin, History, X, Leaf } from "lucide-react-native";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { generateObject } from "@rork-ai/toolkit-sdk";
import { z } from "zod";
import type { RoomAnalysis, LocationData } from "@/types/plant";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";
import { COMMON_PLANTS } from "@/constants/commonPlants";
import { usePlantImages } from "@/contexts/PlantImagesContext";

function PlantLegendComponent({ suggestions, getPlantImage, onPlantPress }: {
  suggestions: any[];
  getPlantImage: (id: string, name?: string) => string | undefined;
  onPlantPress: (index: number) => void;
}) {
  return (
    <View style={styles.plantNumberLegend}>
      <ScrollView 
        style={styles.legendScrollView}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {suggestions.map((plant, index) => {
          if (!plant) return null;
          const plantId = plant.id || `plant-${index}`;
          const plantName = plant.name || 'Plant';
          let plantImage: string | undefined;
          try {
            plantImage = getPlantImage(plantId, plantName);
          } catch {
            plantImage = undefined;
          }
          return (
            <TouchableOpacity 
              key={`legend-${plantId}`} 
              style={styles.legendItem}
              onPress={() => onPlantPress(index)}
              activeOpacity={0.7}
            >
              {plantImage ? (
                <Image
                  source={{ uri: plantImage }}
                  style={styles.legendPlantImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.legendNumberCircle}>
                  <Text style={styles.legendNumberLargeText}>{index + 1}</Text>
                </View>
              )}
              <View style={styles.legendPlantInfo}>
                <Text style={styles.legendPlantName}>{plantName}</Text>
                <Text style={styles.legendPlantScientific}>{plant.scientificName || ''}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
const PlantLegend = React.memo(PlantLegendComponent);

function PlantCardComponent({ plant, index, getPlantImage, getDifficultyColor, getDifficultyText, enrichedPlant, safeNavigate, language, allPlantsJson, totalPlants }: {
  plant: any;
  index: number;
  getPlantImage: (id: string, name?: string) => string | undefined;
  getDifficultyColor: (d: string) => string;
  getDifficultyText: (d: string) => string;
  enrichedPlant: any;
  safeNavigate: (path: any) => void;
  language: string;
  allPlantsJson: string;
  totalPlants: number;
}) {
  const plantId = plant?.id || `plant-${index}`;
  const plantName = plant?.name || 'Plant';
  
  const plantImage = useMemo(() => {
    if (!plant) return undefined;
    try {
      return getPlantImage(plantId, plantName);
    } catch {
      return undefined;
    }
  }, [getPlantImage, plantId, plantName, plant]);

  const handlePress = useCallback(() => {
    if (!plant) return;
    try {
      const sourcePlant = enrichedPlant || plant;
      const safeEnriched = {
        id: String(sourcePlant.id || plant.id || ''),
        name: String(sourcePlant.name || plant.name || ''),
        scientificName: String(sourcePlant.scientificName || plant.scientificName || ''),
        difficulty: String(sourcePlant.difficulty || plant.difficulty || 'Easy'),
        lightRequirement: String(sourcePlant.lightRequirement || plant.lightRequirement || ''),
        wateringSchedule: String(sourcePlant.wateringSchedule || plant.wateringSchedule || ''),
        description: String(sourcePlant.description || plant.description || ''),
        airPurification: sourcePlant.airPurification || plant.airPurification || null,
        wellnessBenefits: sourcePlant.wellnessBenefits || plant.wellnessBenefits || null,
        careInstructions: sourcePlant.careInstructions || plant.careInstructions || null,
      };
      safeNavigate({
        pathname: "/plant-detail",
        params: { 
          plantData: JSON.stringify(safeEnriched),
          allPlants: allPlantsJson,
          currentIndex: String(index)
        },
      });
    } catch (e) {
      console.log('Navigation error:', e);
    }
  }, [plant, enrichedPlant, safeNavigate, allPlantsJson, index]);

  if (!plant) return null;

  return (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {plantImage && (
        <Image
          source={{ uri: plantImage }}
          style={styles.plantCardImage}
          contentFit="cover"
        />
      )}
      <View style={styles.plantInfo}>
        <View style={styles.plantHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.plantName}>{plantName}</Text>
            <Text style={styles.plantScientific}>
              {plant.scientificName || ''}
            </Text>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(plant.difficulty || 'Easy') },
            ]}
          >
            <Text style={styles.difficultyText}>
              {getDifficultyText(plant.difficulty || 'Easy')}
            </Text>
          </View>
        </View>
        <Text style={styles.plantDescription} numberOfLines={2}>
          {plant.description || ''}
        </Text>
        <View style={styles.requirementsRow}>
          <View style={styles.requirement}>
            <Text style={styles.requirementText}>
              💡 {plant.lightRequirement || 'N/A'}
            </Text>
          </View>
          <View style={styles.requirement}>
            <Text style={styles.requirementText}>
              💧 {plant.wateringSchedule || 'N/A'}
            </Text>
          </View>
        </View>
        {enrichedPlant?.airPurification && (
          <View style={styles.airPurificationBadge}>
            <Leaf size={14} color="#16a34a" />
            <Text style={styles.airPurificationBadgeText}>
              {language === 'es' ? 'Purificación' : 'Air Purification'}: {enrichedPlant.airPurification?.score ?? 0}/10
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
const PlantCard = React.memo(PlantCardComponent);

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ 
    imageData: string;
    latitude?: string;
    longitude?: string;
    altitude?: string;
  }>();
  const router = useRouter();
  const { careLevel, addScan, language } = useUserPreferences();
  const t = getTranslations(language);
  const [analysis, setAnalysis] = useState<RoomAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [plantsOnlyImage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<{ uri: string; label: string; isAfter?: boolean } | null>(null);
  const [selectedPlantIndex, setSelectedPlantIndex] = useState<number | null>(null);
  const [showPlantTooltip, setShowPlantTooltip] = useState<{ index: number; name: string } | null>(null);
  const [showMarkers, setShowMarkers] = useState(false);
  const markersTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigatingRef = useRef(false);
  const { getPlantImage, prefetchPlantImage } = usePlantImages();
  const lastClickRef = useRef(0);
  const isProcessingTapRef = useRef(false);
  const lastMarkerTapRef = useRef(0);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const enrichPlantData = useCallback((plant: any) => {
    if (!plant) return plant;
    try {
      const commonPlant = COMMON_PLANTS.find(
        (p) => p.id === plant.id || 
               p.name?.toLowerCase() === plant.name?.toLowerCase() ||
               p.scientificName?.toLowerCase() === plant.scientificName?.toLowerCase()
      );
      
      if (commonPlant) {
        return {
          ...plant,
          airPurification: plant.airPurification || commonPlant.airPurification,
          wellnessBenefits: plant.wellnessBenefits || commonPlant.wellnessBenefits,
          careInstructions: plant.careInstructions || commonPlant.careInstructions,
        };
      }
    } catch (e) {
      console.log('Error enriching plant:', e);
    }
    return plant;
  }, []);

  const enrichedPlants = useMemo(() => {
    if (!analysis?.suggestions || !Array.isArray(analysis.suggestions)) return [];
    try {
      return analysis.suggestions.map(plant => {
        if (!plant) return plant;
        return enrichPlantData(plant);
      });
    } catch (e) {
      console.log('Error enriching plants:', e);
      return analysis.suggestions;
    }
  }, [analysis?.suggestions, enrichPlantData]);

  const allPlantsJson = useMemo(() => {
    try {
      if (!enrichedPlants || enrichedPlants.length === 0) return '[]';
      const simplePlants = enrichedPlants.slice(0, 10).map(p => {
        if (!p) return null;
        return {
          id: String(p.id || ''),
          name: String(p.name || ''),
          scientificName: String(p.scientificName || ''),
          difficulty: String(p.difficulty || 'Easy'),
        };
      }).filter(Boolean);
      return JSON.stringify(simplePlants);
    } catch {
      return '[]';
    }
  }, [enrichedPlants]);

  const safeNavigate = useCallback((path: string | { pathname: string; params: any }) => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastClickRef.current < 600) {
      console.log('⚠️ Navigation blocked - too fast');
      return;
    }
    isNavigatingRef.current = true;
    lastClickRef.current = now;
    try {
      if (typeof path === 'string') {
        router.push(path as any);
      } else {
        router.push(path as any);
      }
    } catch (e) {
      console.error('Navigation error:', e);
    }
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 600);
  }, [router]);

  const handleMarkerTap = useCallback((index: number, plantName: string) => {
    try {
      const now = Date.now();
      if (isProcessingTapRef.current || now - lastMarkerTapRef.current < 300) {
        return;
      }
      isProcessingTapRef.current = true;
      lastMarkerTapRef.current = now;
      
      setSelectedPlantIndex(index);
      setShowPlantTooltip({ index, name: plantName });
      
      if (markersTimeoutRef.current) {
        clearTimeout(markersTimeoutRef.current);
      }
      markersTimeoutRef.current = setTimeout(() => {
        setShowMarkers(false);
        setShowPlantTooltip(null);
        setSelectedPlantIndex(null);
      }, 4000);
      
      setTimeout(() => {
        isProcessingTapRef.current = false;
      }, 300);
    } catch (e) {
      console.log('Marker tap error:', e);
      isProcessingTapRef.current = false;
    }
  }, []);

  const handleAfterImageTap = useCallback(() => {
    try {
      const now = Date.now();
      if (isProcessingTapRef.current || now - lastMarkerTapRef.current < 300) {
        return;
      }
      isProcessingTapRef.current = true;
      lastMarkerTapRef.current = now;
      
      if (!showMarkers) {
        setShowMarkers(true);
        if (markersTimeoutRef.current) {
          clearTimeout(markersTimeoutRef.current);
        }
        markersTimeoutRef.current = setTimeout(() => {
          setShowMarkers(false);
          setShowPlantTooltip(null);
          setSelectedPlantIndex(null);
        }, 4000);
      }
      
      setTimeout(() => {
        isProcessingTapRef.current = false;
      }, 300);
    } catch (e) {
      console.log('After image tap error:', e);
      isProcessingTapRef.current = false;
    }
  }, [showMarkers]);

  useEffect(() => {
    isMountedRef.current = true;
    if (params.imageData) {
      analyzeRoom();
    }
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (markersTimeoutRef.current) {
        clearTimeout(markersTimeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (analysis?.suggestions && analysis.suggestions.length > 0) {
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current && analysis.suggestions.length > 0) {
          try {
            const firstPlant = analysis.suggestions[0];
            if (firstPlant?.id && firstPlant?.name) {
              prefetchPlantImage(firstPlant.id, firstPlant.name);
            }
          } catch {
            console.log('Error prefetching first image');
          }
        }
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis?.suggestions?.length]);

  const analyzeRoom = async () => {
    if (!params.imageData) {
      if (isMountedRef.current) {
        setError("Image not found");
        setIsLoading(false);
      }
      return;
    }
    
    abortControllerRef.current = new AbortController();

    let locationInfo: LocationData | null = null;
    if (params.latitude && params.longitude) {
      locationInfo = {
        latitude: parseFloat(params.latitude),
        longitude: parseFloat(params.longitude),
        altitude: params.altitude ? parseFloat(params.altitude) : undefined,
      };
      setLocationData(locationInfo);
      console.log("📍 Location received:", locationInfo);
    }

    const plantSchema = z.object({
      id: z.string(),
      name: z.string(),
      scientificName: z.string(),
      lightRequirement: z.string(),
      wateringSchedule: z.string(),
      difficulty: z.enum(["Easy", "Moderate", "Advanced"]),
      description: z.string(),
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
      careInstructions: z.object({
        light: z.string(),
        water: z.string(),
        temperature: z.string(),
        humidity: z.string(),
        fertilizer: z.string(),
        tips: z.array(z.string()),
      }),
      position: z.object({
        x: z.number(),
        y: z.number(),
        size: z.enum(["small", "medium", "large"]),
      }),
    });

    const schema = z.object({
      lightLevel: z.enum(["Low", "Medium", "Bright"]),
      spaceSize: z.enum(["Small", "Medium", "Large"]),
      suggestions: z.array(plantSchema),
    });

    try {
      setIsLoading(true);
      setError(null);
      setLoadingStep(t.results.analyzingStep);
      
      console.log("\n========== Analyzing with Gemini 2.0 Flash ==========");
      console.log(`Image length: ${params.imageData.length} characters`);
      
      let locationPrompt = "";
      if (locationInfo) {
        locationPrompt = `

IMPORTANT: The user is located at coordinates ${locationInfo.latitude.toFixed(2)}, ${locationInfo.longitude.toFixed(2)}${locationInfo.altitude ? ` at ${Math.round(locationInfo.altitude)}m altitude` : ""}.

BASED ON THIS LOCATION:
- Identify the region's climate (tropical, subtropical, temperate, continental, Mediterranean, arid, etc.)
- Consider average temperature and seasonal ranges
- Account for typical ambient humidity of the area
- Consider altitude if available (affects temperature and pressure)
- Evaluate if it's coastal, mountainous, desert, etc.

RECOMMEND PLANTS THAT:
1. Are native to or adapt well to that location's climate
2. Can survive the region's typical temperatures
3. Match the local ambient humidity
4. Consider altitude if significant
5. Are easy to find in that geographical region

For example:
- Warm and humid climates: tropical plants, ferns, philodendrons
- Hot and dry climates: succulents, cacti, aloe vera
- Temperate climates: standard indoor plants with good adaptability
- High altitudes: cold-resistant plants adapted to low pressure

ADJUST recommendations to be realistic and appropriate for that location's specific climate.`;
      }

      let careLevelPrompt = "";
      if (careLevel) {
        const careLevelText = careLevel === "beginner" ? "beginner (very easy-to-care-for plants)" : careLevel === "intermediate" ? "intermediate (moderate-care plants)" : "expert (can handle demanding and exotic plants)";
        careLevelPrompt = `

IMPORTANT: The user has ${careLevelText} experience level.

BASED ON THEIR LEVEL:
${careLevel === "beginner" ? `
- Recommend ONLY "Easy" difficulty plants
- Prioritize hardy plants that tolerate occasional neglect
- Avoid plants requiring frequent or specific care
- Ideal examples: Pothos, Sansevieria, Succulents, Spider Plant` : ""}
${careLevel === "intermediate" ? `
- Recommend "Easy" and "Moderate" difficulty plants
- Include some plants requiring more attention but not demanding
- Balance between ease and variety
- Examples: Monstera, Philodendron, Calathea, Ficus` : ""}
${careLevel === "expert" ? `
- You can recommend plants of any difficulty, including "Advanced"
- Include exotic, tropical or plants requiring specific care
- User seeks challenges and variety
- Examples: Orchids, Bonsai, Calathea ornata, carnivorous plants` : ""}

ADJUST recommendations according to their experience level.`;
      }

      const languageInstruction = language === "es" 
        ? "\n\nIMPORTANTE: Responde TODA la información en ESPAÑOL (nombres comunes de plantas, descripciones, instrucciones de cuidado, consejos). Solo los nombres científicos deben estar en latín."
        : "";

      const prompt = `Analyze this image of a room and generate plant suggestions.${locationPrompt}${careLevelPrompt}${languageInstruction}

Analyze the room and identify 4-5 specific locations where plants would look good (tables, shelves, corners, windows). 

IMPORTANT: Include a diverse selection of plants:
- Indoor foliage plants (pothos, monstera, ferns, etc.)
- Flowering plants (orchids, peace lily, African violet, begonias, kalanchoe, anthurium, etc.)
- Succulents and cacti
- Consider seasonal blooming plants appropriate for indoor cultivation

For each plant:
- Use common names ${language === "es" ? "in Spanish" : "in English"}
- Provide the scientific name
- Indicate light requirements ${language === "es" ? "(\"Luz indirecta\", \"Luz directa\", o \"Sombra\")" : "(\"Indirect light\", \"Direct light\", or \"Shade\")"}
- Specify watering schedule ${language === "es" ? "(ej. \"1-2 veces/semana\", \"Cada 7-10 días\")" : "(e.g., \"1-2 times/week\", \"Every 7-10 days\")"}
- Assign a difficulty: "Easy", "Moderate", or "Advanced"
- Write a brief description ${language === "es" ? "in Spanish" : "in English"} mentioning why it's appropriate for the local climate and space
- For flowering plants, mention blooming characteristics
- Include an AIR PURIFICATION section with:
  * score: a number from 1-10 rating how well the plant purifies air (10 = excellent like Peace Lily, Snake Plant; 1 = minimal purification)
  * description: brief explanation in English of air purification benefits (toxins removed, oxygen production, etc.)
  * descriptionEs: the same explanation in Spanish
- Include a WELLNESS BENEFITS section with:
  * sleepScore: a number from 1-10 rating how well the plant helps with sleep (10 = excellent like Lavender, Jasmine, Snake Plant that release oxygen at night; 1 = minimal benefit)
  * sleepDescription: brief explanation in English of how it helps sleep (oxygen release at night, calming scent, humidity, etc.)
  * sleepDescriptionEs: the same explanation in Spanish
  * stressScore: a number from 1-10 rating how well the plant helps reduce stress (10 = excellent like Lavender, Jasmine with calming aromatherapy; 1 = minimal benefit)
  * stressDescription: brief explanation in English of stress-relief benefits (calming appearance, aromatherapy, easy care reducing anxiety, etc.)
  * stressDescriptionEs: the same explanation in Spanish
- Include detailed care instructions ${language === "es" ? "in Spanish" : "in English"} adjusted for the climate
- Assign a position in the room (x and y between 10-90, size: "small", "medium", or "large")

Also evaluate the light level ("Low", "Medium", "Bright") and space size ("Small", "Medium", "Large").`;

      console.log("Sending request to Gemini 2.0 Flash...");
      console.log("Request details:", {
        imageLength: params.imageData.length,
        promptLength: prompt.length,
        hasLocation: !!locationInfo,
        careLevel: careLevel
      });
      
      let result;
      const maxRetries = 2;
      let lastError: any = null;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            console.log(`🔄 Retry attempt ${attempt}/${maxRetries}...`);
            if (isMountedRef.current) {
              setLoadingStep(language === 'es' ? `Reintentando análisis (${attempt}/${maxRetries})...` : `Retrying analysis (${attempt}/${maxRetries})...`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
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
          
          if (result && result.suggestions && result.suggestions.length > 0) {
            break;
          }
        } catch (genError: any) {
          console.error(`generateObject error (attempt ${attempt + 1}):`, genError?.message || 'Unknown error');
          lastError = genError;
          
          if (attempt === maxRetries) {
            throw new Error(lastError?.message || "Failed to analyze image after retries");
          }
        }
      }
      
      if (!result) {
        throw new Error(lastError?.message || "Failed to get analysis result");
      }

      if (!isMountedRef.current) return;
      
      console.log("Response received");
      
      if (!result || !result.suggestions || result.suggestions.length === 0) {
        throw new Error("The response does not contain plant suggestions");
      }

      console.log(`✅ Analysis successful: ${result.suggestions.length} plants suggested`);
      
      if (!isMountedRef.current) return;
      setAnalysis(result as RoomAnalysis);

      if (!isMountedRef.current) return;
      
      setLoadingStep(language === "es" ? "Generando visualización con plantas..." : "Generating visualization with plants...");
      console.log("\n========== Generating edited image with Gemini 2.5 Flash Image ==========");
      
      const plantNames = result.suggestions.map(p => p.name).join(", ");
      
      const editPrompt = `Add these beautiful plants to this space: ${plantNames}

Instructions:
- Keep the existing environment, structures, and features unchanged
- Add the specified plants in natural and appropriate locations
- For indoor spaces: use corners, tables, shelves, floor, windowsills with decorative pots
- For outdoor spaces: place plants in garden beds, planters, along pathways, or in natural arrangements
- For patios/balconies: use potted plants, hanging baskets, and container gardens
- Use realistic pots, planters, or natural planting that complements the setting
- For flowering plants, show them with visible blooms in appropriate colors
- Make the plants look naturally integrated into the environment
- Create proper lighting and shadows for the plants
- Add visual variety with different plant heights and textures
- The result should be the same space but beautifully enhanced with plants`;

      let editedImageData: string | null = null;
      try {
        console.log("📤 Sending image edit request...");
        console.log("📊 Request details:", {
          promptLength: editPrompt.length,
          imageDataLength: params.imageData.length,
          aspectRatio: "1:1"
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log("⏱️ Request timeout - aborting after 90 seconds");
          controller.abort();
        }, 90000);
        
        if (!isMountedRef.current) {
          clearTimeout(timeoutId);
          return;
        }
        
        const editResponse = await fetch("https://toolkit.rork.com/images/edit/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: editPrompt,
            images: [{ type: "image", image: params.imageData }],
            aspectRatio: "1:1",
            quality: "high",
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!isMountedRef.current) return;
        console.log("📥 Response received with status:", editResponse.status);

        if (!editResponse.ok) {
          let errorText = '';
          try {
            errorText = await editResponse.text();
            console.error(`❌ Image edit API error ${editResponse.status}:`, errorText);
          } catch {
            console.error(`❌ Image edit API error ${editResponse.status} - could not read error`);
          }
          throw new Error(`API error: ${editResponse.status} - ${errorText || 'Unknown error'}`);
        }

        const editData = await editResponse.json();
        console.log("✅ Image edit response structure:", {
          hasImage: !!editData.image,
          hasBase64Data: !!editData.image?.base64Data,
          base64Length: editData.image?.base64Data?.length || 0,
          mimeType: editData.image?.mimeType,
          aspectRatio: editData.image?.aspectRatio
        });
        
        if (!editData.image || !editData.image.base64Data) {
          throw new Error("Response does not contain valid image data");
        }
        
        editedImageData = editData.image.base64Data;
        if (isMountedRef.current) {
          setEditedImage(editedImageData);
        }
        console.log("✅ Edited image generated and saved successfully");
      } catch (editError: any) {
        console.error("❌ Error generating edited image:", editError.message);
        console.error("Full edit error:", {
          message: editError?.message,
          name: editError?.name,
          stack: editError?.stack,
          isAbort: editError?.name === 'AbortError',
          isNetwork: editError?.message?.includes('network') || editError?.message?.includes('fetch')
        });
        if (editError.name === 'AbortError') {
          console.log("⏱️ Image edit request timed out after 90 seconds");
        }
        console.log("⏩ Continuing without edited image (user will see analysis only)...");
      }

      if (isMountedRef.current) {
        try {
          await addScan({
            analysis: result as RoomAnalysis,
            originalImage: params.imageData || '',
            editedImage: editedImageData || undefined,
            location: locationInfo ? {
              latitude: locationInfo.latitude,
              longitude: locationInfo.longitude,
              altitude: locationInfo.altitude,
            } : undefined,
          });
          console.log("✅ Scan saved to history with images");
        } catch (saveError) {
          console.log('Error saving scan to history:', saveError);
        }
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      console.error("\n❌ ERROR:", err?.message || 'Unknown error');
      
      const errorMessage = err?.message || "";
      const errorString = String(err || "");
      const errorName = err?.name || "";
      
      if (errorMessage.includes("timeout") || errorString.includes("timeout")) {
        setError("⏱️ Request timed out. The image might be too large or the service is slow. Try with a smaller image or try again later.");
      } else if (errorMessage.includes("429") || errorString.includes("429")) {
        setError("⏱️ Request limit reached. Wait a moment and try again.");
      } else if (errorMessage.includes("403") || errorString.includes("403")) {
        setError("🔑 Error 403: No permissions. Check your settings.");
      } else if (errorMessage.includes("401") || errorString.includes("401")) {
        setError("🔑 Error 401: Unauthorized. Check your settings.");
      } else if (errorMessage.includes("network") || errorString.includes("network") || (errorName === "TypeError" && errorMessage.includes("failed"))) {
        setError("🌐 Network error. Check your internet connection and try again. If the problem persists, the service might be temporarily unavailable.");
      } else if (errorMessage.includes("Failed to fetch") || errorString.includes("Failed to fetch")) {
        setError("🌐 Cannot connect to the service. Check your internet connection or try again later.");
      } else {
        setError(`❌ Error: ${errorMessage || "Unknown error occurred"}`);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

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
        return t.results.easy;
      case "Moderate":
        return t.results.moderate;
      case "Advanced":
        return t.results.advanced;
      default:
        return difficulty;
    }
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
              <Sparkles size={64} color="#a8d5ba" />
              <Text style={styles.loadingTitle}>{t.results.analyzingSpace}</Text>
              <Text style={styles.loadingText}>
                {loadingStep}
              </Text>
              <Text style={styles.loadingTimeHint}>
                {t.results.timeHint}
              </Text>
              <ActivityIndicator size="large" color="#52b788" style={{ marginTop: 20 }} />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  if (error || !analysis) {
    return (
      <View style={styles.errorContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>{t.results.error}</Text>
            <Text style={styles.errorText}>{error || "Unknown error"}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.retryButtonText}>{t.results.tryAgain}</Text>
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
              onPress={() => safeNavigate("/")}
            >
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.results.title}</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => safeNavigate("/gallery")}
            >
              <History size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {editedImage && (
              <View style={styles.comparisonCard}>
                <Text style={styles.comparisonTitle}>{t.results.beforeAfter}</Text>
                
                <View style={styles.imageComparisonContainer}>
                  <TouchableOpacity 
                    style={styles.comparisonImageWrapper}
                    onPress={() => setEnlargedImage({ 
                      uri: `data:image/jpeg;base64,${params.imageData}`, 
                      label: t.results.before 
                    })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.comparisonLabel}>{t.results.before}</Text>
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${params.imageData}` }}
                      style={styles.comparisonImage}
                      contentFit="cover"
                    />
                    <Text style={styles.tapToEnlargeText}>{t.results.tapToEnlarge}</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.comparisonImageWrapper}>
                    <Text style={styles.comparisonLabel}>{t.results.after}</Text>
                    <TouchableOpacity
                      onPress={handleAfterImageTap}
                      activeOpacity={0.9}
                      style={styles.afterImageContainer}
                      delayPressIn={50}
                    >
                      <Image
                        source={{ uri: `data:image/png;base64,${editedImage}` }}
                        style={styles.comparisonImage}
                        contentFit="cover"
                      />
                      {showMarkers && analysis?.suggestions && Array.isArray(analysis.suggestions) && analysis.suggestions.slice(0, 5).map((plant, index) => {
                        if (!plant || typeof plant !== 'object') return null;
                        const posX = plant.position?.x ?? (20 + index * 15);
                        const posY = plant.position?.y ?? (30 + index * 10);
                        return (
                          <TouchableOpacity
                            key={`marker-${plant.id || index}`}
                            style={[
                              styles.plantMarker,
                              {
                                left: `${posX}%`,
                                top: `${posY}%`,
                              },
                              selectedPlantIndex === index && styles.plantMarkerSelected,
                            ]}
                            onPress={() => handleMarkerTap(index, plant.name || 'Plant')}
                            activeOpacity={0.8}
                            delayPressIn={50}
                          >
                            <Text style={styles.plantMarkerText}>{index + 1}</Text>
                          </TouchableOpacity>
                        );
                      })}
                      {showMarkers && showPlantTooltip && (
                        <View 
                          style={[
                            styles.plantTooltip,
                            {
                              left: `${analysis?.suggestions[showPlantTooltip.index]?.position?.x || 50}%`,
                              top: `${(analysis?.suggestions[showPlantTooltip.index]?.position?.y || 50) - 12}%`,
                            }
                          ]}
                        >
                          <Text style={styles.plantTooltipText}>{showPlantTooltip.name}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <Text style={styles.tapToEnlargeText}>{language === 'es' ? 'Toca para ver los números de plantas' : 'Tap to see plant numbers'}</Text>
                  </View>
                </View>
                
                <Text style={styles.comparisonHint}>
                  {t.results.beforeAfterHint}
                </Text>
              </View>
            )}

            <View style={styles.analysisCard}>
              <Text style={styles.analysisTitle}>{t.results.spaceAnalysis}</Text>
              <View style={styles.analysisRow}>
                <View style={styles.analysisItem}>
                  <Sun size={24} color="#f59e0b" />
                  <Text style={styles.analysisLabel}>{t.results.light}</Text>
                  <Text style={styles.analysisValue}>{analysis.lightLevel}</Text>
                </View>
                <View style={styles.analysisDivider} />
                <View style={styles.analysisItem}>
                  <ThermometerSun size={24} color="#52b788" />
                  <Text style={styles.analysisLabel}>{t.results.space}</Text>
                  <Text style={styles.analysisValue}>{analysis.spaceSize}</Text>
                </View>
                {locationData && (
                  <>
                    <View style={styles.analysisDivider} />
                    <View style={styles.analysisItem}>
                      <MapPin size={24} color="#3b82f6" />
                      <Text style={styles.analysisLabel}>{t.results.location}</Text>
                      <Text style={styles.analysisValue}>{t.results.detected}</Text>
                    </View>
                  </>
                )}
              </View>
              {locationData && (
                <Text style={styles.locationNote}>
                  {t.results.locationNote}
                </Text>
              )}
            </View>

            <Text style={styles.sectionTitle}>
              {t.results.recommendedPlants} ({analysis.suggestions.length})
            </Text>

            {plantsOnlyImage && (
              <View style={styles.plantsGalleryCard}>
                <Image
                  source={{ uri: `data:image/png;base64,${plantsOnlyImage}` }}
                  style={styles.plantsGalleryImage}
                  contentFit="cover"
                />
                <Text style={styles.plantsGalleryHint}>
                  🌿 Gallery of your recommended plants
                </Text>
              </View>
            )}

            <PlantLegend 
              suggestions={analysis.suggestions} 
              getPlantImage={getPlantImage}
              onPlantPress={(index) => {
                const plant = analysis.suggestions[index];
                const enriched = enrichedPlants[index];
                if (!plant) return;
                try {
                  const sourcePlant = enriched || plant;
                  const safeEnriched = {
                    id: String(sourcePlant.id || plant.id || ''),
                    name: String(sourcePlant.name || plant.name || ''),
                    scientificName: String(sourcePlant.scientificName || plant.scientificName || ''),
                    difficulty: String(sourcePlant.difficulty || plant.difficulty || 'Easy'),
                    lightRequirement: String(sourcePlant.lightRequirement || plant.lightRequirement || ''),
                    wateringSchedule: String(sourcePlant.wateringSchedule || plant.wateringSchedule || ''),
                    description: String(sourcePlant.description || plant.description || ''),
                    airPurification: sourcePlant.airPurification || plant.airPurification || null,
                    wellnessBenefits: sourcePlant.wellnessBenefits || plant.wellnessBenefits || null,
                    careInstructions: sourcePlant.careInstructions || plant.careInstructions || null,
                  };
                  safeNavigate({
                    pathname: "/plant-detail",
                    params: { 
                      plantData: JSON.stringify(safeEnriched),
                      allPlants: allPlantsJson,
                      currentIndex: String(index)
                    },
                  });
                } catch (e) {
                  console.log('Legend navigation error:', e);
                }
              }}
            />

            {analysis.suggestions.map((plant, idx) => {
              if (!plant) return null;
              return (
                <PlantCard
                  key={plant?.id || `plant-${idx}`}
                  plant={plant}
                  index={idx}
                  getPlantImage={getPlantImage}
                  getDifficultyColor={getDifficultyColor}
                  getDifficultyText={getDifficultyText}
                  enrichedPlant={enrichedPlants[idx]}
                  safeNavigate={safeNavigate}
                  language={language}
                  allPlantsJson={allPlantsJson}
                  totalPlants={analysis.suggestions.length}
                />
              );
            })}

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <Modal
        visible={!!enlargedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setEnlargedImage(null)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setEnlargedImage(null)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{enlargedImage?.label}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setEnlargedImage(null)}
              >
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalImageContainer}>
              {enlargedImage && (
                <Image
                  source={{ uri: enlargedImage.uri }}
                  style={styles.modalImage}
                  contentFit="contain"
                />
              )}
            </View>
          </SafeAreaView>
        </Pressable>
      </Modal>
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
  analysisCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 20,
  },
  analysisRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  analysisItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  analysisDivider: {
    width: 1,
    height: 60,
    backgroundColor: "#e5e7eb",
  },
  analysisLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500" as const,
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1a4d2e",
  },
  locationNote: {
    fontSize: 13,
    color: "#52b788",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500" as const,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 16,
  },
  plantCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  plantInfo: {
    padding: 20,
  },
  plantHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  plantName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 4,
  },
  plantScientific: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
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
  plantDescription: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 16,
  },
  requirementsRow: {
    flexDirection: "row",
    gap: 16,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  requirementText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500" as const,
  },
  airPurificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  airPurificationBadgeText: {
    fontSize: 13,
    color: "#16a34a",
    fontWeight: "600" as const,
  },
  comparisonCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#1a4d2e",
    marginBottom: 16,
    textAlign: "center",
  },
  imageComparisonContainer: {
    gap: 16,
  },
  comparisonImageWrapper: {
    width: "100%",
  },
  tapToEnlargeText: {
    fontSize: 12,
    color: "#52b788",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500" as const,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },
  comparisonImage: {
    width: "100%",
    height: 250,
    borderRadius: 16,
  },
  afterImageContainer: {
    position: "relative",
    width: "100%",
  },
  plantMarker: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#52b788",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    transform: [{ translateX: -16 }, { translateY: -16 }],
    zIndex: 10,
  },
  plantMarkerSelected: {
    backgroundColor: "#f59e0b",
    transform: [{ translateX: -18 }, { translateY: -18 }, { scale: 1.15 }],
  },
  plantMarkerText: {
    fontSize: 14,
    fontWeight: "800" as const,
    color: "#ffffff",
  },
  plantTooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    transform: [{ translateX: -50 }, { translateY: -30 }],
    zIndex: 20,
    maxWidth: 150,
  },
  plantTooltipText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#ffffff",
    textAlign: "center",
  },
  comparisonHint: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  plantNumberLegend: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxHeight: 350,
  },
  legendScrollView: {
    flex: 1,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  legendNumberCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#52b788",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  legendNumberLargeText: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#ffffff",
  },
  legendPlantInfo: {
    flex: 1,
    gap: 2,
  },
  legendPlantName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#1a4d2e",
  },
  legendPlantScientific: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  legendPlantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  plantCardImage: {
    width: "100%",
    height: 150,
  },
  plantsGalleryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  plantsGalleryImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
  },
  plantsGalleryHint: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic" as const,
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
  loadingTimeHint: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic" as const,
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
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
});
