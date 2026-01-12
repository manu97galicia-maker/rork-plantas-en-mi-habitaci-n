import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { fetchPlantImage } from '@/services/freepikService';
import { COMMON_PLANTS } from '@/constants/commonPlants';

const STORAGE_KEY = '@plant_images_cache_v4';
const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000;

interface CachedImages {
  images: Record<string, string>;
  timestamp: number;
  version: number;
}

const CACHE_VERSION = 5;

const PLANT_FALLBACK_IMAGES: Record<string, string> = {
  'monstera': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=70',
  'pothos': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=70',
  'snake': 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&q=70',
  'spider': 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&q=70',
  'peace': 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400&q=70',
  'rubber': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=70',
  'ficus': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=70',
  'philodendron': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=70',
  'calathea': 'https://images.unsplash.com/photo-1598880940371-c756e015faf1?w=400&q=70',
  'fern': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&q=70',
  'palm': 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&q=70',
  'succulent': 'https://images.unsplash.com/photo-1509223197845-458d87c8d921?w=400&q=70',
  'aloe': 'https://images.unsplash.com/photo-1596548438137-d51ea5c83807?w=400&q=70',
  'cactus': 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&q=70',
  'zz': 'https://images.unsplash.com/photo-1637967886160-fd78dc3ce3f5?w=400&q=70',
  'zamioculcas': 'https://images.unsplash.com/photo-1637967886160-fd78dc3ce3f5?w=400&q=70',
  'cast iron': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=70',
  'aspidistra': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=70',
  'orchid': 'https://images.unsplash.com/photo-1566836610593-62a64888a216?w=400&q=70',
  'rose': 'https://images.unsplash.com/photo-1518882605630-8eb590c6f424?w=400&q=70',
  'lavender': 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&q=70',
  'jasmine': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=70',
  'tulip': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&q=70',
  'lily': 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=70',
  'sunflower': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=70',
  'begonia': 'https://images.unsplash.com/photo-1598880940371-c756e015faf1?w=400&q=70',
  'african': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=70',
  'anthurium': 'https://images.unsplash.com/photo-1610397648930-477b8c7f0943?w=400&q=70',
  'hibiscus': 'https://images.unsplash.com/photo-1592530392326-bf3d3cc51a8f?w=400&q=70',
  'geranium': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=70',
  'default': 'https://images.unsplash.com/photo-1463320898484-cdcfb6d08e12?w=400&q=70',
};

const getCommonPlantImage = (plantId: string, plantName: string): string | undefined => {
  const normalizedName = (plantName || '').toLowerCase().trim();
  const normalizedId = (plantId || '').toLowerCase().trim();
  
  const commonPlant = COMMON_PLANTS.find((p) => {
    if (p.id === plantId) return true;
    if (normalizedId && p.id.toLowerCase() === normalizedId) return true;
    if (normalizedName && normalizedName.length > 2) {
      if (p.name?.toLowerCase() === normalizedName) return true;
      if (normalizedName.includes(p.name?.toLowerCase() || '')) return true;
      if (p.name?.toLowerCase().includes(normalizedName)) return true;
    }
    return false;
  });
  return commonPlant?.imageUrl;
};

const getFallbackForPlant = (plantName: string): string => {
  const commonImage = getCommonPlantImage('', plantName);
  if (commonImage) return commonImage;
  
  const name = plantName.toLowerCase();
  for (const key of Object.keys(PLANT_FALLBACK_IMAGES)) {
    if (key !== 'default' && name.includes(key)) {
      return PLANT_FALLBACK_IMAGES[key];
    }
  }
  return PLANT_FALLBACK_IMAGES.default;
};

export const [PlantImagesProvider, usePlantImages] = createContextHook(() => {
  const [plantImages, setPlantImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching] = useState(false);
  const pendingFetches = useRef<Set<string>>(new Set());
  const hasInitialized = useRef(false);

  const loadCachedImages = useCallback(async (): Promise<Record<string, string>> => {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsedCache: CachedImages = JSON.parse(cached);
        const isExpired = Date.now() - parsedCache.timestamp > CACHE_DURATION;
        const isValidVersion = parsedCache.version === CACHE_VERSION;
        
        if (!isExpired && isValidVersion && Object.keys(parsedCache.images).length > 0) {
          console.log('[PlantImages] Cache loaded:', Object.keys(parsedCache.images).length);
          return parsedCache.images;
        }
      }
    } catch {
      console.log('[PlantImages] Cache load error');
    }
    return {};
  }, []);

  const saveToCache = useCallback(async (images: Record<string, string>) => {
    try {
      const cacheData: CachedImages = {
        images,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    } catch {
      console.log('[PlantImages] Cache save error');
    }
  }, []);

  const fetchSingleImage = useCallback(async (plantId: string, plantName: string): Promise<string | null> => {
    if (pendingFetches.current.has(plantId)) {
      return null;
    }
    
    pendingFetches.current.add(plantId);
    
    try {
      const url = await fetchPlantImage(plantName);
      if (url) {
        setPlantImages(prev => {
          const updated = { ...prev, [plantId]: url };
          saveToCache(updated);
          return updated;
        });
        return url;
      }
    } catch {
      console.log('[PlantImages] Fetch error for:', plantName);
    } finally {
      pendingFetches.current.delete(plantId);
    }
    
    return null;
  }, [saveToCache]);

  const getPlantImage = useCallback((plantId: string, plantName?: string): string | undefined => {
    // Always prefer cached Freepik images first
    if (plantImages[plantId]) {
      return plantImages[plantId];
    }
    
    // If not cached, trigger a fetch from Freepik and return fallback
    if (plantName && !pendingFetches.current.has(plantId)) {
      fetchSingleImage(plantId, plantName);
    }
    
    // Return fallback while loading
    if (plantName) {
      return getFallbackForPlant(plantName);
    }
    
    const commonImage = getCommonPlantImage(plantId, plantName || '');
    if (commonImage) {
      return commonImage;
    }
    
    return undefined;
  }, [plantImages, fetchSingleImage]);

  const prefetchPlantImage = useCallback((plantId: string, plantName: string) => {
    if (!plantImages[plantId] && !pendingFetches.current.has(plantId)) {
      fetchSingleImage(plantId, plantName);
    }
  }, [plantImages, fetchSingleImage]);

  const getPlantImageWithFallback = useCallback((plantId: string, plantName: string): string => {
    // Always prefer cached Freepik images first
    const cached = plantImages[plantId];
    if (cached) return cached;
    
    // Trigger fetch from Freepik if not already fetching
    if (!pendingFetches.current.has(plantId)) {
      fetchSingleImage(plantId, plantName);
    }
    
    // Return fallback while loading
    return getFallbackForPlant(plantName);
  }, [plantImages, fetchSingleImage]);

  const refreshImages = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setPlantImages({});
    pendingFetches.current.clear();
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const init = async () => {
      const cachedImages = await loadCachedImages();
      if (Object.keys(cachedImages).length > 0) {
        setPlantImages(cachedImages);
      }
      setIsLoading(false);
    };
    
    init();
  }, [loadCachedImages]);

  return {
    plantImages,
    isLoading,
    isFetching,
    fetchedCount: Object.keys(plantImages).length,
    getPlantImage,
    getPlantImageWithFallback,
    prefetchPlantImage,
    refreshImages,
    getFallbackForPlant,
  };
});
