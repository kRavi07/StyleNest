import { Editor } from "@tiptap/react";

type TableMenuItem = {
  id: string;
  name: string;
  action: () => void;
};

export function getTableMenu(editor: Editor): TableMenuItem[] {
  const canInsertTable = editor.can().insertTable?.();
  const isInsideTable = editor.isActive("table");

  const actions: TableMenuItem[] = [];

  if (!isInsideTable && canInsertTable) {
    actions.push({
      id: "insert-table",
      name: "Insert Table",
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    });
  }

  if (isInsideTable) {
    actions.push(
      {
        id: "add-row-before",
        name: "Add Row Above",
        action: () => editor.chain().focus().addRowBefore().run(),
      },
      {
        id: "add-row-after",
        name: "Add Row Below",
        action: () => editor.chain().focus().addRowAfter().run(),
      },
      {
        id: "delete-row",
        name: "Delete Row",
        action: () => editor.chain().focus().deleteRow().run(),
      },
      {
        id: "add-column-before",
        name: "Add Column Left",
        action: () => editor.chain().focus().addColumnBefore().run(),
      },
      {
        id: "add-column-after",
        name: "Add Column Right",
        action: () => editor.chain().focus().addColumnAfter().run(),
      },
      {
        id: "delete-column",
        name: "Delete Column",
        action: () => editor.chain().focus().deleteColumn().run(),
      },
      {
        id: "toggle-header-row",
        name: "Toggle Header Row",
        action: () => editor.chain().focus().toggleHeaderRow().run(),
      },
      {
        id: "toggle-header-column",
        name: "Toggle Header Column",
        action: () => editor.chain().focus().toggleHeaderColumn().run(),
      },
      {
        id: "toggle-header-cell",
        name: "Toggle Header Cell",
        action: () => editor.chain().focus().toggleHeaderCell().run(),
      },
      {
        id: "delete-table",
        name: "Delete Table",
        action: () => editor.chain().focus().deleteTable().run(),
      }
    );
  }

  return actions;
}
