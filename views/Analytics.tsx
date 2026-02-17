
import React from 'react';
import { ProductAnalysis } from '../types';
import { LucideChevronLeft, LucideActivity, LucideAlertTriangle, LucideHeart, LucideZap } from 'lucide-react';

interface AnalyticsProps {
  history: ProductAnalysis[];
  onBack: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ history, onBack }) => {
  const avgHealth = history.length ? Math.round(history.reduce((a, b) => a + b.productScore.health, 0) / history.length) : 0;
  const totalAllergens = history.reduce((a, b) => a + b.ingredients.filter(i => i.isAllergen).length, 0);
  
  const categories = history.reduce((acc: any, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(categories).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'None';

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5"><LucideChevronLeft /></button>
        <h2 className="text-xl font-bold">Personal Insights</h2>
      </div>

      <div className="p-6 space-y-6 pb-20">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[32px] p-6 text-white shadow-xl shadow-blue-500/20">
            <LucideHeart size={18} className="mb-4 opacity-70" />
            <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Avg Health Score</p>
            <p className="text-4xl font-black">{avgHealth}</p>
          </div>
          <div className="bg-white/5 rounded-[32px] p-6 border border-white/5">
            <LucideActivity size={18} className="mb-4 text-emerald-500" />
            <p className="text-[10px] uppercase font-bold opacity-30 mb-1">Total Scans</p>
            <p className="text-4xl font-black">{history.length}</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-[32px] p-6 border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <LucideAlertTriangle size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Risk Exposure</h3>
              <p className="text-[10px] opacity-40 uppercase tracking-widest">Ingredient Watchlist</p>
            </div>
          </div>
          
          <div className="flex items-end gap-2 h-20">
            {history.slice(0, 10).reverse().map((p, i) => {
              const allergenCount = p.ingredients.filter(ing => ing.isAllergen).length;
              return (
                <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-red-500/50 rounded-t-lg transition-all"
                    style={{ height: `${Math.min(allergenCount * 20, 100)}%` }}
                  ></div>
                </div>
              );
            })}
          </div>
          <p className="text-xs opacity-50 text-center">Recent allergen density trends</p>
        </div>

        <div className="bg-white/5 rounded-[32px] p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <LucideZap size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Top Category</h3>
              <p className="text-[10px] opacity-40 uppercase tracking-widest">{topCategory}</p>
            </div>
          </div>
          <div className="space-y-3">
            {Object.entries(categories).slice(0, 3).map(([cat, count]: any) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>{cat}</span>
                  <span>{Math.round((count / history.length) * 100)}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(count / history.length) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
