import * as z from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createTRPCRouter, rateLimitedProcedure } from "../create-context";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY || "";
const FREEPIK_API_URL = "https://api.freepik.com/v1/resources";

// Model IDs
const GEMINI_2_5_FLASH = "gemini-2.5-flash"; // For plant identification
const NANO_BANANA = "gemini-2.5-flash-preview-image-05-20"; // For image decoration

// Initialize Google Generative AI
const genAI = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;

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

  // Plant identification using Gemini 2.5 Flash
  identifyPlant: rateLimitedProcedure
    .input(z.object({
      imageBase64: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      console.log(`[PlantAPI] Device ${ctx.deviceId} identifying plant`);

      if (!genAI) {
        console.error("[PlantAPI] GOOGLE_API_KEY not configured");
        return {
          success: false,
          error: "API not configured",
          plant: null
        };
      }

      try {
        const model = genAI.getGenerativeModel({ model: GEMINI_2_5_FLASH });

        const prompt = `Analyze this image and identify the plant. Provide a JSON response with the following structure:
{
  "name": "Common name of the plant",
  "scientificName": "Scientific/botanical name",
  "confidence": "high/medium/low",
  "description": "Brief description of the plant",
  "careLevel": "easy/medium/hard",
  "wateringFrequency": "Description of watering needs",
  "lightRequirements": "Description of light needs",
  "toxicity": "Information about toxicity to pets/humans if applicable",
  "funFact": "An interesting fact about this plant"
}

If no plant is detected in the image, return:
{
  "name": null,
  "error": "No plant detected in the image"
}

Only respond with valid JSON, no additional text.`;

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: input.imageBase64,
            },
          },
        ]);

        const response = result.response;
        const text = response.text();

        // Parse the JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error("[PlantAPI] Failed to parse plant identification response");
          return {
            success: false,
            error: "Failed to parse response",
            plant: null
          };
        }

        const plantData = JSON.parse(jsonMatch[0]);

        if (plantData.error || !plantData.name) {
          console.log(`[PlantAPI] No plant detected: ${plantData.error}`);
          return {
            success: false,
            error: plantData.error || "No plant detected",
            plant: null
          };
        }

        console.log(`[PlantAPI] ✓ Identified plant: ${plantData.name}`);
        return {
          success: true,
          plant: plantData
        };
      } catch (error: any) {
        console.error(`[PlantAPI] Error identifying plant:`, error?.message);
        return {
          success: false,
          error: error?.message || "Unknown error",
          plant: null
        };
      }
    }),

  // Image decoration using Nano Banana (Gemini 2.5 Flash Image)
  decorateImage: rateLimitedProcedure
    .input(z.object({
      imageBase64: z.string(),
      prompt: z.string(),
      style: z.string().optional().default("natural"),
    }))
    .mutation(async ({ input, ctx }) => {
      console.log(`[PlantAPI] Device ${ctx.deviceId} decorating image with Nano Banana`);

      if (!genAI) {
        console.error("[PlantAPI] GOOGLE_API_KEY not configured");
        return {
          success: false,
          error: "API not configured",
          imageBase64: null
        };
      }

      try {
        const model = genAI.getGenerativeModel({
          model: NANO_BANANA,
          generationConfig: {
            responseModalities: ["image", "text"],
          } as any,
        });

        const decorationPrompt = `${input.prompt}. Style: ${input.style}. Keep the plant as the main focus and enhance the image beautifully.`;

        const result = await model.generateContent([
          decorationPrompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: input.imageBase64,
            },
          },
        ]);

        const response = result.response;
        const candidates = response.candidates;

        if (!candidates || candidates.length === 0) {
          console.error("[PlantAPI] No candidates in Nano Banana response");
          return {
            success: false,
            error: "No image generated",
            imageBase64: null
          };
        }

        // Find the image part in the response
        const parts = candidates[0].content?.parts || [];
        const imagePart = parts.find((part: any) => part.inlineData?.mimeType?.startsWith("image/"));

        if (!imagePart || !imagePart.inlineData) {
          console.error("[PlantAPI] No image in Nano Banana response");
          return {
            success: false,
            error: "No image in response",
            imageBase64: null
          };
        }

        console.log(`[PlantAPI] ✓ Image decorated successfully with Nano Banana`);
        return {
          success: true,
          imageBase64: imagePart.inlineData.data,
          mimeType: imagePart.inlineData.mimeType,
        };
      } catch (error: any) {
        console.error(`[PlantAPI] Error decorating image:`, error?.message);
        return {
          success: false,
          error: error?.message || "Unknown error",
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
        models: {
          plantIdentification: GEMINI_2_5_FLASH,
          imageDecoration: NANO_BANANA,
        },
      };
    }),
});
