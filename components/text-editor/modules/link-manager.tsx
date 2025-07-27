// components/Editor/Toolbar/modules/LinkManager.tsx
import React, { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
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

const LinkManager = ({ editor }: { editor: Editor }) => {
    const [open, setOpen] = useState(false);
    const [link, setLink] = useState("");

    const handleOpenChange = (val: boolean) => {
        if (editor.isActive("link")) {
            const href = editor.getAttributes("link").href;
            setLink(href || "");
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        }
        setOpen(val);
    };

    const handleSetLink = useCallback(() => {
        const normalized = link.startsWith("http://") || link.startsWith("https://")
            ? link
            : `https://${link}`;
        editor.chain().focus().extendMarkRange("link").setLink({ href: normalized }).run();
        setOpen(false);
        setLink("");
    }, [editor, link]);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className={editor.isActive("link") ? "bg-slate-500 text-white" : ""}
                >
                    <LinkIcon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogTitle>Insert Link</DialogTitle>
                <DialogDescription className="space-y-2">
                    <Label>URL</Label>
                    <Input
                        placeholder="https://example.com"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </DialogDescription>
                <DialogClose asChild>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button variant="default" onClick={handleSetLink}>
                            Submit
                        </Button>
                    </div>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default LinkManager;
