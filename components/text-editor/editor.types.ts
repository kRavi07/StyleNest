import { Editor, Extension } from "@tiptap/core";
import { ReactNode } from "react";

export interface TailwindConfig {
  editor?: {
    container?: string;
    content?: string;
    placeholder?: string;
    focus?: string;
  };
  toolbar?: {
    container?: string;
    group?: string;
    button?: {
      base?: string;
      active?: string;
      inactive?: string;
      hover?: string;
      disabled?: string;
    };
    divider?: string;
  };
  menus?: {
    bubble?: string;
    floating?: string;
  };
  footer?: {
    container?: string;
    characterCount?: string;
  };
}

export interface ToolbarLayout {
  position?: "top" | "bottom" | "floating" | "sticky";
  alignment?: "left" | "center" | "right" | "space-between";
  size?: "sm" | "md" | "lg";
  spacing?: "tight" | "normal" | "loose";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  border?: boolean;
  backdrop?: "none" | "blur" | "solid";
}

export type ToolbarConfigMap = {
  bold: { icon?: ReactNode; tooltip?: string; shortcut?: string };
  italic: { icon?: ReactNode; tooltip?: string; shortcut?: string };
  underline: { icon?: ReactNode; tooltip?: string; shortcut?: string };
  strike: { icon?: ReactNode; tooltip?: string; shortcut?: string };
  code: { icon?: ReactNode; tooltip?: string; shortcut?: string };

  heading: {
    levels: number[];
    showDropdown?: boolean;
    icons?: { [key: number]: ReactNode };
    labels?: { [key: number]: string };
  };

  bulletList: { icon?: ReactNode; tooltip?: string };
  orderedList: { icon?: ReactNode; tooltip?: string };
  taskList: { icon?: ReactNode; tooltip?: string };

  blockquote: { icon?: ReactNode; tooltip?: string };
  codeBlock: {
    icon?: ReactNode;
    tooltip?: string;
    languages?: string[];
    showLanguageSelector?: boolean;
  };
  horizontalRule: { icon?: ReactNode; tooltip?: string };

  link: {
    icon?: ReactNode;
    tooltip?: string;
    allowEdit?: boolean;
    validation?: (url: string) => boolean;
  };
  image: {
    icon?: ReactNode;
    tooltip?: string;
    allowResize?: boolean;
    allowAlignment?: boolean;
    maxSize?: number;
    acceptedTypes?: string[];
  };

  table: {
    icon?: ReactNode;
    tooltip?: string;
    defaultRows?: number;
    defaultCols?: number;
    allowResize?: boolean;
    allowHeaderToggle?: boolean;
  };

  textAlign: {
    options?: ("left" | "center" | "right" | "justify")[];
    icons?: { [key: string]: ReactNode };
  };

  color: {
    icon?: ReactNode;
    tooltip?: string;
    colors?: string[];
    allowCustom?: boolean;
    showPalette?: boolean;
  };
  highlight: {
    icon?: ReactNode;
    tooltip?: string;
    colors?: string[];
    allowCustom?: boolean;
    showPalette?: boolean;
  };

  subscript: { icon?: ReactNode; tooltip?: string };
  superscript: { icon?: ReactNode; tooltip?: string };
  fontSize: {
    icon?: ReactNode;
    tooltip?: string;
    sizes?: number[];
    showDropdown?: boolean;
  };
  fontFamily: {
    icon?: ReactNode;
    tooltip?: string;
    fonts?: string[];
    showDropdown?: boolean;
  };
};

