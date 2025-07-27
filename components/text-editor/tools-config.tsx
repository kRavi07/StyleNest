
import { Editor } from "@tiptap/react";
import {
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  LinkBreak1Icon,
  CodeSandboxLogoIcon,
} from "@radix-ui/react-icons";

import {
  ImageIcon,
  FileUpIcon,
  Strikethrough,
  Code,
  ListOrdered,
  LucideAlignLeft,
  AlignCenterIcon,
  LucideAlignRight,
  Quote,
  TableIcon,
  Undo,
  Redo,
  YoutubeIcon,
  LinkIcon,
} from "lucide-react";

export const TOOLBAR_ITEMS = [
  {
    id: "bold",
    type: "button",
    icon: <FontBoldIcon className="h-4 w-4" />,
    tooltip: "Toggle Bold",
    action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    active: (editor: Editor) => editor.isActive("bold"),
  },
  {
    id: "italic",
    type: "button",
    icon: <FontItalicIcon className="h-4 w-4" />,
    tooltip: "Toggle Italic",
    action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    active: (editor: Editor) => editor.isActive("italic"),
  },
  {
    id: "paragraph",
    type: "button",
    icon: <div className="h-4 w-4">P</div>,
    tooltip: "Toggle Paragraph",
    action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
    active: (editor: Editor) => editor.isActive("paragraph"),
  },

  {
    id: "strike",
    type: "button",
    icon: <Strikethrough className="h-4 w-4" />,
    tooltip: "Toggle Strikethrough",
    action: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
    active: (editor: Editor) => editor.isActive("strike"),
  },
  {
    id: "code",
    type: "button",
    icon: <Code className="h-4 w-4" />,
    tooltip: "Toggle Code",
    action: (editor: Editor) => editor.chain().focus().toggleCode().run(),
    active: (editor: Editor) => editor.isActive("code"),
  },
  {
    id: "bullet-list",
    type: "button",
    icon: <ListBulletIcon className="h-4 w-4" />,
    tooltip: "Toggle Bullet List",
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
    active: (editor: Editor) => editor.isActive("bulletList"),
  },

  {
    id: "ordered-list",
    type: "button",
    icon: <ListOrdered className="h-4 w-4" />,
    tooltip: "Toggle Ordered List",
    action: (editor: Editor) =>
      editor.chain().focus().toggleOrderedList().run(),
    active: (editor: Editor) => editor.isActive("ordered-list"),
  },
  {
    id: "left",
    type: "button",
    icon: <LucideAlignLeft className="h-4 w-4" />,
    tooltip: "Align Left",
    action: (editor: Editor) =>
      editor.chain().focus().setTextAlign("left").run(),
    active: (editor: Editor) => editor.isActive({ textAlign: "left" }),
  },
  {
    id: "center",
    type: "button",
    icon: <AlignCenterIcon className="h-4 w-4" />,
    tooltip: "Align Center",
    action: (editor: Editor) =>
      editor.chain().focus().setTextAlign("center").run(),
    active: (editor: Editor) => editor.isActive({ textAlign: "center" }),
  },
  {
    id: "right",
    type: "button",
    icon: <LucideAlignRight className="h-4 w-4" />,
    tooltip: "Align Right",
    action: (editor: Editor) =>
      editor.chain().focus().setTextAlign("right").run(),
    active: (editor: Editor) => editor.isActive({ textAlign: "right" }),
  },
  {
    id: "line-break",
    type: "button",
    icon: <LinkBreak1Icon className="h-4 w-4" />,
    tooltip: "Insert Line Break",
    action: (editor: Editor) => editor.chain().focus().setHardBreak().run(),
    active: () => false,
  },
  {
    id: "code-block",
    type: "button",
    icon: <CodeSandboxLogoIcon className="h-4 w-4" />,
    tooltip: "Toggle Code Block",
    action: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
    active: (editor: Editor) => editor.isActive("code-block"),
  },
  {
    id: "blockquote",
    type: "button",
    icon: <Quote className="h-4 w-4" />,
    tooltip: "Toggle Blockquote",
    action: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
    active: (editor: Editor) => editor.isActive("blockquote"),
  },
];


export const TOOLBAR_HEADING_OPTIONS = [
  {
    id: "h1",
    type: "button",
    icon: <div className="h-4 w-4">H1</div>,
    tooltip: "Toggle Heading 1",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    active: (editor: Editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    id: "h2",
    type: "button",
    icon: <div className="h-4 w-4">H2</div>,
    tooltip: "Toggle Heading 2",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    active: (editor: Editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    id: "h3",
    type: "button",
    icon: <div className="h-4 w-4">H3</div>,
    tooltip: "Toggle Heading 3",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    active: (editor: Editor) => editor.isActive("heading", { level: 3 }),
  },
  {
    id: "h4",
    type: "button",
    icon: <div className="h-4 w-4">H4</div>,
    tooltip: "Toggle Heading 4",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 4 }).run(),
    active: (editor: Editor) => editor.isActive("heading", { level: 4 }),
  },
  {
    id: "h5",
    type: "button",
    icon: <div className="h-4 w-4">H5</div>,
    tooltip: "Toggle Heading 5",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 5 }).run(),
    active: (editor: Editor) => editor.isActive("heading", { level: 5 }),
  },
  {
    id: "h6",
    type: "button",
    icon: <div className="h-4 w-4">H6</div>,
    tooltip: "Toggle Heading 6",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 6 }).run(),
    active: (editor: Editor) => editor.isActive("heading", { level: 6 }),
  },
]

export const FONT_FAMILY_GROUPS = [
  {
    label: "Sans Serif",
    options: [
      { label: "Inter", value: "Inter" },
      { label: "Arial", value: "Arial" },
      { label: "Helvetica", value: "Helvetica" },
    ],
  },
  {
    label: "Serif",
    options: [
      { label: "Times New Roman", value: "Times" },
      { label: "Garamond", value: "Garamond" },
      { label: "Georgia", value: "Georgia" },
    ],
  },
  {
    label: "Monospace",
    options: [
      { label: "Courier", value: "Courier" },
      { label: "Courier New", value: "Courier New" },
    ],
  },
];
