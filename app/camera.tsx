import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { X, Camera as CameraIcon, RotateCcw, History, Image as ImageIcon } from "lucide-react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  InteractionManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isCapturing, setIsCapturing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { getRemainingScans, canScan } = useUserPreferences();
  const remainingScans = getRemainingScans();
  const isNavigatingRef = useRef(false);
  const lastClickRef = useRef(0);

  const safeNavigate = useCallback((path: string | { pathname: string; params: any }) => {
    const now = Date.now();
    if (isNavigatingRef.current || now - lastClickRef.current < 500) {
      console.log('⚠️ Navigation blocked - too fast');
      return;
    }
    isNavigatingRef.current = true;
    lastClickRef.current = now;
    console.log('📱 Navigating to:', typeof path === 'string' ? path : path.pathname);
    if (typeof path === 'string') {
      router.push(path as any);
    } else {
      router.push(path as any);
    }
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 1000);
  }, [router]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              console.log("✅ Location obtained (Web):", position.coords.latitude, position.coords.longitude);
            },
            (error) => {
              console.log("⚠️ Could not get location (Web):", error.message);
            }
          );
        }
      } catch (error) {
        console.log("⚠️ Error getting location (Web):", error);
      }
      return;
    }

    try {
      if (!locationPermission?.granted) {
        const { status } = await requestLocationPermission();
        if (status !== "granted") {
          console.log("⚠️ Location permission denied");
          return;
        }
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
      console.log("✅ Location obtained:", currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.log("⚠️ Could not get location:", error);
    }
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
              Camera Permission Required
            </Text>
            <Text style={styles.permissionText}>
              We need access to your camera to photograph your room and
              recommend the best plants.
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Allow Camera</Text>
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
    if (isNavigatingRef.current || now - lastClickRef.current < 800) {
      console.log('⚠️ Pick image blocked - action in progress');
      return;
    }
    lastClickRef.current = now;
    
    if (!canScan()) {
      Alert.alert(
        "Limit Reached",
        "You have reached the limit of 50 scans this month. The limit resets next month.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      console.log("🖼️ Opening image picker...");
      isNavigatingRef.current = true;
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5,
        base64: true,
      });

      console.log("✅ Image picker result:", { canceled: result.canceled });

      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].base64) {
        const imageData = result.assets[0].base64;
        console.log("📷 Image data length:", imageData.length);
        
        const params: any = { imageData };
        
        if (location) {
          params.latitude = location.coords.latitude.toString();
          params.longitude = location.coords.longitude.toString();
          if (location.coords.altitude) {
            params.altitude = location.coords.altitude.toString();
          }
          console.log("📍 Sending location with photo:", {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            alt: location.coords.altitude,
          });
        }
        
        console.log("🚀 Navigating to results...");
        
        setTimeout(() => {
          router.push({
            pathname: "/results",
            params,
          } as any);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 1500);
        }, 100);
      } else {
        isNavigatingRef.current = false;
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      isNavigatingRef.current = false;
      Alert.alert(
        "Error",
        "Could not select image. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const takePicture = async () => {
    const now = Date.now();
    if (!cameraRef.current || isCapturing || isNavigatingRef.current || now - lastClickRef.current < 500) {
      console.log('⚠️ Take picture blocked - action in progress');
      return;
    }
    lastClickRef.current = now;

    if (!canScan()) {
      Alert.alert(
        "Limit Reached",
        "You have reached the limit of 30 scans this month. The limit resets next month.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      setIsCapturing(true);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      console.log("📸 Starting photo capture...");
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        base64: true,
        skipProcessing: true,
      });

      console.log("✅ Photo captured successfully");

      if (photo && photo.base64) {
        const params: any = { imageData: photo.base64 };
        
        if (location) {
          params.latitude = location.coords.latitude.toString();
          params.longitude = location.coords.longitude.toString();
          if (location.coords.altitude) {
            params.altitude = location.coords.altitude.toString();
          }
          console.log("📍 Sending location with photo:", {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            alt: location.coords.altitude,
          });
        }
        
        console.log("🚀 Navigating to results...");
        
        InteractionManager.runAfterInteractions(() => {
          safeNavigate({
            pathname: "/results",
            params,
          });
        });
      } else {
        console.error("❌ Photo capture failed - no base64 data");
        setIsCapturing(false);
      }
    } catch (error) {
      console.error("❌ Error taking picture:", error);
      Alert.alert(
        "Error",
        "Could not take photo. Please try again.",
        [{ text: "OK" }]
      );
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={safeBack}
              >
                <X size={28} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerText}>
                  Photograph your room
                </Text>
                <View style={styles.scansRemaining}>
                  <Text style={[styles.scansText, remainingScans <= 5 && styles.scansTextWarning]}>
                    {remainingScans} scans remaining this month
                  </Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={styles.locationIndicator}
                  onPress={() => safeNavigate("/gallery")}
                >
                  <History size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.guideContainer}>
              <View style={styles.guideBox} />
              <Text style={styles.guideText}>
                Capture the entire room for best results
              </Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={pickImage}
              >
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

              <TouchableOpacity
                style={styles.flipButton}
                onPress={toggleCameraFacing}
              >
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
    fontWeight: "600" as const,
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
    fontWeight: "500" as const,
    color: "rgba(255, 255, 255, 0.9)",
  },
  scansTextWarning: {
    color: "#fbbf24",
  },
  locationIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "700" as const,
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
    fontWeight: "600" as const,
    color: "#ffffff",
  },
});
