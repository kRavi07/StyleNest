'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    ChevronDown,
} from 'lucide-react';

const ToolbarDropdown = ({
    children,
    trigger,
    tooltip
}: {
    children: React.ReactNode;
    trigger: React.ReactNode;
    tooltip: string;
}) => (
    <TooltipProvider>
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-3 hover:bg-blue-50 transition-colors duration-200 text-blue-700 hover:text-blue-800 border-0"
                        >
                            {trigger}
                            <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px]">
                    {children}
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>
                <p className="text-xs">{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default ToolbarDropdown;