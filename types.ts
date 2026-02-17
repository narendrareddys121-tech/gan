
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum AnimationIntensity {
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  FULL = 'full'
}

export interface ThemePreferences {
  mode: ThemeMode;
  accentColor: string;
  animationIntensity: AnimationIntensity;
  fontSize: number;
  colorBlindnessMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  highContrast?: boolean;
  reducedMotion?: boolean;
}

export interface UserProfile {
  allergens: string[];
  dietaryRestrictions: string[];
  theme: ThemePreferences;
  expertMode: boolean;
}

export interface ProductAnalysis {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  barcode?: string;
  timestamp: number;
  snapshot: {
    nutritionalSummary: string;
    certifications: string[];
  };
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  considerations: {
    title: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  ingredients: {
    name: string;
    scientificName?: string;
    role: string;
    isAllergen: boolean;
    source: 'natural' | 'synthetic';
    safetyProfile: string;
  }[];
  qualityInsights: {
    sourcing: string;
    sustainabilityScore: number;
    notes: string;
  };
  cautionIndicators: {
    type: string;
    message: string;
    severity: 'warning' | 'alert';
  }[];
  smartVerdict: {
    recommendation: string;
    confidenceScore: number;
    reasoning: string;
  };
  productScore: {
    overall: number;
    health: number;
    quality: number;
    sustainability: number;
    value: number;
  };
}

export interface SavedComparison {
  id: string;
  name: string;
  productIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TrackedProduct {
  productId: string;
  productName: string;
  brand: string;
  alerts: {
    priceThreshold?: number;
    reformulationAlert: boolean;
    availabilityAlert: boolean;
  };
  priceHistory: { date: number; price: number }[];
  reformulations: { date: number; changes: string[] }[];
  addedAt: number;
}

export interface AnalyticsTrend {
  period: string;
  categories: { name: string; count: number }[];
  brands: { name: string; count: number }[];
  scanFrequency: { date: string; count: number }[];
}

export interface HealthInsight {
  type: 'recommendation' | 'warning' | 'achievement' | 'info';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  data?: any;
}

export interface WatchlistIngredient {
  name: string;
  frequency: number;
  lastEncountered?: number;
  alertEnabled: boolean;
}

export interface BatchReport {
  id: string;
  products: ProductAnalysis[];
  commonIngredients: string[];
  averageScores: {
    health: number;
    quality: number;
    sustainability: number;
    value: number;
  };
  priceRange: { min: number; max: number };
  generatedAt: number;
}

export interface ExportConfig {
  dateRange: { start: number; end: number };
  dataTypes: ('scans' | 'comparisons' | 'analytics')[];
  format: 'pdf' | 'csv' | 'json';
  sections: {
    summary: boolean;
    detailedAnalysis: boolean;
    recommendations: boolean;
  };
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    email: string;
  };
}

export interface AppState {
  user: UserProfile;
  history: ProductAnalysis[];
  favorites: string[]; // list of product IDs
  currentAnalysis: ProductAnalysis | null;
  onboarded: boolean;
  savedComparisons: SavedComparison[];
  trackedProducts: TrackedProduct[];
  watchlistIngredients: WatchlistIngredient[];
}
