
import React from 'react';
import { ProductAnalysis } from '../types';
import { LucideChevronLeft, LucideShieldCheck, LucideFlaskConical, LucideAlertCircle, LucideInfo } from 'lucide-react';

interface DeepDiveProps {
  analysis: ProductAnalysis | null;
  onBack: () => void;
}

export const DeepDive: React.FC<DeepDiveProps> = ({ analysis, onBack }) => {
  if (!analysis) return null;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5"><LucideChevronLeft /></button>
        <h2 className="text-xl font-bold">Ingredient Intelligence</h2>
      </div>

      <div className="px-6 pb-12 space-y-6">
        <div className="bg-blue-600/5 border border-blue-500/10 rounded-3xl p-5 flex items-start gap-4">
          <LucideInfo className="text-blue-500 mt-1 flex-shrink-0" size={20} />
          <p className="text-sm opacity-70 leading-relaxed">
            AuraScan AI has analyzed {analysis.ingredients.length} ingredients. Tapping on specialized chemical names reveals their regulatory status and common industrial uses.
          </p>
        </div>

        <div className="space-y-4">
          {analysis.ingredients.map((ing, idx) => (
            <div 
              key={idx} 
              className={`p-5 rounded-[28px] border transition-all ${ing.isAllergen ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/5'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className={`font-bold text-base ${ing.isAllergen ? 'text-red-400' : ''}`}>{ing.name}</h4>
                  {ing.scientificName && (
                    <p className="text-[10px] opacity-40 font-mono italic">{ing.scientificName}</p>
                  )}
                </div>
                {ing.isAllergen && (
                  <span className="px-2 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg">Allergen Alert</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-bold opacity-30">Role</p>
                  <p className="text-xs font-semibold">{ing.role}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] uppercase font-bold opacity-30">Source</p>
                  <div className="flex items-center justify-end gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${ing.source === 'natural' ? 'bg-emerald-500' : 'bg-blue-400'}`}></span>
                    <p className="text-xs font-semibold capitalize">{ing.source}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <p className="text-[10px] opacity-50 leading-relaxed italic">
                  <span className="font-bold opacity-100 mr-1 not-italic text-blue-400">Safety Profile:</span>
                  {ing.safetyProfile}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
