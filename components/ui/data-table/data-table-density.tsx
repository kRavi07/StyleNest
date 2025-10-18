import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList } from "lucide-react";

export function DataTableDensity() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <LayoutList className="mr-2 h-4 w-4" />
          Density
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Compact</DropdownMenuItem>
        <DropdownMenuItem>Comfortable</DropdownMenuItem>
        <DropdownMenuItem>Spacious</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}