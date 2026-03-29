export interface AirPurification {
  score: number; // 1-10
  description: string;
  descriptionEs: string;
}

export interface WellnessBenefits {
  sleepScore: number; // 1-10
  sleepDescription: string;
  sleepDescriptionEs: string;
  stressScore: number; // 1-10
  stressDescription: string;
  stressDescriptionEs: string;
}

export interface SafetyInfo {
  petSafe: boolean;
  petSafeDescription: string;
  petSafeDescriptionEs: string;
  childSafe?: boolean;
  childSafeDescription?: string;
  childSafeDescriptionEs?: string;
  allergenInfo: string;
  allergenInfoEs: string;
  allergyFriendly?: boolean;
}

export interface Plant {
  id: string;
  name: string;
  nameEs?: string;
  scientificName: string;
  lightRequirement: string;
  lightRequirementEs?: string;
  wateringSchedule: string;
  wateringScheduleEs?: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  description: string;
  descriptionEs?: string;
  airPurification?: AirPurification;
  wellnessBenefits?: WellnessBenefits;
  safetyInfo?: SafetyInfo;
  careInstructions: {
    light: string;
    lightEs?: string;
    water: string;
    waterEs?: string;
    temperature: string;
    temperatureEs?: string;
    humidity: string;
    humidityEs?: string;
    fertilizer: string;
    fertilizerEs?: string;
    tips: string[];
    tipsEs?: string[];
  };
  imageUrl?: string;
  position?: {
    x: number;
    y: number;
    size: 'small' | 'medium' | 'large';
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude?: number;
  climate?: string;
  temperature?: string;
  humidity?: string;
}

export interface RoomAnalysis {
  lightLevel: 'Low' | 'Medium' | 'Bright';
  spaceSize: 'Small' | 'Medium' | 'Large';
  suggestions: Plant[];
  location?: LocationData;
}

// Mood emoji type for watering wellness tracking
export type MoodEmoji = "happy" | "relaxed" | "neutral" | "sad" | "stressed";

export const MOOD_EMOJIS: Record<MoodEmoji, string> = {
  happy: "😊",
  relaxed: "😌",
  neutral: "😐",
  sad: "😔",
  stressed: "😢",
};

export const MOOD_LABELS: Record<MoodEmoji, { en: string; es: string }> = {
  happy: { en: "Happy", es: "Feliz" },
  relaxed: { en: "Relaxed", es: "Relajado" },
  neutral: { en: "Neutral", es: "Neutral" },
  sad: { en: "Sad", es: "Triste" },
  stressed: { en: "Stressed", es: "Estresado" },
};

export const MOOD_SCORES: Record<MoodEmoji, number> = {
  happy: 5,
  relaxed: 4,
  neutral: 3,
  sad: 2,
  stressed: 1,
};

export interface WateringRecord {
  date: string;
  note?: string;
  mood?: MoodEmoji;
}

export interface WellnessStats {
  averageMood: number;
  moodTrend: Array<{ date: string; mood: MoodEmoji }>;
  totalWaterings: number;
  plantsWateredToday: number;
}

export interface UserPlant {
  id: string;
  plantInfo: Plant;
  dateAdded: string;
  lastWatered?: string;
  nextWatering: string;
  wateringFrequencyDays: number;
  nickname?: string;
  notes?: string;
  notificationId?: string;
  wateringHistory?: WateringRecord[];
}
