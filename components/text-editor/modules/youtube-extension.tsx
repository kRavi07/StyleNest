// components/Editor/Toolbar/modules/YoutubeEmbed.tsx
import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { YoutubeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const YoutubeEmbed = ({ editor }: { editor: Editor }) => {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [width, setWidth] = useState("640");
    const [height, setHeight] = useState("480");

    const handleSubmit = () => {
        if (!youtubeUrl) return;

        editor.commands.setYoutubeVideo({
            src: youtubeUrl,
            width: parseInt(width, 10) || 640,
            height: parseInt(height, 10) || 480,
        });

        setYoutubeUrl("");
        setWidth("640");
        setHeight("480");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" aria-label="Insert YouTube">
                    <YoutubeIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogTitle>Insert YouTube Video</DialogTitle>
                <DialogDescription className="space-y-3">
                    <div>
                        <Label>YouTube URL</Label>
                        <Input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Label>Width</Label>
                            <Input value={width} onChange={(e) => setWidth(e.target.value)} />
                        </div>
                        <div className="flex-1">
                            <Label>Height</Label>
                            <Input value={height} onChange={(e) => setHeight(e.target.value)} />
                        </div>
                    </div>
                </DialogDescription>
                <DialogClose asChild>
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline">Cancel</Button>
                        <Button variant="default" onClick={handleSubmit}>
                            Insert
                        </Button>
                    </div>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default YoutubeEmbed;
