import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Palette, Check } from 'lucide-react';
import { ColorPickerProps } from '../../lib/types';

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  onColorSelect,
  allowCustom = false,
  theme = 'light',
  tailwindConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#000000');

  const handleColorSelect = (color: string) => {
    onColorSelect(color);
    setIsOpen(false);
  };

  const handleCustomColorSubmit = () => {
    onColorSelect(customColor);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          tailwindConfig?.toolbar?.button?.base || 'inline-flex items-center justify-center h-9 w-9 rounded-md font-medium transition-all',
          tailwindConfig?.toolbar?.button?.inactive || 'hover:bg-gray-100 text-gray-700',
          {
            [tailwindConfig?.toolbar?.button?.active || 'bg-blue-100 text-blue-700']: isOpen,
          }
        )}
      >
        <Palette size={16} />
      </button>

      {isOpen && (
        <div
          className={clsx(
            'absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]',
            {
              'bg-gray-900 border-gray-700': theme === 'dark',
            }
          )}
        >
          <div className="grid grid-cols-6 gap-2 mb-3">
            {colors.map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-md border-2 border-gray-200 hover:scale-110 transition-transform relative"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              >
                <Check 
                  size={12} 
                  className={clsx(
                    'absolute inset-0 m-auto',
                    color === '#000000' || color.toLowerCase() === '#ffffff' 
                      ? 'text-gray-500' 
                      : 'text-white'
                  )}
                  style={{ 
                    opacity: 0,
                    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))'
                  }}
                />
              </button>
            ))}
          </div>

          {allowCustom && (
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className={clsx(
                    'flex-1 px-2 py-1 text-sm border border-gray-300 rounded',
                    {
                      'bg-gray-800 border-gray-600 text-white': theme === 'dark',
                    }
                  )}
                  placeholder="#000000"
                />
                <button
                  onClick={handleCustomColorSubmit}
                  className={clsx(
                    'px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors',
                    {
                      'bg-blue-600 hover:bg-blue-700': theme === 'dark',
                    }
                  )}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};