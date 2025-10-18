// MissingCombinationDrawer.tsx
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export function MissingCombinationDrawer({
    open,
    onOpenChange,
    missingCombinations,
    onGenerateAll,
    onEdit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    missingCombinations: any[];
    onGenerateAll: () => void;
    onEdit: (combo: any) => void;
}) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Missing Variant Combinations</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 space-y-3">
                    {missingCombinations.length ? (
                        missingCombinations.map((combo, i) => (
                            <div key={i} className="flex justify-between items-center border p-2 rounded-md">
                                <span className="text-sm text-muted-foreground">
                                    {Object.entries(combo)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(", ")}
                                </span>
                                <Button size="sm" onClick={() => onEdit(combo)}>Edit</Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">All combinations exist.</p>
                    )}

                    {missingCombinations.length > 0 && (
                        <div className="pt-3 border-t mt-3">
                            <Button onClick={onGenerateAll} className="w-full">
                                Generate All Variants
                            </Button>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
