import { useRouter } from "expo-router";
import { ChevronRight, Plus, Folder, Image as ImageIcon, Trash2, X, Flower2, Leaf } from "lucide-react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserPreferences, type ScanHistory } from "@/contexts/UserPreferencesContext";

const { width, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ALBUM_STORAGE_KEY = "@photo_albums";

interface Album {
  id: string;
  name: string;
  coverImage?: string;
  photoIds: string[];
  createdAt: number;
}

interface ExpandedImageState {
  visible: boolean;
  images: { uri: string; label: string }[];
  currentIndex: number;
}

export default function PhotoGalleryScreen() {
  const router = useRouter();
  const { language, scanHistory } = useUserPreferences();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [viewingAlbum, setViewingAlbum] = useState<Album | null>(null);
  const [expandedImage, setExpandedImage] = useState<ExpandedImageState>({
    visible: false,
    images: [],
    currentIndex: 0,
  });
  const lastTapRef = useRef(0);

  const openImageViewer = useCallback((scan: ScanHistory) => {
    const images: { uri: string; label: string }[] = [];
    
    if (scan.originalImage) {
      images.push({
        uri: `data:image/jpeg;base64,${scan.originalImage}`,
        label: language === "es" ? "Antes" : "Before",
      });
    }
    
    if (scan.editedImage) {
      images.push({
        uri: `data:image/png;base64,${scan.editedImage}`,
        label: language === "es" ? "Después" : "After",
      });
    }
    
    if (images.length > 0) {
      setExpandedImage({
        visible: true,
        images,
        currentIndex: 0,
      });
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

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const stored = await AsyncStorage.getItem(ALBUM_STORAGE_KEY);
      if (stored) {
        setAlbums(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading albums:", error);
    }
  };

  const saveAlbums = async (newAlbums: Album[]) => {
    try {
      await AsyncStorage.setItem(ALBUM_STORAGE_KEY, JSON.stringify(newAlbums));
      setAlbums(newAlbums);
    } catch (error) {
      console.error("Error saving albums:", error);
    }
  };

  const createAlbum = () => {
    if (!newAlbumName.trim()) return;
    
    const newAlbum: Album = {
      id: Date.now().toString(),
      name: newAlbumName.trim(),
      photoIds: [],
      createdAt: Date.now(),
    };
    
    saveAlbums([...albums, newAlbum]);
    setNewAlbumName("");
    setShowCreateModal(false);
  };

  const deleteAlbum = (albumId: string) => {
    Alert.alert(
      language === "es" ? "Eliminar álbum" : "Delete Album",
      language === "es" 
        ? "¿Estás seguro de que quieres eliminar este álbum?" 
        : "Are you sure you want to delete this album?",
      [
        { text: language === "es" ? "Cancelar" : "Cancel", style: "cancel" },
        {
          text: language === "es" ? "Eliminar" : "Delete",
          style: "destructive",
          onPress: () => {
            const updated = albums.filter(a => a.id !== albumId);
            saveAlbums(updated);
            if (viewingAlbum?.id === albumId) {
              setViewingAlbum(null);
            }
          },
        },
      ]
    );
  };

  const openAddPhotosModal = (album: Album) => {
    setSelectedAlbum(album);
    setSelectedPhotos([]);
    setShowAddPhotosModal(true);
  };

  const togglePhotoSelection = (scanId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(scanId) 
        ? prev.filter(id => id !== scanId)
        : [...prev, scanId]
    );
  };

  const addPhotosToAlbum = () => {
    if (!selectedAlbum || selectedPhotos.length === 0) return;

    const firstScan = scanHistory.find(s => selectedPhotos.includes(s.id));
    const coverImage = firstScan?.originalImage || selectedAlbum.coverImage;

    const updated = albums.map(album => {
      if (album.id === selectedAlbum.id) {
        const existingIds = new Set(album.photoIds);
        const newIds = selectedPhotos.filter(id => !existingIds.has(id));
        return {
          ...album,
          photoIds: [...album.photoIds, ...newIds],
          coverImage: album.coverImage || coverImage,
        };
      }
      return album;
    });

    saveAlbums(updated);
    setShowAddPhotosModal(false);
    setSelectedAlbum(null);
    setSelectedPhotos([]);
  };

  const removePhotoFromAlbum = (albumId: string, photoId: string) => {
    const updated = albums.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          photoIds: album.photoIds.filter(id => id !== photoId),
        };
      }
      return album;
    });
    saveAlbums(updated);
    
    const updatedAlbum = updated.find(a => a.id === albumId);
    if (updatedAlbum) {
      setViewingAlbum(updatedAlbum);
    }
  };

  const getAlbumPhotos = (album: Album): ScanHistory[] => {
    return scanHistory.filter(scan => album.photoIds.includes(scan.id));
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
              <ChevronRight size={28} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
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
    const albumPhotos = getAlbumPhotos(viewingAlbum);
    
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#fef3c7", "#ffffff"]} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setViewingAlbum(null)}
              >
                <ChevronRight size={24} color="#64748b" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
              <Text style={styles.headerTitle} numberOfLines={1}>{viewingAlbum.name}</Text>
              <TouchableOpacity
                style={styles.deleteAlbumButton}
                onPress={() => deleteAlbum(viewingAlbum.id)}
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addPhotosButton}
              onPress={() => openAddPhotosModal(viewingAlbum)}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addPhotosButtonText}>
                {language === "es" ? "Añadir fotos" : "Add Photos"}
              </Text>
            </TouchableOpacity>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.photosGrid}
              showsVerticalScrollIndicator={false}
            >
              {albumPhotos.length === 0 ? (
                <View style={styles.emptyAlbum}>
                  <ImageIcon size={64} color="#f59e0b" strokeWidth={1.5} />
                  <Text style={styles.emptyAlbumTitle}>
                    {language === "es" ? "Álbum vacío" : "Empty Album"}
                  </Text>
                  <Text style={styles.emptyAlbumText}>
                    {language === "es" 
                      ? "Añade fotos de tus escaneos" 
                      : "Add photos from your scans"}
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
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => removePhotoFromAlbum(viewingAlbum.id, scan.id)}
                      >
                        <X size={14} color="#ffffff" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>

        {renderImageViewerModal()}

        <Modal
          visible={showAddPhotosModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAddPhotosModal(false)}
        >
          <View style={styles.modalOverlay}>
            <BlurView intensity={20} tint="dark" style={styles.modalBlur}>
              <TouchableOpacity
                style={styles.modalOverlayTouch}
                activeOpacity={1}
                onPress={() => setShowAddPhotosModal(false)}
              />
            </BlurView>
            <View style={styles.addPhotosModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {language === "es" ? "Seleccionar fotos" : "Select Photos"}
                </Text>
                <TouchableOpacity onPress={() => setShowAddPhotosModal(false)}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.photosSelectGrid} showsVerticalScrollIndicator={false}>
                <View style={styles.photoGridContainer}>
                  {scanHistory.map(scan => {
                    const isSelected = selectedPhotos.includes(scan.id);
                    return (
                      <TouchableOpacity
                        key={scan.id}
                        style={[styles.selectablePhoto, isSelected && styles.selectablePhotoSelected]}
                        onPress={() => togglePhotoSelection(scan.id)}
                        activeOpacity={0.8}
                      >
                        <Image
                          source={{ uri: `data:image/jpeg;base64,${scan.originalImage}` }}
                          style={styles.selectablePhotoImage}
                          contentFit="cover"
                        />
                        {isSelected && (
                          <View style={styles.photoSelectedBadge}>
                            <Text style={styles.photoSelectedText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <TouchableOpacity
                style={[styles.confirmButton, selectedPhotos.length === 0 && styles.confirmButtonDisabled]}
                onPress={addPhotosToAlbum}
                disabled={selectedPhotos.length === 0}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>
                  {language === "es" 
                    ? `Añadir ${selectedPhotos.length} foto${selectedPhotos.length !== 1 ? 's' : ''}` 
                    : `Add ${selectedPhotos.length} photo${selectedPhotos.length !== 1 ? 's' : ''}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
              <ChevronRight size={24} color="#64748b" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {language === "es" ? "Galería de Fotos" : "Photo Gallery"}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Folder size={18} color="#f59e0b" />
              <Text style={styles.statBadgeText}>{albums.length} {language === "es" ? "álbumes" : "albums"}</Text>
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
              <TouchableOpacity
                style={styles.createAlbumButton}
                onPress={() => setShowCreateModal(true)}
                activeOpacity={0.7}
              >
                <Plus size={20} color="#f59e0b" />
                <Text style={styles.createAlbumButtonText}>
                  {language === "es" ? "Crear" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>

            {albums.length === 0 ? (
              <View style={styles.emptyState}>
                <Folder size={64} color="#f59e0b" strokeWidth={1.5} />
                <Text style={styles.emptyTitle}>
                  {language === "es" ? "No hay álbumes" : "No Albums"}
                </Text>
                <Text style={styles.emptyText}>
                  {language === "es" 
                    ? "Crea tu primer álbum para organizar tus fotos de plantas y flores" 
                    : "Create your first album to organize your plant & flower photos"}
                </Text>
                <TouchableOpacity
                  style={styles.emptyCreateButton}
                  onPress={() => setShowCreateModal(true)}
                  activeOpacity={0.8}
                >
                  <Plus size={20} color="#ffffff" />
                  <Text style={styles.emptyCreateButtonText}>
                    {language === "es" ? "Crear Álbum" : "Create Album"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.albumsGrid}>
                {albums.map(album => {
                  const photoCount = album.photoIds.length;
                  return (
                    <TouchableOpacity
                      key={album.id}
                      style={styles.albumCard}
                      onPress={() => setViewingAlbum(album)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.albumCover}>
                        {album.coverImage ? (
                          <Image
                            source={{ uri: `data:image/jpeg;base64,${album.coverImage}` }}
                            style={styles.albumCoverImage}
                            contentFit="cover"
                          />
                        ) : (
                          <View style={styles.albumCoverPlaceholder}>
                            <Flower2 size={32} color="#f59e0b" />
                          </View>
                        )}
                      </View>
                      <View style={styles.albumInfo}>
                        <Text style={styles.albumName} numberOfLines={1}>{album.name}</Text>
                        <Text style={styles.albumCount}>
                          {photoCount} {language === "es" ? "fotos" : "photos"}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.albumMenuButton}
                        onPress={() => openAddPhotosModal(album)}
                      >
                        <Plus size={18} color="#f59e0b" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {language === "es" ? "Todas las Fotos" : "All Photos"}
              </Text>
            </View>

            {scanHistory.length === 0 ? (
              <View style={styles.emptyPhotos}>
                <Leaf size={48} color="#10b981" strokeWidth={1.5} />
                <Text style={styles.emptyPhotosText}>
                  {language === "es" 
                    ? "Tus fotos de plantas y flores aparecerán aquí" 
                    : "Your plant & flower photos will appear here"}
                </Text>
              </View>
            ) : (
              <View style={styles.allPhotosContainer}>
                {scanHistory.slice(0, 12).map(scan => (
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
                        {language === "es" ? "Toca para ampliar" : "Tap to expand"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>

          <Modal
            visible={showCreateModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCreateModal(false)}
          >
            <View style={styles.modalOverlay}>
              <BlurView intensity={20} tint="dark" style={styles.modalBlur}>
                <TouchableOpacity
                  style={styles.modalOverlayTouch}
                  activeOpacity={1}
                  onPress={() => setShowCreateModal(false)}
                />
              </BlurView>
              <View style={styles.createModalContent}>
                <View style={styles.modalIconContainer}>
                  <Folder size={32} color="#f59e0b" />
                </View>
                <Text style={styles.createModalTitle}>
                  {language === "es" ? "Crear Álbum" : "Create Album"}
                </Text>
                <TextInput
                  style={styles.albumNameInput}
                  placeholder={language === "es" ? "Nombre del álbum" : "Album name"}
                  placeholderTextColor="#94a3b8"
                  value={newAlbumName}
                  onChangeText={setNewAlbumName}
                  autoFocus
                />
                <View style={styles.createModalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setNewAlbumName("");
                      setShowCreateModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>
                      {language === "es" ? "Cancelar" : "Cancel"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.createButton, !newAlbumName.trim() && styles.createButtonDisabled]}
                    onPress={createAlbum}
                    disabled={!newAlbumName.trim()}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.createButtonText}>
                      {language === "es" ? "Crear" : "Create"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showAddPhotosModal && !viewingAlbum}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAddPhotosModal(false)}
          >
            <View style={styles.modalOverlay}>
              <BlurView intensity={20} tint="dark" style={styles.modalBlur}>
                <TouchableOpacity
                  style={styles.modalOverlayTouch}
                  activeOpacity={1}
                  onPress={() => setShowAddPhotosModal(false)}
                />
              </BlurView>
              <View style={styles.addPhotosModalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {language === "es" ? "Seleccionar fotos" : "Select Photos"}
                  </Text>
                  <TouchableOpacity onPress={() => setShowAddPhotosModal(false)}>
                    <X size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.photosSelectGrid} showsVerticalScrollIndicator={false}>
                  <View style={styles.photoGridContainer}>
                    {scanHistory.map(scan => {
                      const isSelected = selectedPhotos.includes(scan.id);
                      return (
                        <TouchableOpacity
                          key={scan.id}
                          style={[styles.selectablePhoto, isSelected && styles.selectablePhotoSelected]}
                          onPress={() => togglePhotoSelection(scan.id)}
                          activeOpacity={0.8}
                        >
                          <Image
                            source={{ uri: `data:image/jpeg;base64,${scan.originalImage}` }}
                            style={styles.selectablePhotoImage}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View style={styles.photoSelectedBadge}>
                              <Text style={styles.photoSelectedText}>✓</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={[styles.confirmButton, selectedPhotos.length === 0 && styles.confirmButtonDisabled]}
                  onPress={addPhotosToAlbum}
                  disabled={selectedPhotos.length === 0}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>
                    {language === "es" 
                      ? `Añadir ${selectedPhotos.length} foto${selectedPhotos.length !== 1 ? 's' : ''}` 
                      : `Add ${selectedPhotos.length} photo${selectedPhotos.length !== 1 ? 's' : ''}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
  deleteAlbumButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0f172a",
  },
  createAlbumButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  createAlbumButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#92400e",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: "#0f172a",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyCreateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyCreateButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
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
    backgroundColor: "#fef3c7",
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
  albumMenuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fef3c7",
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
  photoGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  galleryPhoto: {
    width: (width - 56) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  galleryPhotoImage: {
    width: "100%",
    height: "100%",
  },
  hasEditedBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotosButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#f59e0b",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  addPhotosButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
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
  removePhotoButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  createModalContent: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  createModalTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: "#0f172a",
    marginBottom: 20,
  },
  albumNameInput: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  createModalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#64748b",
  },
  createButton: {
    flex: 1,
    backgroundColor: "#f59e0b",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#fcd34d",
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  addPhotosModalContent: {
    width: "100%",
    height: "80%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    position: "absolute",
    bottom: 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0f172a",
  },
  photosSelectGrid: {
    flex: 1,
    marginBottom: 16,
  },
  selectablePhoto: {
    width: (width - 56) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectablePhotoSelected: {
    borderColor: "#f59e0b",
  },
  selectablePhotoImage: {
    width: "100%",
    height: "100%",
  },
  photoSelectedBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
  },
  photoSelectedText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  confirmButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#fcd34d",
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
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
