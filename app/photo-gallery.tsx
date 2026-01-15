import { useRouter } from "expo-router";
import { ChevronRight, ChevronLeft, Folder, Image as ImageIcon, X, Flower2, Leaf, Sparkles, Camera } from "lucide-react-native";
import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useUserPreferences, type ScanHistory } from "@/contexts/UserPreferencesContext";

const { width, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ExpandedImageState {
  visible: boolean;
  images: { uri: string; label: string }[];
  currentIndex: number;
}

interface AutoAlbum {
  id: string;
  name: string;
  nameEs: string;
  icon: typeof Flower2;
  iconColor: string;
  bgColor: string;
  getPhotos: (scans: ScanHistory[]) => ScanHistory[];
}

export default function PhotoGalleryScreen() {
  const router = useRouter();
  const { language, scanHistory } = useUserPreferences();
  const [viewingAlbumId, setViewingAlbumId] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<ExpandedImageState>({
    visible: false,
    images: [],
    currentIndex: 0,
  });
  const lastTapRef = useRef(0);

  const autoAlbums: AutoAlbum[] = useMemo(() => [
    {
      id: "spaces",
      name: "Spaces Analysis",
      nameEs: "Análisis de Espacios",
      icon: Sparkles,
      iconColor: "#f59e0b",
      bgColor: "#fef3c7",
      getPhotos: (scans: ScanHistory[]) => scans.filter(s => s.originalImage && s.editedImage),
    },
    {
      id: "all-scans",
      name: "All Scans",
      nameEs: "Todos los Escaneos",
      icon: Camera,
      iconColor: "#3b82f6",
      bgColor: "#dbeafe",
      getPhotos: (scans: ScanHistory[]) => scans,
    },
    {
      id: "plants",
      name: "Plants Identified",
      nameEs: "Plantas Identificadas",
      icon: Leaf,
      iconColor: "#10b981",
      bgColor: "#d1fae5",
      getPhotos: (scans: ScanHistory[]) => scans.filter(s => s.analysis?.suggestions && s.analysis.suggestions.length > 0),
    },
  ], []);

  const viewingAlbum = useMemo(() => {
    if (!viewingAlbumId) return null;
    return autoAlbums.find(a => a.id === viewingAlbumId) || null;
  }, [viewingAlbumId, autoAlbums]);

  const albumPhotos = useMemo(() => {
    if (!viewingAlbum) return [];
    return viewingAlbum.getPhotos(scanHistory);
  }, [viewingAlbum, scanHistory]);

  const openImageViewer = useCallback((scan: ScanHistory) => {
    const images: { uri: string; label: string }[] = [];
    
    console.log('📷 Opening image viewer for scan:', scan.id);
    console.log('📷 Has originalImage:', !!scan.originalImage, 'length:', scan.originalImage?.length || 0);
    console.log('📷 Has editedImage:', !!scan.editedImage, 'length:', scan.editedImage?.length || 0);
    
    if (scan.originalImage && scan.originalImage.length > 100) {
      const mimeType = scan.originalImage.startsWith('iVBOR') ? 'image/png' : 'image/jpeg';
      images.push({
        uri: `data:${mimeType};base64,${scan.originalImage}`,
        label: language === "es" ? "Original" : "Original",
      });
      console.log('✅ Added original image to viewer');
    } else {
      console.log('⚠️ No valid original image found');
    }
    
    if (scan.editedImage && scan.editedImage.length > 100) {
      const mimeType = scan.editedImage.startsWith('iVBOR') ? 'image/png' : 'image/jpeg';
      images.push({
        uri: `data:${mimeType};base64,${scan.editedImage}`,
        label: language === "es" ? "Con Plantas" : "With Plants",
      });
      console.log('✅ Added edited image to viewer');
    }
    
    if (images.length > 0) {
      console.log('📷 Opening viewer with', images.length, 'images');
      setExpandedImage({
        visible: true,
        images,
        currentIndex: 0,
      });
    } else {
      console.log('❌ No images to display');
    }
  }, [language]);

  const closeImageViewer = useCallback(() => {
    setExpandedImage({ visible: false, images: [], currentIndex: 0 });
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setExpandedImage(prev => {
      const newIndex = direction === 'next' 
        ? Math.min(prev.currentIndex + 1, prev.images.length - 1)
        : Math.max(prev.currentIndex - 1, 0);
      return { ...prev, currentIndex: newIndex };
    });
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const renderImageViewerModal = () => (
    <Modal
      visible={expandedImage.visible}
      transparent
      animationType="fade"
      onRequestClose={closeImageViewer}
    >
      <View style={styles.expandedImageOverlay}>
        <TouchableOpacity
          style={styles.expandedImageClose}
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
        
        <ScrollView
          style={styles.zoomScrollView}
          contentContainerStyle={styles.zoomScrollContent}
          maximumZoomScale={3}
          minimumZoomScale={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          centerContent
        >
          {expandedImage.images[expandedImage.currentIndex] && (
            <Image
              source={{ uri: expandedImage.images[expandedImage.currentIndex].uri }}
              style={styles.expandedImage}
              contentFit="contain"
            />
          )}
        </ScrollView>
        
        {expandedImage.images.length === 1 && (
          <View style={styles.singleImageLabel}>
            <Text style={styles.imageNavLabel}>
              {expandedImage.images[0]?.label}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );

  if (viewingAlbum) {
    const AlbumIcon = viewingAlbum.icon;
    
    return (
      <View style={styles.container}>
        <LinearGradient colors={[viewingAlbum.bgColor, "#ffffff"]} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setViewingAlbumId(null)}
              >
                <ChevronLeft size={24} color="#64748b" />
              </TouchableOpacity>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {language === "es" ? viewingAlbum.nameEs : viewingAlbum.name}
              </Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.albumStatsRow}>
              <View style={[styles.albumStatBadge, { backgroundColor: viewingAlbum.bgColor }]}>
                <AlbumIcon size={18} color={viewingAlbum.iconColor} />
                <Text style={[styles.albumStatText, { color: viewingAlbum.iconColor }]}>
                  {albumPhotos.length} {language === "es" ? "fotos" : "photos"}
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.photosGrid}
              showsVerticalScrollIndicator={false}
            >
              {albumPhotos.length === 0 ? (
                <View style={styles.emptyAlbum}>
                  <AlbumIcon size={64} color={viewingAlbum.iconColor} strokeWidth={1.5} />
                  <Text style={styles.emptyAlbumTitle}>
                    {language === "es" ? "Álbum vacío" : "Empty Album"}
                  </Text>
                  <Text style={styles.emptyAlbumText}>
                    {language === "es" 
                      ? "Las fotos aparecerán aquí automáticamente cuando escanees espacios o identifiques plantas" 
                      : "Photos will appear here automatically when you scan spaces or identify plants"}
                  </Text>
                </View>
              ) : (
                <View style={styles.albumPhotosContainer}>
                  {albumPhotos.map(scan => (
                    <TouchableOpacity
                      key={scan.id}
                      style={styles.photoItemLarge}
                      onPress={() => openImageViewer(scan)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.beforeAfterContainer}>
                        <View style={styles.beforeAfterImage}>
                          <Image
                            source={{ uri: `data:image/jpeg;base64,${scan.originalImage}` }}
                            style={styles.halfImage}
                            contentFit="cover"
                          />
                          <View style={styles.imageLabel}>
                            <Text style={styles.imageLabelText}>
                              {language === "es" ? "Antes" : "Before"}
                            </Text>
                          </View>
                        </View>
                        {scan.editedImage ? (
                          <View style={styles.beforeAfterImage}>
                            <Image
                              source={{ uri: `data:image/png;base64,${scan.editedImage}` }}
                              style={styles.halfImage}
                              contentFit="cover"
                            />
                            <View style={[styles.imageLabel, styles.imageLabelGreen]}>
                              <Text style={styles.imageLabelText}>
                                {language === "es" ? "Después" : "After"}
                              </Text>
                            </View>
                          </View>
                        ) : (
                          <View style={[styles.beforeAfterImage, styles.noAfterImage]}>
                            <Leaf size={24} color="#94a3b8" />
                            <Text style={styles.noAfterText}>
                              {language === "es" ? "Sin editar" : "No edit"}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.photoMeta}>
                        <Text style={styles.photoMetaDate}>{formatDate(scan.timestamp)}</Text>
                        <Text style={styles.photoMetaPlants}>
                          🌱 {scan.analysis?.suggestions?.length || 0} {language === "es" ? "plantas" : "plants"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>

        {renderImageViewerModal()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#fef3c7", "#ffffff"]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {language === "es" ? "Galería de Fotos" : "Photo Gallery"}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Folder size={18} color="#f59e0b" />
              <Text style={styles.statBadgeText}>{autoAlbums.length} {language === "es" ? "álbumes" : "albums"}</Text>
            </View>
            <View style={styles.statBadge}>
              <ImageIcon size={18} color="#f59e0b" />
              <Text style={styles.statBadgeText}>{scanHistory.length} {language === "es" ? "fotos" : "photos"}</Text>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {language === "es" ? "Mis Álbumes" : "My Albums"}
              </Text>
            </View>

            <Text style={styles.autoAlbumsHint}>
              {language === "es" 
                ? "📸 Las fotos se guardan automáticamente de tus escaneos" 
                : "📸 Photos are saved automatically from your scans"}
            </Text>

            <View style={styles.albumsGrid}>
              {autoAlbums.map(album => {
                const photos = album.getPhotos(scanHistory);
                const AlbumIcon = album.icon;
                const coverPhoto = photos[0];
                
                return (
                  <TouchableOpacity
                    key={album.id}
                    style={styles.albumCard}
                    onPress={() => setViewingAlbumId(album.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.albumCover}>
                      {coverPhoto?.originalImage ? (
                        <Image
                          source={{ uri: `data:image/jpeg;base64,${coverPhoto.originalImage}` }}
                          style={styles.albumCoverImage}
                          contentFit="cover"
                        />
                      ) : (
                        <View style={[styles.albumCoverPlaceholder, { backgroundColor: album.bgColor }]}>
                          <AlbumIcon size={32} color={album.iconColor} />
                        </View>
                      )}
                    </View>
                    <View style={styles.albumInfo}>
                      <Text style={styles.albumName} numberOfLines={1}>
                        {language === "es" ? album.nameEs : album.name}
                      </Text>
                      <Text style={styles.albumCount}>
                        {photos.length} {language === "es" ? "fotos" : "photos"}
                      </Text>
                    </View>
                    <View style={[styles.albumIconBadge, { backgroundColor: album.bgColor }]}>
                      <AlbumIcon size={18} color={album.iconColor} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {language === "es" ? "Recientes" : "Recent"}
              </Text>
            </View>

            {scanHistory.length === 0 ? (
              <View style={styles.emptyPhotos}>
                <Leaf size={48} color="#10b981" strokeWidth={1.5} />
                <Text style={styles.emptyPhotosText}>
                  {language === "es" 
                    ? "Tus fotos de plantas y espacios aparecerán aquí automáticamente" 
                    : "Your plant & space photos will appear here automatically"}
                </Text>
              </View>
            ) : (
              <View style={styles.allPhotosContainer}>
                {scanHistory.slice(0, 8).map(scan => (
                  <TouchableOpacity
                    key={scan.id}
                    style={styles.beforeAfterCard}
                    onPress={() => {
                      const now = Date.now();
                      if (now - lastTapRef.current < 300) return;
                      lastTapRef.current = now;
                      openImageViewer(scan);
                    }}
                    activeOpacity={0.85}
                    delayPressIn={50}
                  >
                    <View style={styles.beforeAfterRow}>
                      <View style={styles.beforeAfterThumb}>
                        <Image
                          source={{ uri: `data:image/jpeg;base64,${scan.originalImage}` }}
                          style={styles.thumbImage}
                          contentFit="cover"
                        />
                        <View style={styles.thumbLabel}>
                          <Text style={styles.thumbLabelText}>
                            {language === "es" ? "Antes" : "Before"}
                          </Text>
                        </View>
                      </View>
                      {scan.editedImage ? (
                        <View style={styles.beforeAfterThumb}>
                          <Image
                            source={{ uri: `data:image/png;base64,${scan.editedImage}` }}
                            style={styles.thumbImage}
                            contentFit="cover"
                          />
                          <View style={[styles.thumbLabel, styles.thumbLabelAfter]}>
                            <Text style={styles.thumbLabelText}>
                              {language === "es" ? "Después" : "After"}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={[styles.beforeAfterThumb, styles.noEditThumb]}>
                          <Leaf size={20} color="#94a3b8" />
                          <Text style={styles.noEditText}>
                            {language === "es" ? "Sin editar" : "No edit"}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.tapToExpandHint}>
                      <Text style={styles.tapToExpandText}>
                        {formatDate(scan.timestamp)} • {scan.analysis?.suggestions?.length || 0} 🌱
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>

          {renderImageViewerModal()}
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
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0f172a",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 44,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  statBadgeText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#92400e",
  },
  albumStatsRow: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  albumStatBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  albumStatText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0f172a",
  },
  autoAlbumsHint: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 16,
    fontStyle: "italic" as const,
  },
  albumsGrid: {
    gap: 12,
    marginBottom: 32,
  },
  albumCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  albumCover: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
  },
  albumCoverImage: {
    width: "100%",
    height: "100%",
  },
  albumCoverPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  albumInfo: {
    flex: 1,
    marginLeft: 14,
  },
  albumName: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginBottom: 4,
  },
  albumCount: {
    fontSize: 14,
    color: "#64748b",
  },
  albumIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyPhotos: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyPhotosText: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 12,
    textAlign: "center",
  },
  allPhotosContainer: {
    gap: 12,
  },
  beforeAfterCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fef3c7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  beforeAfterRow: {
    flexDirection: "row",
    height: 140,
  },
  beforeAfterThumb: {
    flex: 1,
    position: "relative",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  thumbLabel: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  thumbLabelAfter: {
    backgroundColor: "rgba(16, 185, 129, 0.85)",
  },
  thumbLabelText: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  noEditThumb: {
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  noEditText: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 4,
  },
  tapToExpandHint: {
    backgroundColor: "#fef3c7",
    paddingVertical: 8,
    alignItems: "center",
  },
  tapToExpandText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: "#92400e",
  },
  photosGrid: {
    paddingHorizontal: 20,
  },
  albumPhotosContainer: {
    gap: 16,
  },
  emptyAlbum: {
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyAlbumTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyAlbumText: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },
  photoItemLarge: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  beforeAfterContainer: {
    flexDirection: "row",
    height: 180,
  },
  beforeAfterImage: {
    flex: 1,
    position: "relative",
  },
  halfImage: {
    width: "100%",
    height: "100%",
  },
  imageLabel: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  imageLabelGreen: {
    backgroundColor: "rgba(16, 185, 129, 0.85)",
  },
  imageLabelText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  noAfterImage: {
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  noAfterText: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 6,
  },
  photoMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fafafa",
  },
  photoMetaDate: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#64748b",
  },
  photoMetaPlants: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#10b981",
  },
  expandedImageOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedImageClose: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  expandedImage: {
    width: width - 40,
    height: SCREEN_HEIGHT - 300,
    borderRadius: 16,
  },
  imageViewerNav: {
    position: "absolute",
    bottom: 100,
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
  singleImageLabel: {
    position: "absolute",
    bottom: 100,
    alignItems: "center",
  },
  zoomScrollView: {
    flex: 1,
    width: "100%",
  },
  zoomScrollContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
