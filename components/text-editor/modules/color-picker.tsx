// components/Editor/Toolbar/modules/ColorPicker.tsx
import React, { useRef } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const ColorPicker = ({ editor }: { editor: Editor }) => {
    const colorInputRef = useRef<HTMLInputElement>(null);

    const handleColorClick = () => {
        colorInputRef.current?.click();
    };

    return (
        <>
            <input
                title="Text Color"
                type="color"
                onInput={(event: any) =>
                    editor.chain().focus().setColor(event.target.value).run()
                }
                value={editor.getAttributes("textStyle").color || "#000000"}
                data-testid="setColor"
                className="hidden"
                ref={colorInputRef}
            />

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={handleColorClick} aria-label="Select color">
                        <div
                            className="w-4 h-4 rounded-sm border"
                            style={{
                                background: editor.getAttributes("textStyle").color || "#000000",
                            }}
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white">Text Color</TooltipContent>
            </Tooltip>
        </>
    );
};

export default ColorPicker;
