
import { GoogleGenAI, Type } from "@google/genai";
import { ProductAnalysis } from "../types";
import { ApiError, NetworkError, TimeoutError, ValidationError, ApiKeyError } from "./apiErrors";

// Validate API key on initialization
const API_KEY = process.env.API_KEY;
if (!API_KEY || API_KEY === 'undefined' || API_KEY === '') {
  console.error('GEMINI_API_KEY is not configured. Please set it in your .env file.');
}

// Always initialize with an object containing the apiKey directly from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: API_KEY || '' });

// Constants
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// In-memory cache for recent analyses
interface CacheEntry {
  result: ProductAnalysis;
  timestamp: number;
}

const analysisCache = new Map<string, CacheEntry>();

// Helper function to generate cache key from image data
function getCacheKey(imageData: string): string {
  // Use first 100 chars of base64 data as a simple hash
  return imageData.substring(0, 100);
}

// Helper function to clean expired cache entries
function cleanCache(): void {
  const now = Date.now();
  for (const [key, entry] of analysisCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      analysisCache.delete(key);
    }
  }
}

// Helper function to create timeout promise
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new TimeoutError(`Request timed out after ${ms}ms`)), ms);
  });
}

// Helper function for exponential backoff
function getRetryDelay(attempt: number): number {
  return RETRY_DELAY_BASE * Math.pow(2, attempt);
}

// Helper function to sleep
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

// Helper function to validate response schema
function validateProductAnalysis(data: any): data is Omit<ProductAnalysis, 'id' | 'timestamp'> {
  if (!data || typeof data !== 'object') return false;
  
  const required = ['name', 'brand', 'category', 'snapshot', 'benefits', 'considerations', 
                   'ingredients', 'qualityInsights', 'cautionIndicators', 'smartVerdict', 'productScore'];
  
  for (const field of required) {
    if (!(field in data)) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  // Validate nested structures
  if (!Array.isArray(data.benefits) || !Array.isArray(data.considerations) || 
      !Array.isArray(data.ingredients) || !Array.isArray(data.cautionIndicators)) {
    return false;
  }
  
  if (typeof data.productScore !== 'object' || 
      typeof data.productScore.overall !== 'number' ||
      typeof data.productScore.health !== 'number') {
    return false;
  }
  
  return true;
}

// Helper function to make API call with retry logic
async function makeApiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await Promise.race([
        apiCall(),
        createTimeout(REQUEST_TIMEOUT)
      ]);
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on non-retryable errors
      if (error instanceof ApiError && !error.retryable) {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt < retries - 1) {
        const delay = getRetryDelay(attempt);
        console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms...`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError || new NetworkError('Max retries exceeded');
}

export async function analyzeProduct(imageData: string, userProfile?: any): Promise<ProductAnalysis> {
  // Validate API key
  if (!API_KEY || API_KEY === '') {
    throw new ApiKeyError('Gemini API key is not configured');
  }
  
  // Check cache first
  cleanCache();
  const cacheKey = getCacheKey(imageData);
  const cached = analysisCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached analysis');
    return cached.result;
  }
  
  try {
    const result = await makeApiCallWithRetry(async () => {
      // Use gemini-1.5-pro for production stability (gemini-3-pro-preview may not be available)
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
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
        throw new ValidationError("Analysis failed: Empty response from AI model.");
      }

      const parsed = JSON.parse(text.trim());
      
      // Validate response
      if (!validateProductAnalysis(parsed)) {
        throw new ValidationError("Invalid response structure from AI model");
      }
      
      return parsed;
    });
    
    const analysis: ProductAnalysis = {
      ...result,
      id: Math.random().toString(36).slice(2, 11),
      timestamp: Date.now()
    };
    
    // Cache the result
    analysisCache.set(cacheKey, { result: analysis, timestamp: Date.now() });
    
    return analysis;
  } catch (error: any) {
    console.error("Analysis failed:", error);
    
    // Convert known errors to ApiError
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
      throw new TimeoutError();
    }
    
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      throw new NetworkError();
    }
    
    throw new ApiError(error.message || 'Analysis failed', 'UNKNOWN_ERROR', true);
  }
}

// Search product by name (text-based analysis)
export async function searchProductByName(productName: string, userProfile?: any): Promise<ProductAnalysis> {
  // Validate API key
  if (!API_KEY || API_KEY === '') {
    throw new ApiKeyError('Gemini API key is not configured');
  }
  
  try {
    const result = await makeApiCallWithRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: {
          parts: [
            { text: `Analyze the product "${productName}". The user has these allergens: ${userProfile?.allergens?.join(', ') || 'none'}. Provide a detailed health and quality analysis based on typical formulations of this product. If you don't have information, make reasonable estimates based on similar products.` }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema
        }
      });

      const text = response.text;
      if (!text) {
        throw new ValidationError("Analysis failed: Empty response from AI model.");
      }

      const parsed = JSON.parse(text.trim());
      
      if (!validateProductAnalysis(parsed)) {
        throw new ValidationError("Invalid response structure from AI model");
      }
      
      return parsed;
    });
    
    return {
      ...result,
      id: Math.random().toString(36).slice(2, 11),
      timestamp: Date.now()
    };
  } catch (error: any) {
    console.error("Search failed:", error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(error.message || 'Search failed', 'UNKNOWN_ERROR', true);
  }
}

