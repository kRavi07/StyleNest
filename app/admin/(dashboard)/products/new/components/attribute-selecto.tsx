import CreatableAsyncMultiSelect, { OptionType } from '@/components/ui/multi-select'
import { useGetAttributes } from '@/lib/react-query/admin/query/attributes';
import { VariantAttribute } from '@/lib/react-query/query.type';
import React, { memo, useCallback, useEffect, useState } from 'react';
import AddAttribute from './add-attribute';
import { queryClient } from '@/components/providers/query-client-provider';

type AttributeSelectorProps = {
    selected: OptionType[];
    setSelected: React.Dispatch<React.SetStateAction<OptionType[]>>;
}

const AttributeSelector = ({ selected, setSelected }: AttributeSelectorProps) => {
    const [open, setOpen] = useState(false);
    const [pendingLabel, setPendingLabel] = useState<string | null>(null);
    const { data, refetch, isLoading } = useGetAttributes();
    const [reloadKey, setReloadKey] = useState(0);

    const formatOptions = useCallback((): OptionType[] => {
        return (
            data?.map((item: VariantAttribute) => ({
                label: item.name,
                value: item._id,
            })) || []
        );
    }, [data]);

    const loadOptionsApi = async (): Promise<OptionType[]> => {
        return formatOptions();
    };

    const handleCreateRequest = (inputValue: string) => {
        setPendingLabel(inputValue);
        setOpen(true);
    };

    const handleAddSuccess = async () => {
        setReloadKey((prev) => prev + 1);
        await refetch({ throwOnError: false, cancelRefetch: false });

        const updatedOptions = formatOptions();
        const match = updatedOptions.find(
            (opt) => opt.label.trim().toLowerCase() === pendingLabel?.trim().toLowerCase()
        );

        if (match) {
            setSelected((prev: OptionType[]) => [...prev, match]);
        }

        setPendingLabel(null);
        setOpen(false);
    };


    return (
        <>
            <CreatableAsyncMultiSelect
                key={reloadKey}
                loadOptions={loadOptionsApi}
                onCreateRequest={handleCreateRequest}
                value={selected}
                onChange={setSelected}
                placeholder="Select or type to create..."
                isDisabled={isLoading}
                isLoading={isLoading}
                options={formatOptions()}
            />

            <AddAttribute
                open={open}
                onOpenChange={setOpen}
                name={pendingLabel || ''}
                onSucess={handleAddSuccess}
            />
        </>
    );
};

export default memo(AttributeSelector);
