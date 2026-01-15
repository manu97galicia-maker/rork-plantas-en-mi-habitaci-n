import { useRouter } from "expo-router";
import { Droplets, Calendar, Clock, Edit2, Trash2, ChevronLeft, AlertCircle, Plus, X, Check, History } from "lucide-react-native";
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useMyPlants } from "@/contexts/MyPlantsContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";
import { UserPlant } from "@/types/plant";
import { Colors } from "@/constants/colors";
import * as Haptics from "expo-haptics";

export default function MyPlantsScreen() {
  const router = useRouter();
  const { plants, waterPlant, removePlant, updatePlant, getPlantsNeedingWater } = useMyPlants();
  const { language } = useUserPreferences();
  const t = getTranslations(language);
  const [editingPlant, setEditingPlant] = useState<UserPlant | null>(null);
  const [wateringPlantId, setWateringPlantId] = useState<string | null>(null);
  const [showWateringSuccess, setShowWateringSuccess] = useState<string | null>(null);
  const [viewingHistoryPlant, setViewingHistoryPlant] = useState<UserPlant | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [wateringFrequency, setWateringFrequency] = useState<string>("7");

  const plantsNeedingWater = useMemo(() => getPlantsNeedingWater(), [getPlantsNeedingWater]);

  const handleWaterPlant = async (plantId: string) => {
    setWateringPlantId(plantId);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const success = await waterPlant(plantId);
    
    setWateringPlantId(null);
    
    if (success) {
      setShowWateringSuccess(plantId);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      const plant = plants.find(p => p.id === plantId);
      const plantName = plant?.nickname || plant?.plantInfo.name || '';
      const nextDays = plant?.wateringFrequencyDays || 7;
      
      Alert.alert(
        language === "es" ? "💧 ¡Planta Regada!" : "💧 Plant Watered!",
        language === "es" 
          ? `${plantName} ha sido regada. Próximo riego en ${nextDays} días. Te enviaremos un recordatorio.`
          : `${plantName} has been watered. Next watering in ${nextDays} days. We'll send you a reminder.`,
        [{ text: "OK" }]
      );
      
      setTimeout(() => {
        setShowWateringSuccess(null);
      }, 2000);
    }
  };

  const handleRemovePlant = (plantId: string) => {
    Alert.alert(
      t.myPlants.deleteTitle,
      t.myPlants.deleteMessage,
      [
        { text: t.myPlants.cancel, style: "cancel" },
        {
          text: t.myPlants.delete,
          style: "destructive",
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await removePlant(plantId);
          },
        },
      ]
    );
  };

  const handleEditPlant = (plant: UserPlant) => {
    setEditingPlant(plant);
    setNickname(plant.nickname || "");
    setNotes(plant.notes || "");
    setWateringFrequency(plant.wateringFrequencyDays.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingPlant) return;

    const frequency = parseInt(wateringFrequency, 10);
    if (isNaN(frequency) || frequency < 1) {
      Alert.alert("Error", "Please enter a valid watering frequency");
      return;
    }

    await updatePlant(editingPlant.id, {
      nickname: nickname || undefined,
      notes: notes || undefined,
      wateringFrequencyDays: frequency,
    });

    setEditingPlant(null);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getTimeUntilWatering = (nextWatering: string): { text: string; isOverdue: boolean } => {
    const now = new Date();
    const nextWateringDate = new Date(nextWatering);
    const diffMs = nextWateringDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: t.myPlants.overdue, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: t.myPlants.today, isOverdue: true };
    } else if (diffDays === 1) {
      return { text: `1 ${t.myPlants.days}`, isOverdue: false };
    } else {
      return { text: `${diffDays} ${t.myPlants.days}`, isOverdue: false };
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return t.myPlants.today;
    } else if (diffDays === 1) {
      return `1 ${t.myPlants.days}`;
    } else {
      return `${diffDays} ${t.myPlants.days}`;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={[Colors.lightSecondary, Colors.light]} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color={Colors.text.secondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.myPlants.title}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-plant')}
              activeOpacity={0.7}
            >
              <LinearGradient colors={Colors.gradient.primary} style={styles.addButtonGradient}>
                <Plus size={22} color={Colors.light} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {plantsNeedingWater.length > 0 && (
            <View style={styles.alertBanner}>
              <View style={styles.alertIconBg}>
                <AlertCircle size={18} color="#FFB020" strokeWidth={2.5} />
              </View>
              <Text style={styles.alertText}>
                {plantsNeedingWater.length} {t.myPlants.needsWater}
              </Text>
            </View>
          )}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {plants.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconBg}>
                  <Droplets size={48} color={Colors.primary} strokeWidth={1.5} />
                </View>
                <Text style={styles.emptyTitle}>{t.myPlants.noPlantsYet}</Text>
                <Text style={styles.emptyDescription}>{t.myPlants.noPlantsDescription}</Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => router.push('/add-plant')}
                  activeOpacity={0.7}
                >
                  <LinearGradient colors={Colors.gradient.primary} style={styles.emptyButtonGradient}>
                    <Plus size={20} color={Colors.light} strokeWidth={2.5} />
                    <Text style={styles.emptyButtonText}>{t.myPlants.addPlant}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.plantsList}>
                {plants.map((plant) => {
                  const timeUntil = getTimeUntilWatering(plant.nextWatering);
                  return (
                    <View key={plant.id} style={styles.plantCard}>
                      <View style={[
                        styles.plantCardAccent,
                        { backgroundColor: timeUntil.isOverdue ? "#FFB020" : Colors.primary }
                      ]} />
                      <View style={styles.plantCardContent}>
                        <View style={styles.plantHeader}>
                          <View style={styles.plantTitleSection}>
                            <Text style={styles.plantName}>
                              {plant.nickname || plant.plantInfo.name}
                            </Text>
                            {plant.nickname && (
                              <Text style={styles.plantScientificName}>
                                {plant.plantInfo.name}
                              </Text>
                            )}
                          </View>
                          <View style={[
                            styles.statusBadge,
                            timeUntil.isOverdue ? styles.statusBadgeWarning : styles.statusBadgeSuccess
                          ]}>
                            <Droplets size={12} color={timeUntil.isOverdue ? "#FFB020" : Colors.primary} />
                            <Text style={[
                              styles.statusText,
                              timeUntil.isOverdue ? styles.statusTextWarning : styles.statusTextSuccess
                            ]}>{timeUntil.text}</Text>
                          </View>
                        </View>

                        <View style={styles.plantDetails}>
                          <View style={styles.detailRow}>
                            <View style={styles.detailIconBg}>
                              <Calendar size={14} color={Colors.text.secondary} />
                            </View>
                            <Text style={styles.detailLabel}>{t.myPlants.nextWatering}:</Text>
                            <Text style={styles.detailValue}>{timeUntil.text}</Text>
                          </View>
                          
                          {plant.lastWatered && (
                            <View style={styles.detailRow}>
                              <View style={styles.detailIconBg}>
                                <Clock size={14} color={Colors.text.secondary} />
                              </View>
                              <Text style={styles.detailLabel}>{t.myPlants.lastWatered}:</Text>
                              <Text style={styles.detailValue}>{formatDate(plant.lastWatered)}</Text>
                            </View>
                          )}
                          
                          <View style={styles.detailRow}>
                            <View style={styles.detailIconBg}>
                              <Droplets size={14} color={Colors.text.secondary} />
                            </View>
                            <Text style={styles.detailLabel}>{t.myPlants.wateringFrequency}:</Text>
                            <Text style={styles.detailValue}>{plant.wateringFrequencyDays} {t.myPlants.days}</Text>
                          </View>
                        </View>

                        <View style={styles.plantActions}>
                          <TouchableOpacity
                            style={[styles.actionButton, wateringPlantId === plant.id && styles.actionButtonDisabled]}
                            onPress={() => handleWaterPlant(plant.id)}
                            activeOpacity={0.7}
                            disabled={wateringPlantId === plant.id}
                          >
                            <LinearGradient 
                              colors={showWateringSuccess === plant.id ? ["#22c55e", "#16a34a"] : ["#4ECDC4", "#44A3B8"]} 
                              style={styles.actionButtonGradient}
                            >
                              {wateringPlantId === plant.id ? (
                                <Text style={styles.actionButtonText}>{language === "es" ? "Regando..." : "Watering..."}</Text>
                              ) : showWateringSuccess === plant.id ? (
                                <>
                                  <Check size={18} color={Colors.light} strokeWidth={2.5} />
                                  <Text style={styles.actionButtonText}>{language === "es" ? "¡Regada!" : "Done!"}</Text>
                                </>
                              ) : (
                                <>
                                  <Droplets size={18} color={Colors.light} strokeWidth={2} />
                                  <Text style={styles.actionButtonText}>{language === "es" ? "Regar" : "Water"}</Text>
                                </>
                              )}
                            </LinearGradient>
                          </TouchableOpacity>
                          
                          {plant.wateringHistory && plant.wateringHistory.length > 0 && (
                            <TouchableOpacity
                              style={[styles.iconButton, styles.iconButtonHistory]}
                              onPress={() => setViewingHistoryPlant(plant)}
                              activeOpacity={0.7}
                            >
                              <History size={18} color="#3b82f6" strokeWidth={2} />
                            </TouchableOpacity>
                          )}
                          
                          <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => handleEditPlant(plant)}
                            activeOpacity={0.7}
                          >
                            <Edit2 size={18} color={Colors.text.secondary} strokeWidth={2} />
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={[styles.iconButton, styles.iconButtonDanger]}
                            onPress={() => handleRemovePlant(plant.id)}
                            activeOpacity={0.7}
                          >
                            <Trash2 size={18} color="#FF6B6B" strokeWidth={2} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <Modal
        visible={editingPlant !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setEditingPlant(null)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
            <TouchableOpacity
              style={styles.modalOverlayTouch}
              activeOpacity={1}
              onPress={() => setEditingPlant(null)}
            />
          </BlurView>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.myPlants.editPlant}</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setEditingPlant(null)}
              >
                <X size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.myPlants.nickname}</Text>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder={editingPlant?.plantInfo.name}
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {t.myPlants.wateringFrequency} ({t.myPlants.days})
              </Text>
              <TextInput
                style={styles.input}
                value={wateringFrequency}
                onChangeText={setWateringFrequency}
                keyboardType="number-pad"
                placeholder="7"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t.myPlants.notes}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder={language === "es" ? "Añadir notas..." : "Add notes..."}
                placeholderTextColor={Colors.text.tertiary}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditingPlant(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{t.myPlants.cancel}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
                activeOpacity={0.7}
              >
                <LinearGradient colors={Colors.gradient.primary} style={styles.saveButtonGradient}>
                  <Text style={styles.saveButtonText}>{t.myPlants.saveChanges}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={viewingHistoryPlant !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setViewingHistoryPlant(null)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
            <TouchableOpacity
              style={styles.modalOverlayTouch}
              activeOpacity={1}
              onPress={() => setViewingHistoryPlant(null)}
            />
          </BlurView>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {language === "es" ? "Historial de Riego" : "Watering History"}
              </Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setViewingHistoryPlant(null)}
              >
                <X size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.historyPlantName}>
              {viewingHistoryPlant?.nickname || viewingHistoryPlant?.plantInfo.name}
            </Text>

            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
              {viewingHistoryPlant?.wateringHistory?.map((record, index) => {
                const date = new Date(record.date);
                return (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyIconBg}>
                      <Droplets size={16} color="#4ECDC4" />
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyDate}>
                        {date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </Text>
                      <Text style={styles.historyTime}>
                        {date.toLocaleTimeString(language === "es" ? "es-ES" : "en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  </View>
                );
              })}
              {(!viewingHistoryPlant?.wateringHistory || viewingHistoryPlant.wateringHistory.length === 0) && (
                <Text style={styles.noHistoryText}>
                  {language === "es" ? "No hay historial de riego todavía" : "No watering history yet"}
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  addButton: {
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonGradient: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text.primary,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF8E8",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFE5B4",
  },
  alertIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFF0D4",
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#B8860B",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.text.primary,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: 40,
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
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 16,
    gap: 10,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light,
  },
  plantsList: {
    gap: 16,
  },
  plantCard: {
    backgroundColor: Colors.light,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    flexDirection: "row",
  },
  plantCardAccent: {
    width: 4,
  },
  plantCardContent: {
    flex: 1,
    padding: 18,
  },
  plantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  plantTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  plantScientificName: {
    fontSize: 13,
    color: Colors.text.tertiary,
    fontStyle: "italic" as const,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeSuccess: {
    backgroundColor: Colors.primaryLight,
  },
  statusBadgeWarning: {
    backgroundColor: "#FFF4E5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  statusTextSuccess: {
    color: Colors.primary,
  },
  statusTextWarning: {
    color: "#FFB020",
  },
  plantDetails: {
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.lightSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginRight: 6,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.text.primary,
  },
  plantActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.light,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.lightSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonDanger: {
    backgroundColor: "#FEF2F2",
  },
  iconButtonHistory: {
    backgroundColor: "#EFF6FF",
  },
  actionButtonDisabled: {
    opacity: 0.7,
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
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.lightSecondary,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 2,
    borderColor: Colors.lightTertiary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.lightSecondary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text.secondary,
  },
  saveButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonGradient: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light,
  },
  historyPlantName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  historyList: {
    maxHeight: 300,
  },
  historyItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightTertiary,
  },
  historyIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E0F7F5",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text.primary,
    textTransform: "capitalize" as const,
  },
  historyTime: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  noHistoryText: {
    fontSize: 15,
    color: Colors.text.tertiary,
    textAlign: "center" as const,
    paddingVertical: 24,
  },
});
