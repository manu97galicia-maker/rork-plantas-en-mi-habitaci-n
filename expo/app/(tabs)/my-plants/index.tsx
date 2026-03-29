import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  Droplets,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  Plus,
  X,
  Check,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  Leaf,
  Sun,
  Sparkles,
} from "lucide-react-native";
import { useMyPlants } from "@/contexts/MyPlantsContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";
import { UserPlant, MoodEmoji, MOOD_EMOJIS } from "@/types/plant";
import { Colors } from "@/constants/colors";
import TabHeader from "@/components/TabHeader";
import SettingsModal from "@/components/SettingsModal";
import MoodPicker from "@/components/MoodPicker";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function MyPlantsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plants, waterPlant, removePlant, updatePlant, getPlantsNeedingWater, getWellnessStats } = useMyPlants();
  const { language } = useUserPreferences();
  const t = getTranslations(language);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingPlant, setEditingPlant] = useState<UserPlant | null>(null);
  const [wateringPlantId, setWateringPlantId] = useState<string | null>(null);
  const [showWateringSuccess, setShowWateringSuccess] = useState<string | null>(null);
  const [viewingHistoryPlant, setViewingHistoryPlant] = useState<UserPlant | null>(null);
  const [moodPickerVisible, setMoodPickerVisible] = useState(false);
  const [pendingWaterPlantId, setPendingWaterPlantId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [wateringFrequency, setWateringFrequency] = useState<string>("7");

  const isNavigatingRef = useRef(false);
  const lastClickRef = useRef(0);

  const plantsNeedingWater = useMemo(() => getPlantsNeedingWater(), [getPlantsNeedingWater]);
  const wellnessStats = useMemo(() => getWellnessStats(), [getWellnessStats]);

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

  const initiateWatering = (plantId: string) => {
    setPendingWaterPlantId(plantId);
    setMoodPickerVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleMoodSelect = async (mood: MoodEmoji) => {
    setMoodPickerVisible(false);
    if (pendingWaterPlantId) {
      await completeWatering(pendingWaterPlantId, mood);
    }
    setPendingWaterPlantId(null);
  };

  const handleMoodSkip = async () => {
    setMoodPickerVisible(false);
    if (pendingWaterPlantId) {
      await completeWatering(pendingWaterPlantId);
    }
    setPendingWaterPlantId(null);
  };

  const completeWatering = async (plantId: string, mood?: MoodEmoji) => {
    setWateringPlantId(plantId);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const success = await waterPlant(plantId, mood);

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
          ? `${plantName} ha sido regada. Próximo riego en ${nextDays} días.`
          : `${plantName} has been watered. Next watering in ${nextDays} days.`,
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

  const getTimeUntilWatering = (nextWatering: string): { text: string; isOverdue: boolean; days: number } => {
    const now = new Date();
    const nextWateringDate = new Date(nextWatering);
    const diffMs = nextWateringDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: t.myPlants.overdue, isOverdue: true, days: diffDays };
    } else if (diffDays === 0) {
      return { text: t.myPlants.today, isOverdue: true, days: 0 };
    } else if (diffDays === 1) {
      return { text: `1 ${t.myPlants.days}`, isOverdue: false, days: 1 };
    } else {
      return { text: `${diffDays} ${t.myPlants.days}`, isOverdue: false, days: diffDays };
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

  const getMoodTrendIcon = () => {
    if (wellnessStats.moodTrend.length < 2) return null;

    const recentMoods = wellnessStats.moodTrend.slice(-7);
    if (recentMoods.length < 2) return null;

    const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
    const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));

    const avgFirst = firstHalf.reduce((sum, r) => sum + (r.mood ? getMoodScore(r.mood) : 3), 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, r) => sum + (r.mood ? getMoodScore(r.mood) : 3), 0) / secondHalf.length;

    const diff = avgSecond - avgFirst;

    if (diff > 0.3) return <TrendingUp size={14} color={Colors.status.success} strokeWidth={2.5} />;
    if (diff < -0.3) return <TrendingDown size={14} color={Colors.status.error} strokeWidth={2.5} />;
    return <Minus size={14} color={Colors.text.tertiary} strokeWidth={2.5} />;
  };

  const getMoodScore = (mood: MoodEmoji): number => {
    const scores: Record<MoodEmoji, number> = {
      happy: 5,
      relaxed: 4,
      neutral: 3,
      sad: 2,
      stressed: 1,
    };
    return scores[mood];
  };

  const getAverageMoodEmoji = (): string => {
    if (wellnessStats.averageMood === 0) return "🌱";
    if (wellnessStats.averageMood >= 4.5) return "😊";
    if (wellnessStats.averageMood >= 3.5) return "😌";
    if (wellnessStats.averageMood >= 2.5) return "😐";
    if (wellnessStats.averageMood >= 1.5) return "😔";
    return "😢";
  };

  const pendingPlant = plants.find(p => p.id === pendingWaterPlantId);

  // Sort plants: overdue first, then by days until watering
  const sortedPlants = useMemo(() => {
    return [...plants].sort((a, b) => {
      const aTime = getTimeUntilWatering(a.nextWatering);
      const bTime = getTimeUntilWatering(b.nextWatering);

      // Overdue plants first
      if (aTime.isOverdue && !bTime.isOverdue) return -1;
      if (!aTime.isOverdue && bTime.isOverdue) return 1;

      // Then sort by days
      return aTime.days - bTime.days;
    });
  }, [plants]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={[Colors.primaryLight, Colors.mint]}
          style={styles.emptyIconBg}
        >
          <Leaf size={48} color={Colors.primary} strokeWidth={1.5} />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>{t.myPlants.noPlantsYet}</Text>
      <Text style={styles.emptyDescription}>{t.myPlants.noPlantsDescription}</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => safeNavigate("/(tabs)/my-plants/add")}
        activeOpacity={0.8}
      >
        <LinearGradient colors={Colors.gradient.primary} style={styles.emptyButtonGradient}>
          <Plus size={20} color={Colors.light} strokeWidth={2.5} />
          <Text style={styles.emptyButtonText}>{t.myPlants.addPlant}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <TabHeader
          title={t.myPlants.title}
          onSettingsPress={() => setSettingsVisible(true)}
          rightContent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => safeNavigate("/(tabs)/my-plants/add")}
              activeOpacity={0.8}
            >
              <LinearGradient colors={Colors.gradient.primary} style={styles.addButtonGradient}>
                <Plus size={22} color={Colors.light} strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
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
          {/* Stats Row - Always visible when plants exist */}
          {plants.length > 0 && (
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: Colors.primaryLight }]}>
                  <Leaf size={18} color={Colors.primary} strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{plants.length}</Text>
                <Text style={styles.statLabel}>{language === "es" ? "Plantas" : "Plants"}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconBg, { backgroundColor: plantsNeedingWater.length > 0 ? Colors.status.warningLight : Colors.status.successLight }]}>
                  <Droplets size={18} color={plantsNeedingWater.length > 0 ? Colors.status.warning : Colors.status.success} strokeWidth={2} />
                </View>
                <Text style={[styles.statValue, plantsNeedingWater.length > 0 && { color: Colors.status.warning }]}>
                  {plantsNeedingWater.length}
                </Text>
                <Text style={styles.statLabel}>{language === "es" ? "Necesitan agua" : "Need water"}</Text>
              </View>

              {wellnessStats.totalWaterings > 0 && (
                <View style={styles.statCard}>
                  <Text style={styles.moodEmoji}>{getAverageMoodEmoji()}</Text>
                  <View style={styles.trendRow}>
                    <Text style={styles.statValue}>{wellnessStats.totalWaterings}</Text>
                    {getMoodTrendIcon()}
                  </View>
                  <Text style={styles.statLabel}>{language === "es" ? "Riegos" : "Waterings"}</Text>
                </View>
              )}
            </View>
          )}

          {/* Alert Banner for overdue plants */}
          {plantsNeedingWater.length > 0 && (
            <View style={styles.alertBanner}>
              <View style={styles.alertIconBg}>
                <AlertCircle size={16} color={Colors.status.warning} strokeWidth={2.5} />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>
                  {language === "es" ? "¡Hora de regar!" : "Time to water!"}
                </Text>
                <Text style={styles.alertText}>
                  {plantsNeedingWater.length} {plantsNeedingWater.length === 1
                    ? (language === "es" ? "planta necesita agua" : "plant needs water")
                    : (language === "es" ? "plantas necesitan agua" : "plants need water")}
                </Text>
              </View>
            </View>
          )}

          {plants.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.plantsList}>
              {sortedPlants.map((plant) => {
                const timeUntil = getTimeUntilWatering(plant.nextWatering);
                const isWatering = wateringPlantId === plant.id;
                const showSuccess = showWateringSuccess === plant.id;

                return (
                  <View key={plant.id} style={styles.plantCard}>
                    {/* Card Header */}
                    <View style={styles.cardHeader}>
                      <View style={styles.plantTitleSection}>
                        <Text style={styles.plantName} numberOfLines={1}>
                          {plant.nickname || plant.plantInfo.name}
                        </Text>
                        {plant.nickname && (
                          <Text style={styles.plantSpecies} numberOfLines={1}>
                            {plant.plantInfo.name}
                          </Text>
                        )}
                      </View>

                      {/* Status Badge */}
                      <View style={[
                        styles.statusBadge,
                        timeUntil.isOverdue ? styles.statusBadgeWarning : styles.statusBadgeSuccess
                      ]}>
                        <Droplets size={12} color={timeUntil.isOverdue ? Colors.status.warning : Colors.status.success} strokeWidth={2.5} />
                        <Text style={[
                          styles.statusText,
                          timeUntil.isOverdue ? styles.statusTextWarning : styles.statusTextSuccess
                        ]}>{timeUntil.text}</Text>
                      </View>
                    </View>

                    {/* Quick Info Row */}
                    <View style={styles.quickInfoRow}>
                      <View style={styles.quickInfoItem}>
                        <Calendar size={14} color={Colors.text.tertiary} strokeWidth={2} />
                        <Text style={styles.quickInfoText}>
                          {language === "es" ? "Cada" : "Every"} {plant.wateringFrequencyDays} {language === "es" ? "días" : "days"}
                        </Text>
                      </View>
                      {plant.lastWatered && (
                        <View style={styles.quickInfoItem}>
                          <Clock size={14} color={Colors.text.tertiary} strokeWidth={2} />
                          <Text style={styles.quickInfoText}>
                            {language === "es" ? "Último" : "Last"}: {formatDate(plant.lastWatered)}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Action Row */}
                    <View style={styles.actionRow}>
                      {/* Main Water Button */}
                      <TouchableOpacity
                        style={[styles.waterButton, isWatering && styles.waterButtonDisabled]}
                        onPress={() => initiateWatering(plant.id)}
                        activeOpacity={0.8}
                        disabled={isWatering}
                      >
                        <LinearGradient
                          colors={showSuccess ? Colors.gradient.waterSuccess : Colors.gradient.water}
                          style={styles.waterButtonGradient}
                        >
                          {isWatering ? (
                            <Text style={styles.waterButtonText}>
                              {language === "es" ? "Regando..." : "Watering..."}
                            </Text>
                          ) : showSuccess ? (
                            <>
                              <Check size={18} color={Colors.light} strokeWidth={2.5} />
                              <Text style={styles.waterButtonText}>
                                {language === "es" ? "¡Listo!" : "Done!"}
                              </Text>
                            </>
                          ) : (
                            <>
                              <Droplets size={18} color={Colors.light} strokeWidth={2} />
                              <Text style={styles.waterButtonText}>
                                {language === "es" ? "Regar" : "Water"}
                              </Text>
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>

                      {/* Secondary Actions */}
                      <View style={styles.secondaryActions}>
                        {plant.wateringHistory && plant.wateringHistory.length > 0 && (
                          <TouchableOpacity
                            style={[styles.iconButton, styles.iconButtonHistory]}
                            onPress={() => setViewingHistoryPlant(plant)}
                            activeOpacity={0.7}
                          >
                            <History size={18} color={Colors.action.history} strokeWidth={2} />
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
                          <Trash2 size={18} color={Colors.action.delete} strokeWidth={2} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      <MoodPicker
        visible={moodPickerVisible}
        onSelect={handleMoodSelect}
        onSkip={handleMoodSkip}
        onClose={() => {
          setMoodPickerVisible(false);
          setPendingWaterPlantId(null);
        }}
        plantName={pendingPlant?.nickname || pendingPlant?.plantInfo.name || ""}
        language={language}
      />

      {/* Edit Plant Modal */}
      <Modal
        visible={editingPlant !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setEditingPlant(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setEditingPlant(null)}
                activeOpacity={0.7}
              >
                <X size={20} color={Colors.text.secondary} strokeWidth={2.5} />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>{t.myPlants.editPlant}</Text>

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveEdit}
                activeOpacity={0.8}
              >
                <LinearGradient colors={Colors.gradient.primary} style={styles.modalSaveButtonGradient}>
                  <Check size={18} color={Colors.light} strokeWidth={2.5} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputSection}>
                <Text style={styles.sectionLabel}>{language === "es" ? "Personalización" : "Customization"}</Text>

                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>{t.myPlants.nickname}</Text>
                    <TextInput
                      style={styles.input}
                      value={nickname}
                      onChangeText={setNickname}
                      placeholder={editingPlant?.plantInfo.name}
                      placeholderTextColor={Colors.text.tertiary}
                    />
                  </View>

                  <View style={[styles.inputWrapper, { flex: 0.4 }]}>
                    <Text style={styles.inputLabel}>{language === "es" ? "Días" : "Days"}</Text>
                    <TextInput
                      style={styles.input}
                      value={wateringFrequency}
                      onChangeText={setWateringFrequency}
                      keyboardType="number-pad"
                      placeholder="7"
                      placeholderTextColor={Colors.text.tertiary}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>{t.myPlants.notes}</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder={language === "es" ? "Añadir notas..." : "Add notes..."}
                    placeholderTextColor={Colors.text.tertiary}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              {/* Bottom Save Button */}
              <TouchableOpacity
                style={styles.bottomSaveButton}
                onPress={handleSaveEdit}
                activeOpacity={0.8}
              >
                <LinearGradient colors={Colors.gradient.primary} style={styles.bottomSaveButtonGradient}>
                  <Check size={20} color={Colors.light} strokeWidth={2.5} />
                  <Text style={styles.bottomSaveButtonText}>{t.myPlants.saveChanges}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Watering History Modal */}
      <Modal
        visible={viewingHistoryPlant !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setViewingHistoryPlant(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setViewingHistoryPlant(null)}
                activeOpacity={0.7}
              >
                <X size={20} color={Colors.text.secondary} strokeWidth={2.5} />
              </TouchableOpacity>

              <View style={styles.modalHeaderCenter}>
                <Text style={styles.modalTitle}>
                  {language === "es" ? "Historial" : "History"}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {viewingHistoryPlant?.nickname || viewingHistoryPlant?.plantInfo.name}
                </Text>
              </View>

              <View style={{ width: 36 }} />
            </View>

            {/* History Stats */}
            {viewingHistoryPlant?.wateringHistory && viewingHistoryPlant.wateringHistory.length > 0 && (
              <View style={styles.historyStats}>
                <View style={styles.historyStatItem}>
                  <Text style={styles.historyStatValue}>{viewingHistoryPlant.wateringHistory.length}</Text>
                  <Text style={styles.historyStatLabel}>{language === "es" ? "Total" : "Total"}</Text>
                </View>
                <View style={styles.historyStatDivider} />
                <View style={styles.historyStatItem}>
                  <Text style={styles.historyStatValue}>
                    {viewingHistoryPlant.wateringHistory.filter(r => r.mood).length}
                  </Text>
                  <Text style={styles.historyStatLabel}>{language === "es" ? "Con mood" : "With mood"}</Text>
                </View>
              </View>
            )}

            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
              {viewingHistoryPlant?.wateringHistory?.map((record, index) => {
                const date = new Date(record.date);
                return (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyIconBg}>
                      <Droplets size={16} color={Colors.action.water} strokeWidth={2} />
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyDate}>
                        {date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </Text>
                      <Text style={styles.historyTime}>
                        {date.toLocaleTimeString(language === "es" ? "es-ES" : "en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    {record.mood && (
                      <Text style={styles.historyMood}>{MOOD_EMOJIS[record.mood]}</Text>
                    )}
                  </View>
                );
              })}
              {(!viewingHistoryPlant?.wateringHistory || viewingHistoryPlant.wateringHistory.length === 0) && (
                <View style={styles.noHistoryState}>
                  <Droplets size={32} color={Colors.text.tertiary} strokeWidth={1.5} />
                  <Text style={styles.noHistoryText}>
                    {language === "es" ? "No hay historial todavía" : "No history yet"}
                  </Text>
                </View>
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
  addButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonGradient: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.text.tertiary,
    marginTop: 2,
    textAlign: "center",
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // Alert Banner
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.alert.warningBg,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.alert.warningBorder,
  },
  alertIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.alert.warningIconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.alert.warningText,
  },
  alertText: {
    fontSize: 12,
    color: Colors.status.warningDark,
    marginTop: 2,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text.primary,
    marginBottom: 8,
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
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    fontWeight: "700",
    color: Colors.light,
  },

  // Plant Cards
  plantsList: {
    gap: 12,
  },
  plantCard: {
    backgroundColor: Colors.light,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  plantTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  plantName: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  plantSpecies: {
    fontSize: 13,
    color: Colors.text.tertiary,
    fontStyle: "italic",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusBadgeSuccess: {
    backgroundColor: Colors.status.successLight,
  },
  statusBadgeWarning: {
    backgroundColor: Colors.status.warningLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextSuccess: {
    color: Colors.status.success,
  },
  statusTextWarning: {
    color: Colors.status.warning,
  },

  // Quick Info
  quickInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
  },
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickInfoText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },

  // Actions
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  waterButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  waterButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  waterButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light,
  },
  waterButtonDisabled: {
    opacity: 0.7,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.softWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonDanger: {
    backgroundColor: Colors.action.deleteLight,
  },
  iconButtonHistory: {
    backgroundColor: Colors.action.historyLight,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay.dark,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingHorizontal: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.warmGray,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warmGray,
    marginBottom: 16,
    gap: 12,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeaderCenter: {
    flex: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.charcoal,
  },
  modalSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  modalSaveButton: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  modalSaveButtonGradient: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // Input Section
  inputSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.softWhite,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.charcoal,
    borderWidth: 1,
    borderColor: Colors.warmGray,
    fontWeight: "500",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  // Bottom Save Button
  bottomSaveButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bottomSaveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  bottomSaveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light,
  },

  // History Modal
  historyStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.softWhite,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 24,
  },
  historyStatItem: {
    alignItems: "center",
  },
  historyStatValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text.primary,
  },
  historyStatLabel: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  historyStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.warmGray,
  },
  historyList: {
    maxHeight: 350,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warmGray,
  },
  historyIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  historyTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  historyMood: {
    fontSize: 24,
  },
  noHistoryState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  noHistoryText: {
    fontSize: 15,
    color: Colors.text.tertiary,
    textAlign: "center",
  },
});
