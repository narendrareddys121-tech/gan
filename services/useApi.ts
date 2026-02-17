
import { useState, useCallback, useRef } from 'react';
import { ProductAnalysis } from '../types';
import { analyzeProduct, searchProductByName } from './geminiService';
import { ApiError } from './apiErrors';

interface UseAnalysisResult {
  analyze: (imageData: string, userProfile?: any) => Promise<ProductAnalysis | null>;
  searchByName: (productName: string, userProfile?: any) => Promise<ProductAnalysis | null>;
  isLoading: boolean;
  error: ApiError | null;
  result: ProductAnalysis | null;
  retry: () => Promise<ProductAnalysis | null>;
  cancel: () => void;
  clearError: () => void;
}

export function useAnalysis(): UseAnalysisResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<ProductAnalysis | null>(null);
  
  // Store last call parameters for retry
  const lastCallRef = useRef<{
    type: 'analyze' | 'search';
    imageData?: string;
    productName?: string;
    userProfile?: any;
  } | null>(null);
  
  // AbortController for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (imageData: string, userProfile?: any): Promise<ProductAnalysis | null> => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    // Store for retry
    lastCallRef.current = { type: 'analyze', imageData, userProfile };
    
    try {
      const analysis = await analyzeProduct(imageData, userProfile);
      
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }
      
      setResult(analysis);
      setIsLoading(false);
      return analysis;
    } catch (err: any) {
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }
      
      const apiError = err instanceof ApiError ? err : new ApiError(err.message || 'Analysis failed', 'UNKNOWN_ERROR');
      setError(apiError);
      setIsLoading(false);
      return null;
    }
  }, []);

  const searchByName = useCallback(async (productName: string, userProfile?: any): Promise<ProductAnalysis | null> => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    // Store for retry
    lastCallRef.current = { type: 'search', productName, userProfile };
    
    try {
      const analysis = await searchProductByName(productName, userProfile);
      
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }
      
      setResult(analysis);
      setIsLoading(false);
      return analysis;
    } catch (err: any) {
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return null;
      }
      
      const apiError = err instanceof ApiError ? err : new ApiError(err.message || 'Search failed', 'UNKNOWN_ERROR');
      setError(apiError);
      setIsLoading(false);
      return null;
    }
  }, []);

  const retry = useCallback(async (): Promise<ProductAnalysis | null> => {
    if (!lastCallRef.current) {
      return null;
    }
    
    const { type, imageData, productName, userProfile } = lastCallRef.current;
    
    if (type === 'analyze' && imageData) {
      return analyze(imageData, userProfile);
    } else if (type === 'search' && productName) {
      return searchByName(productName, userProfile);
    }
    
    return null;
  }, [analyze, searchByName]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analyze,
    searchByName,
    isLoading,
    error,
    result,
    retry,
    cancel,
    clearError
  };
}
