
// API Service Layer for AuraScan AI
// Comprehensive REST API client with token management and auto-redirect on 401

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.aurascan.ai/v1';

// Token Management
const TOKEN_KEY = 'aurascan_auth_token';

const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Base fetch with auth and error handling
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Auto-redirect on 401
  if (response.status === 401) {
    clearToken();
    localStorage.removeItem('aurascan_authenticated');
    window.location.reload();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string, name: string) =>
    apiFetch<{ token: string; user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  socialLogin: (provider: string, token: string) =>
    apiFetch<{ token: string; user: any }>('/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider, token }),
    }),

  biometricVerify: (userId: string, signature: string) =>
    apiFetch<{ token: string }>('/auth/biometric', {
      method: 'POST',
      body: JSON.stringify({ userId, signature }),
    }),

  logout: () => apiFetch('/auth/logout', { method: 'POST' }),

  refreshToken: () => apiFetch<{ token: string }>('/auth/refresh', { method: 'POST' }),

  setToken,
};

// User API
export const userApi = {
  getProfile: () => apiFetch<any>('/user/profile'),

  updateProfile: (data: Partial<any>) =>
    apiFetch<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getHealthProfile: () => apiFetch<any>('/user/health-profile'),

  updateHealthProfile: (data: any) =>
    apiFetch<any>('/user/health-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getPreferences: () => apiFetch<any>('/user/preferences'),

  updatePreferences: (data: any) =>
    apiFetch<any>('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateTheme: (theme: any) =>
    apiFetch<any>('/user/theme', {
      method: 'PUT',
      body: JSON.stringify(theme),
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiFetch('/user/password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  setup2FA: () => apiFetch<{ qrCode: string; secret: string }>('/user/2fa/setup', { method: 'POST' }),

  getDevices: () => apiFetch<any[]>('/user/devices'),

  logoutAll: () => apiFetch('/user/logout-all', { method: 'POST' }),

  updateAllergenProfile: (allergens: string[]) =>
    apiFetch('/user/allergens', {
      method: 'PUT',
      body: JSON.stringify({ allergens }),
    }),

  exportData: () => apiFetch<Blob>('/user/export', { method: 'POST' }),

  deleteAccount: () => apiFetch('/user/delete', { method: 'DELETE' }),
};

// Scan API
export const scanApi = {
  sendFrame: (frameData: string, confidence: number) =>
    apiFetch('/scan/frame', {
      method: 'POST',
      body: JSON.stringify({ frameData, confidence }),
    }),

  getConfidence: (scanId: string) => apiFetch<{ confidence: number }>(`/scan/${scanId}/confidence`),

  addToBatchQueue: (scanId: string) =>
    apiFetch('/scan/batch/add', {
      method: 'POST',
      body: JSON.stringify({ scanId }),
    }),

  getBatchStatus: (batchId: string) => apiFetch<any>(`/scan/batch/${batchId}`),

  cancelScan: (scanId: string) =>
    apiFetch(`/scan/${scanId}/cancel`, { method: 'POST' }),
};

// Analysis API
export const analysisApi = {
  analyzeProduct: (imageData: string, options?: any) =>
    apiFetch<any>('/analysis/analyze', {
      method: 'POST',
      body: JSON.stringify({ imageData, options }),
    }),

  getProgress: (analysisId: string) => apiFetch<{ progress: number; stage: string }>(`/analysis/${analysisId}/progress`),

  cancel: (analysisId: string) =>
    apiFetch(`/analysis/${analysisId}/cancel`, { method: 'POST' }),
};

// Results API
export const resultsApi = {
  get: (resultId: string) => apiFetch<any>(`/results/${resultId}`),

  save: (resultId: string) =>
    apiFetch(`/results/${resultId}/save`, { method: 'POST' }),

  share: (resultId: string) =>
    apiFetch<{ shareLink: string }>(`/results/${resultId}/share`, { method: 'POST' }),

  exportPdf: (resultId: string) =>
    apiFetch<Blob>(`/results/${resultId}/export/pdf`, { method: 'POST' }),

  saveNotes: (resultId: string, notes: string) =>
    apiFetch(`/results/${resultId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    }),
};

// Ingredients API
export const ingredientsApi = {
  get: (ingredientId: string) => apiFetch<any>(`/ingredients/${ingredientId}`),

  search: (query: string) =>
    apiFetch<any[]>(`/ingredients/search?q=${encodeURIComponent(query)}`),

  getSubstitutes: (ingredientId: string) =>
    apiFetch<any[]>(`/ingredients/${ingredientId}/substitutes`),

  getCommunityInsights: (ingredientId: string) =>
    apiFetch<any[]>(`/ingredients/${ingredientId}/community`),
};

// Comparison API
export const comparisonApi = {
  getProducts: (productIds: string[]) =>
    apiFetch<any[]>(`/comparison/products?ids=${productIds.join(',')}`),

  create: (productIds: string[], name?: string) =>
    apiFetch<{ id: string }>('/comparison/create', {
      method: 'POST',
      body: JSON.stringify({ productIds, name }),
    }),

  get: (comparisonId: string) => apiFetch<any>(`/comparison/${comparisonId}`),

  update: (comparisonId: string, data: any) =>
    apiFetch(`/comparison/${comparisonId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  export: (comparisonId: string, format: 'pdf' | 'csv') =>
    apiFetch<Blob>(`/comparison/${comparisonId}/export?format=${format}`, { method: 'POST' }),

  getRecommendation: (productIds: string[]) =>
    apiFetch<{ recommended: string; reasoning: string }>('/comparison/recommend', {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    }),

  getPriceAnalysis: (productIds: string[]) =>
    apiFetch<any>('/comparison/price-analysis', {
      method: 'POST',
      body: JSON.stringify({ productIds }),
    }),
};

// History API
export const historyApi = {
  getScans: (page = 1, perPage = 20) =>
    apiFetch<any>(`/history/scans?page=${page}&perPage=${perPage}`),

  getFavorites: () => apiFetch<any[]>('/history/favorites'),

  export: (format: 'pdf' | 'csv' | 'json') =>
    apiFetch<Blob>(`/history/export?format=${format}`, { method: 'POST' }),

  getRecommendations: () => apiFetch<any[]>('/history/recommendations'),

  updateSyncStatus: (scanId: string, synced: boolean) =>
    apiFetch(`/history/sync/${scanId}`, {
      method: 'PUT',
      body: JSON.stringify({ synced }),
    }),

  deleteScan: (scanId: string) =>
    apiFetch(`/history/scans/${scanId}`, { method: 'DELETE' }),
};

// Analytics API
export const analyticsApi = {
  getTrends: (period: 'week' | 'month' | 'year') =>
    apiFetch<any>(`/analytics/trends?period=${period}`),

  getHealthInsights: () => apiFetch<any[]>('/analytics/health-insights'),

  getSustainability: () => apiFetch<any>('/analytics/sustainability'),

  getSpending: (period: 'week' | 'month' | 'year') =>
    apiFetch<any>(`/analytics/spending?period=${period}`),

  getRecommendations: () => apiFetch<any[]>('/analytics/recommendations'),

  getBenchmarking: () => apiFetch<any>('/analytics/benchmarking'),

  export: (format: 'pdf' | 'csv') =>
    apiFetch<Blob>(`/analytics/export?format=${format}`, { method: 'POST' }),

  updateWatchlist: (ingredients: string[]) =>
    apiFetch('/analytics/watchlist', {
      method: 'PUT',
      body: JSON.stringify({ ingredients }),
    }),
};

// Tracking API
export const trackingApi = {
  addProduct: (productId: string) =>
    apiFetch<{ trackingId: string }>('/tracking/add-product', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  updateAlerts: (trackingId: string, alerts: any) =>
    apiFetch(`/tracking/${trackingId}/alerts`, {
      method: 'PUT',
      body: JSON.stringify({ alerts }),
    }),

  getPriceHistory: (productId: string) =>
    apiFetch<any[]>(`/tracking/${productId}/price-history`),

  getReformulations: (productId: string) =>
    apiFetch<any[]>(`/tracking/${productId}/reformulations`),

  getAvailability: (productId: string) =>
    apiFetch<any>(`/tracking/${productId}/availability`),
};

// Allergen Scanner API
export const allergenScannerApi = {
  search: (allergens: string[], mode: 'free-from' | 'contains') =>
    apiFetch<any[]>('/allergen-scanner/search', {
      method: 'POST',
      body: JSON.stringify({ allergens, mode }),
    }),

  saveSearch: (name: string, allergens: string[], mode: string) =>
    apiFetch('/allergen-scanner/saved-searches', {
      method: 'POST',
      body: JSON.stringify({ name, allergens, mode }),
    }),

  setAlert: (allergens: string[]) =>
    apiFetch('/allergen-scanner/alerts', {
      method: 'POST',
      body: JSON.stringify({ allergens }),
    }),
};

// Sustainability API
export const sustainabilityApi = {
  getCarbonFootprint: (productId: string) =>
    apiFetch<any>(`/sustainability/carbon-footprint/${productId}`),

  getAlternatives: (productId: string) =>
    apiFetch<any[]>(`/sustainability/alternatives/${productId}`),

  getCertifications: (productId: string) =>
    apiFetch<any[]>(`/sustainability/certifications/${productId}`),

  getPersonalImpact: () => apiFetch<any>('/sustainability/personal-impact'),
};

// Export API
export const exportApi = {
  generateReport: (config: any) =>
    apiFetch<Blob>('/export/generate-report', {
      method: 'POST',
      body: JSON.stringify(config),
    }),

  createShareLink: (dataType: string, itemIds: string[], expiryDays = 7) =>
    apiFetch<{ link: string; expiresAt: string }>('/export/share-link', {
      method: 'POST',
      body: JSON.stringify({ dataType, itemIds, expiryDays }),
    }),

  emailReport: (email: string, config: any) =>
    apiFetch('/export/email', {
      method: 'POST',
      body: JSON.stringify({ email, config }),
    }),

  schedule: (frequency: 'daily' | 'weekly' | 'monthly', email: string, config: any) =>
    apiFetch('/export/schedule', {
      method: 'POST',
      body: JSON.stringify({ frequency, email, config }),
    }),
};

// Menu API
export const menuApi = {
  getItems: () => apiFetch<any[]>('/menu/items'),

  saveCustomOrder: (order: string[]) =>
    apiFetch('/menu/custom-order', {
      method: 'PUT',
      body: JSON.stringify({ order }),
    }),
};
