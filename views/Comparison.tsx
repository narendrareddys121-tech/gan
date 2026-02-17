
import React, { useState } from 'react';
import { ProductAnalysis } from '../types';
import { LucideChevronLeft, LucidePlus, LucideX, LucideScale } from 'lucide-react';

interface ComparisonProps {
  products: ProductAnalysis[];
  initialId?: string;
  onBack: () => void;
}

export const Comparison: React.FC<ComparisonProps> = ({ products, initialId, onBack }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialId ? [initialId] : []);
  const [showPicker, setShowPicker] = useState(false);

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));
  const availableToPick = products.filter(p => !selectedIds.includes(p.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds(prev => [...prev, id]);
    }
    setShowPicker(false);
  };

  const scoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-500';
    if (val >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 sticky top-0 z-20 bg-[#0F1419]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5"><LucideChevronLeft /></button>
          <h2 className="text-xl font-bold">Compare</h2>
        </div>
        <LucideScale size={20} className="opacity-30" />
      </div>

      <div className="flex-1 overflow-x-auto p-6 pt-0">
        <div className="min-w-max flex gap-4 h-full">
          {selectedProducts.map(p => (
            <div key={p.id} className="w-64 flex flex-col bg-white/5 rounded-[32px] overflow-hidden border border-white/5 p-5 relative">
              <button 
                onClick={() => toggleSelect(p.id)}
                className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <LucideX size={14} />
              </button>

              <div className="text-center mb-6 pt-4">
                <p className="text-[10px] uppercase font-black opacity-30 tracking-widest">{p.brand}</p>
                <h3 className="font-bold text-sm h-10 overflow-hidden line-clamp-2">{p.name}</h3>
              </div>

              <div className="space-y-6">
                <div className="text-center bg-white/5 rounded-2xl p-4">
                  <p className="text-[10px] uppercase font-bold opacity-30 mb-1">Health</p>
                  <p className={`text-3xl font-black ${scoreColor(p.productScore.health)}`}>{p.productScore.health}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Key Metrics</h4>
                  <div className="space-y-3">
                    {['Quality', 'Sustainability', 'Value'].map(metric => {
                      const val = (p.productScore as any)[metric.toLowerCase()];
                      return (
                        <div key={metric} className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>{metric}</span>
                            <span>{val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-1000"
                              style={{ width: `${val}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                   <h4 className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Ingredients</h4>
                   <p className="text-xs opacity-60">{p.ingredients.length} total</p>
                   <p className="text-xs opacity-60 font-bold text-red-400">{p.ingredients.filter(i => i.isAllergen).length} allergens</p>
                </div>
              </div>
            </div>
          ))}

          {selectedIds.length < 3 && (
            <button 
              onClick={() => setShowPicker(true)}
              className="w-64 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
            >
              <div className="p-4 rounded-full bg-white/5 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <LucidePlus size={24} />
              </div>
              <p className="text-sm font-bold opacity-40 group-hover:opacity-100">Add Product</p>
            </button>
          )}
        </div>
      </div>

      {showPicker && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col p-6 pt-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Select from History</h3>
            <button onClick={() => setShowPicker(false)} className="p-2 bg-white/10 rounded-full"><LucideX size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
            {availableToPick.length === 0 ? (
              <p className="text-center py-10 opacity-40">No other products in history.</p>
            ) : (
              availableToPick.map(p => (
                <button 
                  key={p.id}
                  onClick={() => toggleSelect(p.id)}
                  className="w-full p-4 bg-white/5 rounded-2xl text-left flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-xs opacity-40 uppercase tracking-widest">{p.brand}</p>
                  </div>
                  <span className={`font-black ${scoreColor(p.productScore.health)}`}>{p.productScore.health}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
