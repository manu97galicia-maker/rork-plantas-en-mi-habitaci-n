import { useRouter } from "expo-router";
import { Calendar, Trash2, Eye, Scan, Camera, Settings, CheckCircle2, Download, Leaf, User, Images, Sparkles, ChevronRight, X, ZoomIn, ChevronLeft } from "lucide-react-native";
import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Paths, File as ExpoFile } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useUserPreferences, type Language } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";
import { Colors } from "@/constants/colors";
import { COMMON_PLANTS } from "@/constants/commonPlants";
import { usePlantImages } from "@/contexts/PlantImagesContext";



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ExpandedImageState {
  visible: boolean;
  images: { uri: string; label: string }[];
  currentIndex: number;
}

export default function GalleryScreen() {
  const router = useRouter();
  const { scanHistory, deleteScan, getRemainingScans, language, setLanguage } = useUserPreferences();
  const { getPlantImageWithFallback } = usePlantImages();
  const [expandedScan, setExpandedScan] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedImage, setExpandedImage] = useState<ExpandedImageState>({
    visible: false,
    images: [],
    currentIndex: 0,
  });
  const remainingScans = getRemainingScans();
  const t = getTranslations(language);
  const isNavigatingRef = useRef(false);
  const lastClickRef = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const zoomScale = useRef(new Animated.Value(1)).current;
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const safeNavigate = useCallback((path: string) => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastClickRef.current < 500) {
      console.log('⚠️ Navigation blocked - too fast');
      return;
    }
    isNavigatingRef.current = true;
    lastClickRef.current = now;
    console.log('📱 Navigating to:', path);
    router.push(path as any);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);
  }, [router]);

  const getPlantImageUrl = useCallback((plant: any): string => {
    return getPlantImageWithFallback(plant.id, plant.name || 'plant');
  }, [getPlantImageWithFallback]);
  
  const fixedScanHistory = useMemo(() => {
    return scanHistory.map(scan => ({
      ...scan,
      analysis: {
        ...scan.analysis,
        suggestions: scan.analysis.suggestions.map(plant => ({
          ...plant,
          imageUrl: getPlantImageUrl(plant),
        })),
      },
    }));
  }, [scanHistory, getPlantImageUrl]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return t.gallery.today;
    } else if (diffInDays === 1) {
      return t.gallery.yesterday;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${t.gallery.daysAgo}`;
    } else {
      return date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
        day: "numeric",
        month: "short",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const handleDelete = (scanId: string) => {
    Alert.alert(
      t.gallery.deleteTitle,
      t.gallery.deleteMessage,
      [
        { text: t.gallery.cancel, style: "cancel" },
        {
          text: t.gallery.delete,
          style: "destructive",
          onPress: async () => {
            await deleteScan(scanId);
          },
        },
      ]
    );
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    await setLanguage(newLanguage);
    setShowSettings(false);
  };

  const enrichPlantData = useCallback((plant: any) => {
    const commonPlant = COMMON_PLANTS.find(
      (p) => p.id === plant.id || 
             p.name.toLowerCase() === plant.name?.toLowerCase() ||
             p.scientificName.toLowerCase() === plant.scientificName?.toLowerCase()
    );
    
    if (commonPlant) {
      return {
        ...plant,
        airPurification: plant.airPurification || commonPlant.airPurification,
        wellnessBenefits: plant.wellnessBenefits || commonPlant.wellnessBenefits,
        careInstructions: plant.careInstructions || commonPlant.careInstructions,
      };
    }
    return plant;
  }, []);

  const handleViewDetails = useCallback((scanId: string) => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastClickRef.current < 500) {
      console.log('⚠️ Navigation blocked - too fast');
      return;
    }
    const scan = scanHistory.find((s) => s.id === scanId);
    if (scan && scan.analysis.suggestions.length > 0) {
      isNavigatingRef.current = true;
      lastClickRef.current = now;
      const enrichedPlant = enrichPlantData(scan.analysis.suggestions[0]);
      router.push({
        pathname: "/plant-detail" as any,
        params: { plantData: JSON.stringify(enrichedPlant) },
      });
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 500);
    }
  }, [scanHistory, router, enrichPlantData]);

  const downloadImage = async (base64Data: string, filename: string) => {
    try {
      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${base64Data}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert(t.gallery.downloadSuccess);
      } else {
        const file = new ExpoFile(Paths.cache, filename);
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        file.write(bytes);
        
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(file.uri);
        } else {
          Alert.alert(t.gallery.downloadError);
        }
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      Alert.alert(t.gallery.downloadError);
    }
  };

  const handleDownloadOriginal = (scan: any) => {
    downloadImage(scan.originalImage, `plant-scan-original-${scan.id}.jpg`);
  };

  const handleDownloadEdited = (scan: any) => {
    if (scan.editedImage) {
      downloadImage(scan.editedImage, `plant-scan-with-plants-${scan.id}.png`);
    }
  };

  const openImageViewer = useCallback((scan: any, startWithEdited: boolean = false) => {
    const images: { uri: string; label: string }[] = [];
    
    if (scan.originalImage) {
      images.push({
        uri: `data:image/jpeg;base64,${scan.originalImage}`,
        label: "Original",
      });
    }
    
    if (scan.editedImage) {
      images.push({
        uri: `data:image/png;base64,${scan.editedImage}`,
        label: "+ Plants",
      });
    }
    
    if (images.length > 0) {
      const startIndex = startWithEdited && scan.editedImage ? (scan.originalImage ? 1 : 0) : 0;
      setExpandedImage({
        visible: true,
        images,
        currentIndex: startIndex,
      });
      zoomScale.setValue(1);
      panX.setValue(0);
      panY.setValue(0);
    }
  }, [zoomScale, panX, panY]);

  const closeImageViewer = useCallback(() => {
    setExpandedImage({ visible: false, images: [], currentIndex: 0 });
    zoomScale.setValue(1);
    panX.setValue(0);
    panY.setValue(0);
  }, [zoomScale, panX, panY]);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setExpandedImage(prev => {
      const newIndex = direction === 'next' 
        ? Math.min(prev.currentIndex + 1, prev.images.length - 1)
        : Math.max(prev.currentIndex - 1, 0);
      return { ...prev, currentIndex: newIndex };
    });
    zoomScale.setValue(1);
    panX.setValue(0);
    panY.setValue(0);
  }, [zoomScale, panX, panY]);

  const navItems = [
    { icon: Camera, label: t.camera.title, path: "/camera", color: Colors.primary },
    { icon: Scan, label: t.gallery.identifyPlant, path: "/identify-camera", color: "#4ECDC4" },
    { icon: Leaf, label: t.myPlants.title, path: "/my-plants", color: "#FFB020" },
    { icon: Images, label: language === "es" ? "Álbumes" : "Albums", path: "/photo-gallery", color: "#FF6B6B" },
    { icon: User, label: language === "es" ? "Perfil" : "Profile", path: "/profile", color: "#3B82F6" },
  ];

  if (scanHistory.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[Colors.lightSecondary, Colors.light]} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerGreeting}>{language === "es" ? "Hola! 👋" : "Hello! 👋"}</Text>
                <Text style={styles.headerTitle}>{t.gallery.title}</Text>
              </View>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setShowSettings(true)}
              >
                <Settings size={22} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <LinearGradient colors={Colors.gradient.primary} style={styles.emptyIconGradient}>
                  <Sparkles size={48} color={Colors.light} strokeWidth={1.5} />
                </LinearGradient>
              </View>
              <Text style={styles.emptyTitle}>{t.gallery.noScans}</Text>
              <Text style={styles.emptyText}>
                {t.gallery.noScansDescription}
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => safeNavigate("/camera")}
                activeOpacity={0.8}
              >
                <LinearGradient colors={Colors.gradient.primary} style={styles.emptyButtonGradient}>
                  <Camera size={20} color={Colors.light} />
                  <Text style={styles.emptyButtonText}>{t.gallery.startScanning}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomNav}>
              {navItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.navItem}
                  onPress={() => safeNavigate(item.path)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.navIconWrapper, { backgroundColor: `${item.color}15` }]}>
                    <item.icon size={22} color={item.color} strokeWidth={2} />
                  </View>
                  <Text style={styles.navLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.lightSecondary, Colors.light]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerGreeting}>{language === "es" ? "Hola! 👋" : "Hello! 👋"}</Text>
              <Text style={styles.headerTitle}>{t.gallery.title}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettings(true)}
            >
              <Settings size={22} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <LinearGradient colors={Colors.gradient.primary} style={styles.statGradient}>
                <Text style={styles.statValue}>{remainingScans}</Text>
                <Text style={styles.statLabel}>{t.gallery.scansRemaining}</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCardSmall}>
              <Text style={styles.statValueDark}>{scanHistory.length}</Text>
              <Text style={styles.statLabelDark}>{t.gallery.totalScans}</Text>
            </View>
          </View>

          <Animated.ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          >
            {fixedScanHistory.map((scan, index) => {
              const isExpanded = expandedScan === scan.id;
              return (
                <TouchableOpacity
                  key={scan.id}
                  style={styles.scanCard}
                  onPress={() => setExpandedScan(isExpanded ? null : scan.id)}
                  activeOpacity={0.95}
                >
                  <View style={styles.scanCardInner}>
                    <View style={styles.scanHeader}>
                      <View style={styles.scanHeaderLeft}>
                        <View style={styles.scanDateBadge}>
                          <Calendar size={14} color={Colors.primary} />
                          <Text style={styles.scanDate}>{formatDate(scan.timestamp)}</Text>
                        </View>
                      </View>
                      <View style={styles.scanNumberBadge}>
                        <Text style={styles.scanNumber}>#{scanHistory.length - index}</Text>
                      </View>
                    </View>

                    <View style={styles.scanImagesRow}>
                      <TouchableOpacity 
                        style={styles.scanImageContainer}
                        onPress={() => openImageViewer(scan, false)}
                        activeOpacity={0.9}
                      >
                        {scan.originalImage ? (
                          <Image
                            source={{ uri: `data:image/jpeg;base64,${scan.originalImage}` }}
                            style={styles.scanImage}
                            contentFit="cover"
                          />
                        ) : (
                          <View style={[styles.scanImage, styles.noImagePlaceholder]}>
                            <Camera size={32} color={Colors.text.tertiary} />
                          </View>
                        )}
                        <View style={styles.imageOverlay}>
                          <Text style={styles.imageOverlayText}>Original</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.downloadBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDownloadOriginal(scan);
                          }}
                          activeOpacity={0.8}
                        >
                          <Download size={16} color={Colors.primary} />
                        </TouchableOpacity>
                        <View style={styles.zoomIndicator}>
                          <ZoomIn size={14} color="#fff" />
                        </View>
                      </TouchableOpacity>

                      {scan.editedImage && (
                        <TouchableOpacity 
                          style={styles.scanImageContainer}
                          onPress={() => openImageViewer(scan, true)}
                          activeOpacity={0.9}
                        >
                          <Image
                            source={{ uri: `data:image/png;base64,${scan.editedImage}` }}
                            style={styles.scanImage}
                            contentFit="cover"
                          />
                          <View style={[styles.imageOverlay, styles.imageOverlayGreen]}>
                            <Text style={styles.imageOverlayText}>+ Plants</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.downloadBtn}
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDownloadEdited(scan);
                            }}
                            activeOpacity={0.8}
                          >
                            <Download size={16} color={Colors.primary} />
                          </TouchableOpacity>
                          <View style={styles.zoomIndicator}>
                            <ZoomIn size={14} color="#fff" />
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.scanInfoRow}>
                      <View style={styles.scanInfoItem}>
                        <Text style={styles.scanInfoEmoji}>🌱</Text>
                        <Text style={styles.scanInfoText}>{scan.analysis.suggestions.length} plants</Text>
                      </View>
                      <View style={styles.scanInfoItem}>
                        <Text style={styles.scanInfoEmoji}>☀️</Text>
                        <Text style={styles.scanInfoText}>{scan.analysis.lightLevel}</Text>
                      </View>
                      <View style={styles.scanInfoItem}>
                        <Text style={styles.scanInfoEmoji}>📏</Text>
                        <Text style={styles.scanInfoText}>{scan.analysis.spaceSize}</Text>
                      </View>
                    </View>

                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <Text style={styles.expandedTitle}>{language === "es" ? "Plantas recomendadas:" : "Recommended plants:"}</Text>
                        {scan.analysis.suggestions.map((plant) => (
                          <View key={plant.id} style={styles.plantRow}>
                            <Image
                              source={{ uri: plant.imageUrl }}
                              style={styles.plantThumb}
                              contentFit="cover"
                              cachePolicy="memory-disk"
                              placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                              transition={200}
                            />
                            <View style={styles.plantInfo}>
                              <Text style={styles.plantName}>{plant.name}</Text>
                              <Text style={styles.plantScientific}>{plant.scientificName}</Text>
                            </View>
                            <ChevronRight size={18} color={Colors.text.tertiary} />
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.scanActions}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleViewDetails(scan.id)}
                        activeOpacity={0.8}
                      >
                        <Eye size={18} color={Colors.primary} />
                        <Text style={styles.actionBtnText}>{t.gallery.viewDetails}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.actionBtnDanger]}
                        onPress={() => handleDelete(scan.id)}
                        activeOpacity={0.8}
                      >
                        <Trash2 size={18} color={Colors.status.error} />
                        <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>{t.gallery.delete}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            <View style={{ height: 140 }} />
          </Animated.ScrollView>

          <View style={styles.bottomNav}>
            {navItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.navItem}
                onPress={() => safeNavigate(item.path)}
                activeOpacity={0.7}
              >
                <View style={[styles.navIconWrapper, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={22} color={item.color} strokeWidth={2} />
                </View>
                <Text style={styles.navLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Modal
            visible={expandedImage.visible}
            transparent
            animationType="fade"
            onRequestClose={closeImageViewer}
          >
            <View style={styles.imageViewerOverlay}>
              <TouchableOpacity
                style={styles.imageViewerClose}
                onPress={closeImageViewer}
              >
                <X size={28} color="#ffffff" />
              </TouchableOpacity>

              {expandedImage.images.length > 1 && (
                <View style={styles.imageViewerNav}>
                  <TouchableOpacity
                    style={[
                      styles.imageNavBtn,
                      expandedImage.currentIndex === 0 && styles.imageNavBtnDisabled
                    ]}
                    onPress={() => navigateImage('prev')}
                    disabled={expandedImage.currentIndex === 0}
                  >
                    <ChevronLeft size={28} color="#fff" />
                  </TouchableOpacity>
                  <View style={styles.imageNavIndicator}>
                    <Text style={styles.imageNavText}>
                      {expandedImage.currentIndex + 1} / {expandedImage.images.length}
                    </Text>
                    <Text style={styles.imageNavLabel}>
                      {expandedImage.images[expandedImage.currentIndex]?.label}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.imageNavBtn,
                      expandedImage.currentIndex === expandedImage.images.length - 1 && styles.imageNavBtnDisabled
                    ]}
                    onPress={() => navigateImage('next')}
                    disabled={expandedImage.currentIndex === expandedImage.images.length - 1}
                  >
                    <ChevronRight size={28} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              {expandedImage.images[expandedImage.currentIndex] && (
                <View style={styles.imageViewerContent}>
                  <Image
                    source={{ uri: expandedImage.images[expandedImage.currentIndex].uri }}
                    style={styles.expandedImage}
                    contentFit="contain"
                  />
                </View>
              )}

              {expandedImage.images.length === 1 && (
                <View style={styles.singleImageLabel}>
                  <Text style={styles.imageNavLabel}>
                    {expandedImage.images[0]?.label}
                  </Text>
                </View>
              )}
            </View>
          </Modal>

          <Modal
            visible={showSettings}
            transparent
            animationType="fade"
            onRequestClose={() => setShowSettings(false)}
          >
            <View style={styles.modalOverlay}>
              <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
                <TouchableOpacity
                  style={styles.modalOverlayTouch}
                  activeOpacity={1}
                  onPress={() => setShowSettings(false)}
                />
              </BlurView>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{t.settings.changeLanguage}</Text>
                  <TouchableOpacity 
                    style={styles.modalClose}
                    onPress={() => setShowSettings(false)}
                  >
                    <X size={20} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.languageOptions}>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      language === "en" && styles.languageOptionActive,
                    ]}
                    onPress={() => handleLanguageChange("en")}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.languageFlag}>🇺🇸</Text>
                    <View style={styles.languageTextWrap}>
                      <Text style={styles.languageName}>English</Text>
                      <Text style={styles.languageNative}>English</Text>
                    </View>
                    {language === "en" && (
                      <View style={styles.languageCheck}>
                        <CheckCircle2 size={22} color={Colors.primary} strokeWidth={2.5} />
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      language === "es" && styles.languageOptionActive,
                    ]}
                    onPress={() => handleLanguageChange("es")}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.languageFlag}>🇪🇸</Text>
                    <View style={styles.languageTextWrap}>
                      <Text style={styles.languageName}>Español</Text>
                      <Text style={styles.languageNative}>Spanish</Text>
                    </View>
                    {language === "es" && (
                      <View style={styles.languageCheck}>
                        <CheckCircle2 size={22} color={Colors.primary} strokeWidth={2.5} />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightSecondary,
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerGreeting: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500" as const,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1.5,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  statGradient: {
    padding: 20,
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.light,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "rgba(255,255,255,0.85)",
  },
  statCardSmall: {
    flex: 1,
    backgroundColor: Colors.light,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statValueDark: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  statLabelDark: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  scanCard: {
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: Colors.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  scanCardInner: {
    padding: 16,
  },
  scanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  scanHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanDateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scanDate: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  scanNumberBadge: {
    backgroundColor: Colors.lightTertiary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  scanNumber: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.text.secondary,
  },
  scanImagesRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  scanImageContainer: {
    flex: 1,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  scanImage: {
    width: "100%",
    height: 150,
    backgroundColor: Colors.lightTertiary,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  imageOverlayGreen: {
    backgroundColor: "rgba(0,200,150,0.85)",
  },
  imageOverlayText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.light,
  },
  downloadBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.light,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  noImagePlaceholder: {
    backgroundColor: Colors.lightTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerClose: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  imageViewerNav: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    zIndex: 10,
  },
  imageNavBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageNavBtnDisabled: {
    opacity: 0.3,
  },
  imageNavIndicator: {
    alignItems: "center",
  },
  imageNavText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  imageNavLabel: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  imageViewerContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  expandedImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 250,
    borderRadius: 16,
  },
  singleImageLabel: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },
  scanInfoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  scanInfoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.lightSecondary,
    paddingVertical: 10,
    borderRadius: 12,
  },
  scanInfoEmoji: {
    fontSize: 14,
  },
  scanInfoText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.text.secondary,
  },
  expandedContent: {
    paddingTop: 8,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.lightTertiary,
    marginTop: 4,
  },
  expandedTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  plantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  plantThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.lightTertiary,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  plantScientific: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontStyle: "italic" as const,
  },
  scanActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
  },
  actionBtnDanger: {
    backgroundColor: "#FEF2F2",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  actionBtnTextDanger: {
    color: Colors.status.error,
  },
  bottomNav: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: Colors.light,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  navIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "600" as const,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalOverlayTouch: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: Colors.light,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightTertiary,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.text.primary,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  languageOptions: {
    gap: 12,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.lightSecondary,
    borderWidth: 2,
    borderColor: "transparent",
  },
  languageOptionActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 14,
  },
  languageTextWrap: {
    flex: 1,
  },
  languageName: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  languageCheck: {
    marginLeft: 8,
  },
});
