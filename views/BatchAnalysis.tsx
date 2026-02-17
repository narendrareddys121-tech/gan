
import React, { useState } from 'react';
import { LucideChevronLeft, LucidePlus, LucideDownload } from 'lucide-react';
import { Screen } from '../App';
import { ProductAnalysis } from '../types';
import { ScoreRing } from '../components/ScoreRing';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface BatchAnalysisProps {
  history: ProductAnalysis[];
  onBack: () => void;
  navigate: (screen: Screen) => void;
}

export const BatchAnalysis: React.FC<BatchAnalysisProps> = ({
  history,
  onBack,
  navigate
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else if (selectedProducts.length < 10) {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setReportGenerated(true);
    setIsGenerating(false);
  };

  const selectedProductData = history.filter(p => selectedProducts.includes(p.id));

  const averageScores = selectedProductData.length > 0 ? {
    health: Math.round(selectedProductData.reduce((sum, p) => sum + p.productScore.health, 0) / selectedProductData.length),
    quality: Math.round(selectedProductData.reduce((sum, p) => sum + p.productScore.quality, 0) / selectedProductData.length),
    sustainability: Math.round(selectedProductData.reduce((sum, p) => sum + p.productScore.sustainability, 0) / selectedProductData.length),
    value: Math.round(selectedProductData.reduce((sum, p) => sum + p.productScore.value, 0) / selectedProductData.length),
  } : { health: 0, quality: 0, sustainability: 0, value: 0 };

  // Get common ingredients
  const getCommonIngredients = () => {
    if (selectedProductData.length < 2) return [];
    
    const ingredientCounts = new Map<string, number>();
    selectedProductData.forEach(product => {
      product.ingredients.forEach(ing => {
        ingredientCounts.set(ing.name, (ingredientCounts.get(ing.name) || 0) + 1);
      });
    });

    return Array.from(ingredientCounts.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5">
          <LucideChevronLeft />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Batch Analysis</h2>
          {selectedProducts.length > 0 && (
            <p className="text-xs text-white/60 mt-1">
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
        {selectedProducts.length > 0 && (
          <Badge variant="info" size="md">
            {selectedProducts.length}/10
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Scan New Product Button */}
        <Button
          variant="secondary"
          fullWidth
          icon={<LucidePlus size={20} />}
          onClick={() => navigate('scan')}
        >
          Scan New Product
        </Button>

        {/* Product Selection */}
        {!reportGenerated && (
          <>
            <div>
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
                Select Products from History
              </h3>
              {history.length === 0 ? (
                <Card>
                  <p className="text-center text-white/60 py-8">
                    No products in history. Scan your first product to get started.
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {history.map(product => {
                    const isSelected = selectedProducts.includes(product.id);
                    const isDisabled = !isSelected && selectedProducts.length >= 10;

                    return (
                      <button
                        key={product.id}
                        onClick={() => !isDisabled && toggleProduct(product.id)}
                        disabled={isDisabled}
                        className={`
                          w-full p-4 rounded-2xl text-left transition-all
                          flex items-center gap-4
                          ${isSelected
                            ? 'bg-blue-600/20 border border-blue-600/40'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }
                          ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                        `}
                      >
                        <div
                          className={`
                            w-6 h-6 rounded-md border-2 flex items-center justify-center
                            ${isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-white/20'
                            }
                          `}
                        >
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                              <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{product.name}</h4>
                          <p className="text-xs text-white/60">{product.brand}</p>
                        </div>

                        <Badge
                          variant={
                            product.productScore.overall >= 80 ? 'success' :
                            product.productScore.overall >= 60 ? 'warning' : 'danger'
                          }
                        >
                          {product.productScore.overall}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Generate Report Button */}
            {selectedProducts.length >= 2 && (
              <Button
                variant="primary"
                fullWidth
                onClick={generateReport}
                loading={isGenerating}
                className="mt-6"
              >
                Generate Report
              </Button>
            )}

            {selectedProducts.length === 1 && (
              <p className="text-center text-sm text-white/60 mt-4">
                Select at least 2 products to generate a report
              </p>
            )}
          </>
        )}

        {/* Report View */}
        {reportGenerated && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Average Scores */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Average Scores</h3>
              <div className="grid grid-cols-2 gap-4">
                <ScoreRing score={averageScores.health} size={100} label="Health" />
                <ScoreRing score={averageScores.quality} size={100} label="Quality" animationDelay={100} />
                <ScoreRing score={averageScores.sustainability} size={100} label="Sustainability" animationDelay={200} />
                <ScoreRing score={averageScores.value} size={100} label="Value" animationDelay={300} />
              </div>
            </Card>

            {/* Common Ingredients */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Common Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {getCommonIngredients().map((ingredient, index) => (
                  <Badge key={index} variant="neutral" size="md">
                    {ingredient}
                  </Badge>
                ))}
                {getCommonIngredients().length === 0 && (
                  <p className="text-white/60 text-sm">No common ingredients found</p>
                )}
              </div>
            </Card>

            {/* Export Options */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                fullWidth
                icon={<LucideDownload size={20} />}
              >
                Export as PDF
              </Button>
              <Button
                variant="secondary"
                fullWidth
                icon={<LucideDownload size={20} />}
              >
                Export as CSV
              </Button>
            </div>

            {/* New Analysis Button */}
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setReportGenerated(false);
                setSelectedProducts([]);
              }}
            >
              Start New Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
