import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
    Control,
    FieldErrors,
    FieldValues,
    Path,
    useController
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

    const uploadedFiles: File[] = Array.isArray(field.value) ? field.value : [];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const deduplicated = selectedFiles.filter(
                (newFile) =>
                    !uploadedFiles.some(
                        (existing) =>
                            existing.name === newFile.name &&
                            existing.size === newFile.size &&
                            existing.lastModified === newFile.lastModified
                    )
            );
            field.onChange([...uploadedFiles, ...deduplicated]);
        }
    };

    const handleDeleteFile = (index: number) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
        field.onChange(updatedFiles);
    };

    const getFileSize = (size: number) =>
        size < 1024 * 1024 ? `${(size / 1024).toFixed(2)} KB` : `${(size / 1024 / 1024).toFixed(2)} MB`;

    const isImageFile = (file: File) => file.type.startsWith("image/");

    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor={`uploader-${String(name)}`} className="font-medium">{label}</label>

            <label
                htmlFor={`uploader-${String(name)}`}
                className="w-full border border-slate-300 dark:border-slate-700 p-4 rounded-md cursor-pointer flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
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

            {uploadedFiles.map((file, index) => {
                const objectUrl = isImageFile(file) ? URL.createObjectURL(file) : null;
                return (
                    <div key={index} className="flex items-center justify-between gap-2 p-2 border rounded-md bg-white dark:bg-slate-900 shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {isImageFile(file) ? (
                                <Image
                                    src={objectUrl!}
                                    alt={file.name}
                                    className="w-12 h-12 object-cover rounded-md border"
                                    onLoad={() => URL.revokeObjectURL(objectUrl!)}
                                    width={80}
                                    height={80}
                                />
                            ) : (
                                <div className="w-12 h-12 bg-slate-200 rounded-md flex items-center justify-center text-xs">File</div>
                            )}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm truncate max-w-[160px]">{file.name}</span>
                                <span className="text-xs text-gray-500">{getFileSize(file.size)}</span>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" type="button" onClick={() => handleDeleteFile(index)}>
                            <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                );
            })}

            {errors[name] && (
                <p className="text-sm text-red-500">{(errors[name]?.message as string) || "Invalid file upload"}</p>
            )}
        </div>
    );
};


export default MultipleFileUploader;
