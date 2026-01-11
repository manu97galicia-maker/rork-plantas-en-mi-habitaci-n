import { trpcClient } from "@/lib/trpc";

const pendingRequests = new Map<string, Promise<string | null>>();

export interface FreepikImage {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export async function fetchPlantImage(plantName: string): Promise<string | null> {
  const cacheKey = plantName.toLowerCase().trim();
  
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }
  
  const requestPromise = (async (): Promise<string | null> => {
    try {
      console.log(`[Freepik] Fetching via backend: ${plantName}`);
      
      const result = await trpcClient.plant.searchImage.mutate({ plantName });
      
      if (result.imageUrl) {
        console.log(`[Freepik] ✓ ${plantName}`);
        return result.imageUrl;
      }
      
      if (result.error) {
        console.log(`[Freepik] Error for ${plantName}:`, result.error);
      }

      return null;
    } catch (error: any) {
      console.log(`[Freepik] ✗ ${plantName}:`, error?.message);
      return null;
    } finally {
      setTimeout(() => pendingRequests.delete(cacheKey), 100);
    }
  })();
  
  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

export async function editImageWithPlants(
  prompt: string, 
  imageBase64: string,
  aspectRatio: string = "1:1"
): Promise<{ success: boolean; imageBase64: string | null; error?: string }> {
  try {
    console.log(`[ImageEdit] Sending edit request via backend`);
    
    const result = await trpcClient.plant.editImage.mutate({
      prompt,
      imageBase64,
      aspectRatio,
    });
    
    if (result.success && result.imageBase64) {
      console.log(`[ImageEdit] ✓ Image edited successfully`);
      return { success: true, imageBase64: result.imageBase64 };
    }
    
    console.log(`[ImageEdit] ✗ Error:`, result.error);
    return { success: false, imageBase64: null, error: result.error };
  } catch (error: any) {
    console.error(`[ImageEdit] ✗ Error:`, error?.message);
    return { 
      success: false, 
      imageBase64: null, 
      error: error?.message || "Unknown error" 
    };
  }
}
