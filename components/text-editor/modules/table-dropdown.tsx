// components/Editor/Toolbar/modules/TableDropdown.tsx
import React from "react";
import { Editor } from "@tiptap/react";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/components/ui/menubar";
import { TableIcon } from "lucide-react";
import { getTableMenu } from "../utils";

const TableDropdown = ({ editor }: { editor: Editor }) => {
    const menuItems = getTableMenu(editor); // You’ll implement this util

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>
                    <TableIcon className="h-4 w-4" />
                </MenubarTrigger>
                <MenubarContent className="bg-white p-1">
                    {menuItems.map((item) => (
                        <MenubarItem key={item.id} onClick={item.action}>
                            {item.name}
                        </MenubarItem>
                    ))}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default TableDropdown;
