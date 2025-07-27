import { Icons } from "@/components/admin/icons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const ActionMenu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Icons.ellipsis className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Icons.view className="mr-2 h-4 w-4" />
                    <span>View details</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Icons.edit className="mr-2 h-4 w-4" />
                    <span>Edit product</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Icons.copy className="mr-2 h-4 w-4" />
                    <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                    <Icons.trash className="mr-2 h-4 w-4" />
                    <span>Delete product</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ActionMenu;