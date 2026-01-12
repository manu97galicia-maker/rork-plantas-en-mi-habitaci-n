import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Crown, Check, X, Leaf, Sparkles, Camera, Zap } from "lucide-react-native";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

interface PlanFeature {
  text: string;
  textEs: string;
}

const proFeatures: PlanFeature[] = [
  { text: "Unlimited scans", textEs: "Escaneos ilimitados" },
  { text: "Advanced plant identification", textEs: "Identificación avanzada de plantas" },
  { text: "AI room visualization", textEs: "Visualización IA de habitaciones" },
  { text: "Detailed care instructions", textEs: "Instrucciones de cuidado detalladas" },
  { text: "Watering reminders", textEs: "Recordatorios de riego" },
  { text: "Priority support", textEs: "Soporte prioritario" },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { language, completeOnboarding } = useUserPreferences();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  const handleContinueFree = async () => {
    await completeOnboarding();
    router.replace("/");
  };

  const handleSubscribe = async () => {
    await completeOnboarding();
    router.replace("/");
  };

  const handleClose = async () => {
    await completeOnboarding();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a4d2e", "#2d5f3f", "#3d7a54"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroSection}>
              <View style={styles.crownContainer}>
                <Crown size={60} color="#fbbf24" />
              </View>
              <Text style={styles.heroTitle}>
                {language === "es" ? "PlantAI Pro" : "PlantAI Pro"}
              </Text>
              <Text style={styles.heroSubtitle}>
                {language === "es" 
                  ? "Desbloquea todo el potencial de tu asistente de plantas" 
                  : "Unlock the full potential of your plant assistant"}
              </Text>
            </View>

            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Zap size={24} color="#fbbf24" />
                </View>
                <Text style={styles.featureText}>
                  {language === "es" ? "Escaneos ilimitados" : "Unlimited Scans"}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Sparkles size={24} color="#fbbf24" />
                </View>
                <Text style={styles.featureText}>
                  {language === "es" ? "IA avanzada" : "Advanced AI"}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Camera size={24} color="#fbbf24" />
                </View>
                <Text style={styles.featureText}>
                  {language === "es" ? "Visualización" : "Visualization"}
                </Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Leaf size={24} color="#fbbf24" />
                </View>
                <Text style={styles.featureText}>
                  {language === "es" ? "Cuidado experto" : "Expert Care"}
                </Text>
              </View>
            </View>

            <View style={styles.plansContainer}>
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === "yearly" && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan("yearly")}
                activeOpacity={0.8}
              >
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>
                    {language === "es" ? "AHORRA 50%" : "SAVE 50%"}
                  </Text>
                </View>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>
                    {language === "es" ? "Anual" : "Yearly"}
                  </Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>$29.99</Text>
                    <Text style={styles.planPeriod}>
                      /{language === "es" ? "año" : "year"}
                    </Text>
                  </View>
                  <Text style={styles.planMonthly}>
                    {language === "es" ? "~$2.50/mes" : "~$2.50/month"}
                  </Text>
                </View>
                {selectedPlan === "yearly" && (
                  <View style={styles.checkCircle}>
                    <Check size={16} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === "monthly" && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan("monthly")}
                activeOpacity={0.8}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>
                    {language === "es" ? "Mensual" : "Monthly"}
                  </Text>
                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>$4.99</Text>
                    <Text style={styles.planPeriod}>
                      /{language === "es" ? "mes" : "month"}
                    </Text>
                  </View>
                </View>
                {selectedPlan === "monthly" && (
                  <View style={styles.checkCircle}>
                    <Check size={16} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.featuresList}>
              <Text style={styles.featuresListTitle}>
                {language === "es" ? "Incluido en Pro:" : "Included in Pro:"}
              </Text>
              {proFeatures.map((feature, index) => (
                <View key={index} style={styles.featureListItem}>
                  <Check size={18} color="#52b788" />
                  <Text style={styles.featureListText}>
                    {language === "es" ? feature.textEs : feature.text}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleSubscribe}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#fbbf24", "#f59e0b"]}
                style={styles.subscribeButtonGradient}
              >
                <Crown size={20} color="#1a4d2e" />
                <Text style={styles.subscribeButtonText}>
                  {language === "es" ? "Continuar con Pro" : "Continue with Pro"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.freeButton}
              onPress={handleContinueFree}
              activeOpacity={0.8}
            >
              <Text style={styles.freeButtonText}>
                {language === "es" ? "Continuar gratis" : "Continue for free"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              {language === "es" 
                ? "La suscripción se renovará automáticamente. Puedes cancelar en cualquier momento." 
                : "Subscription auto-renews. Cancel anytime."}
            </Text>
          </View>
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
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  crownContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: "#ffffff",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  featureItem: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(251, 191, 36, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#ffffff",
    textAlign: "center",
  },
  plansContainer: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative" as const,
  },
  planCardSelected: {
    borderColor: "#fbbf24",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
  },
  planBadge: {
    position: "absolute" as const,
    top: -10,
    right: 20,
    backgroundColor: "#fbbf24",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: "#1a4d2e",
  },
  planHeader: {
    alignItems: "flex-start",
  },
  planName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
    marginBottom: 8,
  },
  planPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#ffffff",
  },
  planPeriod: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 4,
  },
  planMonthly: {
    fontSize: 14,
    color: "#52b788",
    marginTop: 4,
    fontWeight: "500" as const,
  },
  checkCircle: {
    position: "absolute" as const,
    top: 20,
    right: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#52b788",
    justifyContent: "center",
    alignItems: "center",
  },
  featuresList: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
  },
  featuresListTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
    marginBottom: 16,
  },
  featureListItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  featureListText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    gap: 12,
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  subscribeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#1a4d2e",
  },
  freeButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  freeButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "rgba(255,255,255,0.7)",
  },
  disclaimer: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 16,
  },
});
