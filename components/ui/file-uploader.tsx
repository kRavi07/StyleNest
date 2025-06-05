import { Button } from "@/components/ui/button";
import { DeleteIcon, Trash } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useController } from "react-hook-form";

type FileUploaderProps = {
    label: string;
    name: string;
    control: any;
    errors: any;
    isSubmitted: boolean;
    acceptedFileType: string;
};

const MultipleFileUploader = ({
    label,
    name,
    control,
    errors,
    isSubmitted,
    acceptedFileType,
}: FileUploaderProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const { field } = useController({ name, control });

    const handleFileUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files !== null) {
                const selectedFiles = Array.from(e.target.files);
                setUploadedFiles((prevUploadedFiles) => [
                    ...prevUploadedFiles,
                    ...selectedFiles,
                ]);
                field.onChange(selectedFiles);
            }
        },
        [field]
    );

    useEffect(() => {
        if (isSubmitted) {
            setUploadedFiles([]);
        }
    }, [control, isSubmitted]);

    const handleDeleteFile = useCallback(
        (index: number) => {
            const updatedFiles = [...uploadedFiles];
            updatedFiles.splice(index, 1);
            setUploadedFiles(updatedFiles);
            field.onChange(updatedFiles);
        },
        [field, uploadedFiles]
    );

    function getFileSize(size: number): React.ReactNode {
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        } else {
            return `${((size / 1024) * 1024).toFixed(2)} MB`;
        }
    }

    return (
        <div className="flex flex-col justify-center">
            <span>{label}</span>
            <label
                htmlFor={`uploader-${name}`}
                className="w-full border-slate-700 border-2 rounded-md"
            >
                <div className="flex py-2 gap-2 items-center">
                    <svg
                        className="w-6 h-6 mx-2"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span>Select files</span>
                </div>
                <input
                    accept={acceptedFileType}
                    name={name}
                    type="file"
                    id={`uploader-${name}`}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e)}
                    multiple={true}
                />
            </label>
            {uploadedFiles.map((file, index) => (
                <div
                    key={index}
                    className="flex w-full my-2 rounded-md justify-between items-center text-black"
                >
                    <span>
                        {file?.name}({getFileSize(file?.size)})
                    </span>
                    <Button
                        variant={"ghost"}
                        className="h-4"
                        onClick={() => handleDeleteFile(index)}
                    >
                        <Trash className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default MultipleFileUploader;
