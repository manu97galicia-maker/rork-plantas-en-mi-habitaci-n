import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { X, Camera as CameraIcon, RotateCcw, Image as ImageIcon } from "lucide-react-native";
import React, { useRef, useState, useCallback } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

export default function IdentifyCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { canScan, getRemainingScans } = useUserPreferences();

  const toggleCameraFacing = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  const pickImage = useCallback(async () => {
    if (isCapturing) {
      console.log('⚠️ Already processing');
      return;
    }

    if (!canScan()) {
      Alert.alert(
        "Scan Limit Reached",
        "You have reached the limit of 30 monthly scans. The limit will reset next month.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      setIsCapturing(true);
      console.log("🖼️ Opening image picker for plant...");
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.4,
        base64: true,
      });

      console.log("✅ Image picker result:", { canceled: result.canceled });

      if (!result.canceled && result.assets[0]?.base64) {
        console.log("🚀 Navigating to identify plant... Image size:", result.assets[0].base64.length);
        
        InteractionManager.runAfterInteractions(() => {
          router.push({
            pathname: "/identify-plant",
            params: { imageData: result.assets[0].base64 },
          });
          setTimeout(() => {
            setIsCapturing(false);
          }, 500);
        });
      } else {
        setIsCapturing(false);
      }
    } catch (error) {
      console.error("❌ Error picking image:", error);
      Alert.alert(
        "Error",
        "Could not select image. Please try again.",
        [{ text: "OK" }]
      );
      setIsCapturing(false);
    }
  }, [isCapturing, canScan, router]);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) {
      console.log('⚠️ Camera not ready or already capturing');
      return;
    }

    if (!canScan()) {
      Alert.alert(
        "Scan Limit Reached",
        "You have reached the limit of 30 monthly scans. The limit will reset next month.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      setIsCapturing(true);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      console.log("📸 Starting plant photo capture...");
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.4,
        base64: true,
        skipProcessing: true,
      });

      console.log("✅ Plant photo captured successfully");

      if (photo && photo.base64) {
        console.log("🚀 Navigating to identify plant... Image size:", photo.base64.length);
        
        InteractionManager.runAfterInteractions(() => {
          router.push({
            pathname: "/identify-plant",
            params: { imageData: photo.base64 },
          });
          setTimeout(() => {
            setIsCapturing(false);
          }, 500);
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
  }, [isCapturing, canScan, router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

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
              We need access to your camera to photograph the plant and identify it.
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

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleBack}
              >
                <X size={28} color="#ffffff" />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerText}>
                  Photograph the plant
                </Text>
                <Text style={styles.headerSubtext}>
                  Remaining scans: {getRemainingScans()}/30
                </Text>
              </View>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.guideContainer}>
              <View style={styles.guideBox} />
              <Text style={styles.guideText}>
                Make sure the plant is well lit and focused
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
  headerSubtext: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: "rgba(255, 255, 255, 0.85)",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  guideContainer: {
    alignItems: "center",
    gap: 16,
  },
  guideBox: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: "rgba(82, 183, 136, 0.8)",
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
    backgroundColor: "rgba(82, 183, 136, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#52b788",
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#52b788",
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
