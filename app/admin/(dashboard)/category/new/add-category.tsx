"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddCategory } from "@/lib/react-query/admin/queries";
import { useFetchCategory } from "@/lib/react-query/public/category/queries";
import { CategoryProps } from "@/lib/react-query/query.type";
import { LoaderIcon, RefreshCcw } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import MultipleFileUploader from "@/components/ui/file-uploader";
import { CategoryFormData } from "@/lib/validation/category";
const AddCategoryFrom = () => {
    const router = useRouter();
    const {
        mutateAsync: addCategory,
        isSuccess,
        data,
        isPending,
        isError,
    } = useAddCategory();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        control,
    } = useForm<CategoryFormData>({
        mode: "onBlur",
        reValidateMode: "onBlur",
    });

    const {
        data: categories,
        isLoading: categoryLoading,
        isError: categoryError,
        isSuccess: categorySuccess,
        refetch,
    } = useFetchCategory();

    const onSubmit = async (data: CategoryFormData) => {
        try {
            console.log(data);
            await addCategory(data);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <Card className="w-1/2 mx-auto p-4">
                <CardHeader className="flex gap-2 flew-row items-center">
                    <CardTitle>Add Product Category</CardTitle>
                    <Button
                        variant={"link"}
                        onClick={() => {
                            refetch();
                        }}
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </Button>
                </CardHeader>
                <CardContent className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category Name
                                </label>
                                <Input
                                    className="mt-1 block w-full bg-white shadow-none appearance-none dark:bg-gray-950"
                                    placeholder="Enter category name"
                                    type="text"
                                    {...register("name", {
                                        required: "Category name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Category name must be at least 3 characters",
                                        },
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select Parent Category
                                </label>
                                <Controller
                                    control={control}
                                    name="parent"
                                    render={({ field }) => (
                                        <Select onValueChange={(value) => field.onChange(value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectGroup>
                                                    {categories?.map((item: any) => (
                                                        <SelectItem
                                                            key={item.Category_ID}
                                                            value={item.Category_ID}
                                                        >
                                                            {item.category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <span className="text-sm font-medium">
                                    Do not select parent category if you don&apos;t have any
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Details
                                </label>
                                <Textarea
                                    className="mt-1 block w-full bg-white shadow-none appearance-none dark:bg-gray-950"
                                    placeholder="Enter category details"
                                    {...register("slug", {
                                        required: "Category details is required",
                                        minLength: {
                                            value: 3,
                                            message: "Category details must be at least 3 characters",
                                        },
                                    })}
                                />
                            </div>

                            <MultipleFileUploader
                                name="image"
                                control={control}
                                errors={errors}
                                label="Upload Images"
                                isSubmitted={isSuccess}
                                acceptedFileType={".jpg,.png"}
                            />

                            <Button
                                className="mt-6 bg-gray-800 text-white w-full py-2 rounded-md hover:bg-gray-700"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <span>
                                        {" "}
                                        <LoaderIcon className="w-6 h-6 animate-spin" />
                                    </span>
                                ) : (
                                    "Add  Category"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
};

export default AddCategoryFrom;
