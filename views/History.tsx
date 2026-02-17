
import React, { useState } from 'react';
import { ProductAnalysis } from '../types';
import { LucideChevronLeft, LucideSearch, LucideStar, LucideFilter, LucideTrash2, LucidePackage } from 'lucide-react';

interface HistoryProps {
  history: ProductAnalysis[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  onBack: () => void;
  onSelect: (a: ProductAnalysis) => void;
}

export const History: React.FC<HistoryProps> = ({ history, favorites, toggleFavorite, onBack, onSelect }) => {
  const [tab, setTab] = useState<'all' | 'favorites'>('all');
  const [search, setSearch] = useState('');

  const filtered = (tab === 'all' ? history : history.filter(h => favorites.includes(h.id)))
    .filter(h => h.name.toLowerCase().includes(search.toLowerCase()) || h.brand.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      <div className="p-6 sticky top-0 z-20 bg-[#0F1419]/80 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5"><LucideChevronLeft /></button>
          <h2 className="text-xl font-bold">Your Library</h2>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-2xl">
          <button onClick={() => setTab('all')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${tab === 'all' ? 'bg-white/10 text-white' : 'opacity-40'}`}>History</button>
          <button onClick={() => setTab('favorites')} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${tab === 'favorites' ? 'bg-white/10 text-white' : 'opacity-40'}`}>Favorites</button>
        </div>

        <div className="relative">
          <LucideSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 pb-12 space-y-4">
        {filtered.length === 0 ? (
          <div className="pt-20 text-center opacity-30 space-y-4">
            <LucidePackage size={48} className="mx-auto" />
            <p className="text-sm">No items found in your {tab}</p>
          </div>
        ) : (
          filtered.map(item => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="p-4 bg-white/5 rounded-[24px] flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex-shrink-0 flex items-center justify-center font-black opacity-10">P</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{item.name}</p>
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">{item.brand}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                  className={`p-2 rounded-full ${favorites.includes(item.id) ? 'text-yellow-400' : 'opacity-20'}`}
                >
                  <LucideStar size={18} className={favorites.includes(item.id) ? 'fill-current' : ''} />
                </button>
                <span className="text-[9px] opacity-20 font-bold">{new Date(item.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
