
import React from 'react';
import { ThemeMode, AnimationIntensity, UserProfile } from './types';

export const ACCENT_COLORS = [
  { name: 'Electric Blue', value: '#0066FF' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Cyan', value: '#00D9FF' },
  { name: 'Sunset', value: '#FF9500' },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  allergens: [],
  dietaryRestrictions: [],
  theme: {
    mode: ThemeMode.DARK,
    accentColor: '#0066FF',
    animationIntensity: AnimationIntensity.FULL,
    fontSize: 16,
  },
  expertMode: false,
};

export const ALLERGENS = [
  'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts', 'Wheat', 'Soybeans', 'Sesame', 'Gluten'
];

export const DIETARY_PREFS = [
  'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Organic Only', 'Non-GMO', 'Low Sugar'
];

export const MOCK_RECENT_SCANS = [
  { id: '1', name: 'Oat Milk', brand: 'Oatly', timestamp: Date.now() - 1000 * 60 * 60 },
  { id: '2', name: 'Almond Butter', brand: 'Justin\'s', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
];
