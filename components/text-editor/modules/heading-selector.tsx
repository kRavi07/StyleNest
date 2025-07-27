"use client";

import { Type } from "lucide-react";
import { Editor } from "@tiptap/react";
import ToolbarDropdown from "../UI/toolbardropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = {
    editor: Editor;
};

type Level = 1 | 2 | 3 | 4 | 5 | 6;


const levels: Level[] = [1, 2, 3, 4, 5, 6];

export const HeadingSelector = ({ editor }: Props) => {
    if (!editor) return null;

    const getCurrentHeading = (): string => {
        if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
        if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
        if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
        if (editor.isActive('heading', { level: 4 })) return 'Heading 4';
        if (editor.isActive('heading', { level: 5 })) return 'Heading 5';
        if (editor.isActive('heading', { level: 6 })) return 'Heading 6';
        return 'Normal Text';
    };

    const isActiveHeading = (level: number): boolean => {
        return editor.isActive("heading", { level });
    };

    return (
        <ToolbarDropdown
            trigger={
                <div className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    <span className="text-sm font-medium">{getCurrentHeading()}</span>
                </div>
            }
            tooltip="Text style"
        >
            <DropdownMenuItem
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`flex items-center gap-2 ${editor.isActive("paragraph") ? "bg-blue-100 text-blue-700 font-semibold" : ""
                    }`}
            >
                <Type className="w-4 h-4" />
                Normal Text
            </DropdownMenuItem>

            {levels.map((level) => (
                <DropdownMenuItem
                    key={level}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level }).run()
                    }
                    className={`flex items-center gap-2 ${isActiveHeading(level)
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : ""
                        }`}
                >
                    <span className="w-5 text-left font-bold">{`H${level}`}</span>
                    {`Heading ${level}`}
                </DropdownMenuItem>
            ))}
        </ToolbarDropdown>
    );
};
