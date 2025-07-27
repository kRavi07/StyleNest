'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Highlighter,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Quote,
    Link,
    Image,
    Table,
    Undo,
    Redo,
    ChevronDown,
    Type,
    CheckSquare,
    Minus,
} from 'lucide-react';


const ToolbarButton = ({
    children,
    onClick,
    isActive = false,
    disabled = false,
    tooltip,
    variant = "ghost"
}: {
    children: React.ReactNode;
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    tooltip: string;
    variant?: "ghost" | "default";
}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Toggle
                    pressed={isActive}
                    onPressedChange={onClick}
                    disabled={disabled}
                    size="sm"
                    className={`
            h-9 w-9 p-0 
            data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:shadow-sm
            hover:bg-blue-50 hover:text-blue-700
            border-0 transition-all duration-200
            text-blue-600
            ${isActive ? 'bg-blue-600 text-blue-100 shadow-sm' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    {children}
                </Toggle>
            </TooltipTrigger>
            <TooltipContent>
                <p className="text-xs">{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default ToolbarButton;