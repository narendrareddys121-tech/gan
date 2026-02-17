
import React from 'react';
import { LucideArrowUp } from 'lucide-react';

interface ComparisonAttribute {
  key: string;
  label: string;
  getValue: (product: any) => string | number;
  formatter?: (value: any) => string;
  higherIsBetter?: boolean;
}

interface ComparisonMatrixProps {
  products: any[];
  attributes: ComparisonAttribute[];
  className?: string;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  products,
  attributes,
  className = ''
}) => {
  const getBestValueIndex = (attribute: ComparisonAttribute): number => {
    const values = products.map(p => attribute.getValue(p));
    
    if (typeof values[0] === 'number') {
      const numValues = values as number[];
      const bestValue = attribute.higherIsBetter !== false
        ? Math.max(...numValues)
        : Math.min(...numValues);
      return numValues.indexOf(bestValue);
    }
    
    return -1;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-gray-900 p-4 text-left text-sm font-bold text-white/60 uppercase tracking-wider">
              Attribute
            </th>
            {products.map((product, index) => (
              <th
                key={index}
                className="p-4 text-center text-sm font-bold text-white min-w-[140px]"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-white">{product.name}</div>
                  <div className="text-white/40 text-xs font-normal">{product.brand}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attributes.map((attribute, attrIndex) => {
            const bestIndex = getBestValueIndex(attribute);
            
            return (
              <tr
                key={attribute.key}
                className={attrIndex % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}
              >
                <td className="sticky left-0 z-10 bg-inherit p-4 text-sm font-medium text-white/80">
                  {attribute.label}
                </td>
                {products.map((product, prodIndex) => {
                  const value = attribute.getValue(product);
                  const displayValue = attribute.formatter
                    ? attribute.formatter(value)
                    : value;
                  const isBest = bestIndex === prodIndex;

                  return (
                    <td
                      key={prodIndex}
                      className={`
                        p-4 text-center text-sm font-semibold
                        transition-colors duration-300
                        ${isBest
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-white/80'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {displayValue}
                        {isBest && (
                          <LucideArrowUp size={16} className="text-emerald-400" />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
