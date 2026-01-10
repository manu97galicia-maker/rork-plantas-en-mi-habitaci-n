import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import type { RoomAnalysis } from "@/types/plant";

export type CareLevel = "beginner" | "intermediate" | "expert";
export type Language = "en" | "es";

export interface ScanHistory {
  id: string;
  timestamp: number;
  analysis: RoomAnalysis;
  originalImage: string;
  editedImage?: string;
  plantsImage?: string;
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
}

interface UserPreferences {
  careLevel: CareLevel | null;
  language: Language;
  hasCompletedOnboarding: boolean;
  scanHistory: ScanHistory[];
  monthlyScans: { [month: string]: number };
}

const STORAGE_KEY = "@user_preferences";
const MAX_MONTHLY_SCANS = 50;
const MAX_SCAN_HISTORY = 20;

const defaultPreferences: UserPreferences = {
  careLevel: null,
  language: "en",
  hasCompletedOnboarding: false,
  scanHistory: [],
  monthlyScans: {},
};

const [UserPreferencesProviderBase, useUserPreferencesBase] = createContextHook(() => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => ({ ...defaultPreferences }));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            const validPreferences: UserPreferences = {
              careLevel: parsed.careLevel || null,
              language: parsed.language === "es" || parsed.language === "en" ? parsed.language : "en",
              hasCompletedOnboarding: parsed.hasCompletedOnboarding || false,
              scanHistory: Array.isArray(parsed.scanHistory) ? parsed.scanHistory : [],
              monthlyScans: parsed.monthlyScans && typeof parsed.monthlyScans === 'object' ? parsed.monthlyScans : {},
            };
            setPreferences(validPreferences);
          } else {
            console.warn("Stored preferences is not a valid object, resetting to defaults");
            await AsyncStorage.removeItem(STORAGE_KEY);
            setPreferences({ ...defaultPreferences });
          }
        } catch (parseError) {
          console.error("Error parsing stored preferences (corrupted data), resetting:", parseError);
          await AsyncStorage.removeItem(STORAGE_KEY);
          setPreferences({ ...defaultPreferences });
        }
      } else {
        setPreferences({ ...defaultPreferences });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
      setPreferences({ ...defaultPreferences });
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      if (!newPreferences || typeof newPreferences !== 'object') {
        console.error("Invalid preferences object");
        return;
      }
      const validPreferences: UserPreferences = {
        careLevel: newPreferences.careLevel || null,
        language: newPreferences.language === "es" || newPreferences.language === "en" ? newPreferences.language : "en",
        hasCompletedOnboarding: newPreferences.hasCompletedOnboarding || false,
        scanHistory: Array.isArray(newPreferences.scanHistory) ? newPreferences.scanHistory : [],
        monthlyScans: newPreferences.monthlyScans && typeof newPreferences.monthlyScans === 'object' ? newPreferences.monthlyScans : {},
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validPreferences));
      setPreferences(validPreferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const setLanguage = async (lang: Language) => {
    const current = preferences || { ...defaultPreferences };
    await savePreferences({
      careLevel: current.careLevel || null,
      language: lang,
      hasCompletedOnboarding: current.hasCompletedOnboarding || false,
      scanHistory: Array.isArray(current.scanHistory) ? current.scanHistory : [],
      monthlyScans: current.monthlyScans && typeof current.monthlyScans === 'object' ? current.monthlyScans : {},
    });
  };

  const setCareLevel = async (level: CareLevel) => {
    const current = preferences || { ...defaultPreferences };
    await savePreferences({
      careLevel: level,
      language: current.language || "en",
      hasCompletedOnboarding: current.hasCompletedOnboarding || false,
      scanHistory: Array.isArray(current.scanHistory) ? current.scanHistory : [],
      monthlyScans: current.monthlyScans && typeof current.monthlyScans === 'object' ? current.monthlyScans : {},
    });
  };

  const completeOnboarding = async () => {
    const current = preferences || { ...defaultPreferences };
    await savePreferences({
      careLevel: current.careLevel || null,
      language: current.language || "en",
      hasCompletedOnboarding: true,
      scanHistory: Array.isArray(current.scanHistory) ? current.scanHistory : [],
      monthlyScans: current.monthlyScans && typeof current.monthlyScans === 'object' ? current.monthlyScans : {},
    });
  };

  const getCurrentMonthKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const getRemainingScans = () => {
    const current = preferences || { ...defaultPreferences };
    const currentMonth = getCurrentMonthKey();
    const monthlyScans = current.monthlyScans && typeof current.monthlyScans === 'object' ? current.monthlyScans : {};
    const usedScans = monthlyScans[currentMonth] || 0;
    return MAX_MONTHLY_SCANS - usedScans;
  };

  const canScan = () => {
    return getRemainingScans() > 0;
  };

  const addScan = async (scan: Omit<ScanHistory, 'id' | 'timestamp'>) => {
    try {
      const current = preferences || { ...defaultPreferences };
      const currentMonth = getCurrentMonthKey();
      
      const newScan: ScanHistory = {
        analysis: scan.analysis,
        originalImage: scan.originalImage || '',
        editedImage: scan.editedImage,
        plantsImage: scan.plantsImage,
        location: scan.location,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };

      const currentHistory = Array.isArray(current.scanHistory) ? current.scanHistory : [];
      const currentMonthlyScans = current.monthlyScans && typeof current.monthlyScans === 'object' ? current.monthlyScans : {};
      
      const updatedHistory = [newScan, ...currentHistory].slice(0, MAX_SCAN_HISTORY);
      const updatedMonthlyScans = {
        ...currentMonthlyScans,
        [currentMonth]: (currentMonthlyScans[currentMonth] || 0) + 1,
      };

      await savePreferences({
        careLevel: current.careLevel || null,
        language: current.language || "en",
        hasCompletedOnboarding: current.hasCompletedOnboarding || false,
        scanHistory: updatedHistory,
        monthlyScans: updatedMonthlyScans,
      });
      console.log('✅ Scan added to history successfully');
    } catch (error) {
      console.error('Error adding scan to history:', error);
    }
  };

  const deleteScan = async (scanId: string) => {
    const current = preferences || { ...defaultPreferences };
    const currentHistory = Array.isArray(current.scanHistory) ? current.scanHistory : [];
    const updatedHistory = currentHistory.filter(scan => scan.id !== scanId);
    await savePreferences({
      careLevel: current.careLevel || null,
      language: current.language || "en",
      hasCompletedOnboarding: current.hasCompletedOnboarding || false,
      scanHistory: updatedHistory,
      monthlyScans: current.monthlyScans && typeof current.monthlyScans === 'object' ? current.monthlyScans : {},
    });
  };

  const current = preferences || { ...defaultPreferences };
  
  return {
    careLevel: current.careLevel || null,
    language: current.language || "en",
    hasCompletedOnboarding: current.hasCompletedOnboarding || false,
    scanHistory: Array.isArray(current.scanHistory) ? current.scanHistory : [],
    setLanguage,
    setCareLevel,
    completeOnboarding,
    addScan,
    deleteScan,
    getRemainingScans,
    canScan,
    isLoading,
  };
});

export const UserPreferencesProvider = UserPreferencesProviderBase;

export const useUserPreferences = () => {
  const context = useUserPreferencesBase();
  if (!context || typeof context !== 'object') {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
};
