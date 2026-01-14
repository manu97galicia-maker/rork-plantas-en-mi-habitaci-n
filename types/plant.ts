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
}
