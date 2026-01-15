import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Sun,
  Droplets,
  ThermometerSun,
  Wind,
  Leaf,
  Clock,
  BookOpen,
} from "lucide-react-native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useUserPreferences, type IdentificationHistory } from "@/contexts/UserPreferencesContext";
import { Colors } from "@/constants/colors";

export default function IdentificationDetailScreen() {
  const params = useLocalSearchParams<{ identificationData: string }>();
  const router = useRouter();
  const { language } = useUserPreferences();

  let identification: IdentificationHistory | null = null;

  try {
    if (params.identificationData) {
      identification = JSON.parse(params.identificationData);
    }
  } catch (error) {
    console.error("Error parsing identification data:", error);
  }

  if (!identification) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {language === "es" ? "Error al cargar los datos" : "Error loading data"}
            </Text>
            <TouchableOpacity style={styles.backButtonError} onPress={() => router.back()}>
              <Text style={styles.backButtonErrorText}>
                {language === "es" ? "Volver" : "Go back"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const imageUri = getImageUri(identification.imageData);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.forest} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {language === "es" ? "Detalles de Identificación" : "Identification Details"}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Plant Image */}
          <View style={styles.imageCard}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.plantImage}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.plantImage, styles.imagePlaceholder]}>
                <Leaf size={64} color={Colors.text.tertiary} />
              </View>
            )}
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(identification.difficulty) }]}>
              <Text style={styles.difficultyText}>
                {getDifficultyText(identification.difficulty)}
              </Text>
            </View>
          </View>

          {/* Plant Name */}
          <View style={styles.nameCard}>
            <Text style={styles.plantName}>{identification.plantName}</Text>
            <Text style={styles.scientificName}>{identification.scientificName}</Text>
            <View style={styles.familyRow}>
              <BookOpen size={16} color={Colors.text.secondary} />
              <Text style={styles.familyText}>
                {language === "es" ? "Familia: " : "Family: "}
                {identification.family}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <Clock size={14} color={Colors.text.tertiary} />
              <Text style={styles.dateText}>{formatDate(identification.timestamp)}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>
              {language === "es" ? "Descripción" : "Description"}
            </Text>
            <Text style={styles.descriptionText}>{identification.description}</Text>
          </View>

          {/* Care Information */}
          {identification.care && (
            <View style={styles.careCard}>
              <Text style={styles.sectionTitle}>
                {language === "es" ? "Cuidados" : "Care Guide"}
              </Text>

              <View style={styles.careItem}>
                <View style={[styles.careIconContainer, { backgroundColor: "#fef3c7" }]}>
                  <Sun size={24} color="#f59e0b" />
                </View>
                <View style={styles.careContent}>
                  <Text style={styles.careLabel}>
                    {language === "es" ? "Luz" : "Light"}
                  </Text>
                  <Text style={styles.careText}>{identification.care.light}</Text>
                </View>
              </View>

              <View style={styles.careItem}>
                <View style={[styles.careIconContainer, { backgroundColor: "#dbeafe" }]}>
                  <Droplets size={24} color="#3b82f6" />
                </View>
                <View style={styles.careContent}>
                  <Text style={styles.careLabel}>
                    {language === "es" ? "Riego" : "Water"}
                  </Text>
                  <Text style={styles.careText}>{identification.care.water}</Text>
                </View>
              </View>

              <View style={styles.careItem}>
                <View style={[styles.careIconContainer, { backgroundColor: "#fee2e2" }]}>
                  <ThermometerSun size={24} color="#ef4444" />
                </View>
                <View style={styles.careContent}>
                  <Text style={styles.careLabel}>
                    {language === "es" ? "Temperatura" : "Temperature"}
                  </Text>
                  <Text style={styles.careText}>{identification.care.temperature}</Text>
                </View>
              </View>

              <View style={styles.careItem}>
                <View style={[styles.careIconContainer, { backgroundColor: "#cffafe" }]}>
                  <Wind size={24} color="#06b6d4" />
                </View>
                <View style={styles.careContent}>
                  <Text style={styles.careLabel}>
                    {language === "es" ? "Humedad" : "Humidity"}
                  </Text>
                  <Text style={styles.careText}>{identification.care.humidity}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 20,
  },
  backButtonError: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonErrorText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light,
  },
  imageCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
    backgroundColor: Colors.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  plantImage: {
    width: "100%",
    aspectRatio: 1,
  },
  imagePlaceholder: {
    backgroundColor: Colors.lightTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  difficultyBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light,
  },
  nameCard: {
    backgroundColor: Colors.light,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  plantName: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 18,
    color: Colors.text.secondary,
    fontStyle: "italic",
    marginBottom: 12,
  },
  familyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  familyText: {
    fontSize: 15,
    color: Colors.text.secondary,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightTertiary,
  },
  dateText: {
    fontSize: 13,
    color: Colors.text.tertiary,
  },
  descriptionCard: {
    backgroundColor: Colors.light,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  careCard: {
    backgroundColor: Colors.light,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  careItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 16,
  },
  careIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  careContent: {
    flex: 1,
  },
  careLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  careText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
