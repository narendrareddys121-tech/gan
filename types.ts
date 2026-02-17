
export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum AnimationIntensity {
  MINIMAL = 'minimal',
  MODERATE = 'moderate',
  FULL = 'full'
}

export interface UserProfile {
  allergens: string[];
  dietaryRestrictions: string[];
  theme: {
    mode: ThemeMode;
    accentColor: string;
    animationIntensity: AnimationIntensity;
    fontSize: number;
  };
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

export interface AppState {
  user: UserProfile;
  history: ProductAnalysis[];
  favorites: string[]; // list of product IDs
  currentAnalysis: ProductAnalysis | null;
  onboarded: boolean;
}
