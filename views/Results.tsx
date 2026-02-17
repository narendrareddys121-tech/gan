
import React, { useState, useEffect } from 'react';
import { LucideChevronLeft, LucideStar, LucideCheckCircle2, LucideAlertTriangle, LucideInfo, LucideShare2, LucideLayoutList, LucideDownload, LucideFileText, LucideShield, LucideLeaf } from 'lucide-react';
import { ProductAnalysis } from '../types';

interface ResultsProps {
  analysis: ProductAnalysis | null;
  onBack: () => void;
  onDeepDive: () => void;
  onCompare: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

// Animated Score Component
const AnimatedScore: React.FC<{ value: number; delay?: number }> = ({ value, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const increment = value / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  const scoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-500';
    if (val >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className={`text-5xl font-black ${scoreColor(value)} animate-count-up`}>
      {displayValue}
    </div>
  );
};

export const Results: React.FC<ResultsProps> = ({ analysis, onBack, onDeepDive, onCompare, isFavorite, toggleFavorite }) => {
  if (!analysis) return null;

  const scoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-500';
    if (val >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const scoreBgColor = (val: number) => {
    if (val >= 80) return 'from-emerald-500/10 to-emerald-600/5';
    if (val >= 60) return 'from-amber-500/10 to-amber-600/5';
    return 'from-red-500/10 to-red-600/5';
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 p-6 flex justify-between items-center bg-inherit/95 backdrop-blur-xl border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95">
          <LucideChevronLeft />
        </button>
        <div className="flex gap-2">
          <button onClick={toggleFavorite} className="p-2 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95">
            <LucideStar size={22} className={`transition-all ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-95">
            <LucideShare2 size={22} />
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6 pt-6">
        {/* 1. Product Snapshot */}
        <section className="bg-white/5 border border-white/5 rounded-[32px] p-6 flex items-start gap-5 animate-fade-in-up shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center text-xs opacity-30 font-bold border border-white/10">
            IMG
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">{analysis.brand}</p>
            <h1 className="text-xl font-bold leading-tight mb-2">{analysis.name}</h1>
            {analysis.barcode && (
              <p className="text-[10px] font-mono opacity-30 mb-2">UPC: {analysis.barcode}</p>
            )}
            <p className="text-xs opacity-60 mb-3">{analysis.snapshot.nutritionalSummary}</p>
            <div className="flex flex-wrap gap-2">
              {analysis.snapshot.certifications.map((c, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase tracking-tight text-emerald-400"
                >
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Benefits */}
        <section className="space-y-4 animate-fade-in-up stagger-1">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 ml-2 flex items-center gap-2">
            <LucideCheckCircle2 size={14} />
            Key Benefits
          </h3>
          <div className="space-y-3">
            {analysis.benefits.map((b, i) => (
              <div 
                key={i} 
                className="flex gap-4 items-start p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mt-1 p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30">
                  <LucideCheckCircle2 size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">{b.title}</h4>
                  <p className="text-xs opacity-60 leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Considerations */}
        {analysis.considerations.length > 0 && (
          <section className="space-y-4 animate-fade-in-up stagger-2">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 ml-2 flex items-center gap-2">
              <LucideAlertTriangle size={14} />
              Considerations
            </h3>
            <div className="space-y-3">
              {analysis.considerations.map((c, i) => (
                <div 
                  key={i} 
                  className={`flex gap-4 items-start p-5 rounded-2xl border transition-all animate-fade-in-up ${
                    c.severity === 'high' 
                      ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10' 
                      : 'bg-amber-500/5 border-amber-500/10 hover:bg-amber-500/10'
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`mt-1 p-2 rounded-xl shadow-lg ${c.severity === 'high' ? 'bg-red-500 shadow-red-500/30' : 'bg-amber-500 shadow-amber-500/30'}`}>
                    <LucideAlertTriangle size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm">{c.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                        c.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Ingredient Intelligence (Condensed) */}
        <section className="bg-white/5 border border-white/5 rounded-[32px] p-6 animate-fade-in-up stagger-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
              <LucideInfo size={14} />
              Ingredient Intelligence
            </h3>
            <button onClick={onDeepDive} className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-1">
              View All
              <LucideChevronLeft size={12} className="rotate-180" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {analysis.ingredients.slice(0, 6).map((ing, i) => (
              <span 
                key={i} 
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all hover:scale-105 ${
                  ing.isAllergen 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-white/5 border-white/5'
                }`}
              >
                {ing.name}
              </span>
            ))}
            {analysis.ingredients.length > 6 && (
              <button 
                onClick={onDeepDive}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-all"
              >
                +{analysis.ingredients.length - 6} more
              </button>
            )}
          </div>
          <p className="text-[10px] opacity-40">
            {analysis.ingredients.filter(i => i.isAllergen).length} allergen{analysis.ingredients.filter(i => i.isAllergen).length !== 1 ? 's' : ''} detected
          </p>
        </section>

        {/* 5. Quality Insights */}
        <section className="bg-white/5 border border-white/5 rounded-[32px] p-6 space-y-4 animate-fade-in-up stagger-4">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
            <LucideShield size={14} />
            Quality Insights
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold opacity-30 mb-2">Sourcing</p>
              <p className="text-sm opacity-80 leading-relaxed">{analysis.qualityInsights.sourcing}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase font-bold opacity-30 flex items-center gap-1.5">
                  <LucideLeaf size={12} />
                  Sustainability Score
                </p>
                <span className={`font-bold ${scoreColor(analysis.qualityInsights.sustainabilityScore)}`}>
                  {analysis.qualityInsights.sustainabilityScore}/100
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${scoreBgColor(analysis.qualityInsights.sustainabilityScore)} transition-all duration-1000`}
                  style={{ width: `${analysis.qualityInsights.sustainabilityScore}%` }}
                ></div>
              </div>
            </div>

            {analysis.qualityInsights.notes && (
              <div>
                <p className="text-[10px] uppercase font-bold opacity-30 mb-2">Additional Notes</p>
                <p className="text-xs opacity-60 leading-relaxed">{analysis.qualityInsights.notes}</p>
              </div>
            )}
          </div>
        </section>

        {/* 6. Caution Indicators */}
        {analysis.cautionIndicators.length > 0 && (
          <section className="space-y-3 animate-fade-in-up stagger-5">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 ml-2 flex items-center gap-2">
              <LucideAlertTriangle size={14} />
              Caution Indicators
            </h3>
            {analysis.cautionIndicators.map((caution, i) => (
              <div 
                key={i}
                className={`p-5 rounded-2xl border flex items-start gap-3 ${
                  caution.severity === 'alert' 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-amber-500/10 border-amber-500/20'
                }`}
              >
                <div className={`p-2 rounded-xl ${caution.severity === 'alert' ? 'bg-red-500' : 'bg-amber-500'}`}>
                  <LucideAlertTriangle size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1">{caution.type}</p>
                  <p className="text-xs opacity-70">{caution.message}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 7. Smart Verdict */}
        <section className="bg-gradient-to-br from-blue-600/10 to-blue-700/5 border border-blue-500/20 rounded-[32px] p-6 space-y-3 animate-fade-in-up stagger-6 shadow-lg shadow-blue-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Smart Verdict</h3>
            <span className="ml-auto px-2 py-1 bg-blue-500/20 rounded-lg text-[9px] font-bold text-blue-300">
              {analysis.smartVerdict.confidenceScore}% Confident
            </span>
          </div>
          <p className="font-bold text-lg leading-tight">{analysis.smartVerdict.recommendation}</p>
          <p className="text-sm opacity-70 leading-relaxed">{analysis.smartVerdict.reasoning}</p>
        </section>

        {/* 8. Product Score (Detailed Breakdown) */}
        <section className="space-y-4 animate-fade-in-up stagger-7">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 ml-2">Overall Scores</h3>
          
          {/* Main Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`bg-gradient-to-br ${scoreBgColor(analysis.productScore.health)} border border-white/10 rounded-[32px] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg`}>
              <div className="absolute top-0 right-0 p-2 opacity-20"><LucideInfo size={14} /></div>
              <span className="text-[10px] uppercase font-bold opacity-40 mb-2">Health Score</span>
              <AnimatedScore value={analysis.productScore.health} delay={0} />
              <div className="mt-2 text-[9px] opacity-40 uppercase font-bold tracking-widest">
                {analysis.productScore.health >= 80 ? 'Excellent' : analysis.productScore.health >= 60 ? 'Good' : 'Fair'}
              </div>
            </div>
            <div className={`bg-gradient-to-br ${scoreBgColor(analysis.productScore.overall)} border border-white/10 rounded-[32px] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-lg`}>
              <div className="absolute top-0 right-0 p-2 opacity-20"><LucideInfo size={14} /></div>
              <span className="text-[10px] uppercase font-bold opacity-40 mb-2">Overall Quality</span>
              <AnimatedScore value={analysis.productScore.overall} delay={200} />
              <div className="mt-2 text-[9px] opacity-40 uppercase font-bold tracking-widest">
                {analysis.productScore.overall >= 80 ? 'Excellent' : analysis.productScore.overall >= 60 ? 'Good' : 'Fair'}
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-white/5 border border-white/5 rounded-[32px] p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Detailed Breakdown</h4>
            {[
              { label: 'Quality', value: analysis.productScore.quality },
              { label: 'Sustainability', value: analysis.productScore.sustainability },
              { label: 'Value', value: analysis.productScore.value }
            ].map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">{metric.label}</span>
                  <span className={`font-bold ${scoreColor(metric.value)}`}>{metric.value}/100</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${scoreBgColor(metric.value)} transition-all duration-1000`}
                    style={{ 
                      width: `${metric.value}%`,
                      transitionDelay: `${(i + 1) * 200}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pb-8 animate-fade-in-up stagger-8">
          <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
            <LucideFileText size={18} />
            Add Notes
          </button>
          <button className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
            <LucideDownload size={18} />
            Export PDF
          </button>
          <button 
            onClick={onCompare}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LucideLayoutList size={18} />
            Compare
          </button>
          <button 
            onClick={onDeepDive}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Deep Dive
          </button>
        </div>
      </div>
    </div>
  );
};
