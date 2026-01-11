import * as z from "zod";
import { createTRPCRouter, rateLimitedProcedure } from "../create-context";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY || "";
const FREEPIK_API_URL = "https://api.freepik.com/v1/resources";

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
        const searchTerm = `${input.plantName} plant`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(
          `${FREEPIK_API_URL}?term=${encodeURIComponent(searchTerm)}&page=1&limit=1&filters[content_type][photo]=1`,
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

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          const imageUrl = data.data[0].image?.source?.url || data.data[0].thumbnail?.url;
          console.log(`[PlantAPI] ✓ Found image for ${input.plantName}`);
          return { imageUrl };
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

        const response = await fetch("https://toolkit.rork.com/images/edit/", {
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

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          console.error(`[PlantAPI] Image edit API error ${response.status}:`, errorText);
          return { 
            success: false, 
            error: `API error: ${response.status}`,
            imageBase64: null 
          };
        }

        const data = await response.json();

        if (!data.image || !data.image.base64Data) {
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
