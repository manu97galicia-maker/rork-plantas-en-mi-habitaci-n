import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { Scan, Camera, Leaf, Clock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUserPreferences, type IdentificationHistory } from "@/contexts/UserPreferencesContext";
import { Colors } from "@/constants/colors";
import TabHeader from "@/components/TabHeader";
import SettingsModal from "@/components/SettingsModal";
import FloatingActionButton from "@/components/FloatingActionButton";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

export default function IdentifyScreen() {
  const router = useRouter();
  const { language, getRemainingScans, identificationHistory } = useUserPreferences();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isNavigatingRef = useRef(false);
  const lastClickRef = useRef(0);

  const remainingScans = getRemainingScans();

  useFocusEffect(
    useCallback(() => {
      isNavigatingRef.current = false;
    }, [])
  );

  const safeNavigate = useCallback((path: string) => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastClickRef.current < 500) return;
    isNavigatingRef.current = true;
    lastClickRef.current = now;
    router.push(path as any);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  }, [router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return language === "es" ? "Hoy" : "Today";
    if (diffDays === 1) return language === "es" ? "Ayer" : "Yesterday";
    if (diffDays < 7) return language === "es" ? `Hace ${diffDays} días` : `${diffDays} days ago`;

    return date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const getImageUri = (base64: string) => {
    if (!base64) return null;
    const prefix = base64.startsWith("iVBOR") ? "data:image/png;base64," : "data:image/jpeg;base64,";
    return `${prefix}${base64}`;
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

  const renderEmptyState = () => (
    <>
      <View style={styles.heroSection}>
        <View style={styles.heroIconContainer}>
          <Scan size={48} color={Colors.primary} />
        </View>
        <Text style={styles.heroTitle}>
          {language === "es" ? "Identifica cualquier planta" : "Identify any plant"}
        </Text>
        <Text style={styles.heroText}>
          {language === "es"
            ? "Toma una foto de cualquier planta y nuestra IA te dirá qué es y cómo cuidarla."
            : "Take a photo of any plant and our AI will tell you what it is and how to care for it."}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.identifyButton}
        onPress={() => safeNavigate("/(tabs)/identify/camera")}
        activeOpacity={0.8}
      >
        <LinearGradient colors={Colors.gradient.primary} style={styles.identifyButtonGradient}>
          <Camera size={24} color={Colors.light} />
          <Text style={styles.identifyButtonText}>
            {language === "es" ? "Identificar una planta" : "Identify a plant"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>
          {language === "es" ? "Lo que obtendrás" : "What you'll get"}
        </Text>

        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: Colors.primaryLight }]}>
            <Leaf size={20} color={Colors.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              {language === "es" ? "Identificación precisa" : "Accurate identification"}
            </Text>
            <Text style={styles.featureText}>
              {language === "es"
                ? "Nombre común, científico y familia botánica"
                : "Common name, scientific name, and botanical family"}
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: "#f0fdf4" }]}>
            <Text style={styles.featureEmoji}>🌱</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              {language === "es" ? "Guía de cuidados" : "Care guide"}
            </Text>
            <Text style={styles.featureText}>
              {language === "es"
                ? "Luz, riego, temperatura, humedad y más"
                : "Light, water, temperature, humidity, and more"}
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: "#fef3c7" }]}>
            <Text style={styles.featureEmoji}>💡</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              {language === "es" ? "Consejos útiles" : "Useful tips"}
            </Text>
            <Text style={styles.featureText}>
              {language === "es"
                ? "Trucos y recomendaciones de expertos"
                : "Expert tricks and recommendations"}
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: "#fce7f3" }]}>
            <Text style={styles.featureEmoji}>❤️</Text>
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>
              {language === "es" ? "Beneficios de bienestar" : "Wellness benefits"}
            </Text>
            <Text style={styles.featureText}>
              {language === "es"
                ? "Purificación del aire, mejora del sueño y más"
                : "Air purification, sleep improvement, and more"}
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const handleIdentificationPress = useCallback((identification: IdentificationHistory) => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastClickRef.current < 500) return;
    isNavigatingRef.current = true;
    lastClickRef.current = now;

    try {
      router.push({
        pathname: "/(tabs)/identify/detail",
        params: { identificationData: JSON.stringify(identification) },
      } as any);
    } catch (e) {
      console.log("Navigation error:", e);
    }

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  }, [router]);

  const renderIdentificationCard = (identification: IdentificationHistory) => {
    const imageUri = getImageUri(identification.imageData);

    return (
      <TouchableOpacity
        key={identification.id}
        style={styles.identificationCard}
        activeOpacity={0.8}
        onPress={() => handleIdentificationPress(identification)}
      >
        <View style={styles.cardImageContainer}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.cardImage}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Leaf size={32} color={Colors.text.tertiary} />
            </View>
          )}
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(identification.difficulty) }]}>
            <Text style={styles.difficultyBadgeText}>
              {getDifficultyText(identification.difficulty)}
            </Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardPlantName} numberOfLines={1}>
            {identification.plantName}
          </Text>
          <Text style={styles.cardScientificName} numberOfLines={1}>
            {identification.scientificName}
          </Text>
          <View style={styles.cardMeta}>
            <Clock size={12} color={Colors.text.tertiary} />
            <Text style={styles.cardDate}>{formatDate(identification.timestamp)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHistoryView = () => (
    <>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{identificationHistory.length}</Text>
          <Text style={styles.statLabel}>
            {language === "es" ? "Identificadas" : "Identified"}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{remainingScans}</Text>
          <Text style={styles.statLabel}>
            {language === "es" ? "Restantes" : "Remaining"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.identifyButtonSmall}
        onPress={() => safeNavigate("/(tabs)/identify/camera")}
        activeOpacity={0.8}
      >
        <LinearGradient colors={Colors.gradient.primary} style={styles.identifyButtonSmallGradient}>
          <Camera size={20} color={Colors.light} />
          <Text style={styles.identifyButtonSmallText}>
            {language === "es" ? "Identificar nueva planta" : "Identify new plant"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>
          {language === "es" ? "Historial de Identificaciones" : "Identification History"}
        </Text>
        <View style={styles.grid}>
          {identificationHistory.map(renderIdentificationCard)}
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <TabHeader
          title={language === "es" ? "Identificar Plantas" : "Identify Plants"}
          onSettingsPress={() => setSettingsVisible(true)}
          rightContent={
            <View style={styles.scansBadge}>
              <Text style={styles.scansBadgeText}>{remainingScans}</Text>
            </View>
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          {identificationHistory.length === 0 ? renderEmptyState() : renderHistoryView()}

          <View style={{ height: 120 }} />
        </ScrollView>

        <FloatingActionButton
          onPress={() => safeNavigate("/(tabs)/identify/camera")}
          icon={<Scan size={28} color={Colors.light} strokeWidth={2} />}
        />
      </SafeAreaView>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  scansBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scansBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  heroIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  heroText: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  identifyButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
  },
  identifyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
  },
  identifyButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light,
  },
  identifyButtonSmall: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },
  identifyButtonSmallGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
  },
  identifyButtonSmallText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  featureEmoji: {
    fontSize: 22,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.lightTertiary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  historySection: {
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  identificationCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.light,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardImagePlaceholder: {
    backgroundColor: Colors.lightTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  difficultyBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light,
  },
  cardInfo: {
    padding: 12,
  },
  cardPlantName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  cardScientificName: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontStyle: "italic",
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardDate: {
    fontSize: 11,
    color: Colors.text.tertiary,
  },
});
