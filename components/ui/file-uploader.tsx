import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, { useEffect } from "react";
import {
    Control,
    FieldErrors,
    FieldValues,
    Path,
    useController,
    useFormState,
} from "react-hook-form";

type FileUploaderProps<TFieldValues extends FieldValues> = {
    label: string;
    name: keyof TFieldValues;
    control: Control<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    acceptedFileType: string;
};

const MultipleFileUploader = <TFieldValues extends FieldValues>({
    label,
    name,
    control,
    errors,
    acceptedFileType,
}: FileUploaderProps<TFieldValues>) => {

    const { field } = useController({
        name: name as Path<TFieldValues>,
        control,
    });

    const { isSubmitted } = useFormState({ control });

    const uploadedFiles: File[] = field.value || [];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const deduplicated = selectedFiles.filter(
                (newFile) =>
                    !uploadedFiles.some(
                        (existing) =>
                            existing.name === newFile.name && existing.size === newFile.size
                    )
            );
            field.onChange([...uploadedFiles, ...deduplicated]);
        }
    };

    const handleDeleteFile = (index: number) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        field.onChange(updatedFiles);
    };

    useEffect(() => {
        if (isSubmitted) {
            field.onChange([]);
        }
    }, [isSubmitted]);

    const getFileSize = (size: number): string => {
        return size < 1024 * 1024
            ? `${(size / 1024).toFixed(2)} KB`
            : `${(size / 1024 / 1024).toFixed(2)} MB`;
    };

    const isImageFile = (file: File) => file.type.startsWith("image/");

    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor={`uploader-${String(name)}`} className="font-medium">
                {label}
            </label>

            <label
                htmlFor={`uploader-${String(name)}`}
                className="w-full border border-slate-300 dark:border-slate-700 p-4 rounded-md cursor-pointer flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
                <svg
                    className="w-5 h-5 text-slate-600"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="text-sm text-slate-600">Select files</span>
                <input
                    accept={acceptedFileType}
                    name={String(name)}
                    type="file"
                    id={`uploader-${String(name)}`}
                    className="hidden"
                    onChange={handleFileUpload}
                    multiple
                />
            </label>

            {/* Previews */}
            {uploadedFiles.map((file, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between gap-2 p-2 border rounded-md bg-white dark:bg-slate-900 shadow-sm"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        {isImageFile(file) ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-12 h-12 object-cover rounded-md border"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center text-xs">
                                File
                            </div>
                        )}

                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm truncate max-w-[160px]">{file.name}</span>
                            <span className="text-xs text-gray-500">{getFileSize(file.size)}</span>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => handleDeleteFile(index)}
                    >
                        <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            ))}

            {errors[name] && (
                <p className="text-sm text-red-500">
                    {(errors[name]?.message as string) || "Invalid file upload"}
                </p>
            )}
        </div>
    );
};

export default MultipleFileUploader;
