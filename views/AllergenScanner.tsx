
import React, { useState } from 'react';
import { LucideChevronLeft, LucideSearch, LucideShield, LucideAlertCircle } from 'lucide-react';
import { ProductAnalysis } from '../types';
import { Input } from '../components/Input';
import { ChipSelect } from '../components/ChipSelect';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';

interface AllergenScannerProps {
  history: ProductAnalysis[];
  onBack: () => void;
}

const COMMON_ALLERGENS = [
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Tree Nuts',
  'Peanuts',
  'Wheat',
  'Soybeans',
  'Sesame',
  'Gluten',
  'Sulfites',
  'Mustard'
];

export const AllergenScanner: React.FC<AllergenScannerProps> = ({
  history,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'free-from' | 'contains'>('free-from');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);

  // Filter products based on selected allergens and mode
  const filteredProducts = history.filter(product => {
    if (selectedAllergens.length === 0) return true;

    const productIngredients = product.ingredients.map(i => i.name.toLowerCase());
    
    if (filterMode === 'free-from') {
      // Product must NOT contain any selected allergens
      return !selectedAllergens.some(allergen => 
        productIngredients.some(ing => 
          ing.includes(allergen.toLowerCase())
        )
      );
    } else {
      // Product must contain at least one selected allergen
      return selectedAllergens.some(allergen => 
        productIngredients.some(ing => 
          ing.includes(allergen.toLowerCase())
        )
      );
    }
  });

  // Further filter by search query
  const searchResults = searchQuery
    ? filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProducts;

  const isSafe = (product: ProductAnalysis): boolean => {
    if (selectedAllergens.length === 0) return true;
    const productIngredients = product.ingredients.map(i => i.name.toLowerCase());
    return !selectedAllergens.some(allergen => 
      productIngredients.some(ing => ing.includes(allergen.toLowerCase()))
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5">
          <LucideChevronLeft />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Allergen Scanner</h2>
          <p className="text-xs text-white/60 mt-1">
            Find products safe for your dietary needs
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<LucideSearch size={18} />}
        />

        {/* Filter Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterMode('free-from')}
            className={`
              flex-1 py-3 rounded-xl font-semibold text-sm transition-all
              ${filterMode === 'free-from'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }
            `}
          >
            Free From
          </button>
          <button
            onClick={() => setFilterMode('contains')}
            className={`
              flex-1 py-3 rounded-xl font-semibold text-sm transition-all
              ${filterMode === 'contains'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }
            `}
          >
            Contains
          </button>
        </div>

        {/* Allergen Selection */}
        <div>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
            Select Allergens
          </h3>
          <ChipSelect
            options={COMMON_ALLERGENS}
            selected={selectedAllergens}
            onChange={setSelectedAllergens}
            columns={3}
          />
        </div>

        {/* Results Summary */}
        {selectedAllergens.length > 0 && (
          <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl">
            <p className="text-sm text-blue-400">
              {filterMode === 'free-from' ? (
                <>Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} free from {selectedAllergens.join(', ')}</>
              ) : (
                <>Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} containing {selectedAllergens.join(', ')}</>
              )}
            </p>
          </div>
        )}

        {/* Results List */}
        <div>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
            Results ({searchResults.length})
          </h3>
          
          {searchResults.length === 0 ? (
            <Card>
              <p className="text-center text-white/60 py-8">
                {history.length === 0 
                  ? 'No products in history. Scan your first product to get started.'
                  : selectedAllergens.length === 0
                  ? 'Select allergens to filter products'
                  : 'No products match your criteria'
                }
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {searchResults.map(product => {
                const productIsSafe = isSafe(product);
                const containsAllergens = product.ingredients.filter(ing =>
                  selectedAllergens.some(allergen =>
                    ing.name.toLowerCase().includes(allergen.toLowerCase())
                  )
                );

                return (
                  <Card key={product.id} className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Safety Icon */}
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                          ${productIsSafe
                            ? 'bg-emerald-500/20'
                            : 'bg-amber-500/20'
                          }
                        `}
                      >
                        {productIsSafe ? (
                          <LucideShield size={24} className="text-emerald-400" />
                        ) : (
                          <LucideAlertCircle size={24} className="text-amber-400" />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{product.name}</h4>
                        <p className="text-xs text-white/60 mb-2">{product.brand}</p>
                        
                        {/* Allergen Badges */}
                        {containsAllergens.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {containsAllergens.slice(0, 5).map((ing, idx) => (
                              <Badge key={idx} variant="danger" size="sm">
                                {ing.name}
                              </Badge>
                            ))}
                            {containsAllergens.length > 5 && (
                              <Badge variant="danger" size="sm">
                                +{containsAllergens.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {productIsSafe && selectedAllergens.length > 0 && (
                          <Badge variant="success" size="sm" className="mt-2">
                            Safe
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
