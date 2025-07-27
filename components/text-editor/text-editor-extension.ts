import { BulletList, OrderedList, ListItem } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { Color, TextStyle, FontFamily } from "@tiptap/extension-text-style";
import HardBreak from "@tiptap/extension-hard-break";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import FontSize from "./extensions/FontSize";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { mergeAttributes } from "@tiptap/react";
export const extensions: any = [
  StarterKit,
  Paragraph.extend({
    parseHTML() {
      return [{ tag: "div" }];
    },
    renderHTML({ HTMLAttributes }) {
      return [
        "div",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        0,
      ];
    },
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc px-4",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal px-4",
    },
  }),

  Text,
  FontFamily,
  TextStyle,
  HardBreak,
  Link.extend({ inclusive: false }).configure({
    openOnClick: false,

    HTMLAttributes: {
      class: "text-blue-500 underline px-1",
    },
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph", "textStyle", "link", "image"],
  }),

  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,

  FontSize.configure({
    types: ["textStyle"],
  }),
  Color,
  Typography.configure({
    oneHalf: false,
    oneQuarter: false,
    threeQuarters: false,
  }),

  Youtube.configure({
    controls: false,
    nocookie: true,
    autoplay: true,
    modestBranding: true,
  }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
];
