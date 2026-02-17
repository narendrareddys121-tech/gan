
import React from 'react';
import { Screen } from '../App';
import { LucideChevronLeft, LucideFlaskConical, LucideBarChart3, LucidePackage, LucideEye, LucideLayoutList, LucideGlobe2, LucideDownload, LucideHistory, LucideShield } from 'lucide-react';

interface ToolsHubProps {
  navigate: (screen: Screen) => void;
  onBack: () => void;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({ navigate, onBack }) => {
  const toolCategories = [
    {
      title: 'Analysis',
      tools: [
        { id: 'deep-dive', title: 'Ingredient Deep Dive', desc: 'Scientific database access', icon: LucideFlaskConical, color: 'bg-emerald-500' },
        { id: 'batch-analysis', title: 'Batch Analysis', desc: 'Analyze multiple items at once', icon: LucidePackage, color: 'bg-amber-500' },
        { id: 'allergen-scanner', title: 'Allergen Scanner', desc: 'Find safe products for you', icon: LucideShield, color: 'bg-red-500' },
      ]
    },
    {
      title: 'Comparison',
      tools: [
        { id: 'comparison', title: 'Comparison Tool', desc: 'Side-by-side product metrics', icon: LucideLayoutList, color: 'bg-blue-500' },
        { id: 'product-tracking', title: 'Product Tracking', desc: 'Monitor changes & alerts', icon: LucideEye, color: 'bg-purple-500' },
      ]
    },
    {
      title: 'Insights',
      tools: [
        { id: 'analytics', title: 'Analytics Dashboard', desc: 'Personal consumption trends', icon: LucideBarChart3, color: 'bg-violet-500' },
        { id: 'sustainability', title: 'Sustainability Deep Dive', desc: 'Environmental impact analysis', icon: LucideGlobe2, color: 'bg-indigo-500' },
      ]
    },
    {
      title: 'Export',
      tools: [
        { id: 'export-reports', title: 'Export & Reports', desc: 'Generate and share data', icon: LucideDownload, color: 'bg-cyan-500' },
        { id: 'history', title: 'History & Favorites', desc: 'View your saved products', icon: LucideHistory, color: 'bg-teal-500' },
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5"><LucideChevronLeft /></button>
        <h2 className="text-xl font-bold">Advanced Tools</h2>
      </div>

      <div className="p-6 space-y-8">
        {toolCategories.map((category, categoryIndex) => (
          <div key={category.title}>
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
              {category.title}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {category.tools.map((tool, toolIndex) => {
                const delay = (categoryIndex * 3 + toolIndex) * 50;
                return (
                  <button 
                    key={tool.id}
                    onClick={() => navigate(tool.id as Screen)}
                    className="flex flex-col p-5 bg-white/5 rounded-[32px] text-left hover:bg-white/10 transition-all hover:translate-y-[-4px] group animate-fade-in-up"
                    style={{ 
                      animationDelay: `${delay}ms`,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 102, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                  >
                    <div className={`p-3 rounded-2xl ${tool.color} w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 102, 255, 0.3))' }}
                    >
                      <tool.icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{tool.title}</h3>
                    <p className="text-[10px] opacity-40 leading-tight">{tool.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
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
