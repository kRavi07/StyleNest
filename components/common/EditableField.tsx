import { useState } from "react";
import { Controller, Control, useFormContext, useController } from "react-hook-form";
import { Edit3, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EditableFieldProps {
    label: string;
    name: string;
    type?: string;
    control?: Control<any>; // optional, uses form context if not provided
    onSave?: (name: string, value: any) => void; // called when field is saved
}

export const EditableField = ({
    label,
    name,
    type = "text",
    control,
    onSave,
}: EditableFieldProps) => {
    const [editing, setEditing] = useState(false);

    const formContext = useFormContext();
    const formControl = control || formContext.control;

    const { field } = useController({ name, control: formControl });

    return (
        <Controller
            control={formControl}
            name={name}
            render={({ field }) => (
                <div className="group relative">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold tracking-wider uppercase opacity-70">
                            {label}
                        </label>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="p-1.5 hover:bg-slate-700/50 rounded-lg"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <div className="flex items-center gap-2">
                            <Input
                                {...field}
                                type={type}
                                className="flex-1 border-0 bg-slate-700/50 focus:bg-slate-700 transition-colors text-white"
                                autoFocus
                            />
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    onSave?.(name, field.value); // notify parent
                                    setEditing(false);
                                }}
                            >
                                <Check className="w-4 h-4 text-green-400" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditing(false)}
                            >
                                <X className="w-4 h-4 text-red-400" />
                            </Button>
                        </div>
                    ) : (
                        <p className="text-base font-medium">{field.value || "—"}</p>
                    )}
                </div>
            )}
        />
    );
};