// Batch analyze multiple images
export async function batchAnalyze(
  imageDataArray: string[], 
  userProfile?: any,
  onProgress?: (completed: number, total: number) => void
): Promise<ProductAnalysis[]> {
  // Validate API key
  if (!API_KEY || API_KEY === '') {
    throw new ApiKeyError('Gemini API key is not configured');
  }
  
  const results: ProductAnalysis[] = [];
  
  for (let i = 0; i < imageDataArray.length; i++) {
    try {
      const analysis = await analyzeProduct(imageDataArray[i], userProfile);
      results.push(analysis);
      
      if (onProgress) {
        onProgress(i + 1, imageDataArray.length);
      }
    } catch (error) {
      console.error(`Failed to analyze image ${i + 1}:`, error);
      // Continue with other images even if one fails
    }
  }
  
  return results;
}

// Compare two products using AI
export async function compareProducts(
  product1: ProductAnalysis, 
  product2: ProductAnalysis
): Promise<{
  summary: string;
  winner: 'product1' | 'product2' | 'tie';
  healthComparison: string;
  qualityComparison: string;
  sustainabilityComparison: string;
  recommendation: string;
}> {
  // Validate API key
  if (!API_KEY || API_KEY === '') {
    throw new ApiKeyError('Gemini API key is not configured');
  }
  
  const comparisonSchema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      winner: { type: Type.STRING },
      healthComparison: { type: Type.STRING },
      qualityComparison: { type: Type.STRING },
      sustainabilityComparison: { type: Type.STRING },
      recommendation: { type: Type.STRING }
    },
    required: ["summary", "winner", "healthComparison", "qualityComparison", "sustainabilityComparison", "recommendation"]
  };
  
  try {
    const result = await makeApiCallWithRetry(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: {
          parts: [
            { 
              text: `Compare these two products and provide a detailed comparison:
              
Product 1: ${product1.name} by ${product1.brand}
- Health Score: ${product1.productScore.health}
- Quality Score: ${product1.productScore.quality}
- Sustainability Score: ${product1.productScore.sustainability}
- Ingredients: ${product1.ingredients.length} total, ${product1.ingredients.filter(i => i.isAllergen).length} allergens
- Smart Verdict: ${product1.smartVerdict.recommendation}

Product 2: ${product2.name} by ${product2.brand}
- Health Score: ${product2.productScore.health}
- Quality Score: ${product2.productScore.quality}
- Sustainability Score: ${product2.productScore.sustainability}
- Ingredients: ${product2.ingredients.length} total, ${product2.ingredients.filter(i => i.isAllergen).length} allergens
- Smart Verdict: ${product2.smartVerdict.recommendation}

Provide a comparison with:
- summary: Overall comparison summary (2-3 sentences)
- winner: Which product is better overall? ('product1', 'product2', or 'tie')
- healthComparison: Detailed health comparison
- qualityComparison: Detailed quality comparison
- sustainabilityComparison: Detailed sustainability comparison
- recommendation: Final recommendation for consumers` 
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: comparisonSchema
        }
      });

      const text = response.text;
      if (!text) {
        throw new ValidationError("Comparison failed: Empty response from AI model.");
      }

      return JSON.parse(text.trim());
    });
    
    return result;
  } catch (error: any) {
    console.error("Comparison failed:", error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(error.message || 'Comparison failed', 'UNKNOWN_ERROR', true);
  }
}
