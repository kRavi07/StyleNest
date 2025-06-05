import { queryClient } from "@/components/providers/query-client-provider"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddAttributeType } from "@/lib/react-query/admin/query/attributes"
import { useSonner, toast } from "sonner"

interface AddAttributeProps {
    name: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSucess?: () => void;
}

const AddAttribute = ({ name, open, onOpenChange, onSucess }: AddAttributeProps) => {
    const { mutateAsync: addProductAttributes, isPending } = useAddAttributeType();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const values = formData.get("name")?.toString().split(",").map((val) => val.trim()).filter(Boolean) || [];
        const label = formData.get("label")?.toString().trim() || "";

        if (values.length === 0 || !label) {
            return;
        }

        /*toast.promise(await addProductAttributes({
            name,
            label,
            isActive: true,
            values,
        }), {
            loading: "Adding attribute...",
            success: "Attribute added successfully",
            error: "Failed to add attribute"
        })*/
        await addProductAttributes({
            name,
            label,
            isActive: true,
            values,
        })

        queryClient.invalidateQueries({
            queryKey: ["getAttributes"],
            exact: true,
        })
        onSucess && onSucess();

        onOpenChange(false);


    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Attribute</DialogTitle>
                    <DialogDescription>
                        Add a new attribute to your product catalog. Attributes can be used to filter products, such as size, color, or material.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
                    <div className="grid gap-3">
                        <Label htmlFor="attribute-values">Values for {name}</Label>
                        <Input id="attribute-values" name="name" placeholder="e.g. Red, Blue, Green" />
                        <span className="text-sm text-muted-foreground">
                            Enter the values for the attribute, separated by commas.
                        </span>
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="attribute-label">Label</Label>
                        <Input id="attribute-label" name="label" defaultValue={name} />
                    </div>

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Adding..." : "Add Attribute"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddAttribute;