/*

export interface ToolbarConfig {
  // Text formatting
  bold?: boolean | { icon?: ReactNode; tooltip?: string; shortcut?: string };
  italic?: boolean | { icon?: ReactNode; tooltip?: string; shortcut?: string };
  underline?:
    | boolean
    | { icon?: ReactNode; tooltip?: string; shortcut?: string };
  strike?: boolean | { icon?: ReactNode; tooltip?: string; shortcut?: string };
  code?: boolean | { icon?: ReactNode; tooltip?: string; shortcut?: string };

  // Headings
  heading?:
    | boolean
    | {
        levels: number[];
        showDropdown?: boolean;
        icons?: { [key: number]: ReactNode };
        labels?: { [key: number]: string };
      };

  // Lists
  bulletList?: boolean | { icon?: ReactNode; tooltip?: string };
  orderedList?: boolean | { icon?: ReactNode; tooltip?: string };
  taskList?: boolean | { icon?: ReactNode; tooltip?: string };

  // Block elements
  blockquote?: boolean | { icon?: ReactNode; tooltip?: string };
  codeBlock?:
    | boolean
    | {
        icon?: ReactNode;
        tooltip?: string;
        languages?: string[];
        showLanguageSelector?: boolean;
      };
  horizontalRule?: boolean | { icon?: ReactNode; tooltip?: string };

  // Media
  link?:
    | boolean
    | {
        icon?: ReactNode;
        tooltip?: string;
        allowEdit?: boolean;
        validation?: (url: string) => boolean;
      };
  image?:
    | boolean
    | {
        icon?: ReactNode;
        tooltip?: string;
        allowResize?: boolean;
        allowAlignment?: boolean;
        maxSize?: number;
        acceptedTypes?: string[];
      };

  // Tables
  table?:
    | boolean
    | {
        icon?: ReactNode;
        tooltip?: string;
        defaultRows?: number;
        defaultCols?: number;
        allowResize?: boolean;
        allowHeaderToggle?: boolean;
      };

  // Text alignment
  textAlign?:
    | boolean
    | {
        options?: ("left" | "center" | "right" | "justify")[];
        icons?: { [key: string]: ReactNode };
      };

  // Colors
  color?:
    | boolean
    | {
        icon?: ReactNode;
        tooltip?: string;
        colors?: string[];
        allowCustom?: boolean;
        showPalette?: boolean;
      };
  highlight?:
    | boolean
    | {
        icon?: ReactNode;
        tooltip?: string;
        colors?: string[];
        allowCustom?: boolean;
        showPalette?: boolean;
      };

  // Advanced formatting
  subscript?: boolean | { icon?: ReactNode; tooltip?: string };
  superscript?: boolean | { icon?: ReactNode; tooltip?: string };
  fontSize?:
    | boolean
    | {
        icon?: ReactNode;
        tooltip?: string;
        sizes?: number[];
        showDropdown?: boolean;
      };
  fontFamily?:
    | boolean
    | {
        icon?: ReactNode;
        tooltip?: string;
        fonts?: string[];
        showDropdown?: boolean;
      };

  // Layout and grouping
  groups?: ToolbarGroup[];
  layout?: ToolbarLayout;

  // Custom buttons
  custom?: ToolbarButton[];

  // Responsive behavior
  responsive?: {
    breakpoints?: {
      sm?: (keyof ToolbarConfig)[];
      md?: (keyof ToolbarConfig)[];
      lg?: (keyof ToolbarConfig)[];
    };
    collapsible?: boolean;
    moreButton?: {
      icon?: ReactNode;
      tooltip?: string;
    };
  };
}*/
export type ToolbarConfig = {
  [K in keyof ToolbarConfigMap]?: boolean | ToolbarConfigMap[K];
} & {
  groups?: ToolbarGroup[];
  layout?: ToolbarLayout;
  custom?: ToolbarButton[];
  responsive?: {
    breakpoints?: {
      sm?: (keyof ToolbarConfigMap)[];
      md?: (keyof ToolbarConfigMap)[];
      lg?: (keyof ToolbarConfigMap)[];
    };
    collapsible?: boolean;
    moreButton?: {
      icon?: ReactNode;
      tooltip?: string;
    };
  };
};

export interface ToolbarGroup {
  name: string;
  items: (keyof ToolbarConfig)[];
  separator?: boolean;
  collapsible?: boolean;
  priority?: number;
}

export interface ToolbarButton {
  name: string;
  icon: ReactNode;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
  tooltip?: string;
  shortcut?: string;
  group?: string;
  priority?: number;
}

export interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string, json: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSelectionUpdate?: (selection: any) => void;
  onTransaction?: (transaction: any) => void;

  // Basic configuration
  placeholder?: string;
  editable?: boolean;
  className?: string;

  // Theming and styling
  theme?: "light" | "dark";
  tailwindConfig?: TailwindConfig;
  customCSS?: string;

  // Toolbar configuration
  toolbar?: ToolbarConfig | false;
  showToolbar?: boolean;
  toolbarPosition?: "top" | "bottom" | "floating";

  // Extensions and features
  extensions?: Extension[];
  characterLimit?: number;
  showCharacterCount?: boolean;

  // Mentions
  enableMentions?: boolean;
  mentionSuggestions?: MentionSuggestion[];
  onMentionSearch?: (query: string) => Promise<MentionSuggestion[]>;

  // Media handling
  imageUpload?: (file: File) => Promise<string>;
  linkValidation?: (url: string) => boolean;

  // Behavior
  autoFocus?: boolean;
  spellCheck?: boolean;
  enableTypography?: boolean;
  enableCollaboration?: boolean;

  // Table options
  tableOptions?: {
    resizable?: boolean;
    allowTableNodeSelection?: boolean;
    cellMinWidth?: number;
  };

  // Advanced features
  enableSlashCommands?: boolean;
  enableMarkdown?: boolean;
  enableDragDrop?: boolean;
  enablePasteFromWord?: boolean;

  // Performance
  debounceDelay?: number;
  maxHistoryDepth?: number;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
}

export interface MentionSuggestion {
  id: string;
  label: string;
  avatar?: string;
  description?: string;
  email?: string;
  role?: string;
}

export interface EditorContextValue {
  editor: Editor | null;
  isLoading: boolean;
  characterCount: number;
  characterLimit?: number;
  theme: "light" | "dark";
  tailwindConfig?: TailwindConfig;
}

export interface ToolbarProps {
  editor: Editor;
  config: ToolbarConfig;
  theme?: "light" | "dark";
  className?: string;
  tailwindConfig?: TailwindConfig;
  floating?: boolean;
  position?: "top" | "bottom" | "floating";
}

export interface FloatingMenuProps {
  editor: Editor;
  theme?: "light" | "dark";
  tailwindConfig?: TailwindConfig;
}

export interface BubbleMenuProps {
  editor: Editor;
  theme?: "light" | "dark";
  tailwindConfig?: TailwindConfig;
}

export interface ColorPickerProps {
  colors: string[];
  onColorSelect: (color: string) => void;
  allowCustom?: boolean;
  theme?: "light" | "dark";
  tailwindConfig?: TailwindConfig;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  theme?: "light" | "dark";
  tailwindConfig?: TailwindConfig;
}

export interface DropdownItem {
  label: string;
  value: any;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  action: () => void;
}
