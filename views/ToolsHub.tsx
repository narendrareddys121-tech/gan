
import React from 'react';
import { Screen } from '../App';
import { LucideChevronLeft, LucideFlaskConical, LucideBarChart3, LucidePackage, LucideTrendingUp, LucideGlobe2, LucideLayoutList } from 'lucide-react';

interface ToolsHubProps {
  navigate: (screen: Screen) => void;
  onBack: () => void;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({ navigate, onBack }) => {
  const tools = [
    { id: 'comparison', title: 'Compare Tool', desc: 'Side-by-side product metrics', icon: LucideLayoutList, color: 'bg-blue-500' },
    { id: 'analytics', title: 'Advanced Analytics', desc: 'Personal consumption trends', icon: LucideBarChart3, color: 'bg-violet-500' },
    { id: 'ingredients', title: 'Ingredient Dive', desc: 'Scientific database access', icon: LucideFlaskConical, color: 'bg-emerald-500' },
    { id: 'batch', title: 'Batch Scan', desc: 'Analyze multiple items at once', icon: LucidePackage, color: 'bg-amber-500' },
    { id: 'trends', title: 'Category Trends', desc: 'See what is healthy right now', icon: LucideTrendingUp, color: 'bg-cyan-500' },
    { id: 'impact', title: 'Eco Impact', desc: 'Sustainability & sourcing deep dive', icon: LucideGlobe2, color: 'bg-indigo-500' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      <div className="p-6 sticky top-0 z-20 bg-[#0F1419]/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5"><LucideChevronLeft /></button>
        <h2 className="text-xl font-bold">Advanced Tools</h2>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        {tools.map(tool => (
          <button 
            key={tool.id}
            onClick={() => navigate(tool.id as any)}
            className="flex flex-col p-5 bg-white/5 rounded-[32px] text-left hover:bg-white/10 transition-colors group"
          >
            <div className={`p-3 rounded-2xl ${tool.color} w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <tool.icon size={22} className="text-white" />
            </div>
            <h3 className="font-bold text-sm mb-1">{tool.title}</h3>
            <p className="text-[10px] opacity-40 leading-tight">{tool.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 px-6 pb-12">
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-[32px] p-6 text-white">
          <h4 className="font-bold mb-2">Upgrade to Pro</h4>
          <p className="text-xs opacity-80 mb-6">Unlock unrestricted batch scanning and professional export capabilities.</p>
          <button className="w-full py-3 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl">
            Go Unlimited
          </button>
        </div>
      </div>
    </div>
  );
};
