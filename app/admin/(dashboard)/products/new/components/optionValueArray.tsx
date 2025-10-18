import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/admin/icons";
import { useFieldArray } from "react-hook-form";

type Props = {
    variantIndex: number;
    form: any
};

export default function OptionValuesArray({ variantIndex, form }: Props) {

    const { control, register } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: `variants.${variantIndex}.attributes`,
    });




    return (
        <div className="space-y-2">
            <Label>Attribute Values</Label>
            {fields.map((field, optionIndex) => (
                <div key={field.id} className="flex items-center space-x-2">

                    <Input
                        {...register(`variants.${variantIndex}.attributes.${optionIndex}.name`)}
                        placeholder={`Values for `}
                    />

                    <Input
                        {...register(`variants.${variantIndex}.attributes.${optionIndex}.value`)}
                        placeholder={`Values for `}
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(optionIndex)}
                    >
                        <Icons.trash className="w-4 h-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", value: "" })}
            >
                <Icons.add className="mr-2 h-4 w-4" />
                Add Attributes Value
            </Button>
        </div>
    );
}
