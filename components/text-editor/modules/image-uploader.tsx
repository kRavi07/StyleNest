// components/Editor/Toolbar/modules/ImageUploader.tsx
import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileUpIcon, ImageIcon } from "lucide-react";

const ImageUploader = ({ editor }: { editor: Editor }) => {
    const [imageUploadUrl, setImageUploadUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                setImageUploadUrl(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (imageUploadUrl) {
            editor.chain().focus().setImage({ src: imageUploadUrl, alt: "image" }).run();
            setImageUploadUrl("");
        }
    }, [imageUploadUrl, editor]);

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" aria-label="Upload image">
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                        <DialogTitle>Upload Image</DialogTitle>
                        <DialogDescription>
                            <div className="w-full flex items-center gap-3">
                                <Input
                                    type="file"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <FileUpIcon
                                    className="w-6 h-6 cursor-pointer"
                                    onClick={handleIconClick}
                                />
                                <span>Choose Image File</span>
                            </div>
                        </DialogDescription>
                        <DialogClose asChild>
                            <div className="flex justify-end mt-4">
                                <Button type="button" variant="outline">
                                    Close
                                </Button>
                            </div>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            </TooltipTrigger>
            <TooltipContent className="bg-white">Insert Image</TooltipContent>
        </Tooltip>
    );
};

export default ImageUploader;
