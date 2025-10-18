"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckoutFormData, ShippingAddress } from "@/types/checkout";
import { Card, CardContent } from "../ui/card";
import { Button } from "@/components/ui/button";
import { AddressFields } from "./AddressField";
import ShippingType from "./ShippingType";
import { AddressSelector } from "./AddressSelector";

interface ShippingAddressFormProps {
    // eslint-disable-next-line no-unused-vars
    onSubmit: (data: Partial<CheckoutFormData>) => void;
    initialData: ShippingAddress;
    savedAddresses: ShippingAddress[];
}

export default function ShippingAddressForm({
    onSubmit,
    initialData,
    savedAddresses,
}: ShippingAddressFormProps) {
    const {
        control,
        watch,
        setValue,
        trigger,
        getValues,
        formState: { errors },
    } = useFormContext<CheckoutFormData>();

    const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(
        null
    );
    const [addNew, setAddNew] = useState(false);

    const useSame = watch("useSameBillingAddress");
    const shippingAddress = watch("shippingAddress");

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            (Object.entries(initialData) as [keyof ShippingAddress, any][]).forEach(
                ([key, value]) => {
                    if (value !== undefined && value !== null) {
                        setValue(
                            `shippingAddress.${key}` as const,
                            value
                        );
                    }
                }
            );
        }
    }, [initialData, setValue]);

    // ✅ Copy shipping → billing when "Use same" is checked
    useEffect(() => {
        if (useSame && shippingAddress) {
            setValue("billingAddress", shippingAddress, { shouldValidate: true });
        }
    }, [useSame, shippingAddress, setValue]);

    // ✅ Handle selecting an address
    const handleSelectAddress = (address: ShippingAddress) => {
        setSelectedAddress(address);
        setAddNew(false);

        (Object.entries(address) as [keyof ShippingAddress, any][]).forEach(
            ([key, value]) => {
                setValue(
                    `shippingAddress.${key}` as const,
                    value ?? "",
                    {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                    }
                );
            }
        );
    };

    // ✅ Clear form on “Add New”
    const handleAddNew = () => {
        setSelectedAddress(null);
        setAddNew(true);

        const fields = Object.keys(getValues().shippingAddress || {}) as (keyof ShippingAddress)[];
        fields.forEach((key) =>
            setValue(`shippingAddress.${key}` as const, "")
        );
    };

    // ✅ Sync selected address if it changes
    useEffect(() => {
        if (selectedAddress) {
            (Object.entries(selectedAddress) as [keyof ShippingAddress, any][]).forEach(
                ([key, value]) => {
                    setValue(`shippingAddress.${key}` as const, value ?? "");
                }
            );
        }
    }, [selectedAddress, setValue]);

    // ✅ Handle final form submission
    const handleFormSubmit = async () => {
        const shippingValid = await trigger([
            "shippingAddress.firstName",
            "shippingAddress.lastName",
            "shippingAddress.address1",
            "shippingAddress.city",
            "shippingAddress.state",
            "shippingAddress.postalCode",
            "shippingAddress.phone",
        ]);

        let billingValid = true;
        if (!useSame) {
            billingValid = await trigger([
                "billingAddress.firstName",
                "billingAddress.lastName",
                "billingAddress.address1",
                "billingAddress.city",
                "billingAddress.state",
                "billingAddress.postalCode",
                "billingAddress.phone",
            ]);
        }

        if (shippingValid && billingValid) {
            const currentValues = getValues();
            onSubmit({
                shippingAddress: currentValues.shippingAddress,
                billingAddress: currentValues.billingAddress,
                useSameBillingAddress: currentValues.useSameBillingAddress,
            });
        } else {
            console.error("Validation failed");
        }
    };

    return (
        <Card className="space-y-6">
            <CardContent className="space-y-6 pt-6">
                <div className="flex flex-row justify-between w-full">
                    <h2 className="text-lg font-semibold">Shipping Address</h2>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddNew}
                        disabled={addNew}
                    >
                        + Add New Address
                    </Button>
                </div>

                {/* ===== Address Selector ===== */}
                {savedAddresses?.length > 0 && !addNew && (
                    <div className="space-y-4">
                        <AddressSelector
                            addresses={savedAddresses}
                            defaultSelectedId={savedAddresses[0]?._id ?? savedAddresses[0]?._id}
                            onSelectAddress={handleSelectAddress}
                        />
                    </div>
                )}

                {/* ===== Add New Address Fields ===== */}
                {addNew && (
                    <div className="space-y-4">
                        <AddressFields
                            control={control}
                            errors={errors}
                            prefix="shippingAddress"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setAddNew(false)}
                            className="w-full"
                        >
                            ← Back to Saved Addresses
                        </Button>
                    </div>
                )}

                <ShippingType />

                {/* ===== Same Billing Checkbox ===== */}
                <Controller
                    control={control}
                    name="useSameBillingAddress"
                    render={({ field }) => (
                        <div className="flex items-center space-x-2 p-4 rounded-lg border">
                            <Checkbox
                                id="sameAsShipping"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <Label
                                htmlFor="sameAsShipping"
                                className="text-sm font-medium cursor-pointer"
                            >
                                Use same address as shipping
                            </Label>
                        </div>
                    )}
                />

                {/* ===== Billing Address (only if not same) ===== */}
                {!useSame && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Billing Address</h2>
                        <AddressFields
                            errors={errors}
                            control={control}
                            prefix="billingAddress"
                        />
                    </div>
                )}

                <Button
                    type="button"
                    className="w-full mt-6 bg-accent hover:bg-accent/90"
                    onClick={handleFormSubmit}
                >
                    Continue to Payment
                </Button>
            </CardContent>
        </Card>
    );
}
