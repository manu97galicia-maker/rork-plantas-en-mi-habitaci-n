import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter, useFocusEffect } from "expo-router";
import { X, Camera as CameraIcon, RotateCcw, Image as ImageIcon } from "lucide-react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";

export default function DecorateCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isCapturing, setIsCapturing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { getRemainingScans, canScan, language } = useUserPreferences();
  const remainingScans = getRemainingScans();
  const t = getTranslations(language);
  const [showStabilizing, setShowStabilizing] = useState(false);
  const isNavigatingRef = useRef(false);
  const lastClickRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      setIsCapturing(false);
      setShowStabilizing(false);
      isNavigatingRef.current = false;
      return () => {};
    }, [])
  );

  const safeBack = useCallback(() => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastClickRef.current < 500) return;
    isNavigatingRef.current = true;
    lastClickRef.current = now;
    router.back();
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);
  }, [router]);

  useEffect(() => {
    getLocation();
  }, [locationPermission]);

  const getLocation = async () => {
    if (Platform.OS === "web") {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  altitude: position.coords.altitude || null,
                  accuracy: position.coords.accuracy,
                  altitudeAccuracy: position.coords.altitudeAccuracy || null,
                  heading: position.coords.heading || null,
                  speed: position.coords.speed || null,
                },
                timestamp: position.timestamp,
              } as Location.LocationObject);
            },
            () => {}
          );
        }
      } catch {}
      return;
    }

    try {
      if (!locationPermission?.granted) {
        const { status } = await requestLocationPermission();
        if (status !== "granted") return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    } catch {}
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#52b788" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.permissionContent}>
            <CameraIcon size={64} color="#52b788" />
            <Text style={styles.permissionTitle}>
              {language === "es" ? "Se requiere permiso de cámara" : "Camera Permission Required"}
            </Text>
            <Text style={styles.permissionText}>
              {language === "es"
                ? "Necesitamos acceso a tu cámara para fotografiar tu habitación y recomendar las mejores plantas."
                : "We need access to your camera to photograph your room and recommend the best plants."}
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>
                {language === "es" ? "Permitir Cámara" : "Allow Camera"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const pickImage = async () => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastClickRef.current < 800) return;
    lastClickRef.current = now;

    if (!canScan()) {
      Alert.alert(
        language === "es" ? "Límite alcanzado" : "Limit Reached",
        language === "es"
          ? "Has alcanzado el límite de 40 escaneos este mes."
          : "You have reached the limit of 40 scans this month.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      isNavigatingRef.current = true;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        const imageData = result.assets[0].base64;
        const params: any = { imageData };

        if (location) {
          params.latitude = location.coords.latitude.toString();
          params.longitude = location.coords.longitude.toString();
          if (location.coords.altitude) {
            params.altitude = location.coords.altitude.toString();
          }
        }

        setTimeout(() => {
          router.push({
            pathname: "/(tabs)/decorate/results",
            params,
          } as any);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 1500);
        }, 100);
      } else {
        isNavigatingRef.current = false;
      }
    } catch {
      isNavigatingRef.current = false;
      Alert.alert(
        language === "es" ? "Error" : "Error",
        language === "es"
          ? "No se pudo seleccionar la imagen."
          : "Could not select image. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const takePicture = async () => {
    const now = Date.now();
    if (isCapturing || isNavigatingRef.current || now - lastClickRef.current < 500) return;

    if (!cameraRef.current) {
      Alert.alert("Error", language === "es"
        ? "La cámara no está lista. Espera un momento."
        : "Camera is not ready. Please wait a moment.");
      return;
    }

    lastClickRef.current = now;

    if (!canScan()) {
      Alert.alert(
        language === "es" ? "Límite alcanzado" : "Limit Reached",
        language === "es"
          ? "Has alcanzado el límite de 40 escaneos este mes."
          : "You have reached the limit of 40 scans this month.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsCapturing(true);
    setShowStabilizing(true);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      const capturePromise = cameraRef.current.takePictureAsync({
        quality: 0.6,
        base64: true,
        skipProcessing: Platform.OS === 'android',
      });

      const timeoutPromise = new Promise<null>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Camera timeout')), 10000);
      });

      const photo = await Promise.race([capturePromise, timeoutPromise]);

      if (timeoutId) clearTimeout(timeoutId);

      if (photo?.base64) {
        const params: any = { imageData: photo.base64 };

        if (location) {
          params.latitude = location.coords.latitude.toString();
          params.longitude = location.coords.longitude.toString();
          if (location.coords.altitude) {
            params.altitude = location.coords.altitude.toString();
          }
        }

        setShowStabilizing(false);

        router.push({
          pathname: "/(tabs)/decorate/results",
          params,
        } as any);

        setTimeout(() => {
          setIsCapturing(false);
        }, 1000);
      } else {
        throw new Error('No base64 data');
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      setShowStabilizing(false);
      setIsCapturing(false);
      Alert.alert(
        "Error",
        language === "es"
          ? "No se pudo capturar la foto. Intenta de nuevo."
          : "Could not capture photo. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={safeBack}>
                <X size={28} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerText}>
                  {language === "es" ? "Fotografía tu habitación" : "Photograph your room"}
                </Text>
                <View style={styles.scansRemaining}>
                  <Text style={[styles.scansText, remainingScans <= 5 && styles.scansTextWarning]}>
                    {remainingScans} {language === "es" ? "escaneos restantes" : "scans remaining"}
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight} />
            </View>

            <View style={styles.guideContainer}>
              <View style={styles.guideBox} />
              {showStabilizing ? (
                <View style={styles.stabilizingContainer}>
                  <ActivityIndicator size="small" color="#52b788" style={{ marginBottom: 8 }} />
                  <Text style={styles.stabilizingText}>{t.camera.stabilizing}</Text>
                </View>
              ) : (
                <Text style={styles.guideText}>
                  {language === "es"
                    ? "Captura toda la habitación para mejores resultados"
                    : "Capture the entire room for best results"}
                </Text>
              )}
            </View>

            <View style={styles.controls}>
              <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                <ImageIcon size={28} color="#ffffff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <RotateCcw size={28} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  headerRight: {
    width: 44,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scansRemaining: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scansText: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
  },
  scansTextWarning: {
    color: "#fbbf24",
  },
  guideContainer: {
    alignItems: "center",
    gap: 16,
  },
  guideBox: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 24,
    borderStyle: "dashed",
  },
  guideText: {
    fontSize: 15,
    color: "#ffffff",
    textAlign: "center",
    paddingHorizontal: 40,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  stabilizingContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  stabilizingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#52b788",
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#ffffff",
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  permissionContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a4d2e",
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#52b788",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
