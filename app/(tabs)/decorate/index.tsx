import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { Sparkles, Camera, ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useUserPreferences, type ScanHistory } from "@/contexts/UserPreferencesContext";
import { Colors } from "@/constants/colors";
import TabHeader from "@/components/TabHeader";
import SettingsModal from "@/components/SettingsModal";
import FloatingActionButton from "@/components/FloatingActionButton";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

export default function DecorateScreen() {
  const router = useRouter();
  const { scanHistory, language, getRemainingScans } = useUserPreferences();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanHistory | null>(null);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const openImageViewer = (scan: ScanHistory) => {
    setSelectedScan(scan);
    setCurrentImageIndex(0);
    setImageViewerVisible(true);
  };

  const getViewerImages = () => {
    if (!selectedScan) return [];
    const images = [];
    if (selectedScan.originalImage) {
      images.push({
        uri: getImageUri(selectedScan.originalImage),
        label: language === "es" ? "Antes" : "Before",
      });
    }
    if (selectedScan.editedImage) {
      images.push({
        uri: getImageUri(selectedScan.editedImage),
        label: language === "es" ? "Después" : "After",
      });
    }
    return images;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Sparkles size={48} color={Colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>
        {language === "es" ? "¡Decora tu espacio!" : "Decorate your space!"}
      </Text>
      <Text style={styles.emptyText}>
        {language === "es"
          ? "Escanea tu habitación y obtén sugerencias de plantas perfectas para tu espacio."
          : "Scan your room and get perfect plant suggestions for your space."}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => safeNavigate("/(tabs)/decorate/camera")}
      >
        <LinearGradient colors={Colors.gradient.primary} style={styles.emptyButtonGradient}>
          <Camera size={20} color={Colors.light} />
          <Text style={styles.emptyButtonText}>
            {language === "es" ? "Escanear habitación" : "Scan Room"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderScanCard = (scan: ScanHistory) => {
    const plantCount = scan.analysis?.suggestions?.length || 0;
    const hasEditedImage = !!scan.editedImage;

    return (
      <TouchableOpacity
        key={scan.id}
        style={styles.scanCard}
        onPress={() => openImageViewer(scan)}
        activeOpacity={0.8}
      >
        <View style={styles.cardImageContainer}>
          {hasEditedImage ? (
            <View style={styles.splitImageContainer}>
              <Image
                source={{ uri: getImageUri(scan.originalImage) || "" }}
                style={styles.splitImageLeft}
                contentFit="cover"
              />
              <View style={styles.splitDivider} />
              <Image
                source={{ uri: getImageUri(scan.editedImage!) || "" }}
                style={styles.splitImageRight}
                contentFit="cover"
              />
            </View>
          ) : (
            <Image
              source={{ uri: getImageUri(scan.originalImage) || "" }}
              style={styles.cardImage}
              contentFit="cover"
            />
          )}
          {hasEditedImage && (
            <View style={styles.sparklesBadge}>
              <Sparkles size={12} color={Colors.light} />
            </View>
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardDate}>{formatDate(scan.timestamp)}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.plantCountBadge}>
              <Text style={styles.plantCountText}>{plantCount}</Text>
            </View>
            <Text style={styles.cardPlants}>
              {language === "es" ? "plantas" : "plants"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const viewerImages = getViewerImages();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <TabHeader
          greeting={language === "es" ? "Hola" : "Hello"}
          title={language === "es" ? "Tus Espacios" : "Your Spaces"}
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
          {scanHistory.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{scanHistory.length}</Text>
                  <Text style={styles.statLabel}>
                    {language === "es" ? "Escaneos" : "Scans"}
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

              <View style={styles.grid}>
                {scanHistory.map(renderScanCard)}
              </View>
            </>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        <FloatingActionButton
          onPress={() => safeNavigate("/(tabs)/decorate/camera")}
          icon={<Camera size={28} color={Colors.light} strokeWidth={2} />}
        />
      </SafeAreaView>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      <Modal
        visible={imageViewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {viewerImages[currentImageIndex]?.label || ""}
              </Text>
              <Text style={styles.modalCounter}>
                {currentImageIndex + 1} / {viewerImages.length}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setImageViewerVisible(false)}
              >
                <X size={24} color={Colors.light} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalImageContainer}>
              {viewerImages.length > 0 && viewerImages[currentImageIndex]?.uri && (
                <Image
                  source={{ uri: viewerImages[currentImageIndex].uri! }}
                  style={styles.modalImage}
                  contentFit="contain"
                />
              )}
            </View>

            {viewerImages.length > 1 && (
              <View style={styles.modalNav}>
                <TouchableOpacity
                  style={[styles.navButton, currentImageIndex === 0 && styles.navButtonDisabled]}
                  onPress={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft size={28} color={currentImageIndex === 0 ? Colors.text.tertiary : Colors.light} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, currentImageIndex === viewerImages.length - 1 && styles.navButtonDisabled]}
                  onPress={() => setCurrentImageIndex((i) => Math.min(viewerImages.length - 1, i + 1))}
                  disabled={currentImageIndex === viewerImages.length - 1}
                >
                  <ChevronRight size={28} color={currentImageIndex === viewerImages.length - 1 ? Colors.text.tertiary : Colors.light} />
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </View>
      </Modal>
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
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  scanCard: {
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
  splitImageContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  splitImageLeft: {
    flex: 1,
    height: "100%",
  },
  splitDivider: {
    width: 2,
    backgroundColor: Colors.light,
  },
  splitImageRight: {
    flex: 1,
    height: "100%",
  },
  sparklesBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    padding: 6,
    borderRadius: 10,
  },
  cardInfo: {
    padding: 12,
  },
  cardDate: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  plantCountBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  plantCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  cardPlants: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light,
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
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light,
    flex: 1,
  },
  modalCounter: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginRight: 16,
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
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
  modalNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
});
