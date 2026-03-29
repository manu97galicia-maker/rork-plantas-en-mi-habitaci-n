import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { UserPlant, Plant, WateringRecord, MoodEmoji, WellnessStats, MOOD_SCORES } from '@/types/plant';

const MY_PLANTS_KEY = 'my_plants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const [MyPlantsProvider, useMyPlants] = createContextHook(() => {
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPlants();
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'web') return;
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
    }
  };

  const loadPlants = async () => {
    try {
      const stored = await AsyncStorage.getItem(MY_PLANTS_KEY);
      if (stored) {
        const parsedPlants = JSON.parse(stored) as UserPlant[];
        setPlants(parsedPlants);
      }
    } catch (error) {
      console.error('Error loading plants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePlants = async (updatedPlants: UserPlant[]) => {
    try {
      await AsyncStorage.setItem(MY_PLANTS_KEY, JSON.stringify(updatedPlants));
      setPlants(updatedPlants);
    } catch (error) {
      console.error('Error saving plants:', error);
    }
  };

  const scheduleWateringNotification = async (plant: UserPlant): Promise<string | undefined> => {
    if (Platform.OS === 'web') return undefined;

    try {
      const nextWateringDate = new Date(plant.nextWatering);
      const now = new Date();
      
      if (nextWateringDate <= now) {
        return undefined;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💧 Tiempo de regar',
          body: `Es hora de regar tu ${plant.nickname || plant.plantInfo.name}`,
          data: { plantId: plant.id },
          sound: true,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: nextWateringDate },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return undefined;
    }
  };

  const cancelNotification = async (notificationId: string) => {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const addPlant = async (plant: Plant, wateringFrequencyDays: number = 7, nickname?: string) => {
    const now = new Date();
    const nextWatering = new Date(now.getTime() + wateringFrequencyDays * 24 * 60 * 60 * 1000);

    const userPlant: UserPlant = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      plantInfo: plant,
      dateAdded: now.toISOString(),
      lastWatered: now.toISOString(),
      nextWatering: nextWatering.toISOString(),
      wateringFrequencyDays,
      nickname,
      notes: '',
    };

    const notificationId = await scheduleWateringNotification(userPlant);
    if (notificationId) {
      userPlant.notificationId = notificationId;
    }

    const updatedPlants = [...plants, userPlant];
    await savePlants(updatedPlants);
  };

  const removePlant = async (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant?.notificationId) {
      await cancelNotification(plant.notificationId);
    }

    const updatedPlants = plants.filter(p => p.id !== plantId);
    await savePlants(updatedPlants);
  };

  const waterPlant = async (plantId: string, mood?: MoodEmoji): Promise<boolean> => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return false;

    console.log('💧 Watering plant:', plant.nickname || plant.plantInfo.name, mood ? `with mood: ${mood}` : '');

    if (plant.notificationId) {
      await cancelNotification(plant.notificationId);
    }

    const now = new Date();
    const nextWatering = new Date(now.getTime() + plant.wateringFrequencyDays * 24 * 60 * 60 * 1000);

    const newWateringRecord: WateringRecord = {
      date: now.toISOString(),
      mood: mood,
    };

    const wateringHistory = plant.wateringHistory || [];
    const updatedHistory = [newWateringRecord, ...wateringHistory].slice(0, 50);

    const updatedPlant: UserPlant = {
      ...plant,
      lastWatered: now.toISOString(),
      nextWatering: nextWatering.toISOString(),
      wateringHistory: updatedHistory,
    };

    const notificationId = await scheduleWateringNotification(updatedPlant);
    if (notificationId) {
      updatedPlant.notificationId = notificationId;
    }

    const updatedPlants = plants.map(p => p.id === plantId ? updatedPlant : p);
    await savePlants(updatedPlants);

    console.log('✅ Plant watered successfully! Next watering:', nextWatering.toLocaleDateString());
    return true;
  };

  const updatePlant = async (plantId: string, updates: Partial<UserPlant>) => {
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    if (plant.notificationId) {
      await cancelNotification(plant.notificationId);
    }

    const updatedPlant: UserPlant = {
      ...plant,
      ...updates,
    };

    if (updates.wateringFrequencyDays && plant.lastWatered) {
      const lastWateredDate = new Date(plant.lastWatered);
      const nextWatering = new Date(lastWateredDate.getTime() + updates.wateringFrequencyDays * 24 * 60 * 60 * 1000);
      updatedPlant.nextWatering = nextWatering.toISOString();
    }

    const notificationId = await scheduleWateringNotification(updatedPlant);
    if (notificationId) {
      updatedPlant.notificationId = notificationId;
    }

    const updatedPlants = plants.map(p => p.id === plantId ? updatedPlant : p);
    await savePlants(updatedPlants);
  };

  const getPlantsNeedingWater = useCallback(() => {
    const now = new Date();
    return plants.filter(plant => {
      const nextWateringDate = new Date(plant.nextWatering);
      return nextWateringDate <= now;
    });
  }, [plants]);

  const getWellnessStats = useCallback((): WellnessStats => {
    const allRecords = plants.flatMap(p => p.wateringHistory || []);
    const recordsWithMood = allRecords.filter(r => r.mood);

    const averageMood = recordsWithMood.length > 0
      ? recordsWithMood.reduce((sum, r) => sum + MOOD_SCORES[r.mood!], 0) / recordsWithMood.length
      : 0;

    // Calculate mood trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moodTrend = recordsWithMood
      .filter(r => new Date(r.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(r => ({ date: r.date, mood: r.mood! }));

    const today = new Date().toDateString();
    const plantsWateredToday = allRecords.filter(r =>
      new Date(r.date).toDateString() === today
    ).length;

    return {
      averageMood,
      moodTrend,
      totalWaterings: allRecords.length,
      plantsWateredToday,
    };
  }, [plants]);

  return {
    plants,
    isLoading,
    addPlant,
    removePlant,
    waterPlant,
    updatePlant,
    getPlantsNeedingWater,
    getWellnessStats,
  };
});
