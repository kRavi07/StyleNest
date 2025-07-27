import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { ToggleGroup } from "@/components/ui/toggle-group";

import {
  ImageIcon,
  FileUpIcon,
  TableIcon,
  YoutubeIcon,
  LinkIcon,
  Type,
  Undo,
  Redo,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TOOLBAR_ITEMS } from "./tools-config";
import { FontFamilySelect } from "./FontFamilyPicker";
import React from "react";
import { toast } from "sonner";
import { Editor } from "@tiptap/react";
import ToolbarButton from "./UI/ToolbarButton";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import ToolbarDropdown from "./UI/toolbardropdown";
import ColorPicker from "./modules/color-picker";
import ImageUploader from "./modules/image-uploader";
import { HeadingSelector } from "./modules/heading-selector";
import TableDropdown from "./modules/table-dropdown";
import LinkManager from "./modules/link-manager";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

const TableMenu = ({ editor }: any) => [
  {
    id: 1,
    name: "Insert Table",
    action: () =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    id: 2,
    name: "Add Column Before",
    action: () => editor.chain().focus().addColumnBefore().run(),
  },
  {
    id: 3,
    name: "Add Column After",
    action: () => editor.chain().focus().addColumnAfter().run(),
  },
  {
    id: 4,
    name: "Delete Column",
    action: () => editor.chain().focus().deleteColumn().run(),
  },
  {
    id: 5,
    name: "Add Row Before",
    action: () => editor.chain().focus().addRowBefore().run(),
  },
  {
    id: 6,
    name: "Add Row After",
    action: () => editor.chain().focus().addRowAfter().run(),
  },
  {
    id: 7,
    name: "Delete Row",
    action: () => editor.chain().focus().deleteRow().run(),
  },
  {
    id: 8,
    name: "Delete Table",
    action: () => editor.chain().focus().deleteTable().run(),
  },
  {
    id: 9,
    name: "Merge Cells",
    action: () => editor.chain().focus().mergeCells().run(),
  },
  {
    id: 11,
    name: "Toggle Header Column",
    action: () => editor.chain().focus().toggleHeaderColumn().run(),
  },
  {
    id: 12,
    name: "Toggle Header Row",
    action: () => editor.chain().focus().toggleHeaderRow().run(),
  },
  {
    id: 13,
    name: "Toggle Header Cell",
    action: () => editor.chain().focus().toggleHeaderCell().run(),
  },
  {
    id: 14,
    name: "Merge Or Split",
    action: () => editor.chain().focus().mergeOrSplit().run(),
  },
  {
    id: 15,
    name: "Set Cell Attribute",
    action: () => editor.chain().focus().setCellAttribute("colspan", 2).run(),
  },
];

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const [imageUploadUrl, setImageUploadUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const [youtube_url, setYoutubeUrl] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [openLinkPanel, setOpenLinkPanel] = useState<boolean>(false);

  useEffect(() => {
    editor.commands.setFontSize("16px");
  }, [editor]);

  const [fontFamily, setFontFamily] = React.useState("");



  useEffect(() => {
    if (imageUploadUrl != "") {
      editor
        ?.chain()
        .focus()
        .setImage({
          src: imageUploadUrl,
          alt: "image",
        })
        .run();
    }

    return () => {
      setImageUploadUrl("");
    };
  }, [editor, imageUploadUrl]);



  if (!editor) {
    return null;
  }




  const handleFontChange = (newFont: string) => {
    setFontFamily(newFont);
    editor.chain().focus().setFontFamily(newFont).run();
  };



  return (
    <div className="flex flex-wrap gap-3 justify-center items-center border rounded px-2 py-2  w-full border-b border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50
    dark:bg-graident-to-r dark:from-slate-900 dark:via-slate-800 dark:to-slate-900  shadow-sm">
      <ToggleGroup
        type="multiple"
        className="w-full flex flex-wrap justify-start items-center gap-2"
      >
        <TooltipProvider>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              tooltip="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              tooltip="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          <Separator orientation="vertical" className="mx-2 h-6 bg-blue-200" />



          <ColorPicker editor={editor} />
          <ImageUploader editor={editor} />
          <FontFamilySelect value={fontFamily} onChange={handleFontChange} />
          <HeadingSelector editor={editor} />
          <LinkManager editor={editor} />



          {TOOLBAR_ITEMS.map(({ tooltip, id, icon, action, active }) => (
            <ToolbarButton
              key={id}
              tooltip={tooltip}
              onClick={() => action(editor)}
              isActive={active && active(editor)}
            >
              {icon}
            </ToolbarButton>
          ))}

          <Menubar className="rounded-none border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="border-none bg-transparent text-blue-400  rounded-none">
                <TableIcon className="h-4 w-4" />
              </MenubarTrigger>
              <MenubarContent className="bg-white p-1">
                {TableMenu({ editor }).map((menuItem) => (
                  <MenubarItem key={menuItem.id} onClick={menuItem.action}
                    className={cn("hover:bg-slate-200 bg-transparent text-blue-400", ""
                    )}>
                    {menuItem.name}
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          {/* Add link extension*

          <Dialog open={openLinkPanel} onOpenChange={handleOpenLinkPanel}>
            <DialogTrigger>
              <Button
                variant="ghost"
                value="link"
                aria-label="Insert link"
                className={
                  editor.isActive("link") ? "bg-slate-500 text-white p-3" : ""
                }
              >
                <LinkIcon className={"w-4 h-4"} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogTitle>Insert link</DialogTitle>
              <DialogDescription>
                <div className="w-full flex flex-col gap-2">

                  <Label>Link</Label>
                  <Input
                    type="text"
                    onChange={(e) => setLink(e.target.value)}
                    value={link}
                    placeholder="www.growthbizb2b.com"
                  />
                </div>
              </DialogDescription>

              <DialogClose asChild>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant={"default"}
                    onClick={handleLink}
                  >
                    Submit
                  </Button>

                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </div>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                value="youtube"
                aria-label="Insert youtube"
                onClick={() => handleYoutube}
              >
                <YoutubeIcon className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogTitle>Insert Youtube Url</DialogTitle>
              <DialogDescription>
                <div className="w-full flex flex-col gap-2">
                  <Label>Youtube Url</Label>
                  <Input
                    type="text"
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    value={youtube_url}
                  />

                  <Label>Youtube Player Dimension</Label>
                  <div className="my-2 flex gap-2">
                    <Input
                      type="text"
                      onChange={(e) => setWidth(e.target.value)}
                      value={width}
                      placeholder="Width"
                    />

                    <Input
                      type="text"
                      onChange={(e) => setHeight(e.target.value)}
                      value={height}
                      placeholder="Height"
                    />
                  </div>
                </div>
              </DialogDescription>

              <DialogClose asChild>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant={"default"}
                    onClick={handleYoutube}
                  >
                    Submit
                  </Button>

                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </div>
              </DialogClose>
            </DialogContent>
          </Dialog>*/}
        </TooltipProvider>
      </ToggleGroup>
    </div>
  );
};
