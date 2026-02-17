
import React, { useState, useEffect, useCallback } from 'react';
import { ThemeMode, AnimationIntensity, AppState, ProductAnalysis, UserProfile } from './types';
import { DEFAULT_USER_PROFILE } from './constants';
import { ThemeWrapper } from './components/ThemeWrapper';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { Home } from './views/Home';
import { Onboarding } from './views/Onboarding';
import { Scan } from './views/Scan';
import { Processing } from './views/Processing';
import { Results } from './views/Results';
import { ToolsHub } from './views/ToolsHub';
import { Settings } from './views/Settings';
import { History } from './views/History';
import { DeepDive } from './views/DeepDive';
import { Comparison } from './views/Comparison';
import { Analytics } from './views/Analytics';

export type Screen = 
  | 'onboarding' 
  | 'home' 
  | 'scan' 
  | 'processing' 
  | 'results' 
  | 'tools' 
  | 'settings' 
  | 'history' 
  | 'deep-dive' 
  | 'comparison'
  | 'analytics';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('aurascan_state');
    if (saved) return JSON.parse(saved);
    return {
      user: DEFAULT_USER_PROFILE,
      history: [],
      favorites: [],
      currentAnalysis: null,
      onboarded: false
    };
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>(state.onboarded ? 'home' : 'onboarding');
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);

  useEffect(() => {
    localStorage.setItem('aurascan_state', JSON.stringify(state));
  }, [state]);

  const navigate = useCallback((screen: Screen) => {
    setPrevScreen(currentScreen);
    setCurrentScreen(screen);
  }, [currentScreen]);

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, user: profile }));
  };

  const handleAnalysisComplete = (analysis: ProductAnalysis) => {
    setState(prev => ({
      ...prev,
      history: [analysis, ...prev.history].slice(0, 50),
      currentAnalysis: analysis
    }));
    navigate('results');
  };

  const toggleFavorite = (id: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(id) 
        ? prev.favorites.filter(f => f !== id)
        : [...prev.favorites, id]
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onComplete={() => { setState(p => ({...p, onboarded: true})); navigate('home'); }} updateProfile={updateProfile} user={state.user} />;
      case 'home':
        return <Home navigate={navigate} user={state.user} recentHistory={state.history.slice(0, 3)} />;
      case 'scan':
        return <Scan onBack={() => navigate('home')} onScanStart={() => navigate('processing')} onAnalysisComplete={handleAnalysisComplete} user={state.user} />;
      case 'processing':
        return <Processing onCancel={() => navigate('scan')} />;
      case 'results':
        return <Results analysis={state.currentAnalysis} onBack={() => navigate('home')} onDeepDive={() => navigate('deep-dive')} onCompare={() => navigate('comparison')} isFavorite={state.favorites.includes(state.currentAnalysis?.id || '')} toggleFavorite={() => state.currentAnalysis && toggleFavorite(state.currentAnalysis.id)} />;
      case 'tools':
        return <ToolsHub navigate={navigate} onBack={() => navigate('home')} />;
      case 'settings':
        return <Settings user={state.user} updateProfile={updateProfile} onBack={() => navigate('home')} />;
      case 'history':
        return <History history={state.history} favorites={state.favorites} toggleFavorite={toggleFavorite} onBack={() => navigate('home')} onSelect={(a) => { setState(p => ({...p, currentAnalysis: a})); navigate('results'); }} />;
      case 'deep-dive':
        return <DeepDive analysis={state.currentAnalysis} onBack={() => navigate('results')} />;
      case 'comparison':
        return <Comparison products={state.history} initialId={state.currentAnalysis?.id} onBack={() => navigate('results')} />;
      case 'analytics':
        return <Analytics history={state.history} onBack={() => navigate('tools')} />;
      default:
        return <Home navigate={navigate} user={state.user} />;
    }
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <ThemeWrapper user={state.user}>
          {renderScreen()}
        </ThemeWrapper>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
