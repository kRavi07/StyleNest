import { TailwindConfig, ToolbarConfig } from "./editor.types";

export const defaultTailwindConfig: TailwindConfig = {
  editor: {
    container:
      "border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200",
    content: "prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none",
    placeholder: "text-gray-400",
    focus: "ring-2 ring-blue-500 border-blue-500",
  },
  toolbar: {
    container:
      "flex items-center p-2 space-x-1 border-b border-gray-200 bg-white",
    group: "flex items-center space-x-1",
    button: {
      base: "inline-flex items-center justify-center h-9 w-9 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
      active: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      inactive: "hover:bg-gray-100 active:bg-gray-200 text-gray-700",
      hover: "hover:bg-gray-100",
      disabled: "opacity-50 cursor-not-allowed",
    },
    divider: "w-px h-6 bg-gray-300 mx-1",
  },
  menus: {
    bubble:
      "flex items-center p-2 space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg",
    floating:
      "flex items-center p-2 space-x-1 bg-white border border-gray-200 rounded-lg shadow-lg",
  },
  footer: {
    container:
      "px-4 py-2 border-t border-gray-200 bg-gray-50 flex justify-between items-center",
    characterCount: "text-sm text-gray-500",
  },
};

export const darkTailwindConfig: TailwindConfig = {
  editor: {
    container:
      "border border-gray-700 rounded-lg overflow-hidden bg-gray-900 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all duration-200",
    content:
      "prose prose-invert prose-sm max-w-none p-4 min-h-[200px] focus:outline-none",
    placeholder: "text-gray-500",
    focus: "ring-2 ring-blue-400 border-blue-400",
  },
  toolbar: {
    container:
      "flex items-center p-2 space-x-1 border-b border-gray-700 bg-gray-900",
    group: "flex items-center space-x-1",
    button: {
      base: "inline-flex items-center justify-center h-9 w-9 rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed",
      active: "bg-blue-900 text-blue-300 hover:bg-blue-800",
      inactive: "hover:bg-gray-800 active:bg-gray-700 text-gray-300",
      hover: "hover:bg-gray-800",
      disabled: "opacity-50 cursor-not-allowed",
    },
    divider: "w-px h-6 bg-gray-600 mx-1",
  },
  menus: {
    bubble:
      "flex items-center p-2 space-x-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg",
    floating:
      "flex items-center p-2 space-x-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg",
  },
  footer: {
    container:
      "px-4 py-2 border-t border-gray-700 bg-gray-800 flex justify-between items-center",
    characterCount: "text-sm text-gray-400",
  },
};

export const defaultToolbarConfig: ToolbarConfig = {
  bold: { tooltip: "Bold", shortcut: "Ctrl+B" },
  italic: { tooltip: "Italic", shortcut: "Ctrl+I" },
  underline: { tooltip: "Underline", shortcut: "Ctrl+U" },
  strike: { tooltip: "Strikethrough", shortcut: "Ctrl+Shift+X" },
  code: { tooltip: "Inline Code", shortcut: "Ctrl+E" },

  heading: {
    levels: [1, 2, 3],
    showDropdown: true,
    labels: {
      1: "Heading 1",
      2: "Heading 2",
      3: "Heading 3",
    },
  },

  bulletList: { tooltip: "Bullet List" },
  orderedList: { tooltip: "Numbered List" },
  taskList: { tooltip: "Task List" },

  blockquote: { tooltip: "Quote" },
  codeBlock: {
    tooltip: "Code Block",
    showLanguageSelector: true,
    languages: ["javascript", "typescript", "python", "html", "css", "json"],
  },
  horizontalRule: { tooltip: "Horizontal Rule" },

  link: {
    tooltip: "Link",
    allowEdit: true,
    validation: (url: string) => /^https?:\/\//.test(url),
  },
  image: {
    tooltip: "Image",
    allowResize: true,
    allowAlignment: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },

  table: {
    tooltip: "Table",
    defaultRows: 3,
    defaultCols: 3,
    allowResize: true,
    allowHeaderToggle: true,
  },

  textAlign: {
    options: ["left", "center", "right", "justify"],
  },

  color: {
    tooltip: "Text Color",
    colors: [
      "#000000",
      "#374151",
      "#dc2626",
      "#ea580c",
      "#d97706",
      "#65a30d",
      "#059669",
      "#0891b2",
      "#2563eb",
      "#7c3aed",
      "#c026d3",
      "#e11d48",
    ],
    allowCustom: true,
    showPalette: true,
  },

  highlight: {
    tooltip: "Highlight",
    colors: [
      "#fef3c7",
      "#fde68a",
      "#fed7aa",
      "#fecaca",
      "#f3e8ff",
      "#e0e7ff",
      "#dbeafe",
      "#d1fae5",
      "#a7f3d0",
      "#fde2e8",
      "#f1f5f9",
      "#e2e8f0",
    ],
    allowCustom: true,
    showPalette: true,
  },

  subscript: { tooltip: "Subscript" },
  superscript: { tooltip: "Superscript" },

  fontSize: {
    tooltip: "Font Size",
    sizes: [12, 14, 16, 18, 20, 24, 28, 32],
    showDropdown: true,
  },

  fontFamily: {
    tooltip: "Font Family",
    fonts: [
      "Inter",
      "Roboto",
      "Open Sans",
      "Lato",
      "Montserrat",
      "Source Sans Pro",
    ],
    showDropdown: true,
  },

  layout: {
    position: "top",
    alignment: "left",
    size: "md",
    spacing: "normal",
    rounded: "md",
    shadow: "sm",
    border: true,
    backdrop: "none",
  },

  responsive: {
    breakpoints: {
      sm: ["bold", "italic", "bulletList", "orderedList"],
      md: [
        "bold",
        "italic",
        "underline",
        "heading",
        "bulletList",
        "orderedList",
        "link",
      ],
      lg: [
        "bold",
        "italic",
        "underline",
        "strike",
        "code",
        "heading",
        "bulletList",
        "orderedList",
        "taskList",
        "blockquote",
        "link",
        "image",
        "table",
      ],
    },
    collapsible: true,
    moreButton: {
      tooltip: "More options",
    },
  },
};
