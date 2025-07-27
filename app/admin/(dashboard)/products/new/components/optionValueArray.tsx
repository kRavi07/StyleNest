import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/admin/icons";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAttributes } from "@/lib/react-query/admin/query/attributes";
import { VariantAttribute } from "@/lib/react-query/query.type";
import { OptionType } from "@/components/ui/multi-select";

type Props = {
    variantIndex: number;
    form: any
};

export default function OptionValuesArray({ variantIndex, form }: Props) {

    const { control, register, formState } = form;

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
