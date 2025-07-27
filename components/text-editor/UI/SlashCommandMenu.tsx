import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { clsx } from 'clsx';

import { SlashCommandItem } from '@/lib/extensions/slashCommands';
interface SlashCommandMenuProps {
    items: SlashCommandItem[];
    command: (item: SlashCommandItem) => void;
    theme?: 'light' | 'dark';
}

export interface SlashCommandMenuRef {
    onKeyDown: (event: KeyboardEvent) => boolean;
}

export const SlashCommandMenu = forwardRef<SlashCommandMenuRef, SlashCommandMenuProps>(
    ({ items, command, theme = 'light' }, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0);
        const [filteredItems, setFilteredItems] = useState(items);
        const menuRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            setFilteredItems(items);
            setSelectedIndex(0);
        }, [items]);

        const selectItem = (index: number) => {
            const item = filteredItems[index];
            if (item) {
                command(item);
            }
        };

        useImperativeHandle(ref, () => ({
            onKeyDown: (event: KeyboardEvent) => {
                if (event.key === 'ArrowUp') {
                    setSelectedIndex((selectedIndex + filteredItems.length - 1) % filteredItems.length);
                    return true;
                }

                if (event.key === 'ArrowDown') {
                    setSelectedIndex((selectedIndex + 1) % filteredItems.length);
                    return true;
                }

                if (event.key === 'Enter') {
                    selectItem(selectedIndex);
                    return true;
                }

                return false;
            },
        }));

        // Group items by category
        const groupedItems = filteredItems.reduce((acc, item) => {
            const category = item.category || 'other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, SlashCommandItem[]>);

        const categoryOrder = ['basic', 'lists', 'media', 'advanced', 'other'];
        const sortedCategories = categoryOrder.filter(cat => groupedItems[cat]);

        return (
            <div
                ref={menuRef}
                className={clsx(
                    'slash-command-menu',
                    'w-80 max-h-96 overflow-y-auto rounded-lg border shadow-lg z-50',
                    {
                        'bg-white border-gray-200': theme === 'light',
                        'bg-gray-900 border-gray-700': theme === 'dark',
                    }
                )}
            >
                {sortedCategories.map((category) => (
                    <div key={category} className="py-2">
                        <div
                            className={clsx(
                                'px-3 py-1 text-xs font-medium uppercase tracking-wide',
                                {
                                    'text-gray-500': theme === 'light',
                                    'text-gray-400': theme === 'dark',
                                }
                            )}
                        >
                            {category}
                        </div>
                        {groupedItems[category].map((item, index) => {
                            const globalIndex = filteredItems.indexOf(item);
                            return (
                                <button
                                    key={`${category}-${index}`}
                                    className={clsx(
                                        'w-full flex items-center px-3 py-2 text-left transition-colors',
                                        {
                                            'hover:bg-gray-100': theme === 'light' && globalIndex !== selectedIndex,
                                            'hover:bg-gray-800': theme === 'dark' && globalIndex !== selectedIndex,
                                            'bg-blue-100 text-blue-900': theme === 'light' && globalIndex === selectedIndex,
                                            'bg-blue-900 text-blue-100': theme === 'dark' && globalIndex === selectedIndex,
                                        }
                                    )}
                                    onClick={() => selectItem(globalIndex)}
                                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                                >
                                    <div className="flex items-center space-x-3 w-full">
                                        <div
                                            className={clsx(
                                                'flex items-center justify-center w-10 h-10 rounded-lg text-lg',
                                                {
                                                    'bg-gray-100': theme === 'light' && globalIndex !== selectedIndex,
                                                    'bg-gray-800': theme === 'dark' && globalIndex !== selectedIndex,
                                                    'bg-blue-200': theme === 'light' && globalIndex === selectedIndex,
                                                    'bg-blue-800': theme === 'dark' && globalIndex === selectedIndex,
                                                }
                                            )}
                                        >
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div
                                                className={clsx(
                                                    'font-medium',
                                                    {
                                                        'text-gray-900': theme === 'light',
                                                        'text-gray-100': theme === 'dark',
                                                    }
                                                )}
                                            >
                                                {item.title}
                                            </div>
                                            <div
                                                className={clsx(
                                                    'text-sm truncate',
                                                    {
                                                        'text-gray-500': theme === 'light',
                                                        'text-gray-400': theme === 'dark',
                                                    }
                                                )}
                                            >
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ))}
                {filteredItems.length === 0 && (
                    <div
                        className={clsx(
                            'px-3 py-8 text-center',
                            {
                                'text-gray-500': theme === 'light',
                                'text-gray-400': theme === 'dark',
                            }
                        )}
                    >
                        No matching commands
                    </div>
                )}
            </div>
        );
    }
);

SlashCommandMenu.displayName = 'SlashCommandMenu';