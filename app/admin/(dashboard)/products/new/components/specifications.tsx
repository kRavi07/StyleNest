import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/admin/icons";
import { useFieldArray } from "react-hook-form";

type Props = {
    form: any
};

export default function Specifications({ form }: Props) {

    const { control, register, formState } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "specifications",
    });




    return (
        <div className="space-y-2">
            <Label>Attribute Values</Label>
            {fields.map((field, optionIndex) => (
                <div key={field.id} className="flex items-center space-x-2">

                    <Input
                        {...register(`specifications.${optionIndex}.name`)}
                        placeholder={`Name of Attribute `}
                    />

                    <Input
                        {...register(`specifications.${optionIndex}.value`)}
                        placeholder={`Value `}
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
                Add New Specification
            </Button>
        </div>
    );
}
