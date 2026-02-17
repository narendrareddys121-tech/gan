
import { GoogleGenAI, Type } from "@google/genai";
import { ProductAnalysis } from "../types";

// Always initialize with an object containing the apiKey directly from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    brand: { type: Type.STRING },
    category: { type: Type.STRING },
    snapshot: {
      type: Type.OBJECT,
      properties: {
        nutritionalSummary: { type: Type.STRING },
        certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["nutritionalSummary", "certifications"]
    },
    benefits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          icon: { type: Type.STRING }
        },
        required: ["title", "description", "icon"]
      }
    },
    considerations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          severity: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "severity", "description"]
      }
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          role: { type: Type.STRING },
          isAllergen: { type: Type.BOOLEAN },
          source: { type: Type.STRING },
          safetyProfile: { type: Type.STRING }
        },
        required: ["name", "role", "isAllergen", "source"]
      }
    },
    qualityInsights: {
      type: Type.OBJECT,
      properties: {
        sourcing: { type: Type.STRING },
        sustainabilityScore: { type: Type.NUMBER },
        notes: { type: Type.STRING }
      },
      required: ["sourcing", "sustainabilityScore"]
    },
    cautionIndicators: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          message: { type: Type.STRING },
          severity: { type: Type.STRING }
        },
        required: ["type", "message", "severity"]
      }
    },
    smartVerdict: {
      type: Type.OBJECT,
      properties: {
        recommendation: { type: Type.STRING },
        confidenceScore: { type: Type.NUMBER },
        reasoning: { type: Type.STRING }
      },
      required: ["recommendation", "confidenceScore", "reasoning"]
    },
    productScore: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.NUMBER },
        health: { type: Type.NUMBER },
        quality: { type: Type.NUMBER },
        sustainability: { type: Type.NUMBER },
        value: { type: Type.NUMBER }
      },
      required: ["overall", "health", "quality", "sustainability", "value"]
    }
  },
  required: ["name", "brand", "category", "snapshot", "benefits", "considerations", "ingredients", "qualityInsights", "cautionIndicators", "smartVerdict", "productScore"]
};

export async function analyzeProduct(imageData: string, userProfile?: any): Promise<ProductAnalysis> {
  try {
    // Upgraded to gemini-3-pro-preview for complex reasoning tasks like safety profiling and ingredient analysis.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { text: `Analyze this product packaging/label. The user has these allergens: ${userProfile?.allergens?.join(', ') || 'none'}. Provide a deep technical and health-focused analysis.` },
          { inlineData: { data: imageData.split(',')[1], mimeType: 'image/jpeg' } }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema
      }
    });

    // Access the .text property directly (do not call as a method).
    const text = response.text;
    if (!text) {
      throw new Error("Analysis failed: Empty response from AI model.");
    }

    const result = JSON.parse(text.trim());
    return {
      ...result,
      id: Math.random().toString(36).slice(2, 11),
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
}
