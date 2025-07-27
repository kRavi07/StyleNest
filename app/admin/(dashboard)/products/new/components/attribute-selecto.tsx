import { useGetAttributes } from '@/lib/react-query/admin/query/attributes';
import { VariantAttribute } from '@/lib/react-query/query.type';
import React, { memo, useCallback, useEffect, useState } from 'react';
import AddAttribute from './add-attribute';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/components/providers/query-client-provider';
import CreatableAsyncMultiSelect, { OptionType } from '@/components/ui/multi-select';

export interface AttributeWithValues {
    label: string;
    value: string;
    values: string[];
}

type AttributeSelectorProps = {
    selected: AttributeWithValues[];
    setSelected: React.Dispatch<React.SetStateAction<AttributeWithValues[]>>;
};

const AttributeSelector = ({ selected, setSelected }: AttributeSelectorProps) => {
    const [open, setOpen] = useState(false);
    const [pendingLabel, setPendingLabel] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [valueInputMap, setValueInputMap] = useState<Record<string, string>>({});

    const { data, refetch, isLoading } = useGetAttributes();

    const formatOptions = useCallback(() => {
        return (
            data?.map((item: VariantAttribute) => ({
                label: item.name,
                value: item._id,
            })) || []
        );
    }, [data]);

    const handleCreateRequest = (inputValue: string) => {
        setPendingLabel(inputValue);
        setOpen(true);
    };

    const handleAddSuccess = async () => {
        setReloadKey((prev) => prev + 1);
        await refetch({ throwOnError: false, cancelRefetch: false });

        const updatedOptions = formatOptions();
        const match = updatedOptions.find(
            (opt: OptionType) => opt.label.trim().toLowerCase() === pendingLabel?.trim().toLowerCase()
        );

        if (match) {
            setSelected((prev) => [...prev, { ...match, values: [] }]);
        }

        setPendingLabel(null);
        setOpen(false);
    };

    const handleAttrChange = (newSelected: { label: string; value: string }[]) => {
        const updated = newSelected.map((sel) => {
            const existing = selected.find((s) => s.value === sel.value);
            return existing || { ...sel, values: [] };
        });
        setSelected(updated);
    };

    const handleValueChange = (id: string, value: string) => {
        setValueInputMap((prev) => ({ ...prev, [id]: value }));
    };

    const handleAddValue = (id: string) => {
        const value = valueInputMap[id]?.trim();
        if (!value) return;
        setSelected((prev) =>
            prev.map((attr) =>
                attr.value === id && !attr.values.includes(value)
                    ? { ...attr, values: [...attr.values, value] }
                    : attr
            )
        );
        setValueInputMap((prev) => ({ ...prev, [id]: '' }));
    };

    return (
        <div className="space-y-4">
            <CreatableAsyncMultiSelect
                key={reloadKey}
                loadOptions={async () => formatOptions()}
                onCreateRequest={handleCreateRequest}
                value={selected.map(({ label, value }) => ({ label, value }))}
                onChange={handleAttrChange}
                isDisabled={isLoading}
                placeholder="Select or create attributes..."
                options={formatOptions()}
            />

            {selected.map((attr) => (
                <div key={attr.value} className="space-y-2">
                    <div className="flex gap-2 items-end">
                        <Input
                            placeholder={`Add values for ${attr.label}`}
                            value={valueInputMap[attr.value] || ''}
                            onChange={(e) => handleValueChange(attr.value, e.target.value)}
                        />
                        <Button type="button" onClick={() => handleAddValue(attr.value)}>
                            Add Value
                        </Button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {attr.values.map((val) => (
                            <span key={val} className="bg-muted px-2 py-1 rounded text-sm">
                                {val}
                            </span>
                        ))}
                    </div>
                </div>
            ))}

            <AddAttribute
                open={open}
                onOpenChange={setOpen}
                name={pendingLabel || ''}
                onSucess={handleAddSuccess}
            />
        </div>
    );
};

export default memo(AttributeSelector);
