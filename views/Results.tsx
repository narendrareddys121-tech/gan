
import React from 'react';
import { LucideChevronLeft, LucideStar, LucideCheckCircle2, LucideAlertTriangle, LucideInfo, LucideShare2, LucideLayoutList } from 'lucide-react';
import { ProductAnalysis } from '../types';

interface ResultsProps {
  analysis: ProductAnalysis | null;
  onBack: () => void;
  onDeepDive: () => void;
  onCompare: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

export const Results: React.FC<ResultsProps> = ({ analysis, onBack, onDeepDive, onCompare, isFavorite, toggleFavorite }) => {
  if (!analysis) return null;

  const scoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-500';
    if (val >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 p-6 flex justify-between items-center bg-[#0F1419]/80 backdrop-blur-xl">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors">
          <LucideChevronLeft />
        </button>
        <div className="flex gap-2">
          <button onClick={toggleFavorite} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <LucideStar size={22} className={isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <LucideShare2 size={22} />
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* 1. Product Snapshot */}
        <section className="bg-white/5 rounded-[32px] p-6 flex items-start gap-5">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-xs opacity-20 font-bold">IMAGE</div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">{analysis.brand}</p>
            <h1 className="text-xl font-bold leading-tight mb-2">{analysis.name}</h1>
            <div className="flex flex-wrap gap-2">
              {analysis.snapshot.certifications.map((c, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/10 rounded-md text-[9px] font-bold uppercase tracking-tight">{c}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Product Score (Main Highlight) */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-[32px] p-6 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-20"><LucideInfo size={14} /></div>
             <span className="text-[10px] uppercase font-bold opacity-30 mb-2">Health Score</span>
             <div className={`text-5xl font-black ${scoreColor(analysis.productScore.health)}`}>{analysis.productScore.health}</div>
          </div>
          <div className="bg-white/5 rounded-[32px] p-6 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-20"><LucideInfo size={14} /></div>
             <span className="text-[10px] uppercase font-bold opacity-30 mb-2">Overall Quality</span>
             <div className={`text-5xl font-black ${scoreColor(analysis.productScore.overall)}`}>{analysis.productScore.overall}</div>
          </div>
        </section>

        {/* 7. Smart Verdict */}
        <section className="bg-blue-600/10 border border-blue-500/20 rounded-[32px] p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Smart Verdict</h3>
          </div>
          <p className="font-semibold text-lg">{analysis.smartVerdict.recommendation}</p>
          <p className="text-sm opacity-60 leading-relaxed">{analysis.smartVerdict.reasoning}</p>
        </section>

        {/* 2. Benefits */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 ml-2">Key Benefits</h3>
          <div className="space-y-3">
            {analysis.benefits.map((b, i) => (
              <div key={i} className="flex gap-4 items-start p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <div className="mt-1 p-1 bg-emerald-500 rounded-lg"><LucideCheckCircle2 size={16} className="text-white" /></div>
                <div>
                  <h4 className="font-bold text-sm">{b.title}</h4>
                  <p className="text-xs opacity-60">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Considerations */}
        {analysis.considerations.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 ml-2">Considerations</h3>
            <div className="space-y-3">
              {analysis.considerations.map((c, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                  <div className={`mt-1 p-1 rounded-lg ${c.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`}>
                    <LucideAlertTriangle size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{c.title}</h4>
                    <p className="text-xs opacity-60">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Ingredient Intelligence (Condensed) */}
        <section className="bg-white/5 rounded-[32px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest opacity-40">Ingredient Intelligence</h3>
            <button onClick={onDeepDive} className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Full List</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.ingredients.slice(0, 5).map((ing, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${ing.isAllergen ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/5'}`}>
                {ing.name}
              </span>
            ))}
            {analysis.ingredients.length > 5 && (
              <span className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 opacity-40">+{analysis.ingredients.length - 5} more</span>
            )}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-4 mt-8 pb-10">
          <button 
            onClick={onCompare}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold text-sm transition-colors"
          >
            <LucideLayoutList size={18} />
            Compare
          </button>
          <button 
            onClick={onDeepDive}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 font-bold text-sm shadow-lg shadow-blue-500/20"
          >
            Deep Dive
          </button>
        </div>
      </div>
    </div>
  );
};
