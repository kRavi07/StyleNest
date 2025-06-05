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
    options: OptionType[]
};

export default function OptionValuesArray({ variantIndex, form, options }: Props) {

    const { data: attributes, isLoading } = useGetAttributes();
    const { control, register, formState } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: `variants.${variantIndex}.optionValues`,
    });

    //watch the selected option values
    const getAttributeName = (index: number) => {
        const optionValues = form.getValues(`variants.${variantIndex}.optionValues`);
        return optionValues[index]?.name || "";
    }


    return (
        <div className="space-y-2">
            <Label>Attribute Values</Label>
            {fields.map((field, optionIndex) => (
                <div key={field.id} className="flex items-center space-x-2">
                    <Controller
                        name={`variants.${variantIndex}.optionValues.${optionIndex}.name`}
                        control={control}
                        render={({ field }) => (
                            <Select disabled={isLoading || (options && options.length === 0)} value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    {
                                        options && options.length > 0 ? (

                                            <SelectValue placeholder="Select an option" />
                                        ) : (
                                            <SelectValue placeholder="Please create an attribute first" />

                                        )

                                    }
                                </SelectTrigger>
                                <SelectContent>
                                    {options?.map((attribute: OptionType) => (
                                        <SelectItem key={attribute.value} value={attribute.value}
                                            className="capitalize"
                                        >
                                            {attribute.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>


                        )}
                    />

                    <Input
                        {...register(`variants.${variantIndex}.optionValues.${optionIndex}.value`)}
                        placeholder={`Values for  ${getAttributeName(optionIndex)} comma separated`}
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
                Add Option Value
            </Button>
        </div>
    );
}
