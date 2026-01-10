const FREEPIK_API_KEY = 'FPSX41919b7629a24ef553c7b0ed0789b0f1';
const FREEPIK_API_URL = 'https://api.freepik.com/v1/resources';
const REQUEST_TIMEOUT = 6000;
const pendingRequests = new Map<string, Promise<string | null>>();

export interface FreepikImage {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      reject(new Error(`Timeout`));
    }, timeout);

    fetch(url, { ...options, signal: controller.signal })
      .then(response => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

export async function fetchPlantImage(plantName: string): Promise<string | null> {
  const cacheKey = plantName.toLowerCase().trim();
  
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }
  
  const requestPromise = (async (): Promise<string | null> => {
    try {
      console.log(`[Freepik] Fetching: ${plantName}`);
      
      const searchTerm = `${plantName} plant`;
      const response = await fetchWithTimeout(
        `${FREEPIK_API_URL}?term=${encodeURIComponent(searchTerm)}&page=1&limit=1&filters[content_type][photo]=1`,
        {
          headers: {
            'Accept': 'application/json',
            'x-freepik-api-key': FREEPIK_API_KEY,
          },
        },
        REQUEST_TIMEOUT
      );

      if (!response.ok) {
        console.log(`[Freepik] Error ${response.status} for: ${plantName}`);
        return null;
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const imageUrl = data.data[0].image?.source?.url || data.data[0].thumbnail?.url;
        console.log(`[Freepik] ✓ ${plantName}`);
        return imageUrl;
      }

      return null;
    } catch {
      console.log(`[Freepik] ✗ ${plantName}`);
      return null;
    } finally {
      setTimeout(() => pendingRequests.delete(cacheKey), 100);
    }
  })();
  
  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}
