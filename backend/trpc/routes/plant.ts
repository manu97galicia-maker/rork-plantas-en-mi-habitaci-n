import * as z from "zod";
import { createTRPCRouter, rateLimitedProcedure } from "../create-context";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY || "";
const FREEPIK_API_URL = "https://api.freepik.com/v1/resources";

type FreepikSearchResponse = {
  data?: {
    image?: { source?: { url?: string } };
    thumbnail?: { url?: string };
    assets?: { preview?: { url?: string }; image?: { url?: string } };
    url?: string;
  }[];
};

export const plantRouter = createTRPCRouter({
  searchImage: rateLimitedProcedure
    .input(z.object({ plantName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(`[PlantAPI] Device ${ctx.deviceId} searching image for: ${input.plantName}`);
      
      if (!FREEPIK_API_KEY) {
        console.error("[PlantAPI] FREEPIK_API_KEY not configured");
        return { imageUrl: null, error: "API not configured" };
      }

      try {
        const cleanName = input.plantName.toLowerCase().trim();
        const searchTerm = `${cleanName} plant`; 
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(
          `${FREEPIK_API_URL}?term=${encodeURIComponent(searchTerm)}&page=1&limit=1&filters[content_type][photo]=1&order=relevance`,
          {
            headers: {
              "Accept": "application/json",
              "x-freepik-api-key": FREEPIK_API_KEY,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.log(`[PlantAPI] Freepik error ${response.status} for: ${input.plantName}`);
          return { imageUrl: null, error: `API error: ${response.status}` };
        }

        const data = (await response.json()) as FreepikSearchResponse;

        const first = data.data?.[0];
        const bestImage =
          first?.image?.source?.url ||
          first?.assets?.image?.url ||
          first?.assets?.preview?.url ||
          first?.thumbnail?.url ||
          first?.url ||
          null;

        if (bestImage) {
          console.log(`[PlantAPI] ✓ Found image for ${input.plantName}`);
          return { imageUrl: bestImage };
        }

        return { imageUrl: null };
      } catch (error: any) {
        console.error(`[PlantAPI] Error searching image:`, error?.message);
        return { imageUrl: null, error: error?.message || "Unknown error" };
      }
    }),

  editImage: rateLimitedProcedure
    .input(z.object({
      prompt: z.string(),
      imageBase64: z.string(),
      aspectRatio: z.string().optional().default("1:1"),
    }))
    .mutation(async ({ input, ctx }) => {
      console.log(`[PlantAPI] Device ${ctx.deviceId} editing image`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log("[PlantAPI] Image edit timeout after 90s");
          controller.abort();
        }, 90000);

        const toolkitUrl = process.env.EXPO_PUBLIC_TOOLKIT_URL || "https://toolkit.rork.com";
        const editUrl = `${toolkitUrl}/images/edit/`;
        
        console.log(`[PlantAPI] Calling image edit API: ${editUrl}`);
        
        const response = await fetch(editUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: input.prompt,
            images: [{ type: "image", image: input.imageBase64 }],
            aspectRatio: input.aspectRatio,
            quality: "high",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type") || "";
        console.log(`[PlantAPI] Response status: ${response.status}, content-type: ${contentType}`);
        
        let responseText = "";
        try {
          responseText = await response.text();
        } catch (textError: any) {
          console.error(`[PlantAPI] Failed to read response text:`, textError?.message);
          return { 
            success: false, 
            error: "Failed to read server response",
            imageBase64: null 
          };
        }
        
        if (!response.ok) {
          console.error(`[PlantAPI] Image edit API error ${response.status}:`, responseText.substring(0, 300));
          return { 
            success: false, 
            error: `API error: ${response.status}`,
            imageBase64: null 
          };
        }

        if (!contentType.includes("application/json")) {
          console.error(`[PlantAPI] Unexpected content-type: ${contentType}`);
          console.error(`[PlantAPI] Response preview:`, responseText.substring(0, 300));
          return { 
            success: false, 
            error: "Invalid response format from server",
            imageBase64: null 
          };
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError: any) {
          console.error(`[PlantAPI] JSON parse error:`, parseError?.message);
          console.error(`[PlantAPI] Response was:`, responseText.substring(0, 300));
          return { 
            success: false, 
            error: "Failed to parse server response",
            imageBase64: null 
          };
        }

        if (!data.image || !data.image.base64Data) {
          console.error(`[PlantAPI] Missing image data in response:`, JSON.stringify(data).substring(0, 200));
          return { 
            success: false, 
            error: "Response does not contain valid image data",
            imageBase64: null 
          };
        }

        console.log(`[PlantAPI] ✓ Image edited successfully`);
        return { 
          success: true, 
          imageBase64: data.image.base64Data,
          mimeType: data.image.mimeType,
        };
      } catch (error: any) {
        console.error(`[PlantAPI] Error editing image:`, error?.message);
        return { 
          success: false, 
          error: error?.name === "AbortError" ? "Request timeout" : (error?.message || "Unknown error"),
          imageBase64: null 
        };
      }
    }),

  healthCheck: rateLimitedProcedure
    .query(({ ctx }) => {
      return { 
        status: "ok", 
        deviceId: ctx.deviceId,
        timestamp: new Date().toISOString(),
      };
    }),
});
