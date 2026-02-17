
import React, { useState } from 'react';
import { LucideChevronLeft, LucideEye, LucideChevronDown, LucideChevronUp } from 'lucide-react';
import { TrackedProduct } from '../types';
import { Badge } from '../components/Badge';
import { Toggle } from '../components/Toggle';
import { BarChart } from '../components/BarChart';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface ProductTrackingProps {
  trackedProducts: TrackedProduct[];
  onBack: () => void;
  onUpdateAlerts: (productId: string, alerts: any) => void;
}

export const ProductTracking: React.FC<ProductTrackingProps> = ({
  trackedProducts,
  onBack,
  onUpdateAlerts
}) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const toggleExpanded = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5">
          <LucideChevronLeft />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Product Tracking</h2>
          {trackedProducts.length > 0 && (
            <p className="text-xs text-white/60 mt-1">
              {trackedProducts.length} product{trackedProducts.length !== 1 ? 's' : ''} monitored
            </p>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Empty State */}
        {trackedProducts.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                <LucideEye size={32} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">No Products Tracked</h3>
              <p className="text-sm text-white/60 mb-6 max-w-xs">
                Start tracking products to get alerts about price changes, reformulations, and availability.
              </p>
              <Button variant="primary">
                Browse Products
              </Button>
            </div>
          </Card>
        )}

        {/* Tracked Products List */}
        {trackedProducts.map(product => {
          const isExpanded = expandedProduct === product.productId;
          const hasAlerts = product.alerts.reformulationAlert || product.alerts.availabilityAlert || !!product.alerts.priceThreshold;

          return (
            <Card key={product.productId} className="overflow-hidden">
              {/* Collapsed View */}
              <button
                onClick={() => toggleExpanded(product.productId)}
                className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-sm">{product.productName}</h4>
                  <p className="text-xs text-white/60">{product.brand}</p>
                </div>

                {hasAlerts && (
                  <Badge variant="success" size="sm">
                    Alerts On
                  </Badge>
                )}

                {isExpanded ? (
                  <LucideChevronUp size={20} className="text-white/40" />
                ) : (
                  <LucideChevronDown size={20} className="text-white/40" />
                )}
              </button>

              {/* Expanded View */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-white/10">
                  {/* Alert Toggles */}
                  <div className="pt-4 space-y-3">
                    <h5 className="text-xs font-bold text-white/60 uppercase tracking-wider">
                      Alert Settings
                    </h5>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">Reformulation Alert</p>
                        <p className="text-xs text-white/60">Notify when ingredients change</p>
                      </div>
                      <Toggle
                        checked={product.alerts.reformulationAlert}
                        onChange={(checked) => 
                          onUpdateAlerts(product.productId, {
                            ...product.alerts,
                            reformulationAlert: checked
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">Availability Alert</p>
                        <p className="text-xs text-white/60">Notify when out of stock</p>
                      </div>
                      <Toggle
                        checked={product.alerts.availabilityAlert}
                        onChange={(checked) => 
                          onUpdateAlerts(product.productId, {
                            ...product.alerts,
                            availabilityAlert: checked
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Price History */}
                  {product.priceHistory.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                        Price History
                      </h5>
                      <BarChart
                        items={product.priceHistory.slice(-5).map((ph, idx) => ({
                          label: new Date(ph.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                          value: ph.price,
                          color: '#10B981'
                        }))}
                        height={32}
                      />
                    </div>
                  )}

                  {/* Reformulations Timeline */}
                  {product.reformulations.length > 0 && (
                    <div>
                      <h5 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                        Recent Changes
                      </h5>
                      <div className="space-y-2">
                        {product.reformulations.slice(0, 3).map((reform, idx) => (
                          <div key={idx} className="p-3 bg-white/5 rounded-lg">
                            <p className="text-xs text-white/60 mb-1">
                              {new Date(reform.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                            <ul className="space-y-1">
                              {reform.changes.map((change, cidx) => (
                                <li key={cidx} className="text-xs text-white/80">
                                  • {change}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
