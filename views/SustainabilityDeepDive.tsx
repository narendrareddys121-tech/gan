
import React from 'react';
import { LucideChevronLeft, LucideLeaf, LucideAward } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

interface SustainabilityDeepDiveProps {
  onBack: () => void;
}

// Mock data - would come from API in production
const mockData = {
  carbonFootprint: {
    value: 2.4,
    unit: 'kg CO₂e',
    comparison: 'average',
    percentile: 65
  },
  alternatives: [
    {
      id: '1',
      name: 'Eco-Friendly Alternative A',
      brand: 'Green Brand',
      carbonReduction: 40,
      score: 92,
      imageUrl: ''
    },
    {
      id: '2',
      name: 'Sustainable Option B',
      brand: 'Earth Co',
      carbonReduction: 35,
      score: 88,
      imageUrl: ''
    },
    {
      id: '3',
      name: 'Organic Choice C',
      brand: 'Pure Nature',
      carbonReduction: 30,
      score: 85,
      imageUrl: ''
    }
  ],
  certifications: [
    { name: 'Fair Trade', verified: true },
    { name: 'Rainforest Alliance', verified: true },
    { name: 'USDA Organic', verified: false },
    { name: 'B Corp', verified: true },
    { name: 'Carbon Neutral', verified: false }
  ],
  personalImpact: {
    totalScans: 47,
    avgCarbonPerScan: 2.1,
    totalCarbon: 98.7,
    treesEquivalent: 4.2
  }
};

export const SustainabilityDeepDive: React.FC<SustainabilityDeepDiveProps> = ({
  onBack
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5">
          <LucideChevronLeft />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Sustainability</h2>
          <p className="text-xs text-white/60 mt-1">
            Environmental impact analysis
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Carbon Footprint Card */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <LucideLeaf size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold">Carbon Footprint</h3>
          </div>

          <div className="text-center py-6">
            <div className="text-5xl font-black text-emerald-400 mb-2">
              {mockData.carbonFootprint.value}
            </div>
            <div className="text-sm text-white/60 mb-4">
              {mockData.carbonFootprint.unit}
            </div>

            {/* Visual Scale */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                style={{ width: `${mockData.carbonFootprint.percentile}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-900"
                style={{ left: `${mockData.carbonFootprint.percentile}%` }}
              />
            </div>

            <p className="text-xs text-white/60">
              {mockData.carbonFootprint.percentile}% better than average
            </p>
          </div>
        </Card>

        {/* Eco-Friendly Alternatives */}
        <div>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
            Eco-Friendly Alternatives
          </h3>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {mockData.alternatives.map(alt => (
              <Card key={alt.id} className="flex-shrink-0 w-[160px]">
                <div className="space-y-3">
                  <div className="w-full h-32 bg-white/5 rounded-lg flex items-center justify-center">
                    <LucideLeaf size={32} className="text-emerald-400/40" />
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-xs mb-0.5 line-clamp-2">{alt.name}</h4>
                    <p className="text-[10px] text-white/60">{alt.brand}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="success" size="sm">
                      {alt.score}
                    </Badge>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      -{alt.carbonReduction}% CO₂
                    </span>
                  </div>

                  <Button variant="secondary" fullWidth size="sm">
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Certification Badges */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <LucideAward size={20} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-bold">Certifications</h3>
          </div>

          <div className="space-y-3">
            {mockData.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <span className="text-sm font-medium">{cert.name}</span>
                {cert.verified ? (
                  <Badge variant="success" size="sm">Verified</Badge>
                ) : (
                  <Badge variant="neutral" size="sm">Not Verified</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Personal Carbon Footprint Tracker */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Your Impact</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-2xl font-black text-white mb-1">
                {mockData.personalImpact.totalScans}
              </div>
              <div className="text-xs text-white/60">
                Products Scanned
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-2xl font-black text-emerald-400 mb-1">
                {mockData.personalImpact.avgCarbonPerScan}
              </div>
              <div className="text-xs text-white/60">
                Avg CO₂e per Product
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-2xl font-black text-amber-400 mb-1">
                {mockData.personalImpact.totalCarbon}
              </div>
              <div className="text-xs text-white/60">
                Total kg CO₂e
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-2xl font-black text-emerald-400 mb-1">
                {mockData.personalImpact.treesEquivalent}
              </div>
              <div className="text-xs text-white/60">
                Trees Equivalent
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-600/10 border border-emerald-600/20 rounded-xl">
            <p className="text-sm text-emerald-400">
              💡 Choose products with lower carbon footprints to reduce your environmental impact
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
