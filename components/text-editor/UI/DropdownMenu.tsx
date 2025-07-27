import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { DropdownMenuProps } from '../../lib/types';

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  theme = 'light',
  tailwindConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: any) => {
    if (!item.disabled) {
      item.action();
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          tailwindConfig?.toolbar?.button?.base || 'inline-flex items-center justify-center h-9 px-3 rounded-md font-medium transition-all',
          tailwindConfig?.toolbar?.button?.inactive || 'hover:bg-gray-100 text-gray-700',
          {
            [tailwindConfig?.toolbar?.button?.active || 'bg-blue-100 text-blue-700']: isOpen,
          }
        )}
      >
        {trigger}
        <ChevronDown 
          size={14} 
          className={clsx(
            'ml-1 transition-transform',
            { 'rotate-180': isOpen }
          )} 
        />
      </button>

      {isOpen && (
        <div
          className={clsx(
            'absolute top-full left-0 mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]',
            {
              'bg-gray-900 border-gray-700': theme === 'dark',
            }
          )}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={clsx(
                'w-full flex items-center px-3 py-2 text-sm text-left transition-colors',
                {
                  'hover:bg-gray-100 text-gray-700': theme === 'light' && !item.disabled,
                  'hover:bg-gray-800 text-gray-300': theme === 'dark' && !item.disabled,
                  'text-gray-400 cursor-not-allowed': item.disabled,
                }
              )}
            >
              {item.icon && (
                <span className="mr-2 flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className={clsx(
                  'ml-2 text-xs',
                  {
                    'text-gray-400': theme === 'light',
                    'text-gray-500': theme === 'dark',
                  }
                )}>
                  {item.shortcut}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};