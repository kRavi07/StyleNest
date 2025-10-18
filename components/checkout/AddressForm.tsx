/* eslint-disable no-unused-vars */
export type AddressType = 'shipping' | 'billing';

// components/forms/AddressForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';
import { Address } from '@/types';
import { ShippingRate } from '@/types/checkout';

const addressSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    addressLine1: z.string().min(5, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits'),
});

interface AddressFormConfig {
    type: AddressType;
    title: string;
    description: string;
    icon: React.ReactNode;
    showShippingOptions?: boolean;
    showSameAsShipping?: boolean;
    submitButtonText: string;
}

interface AddressFormProps {
    config: AddressFormConfig;
    initialData: Address;
    shippingRates?: ShippingRate[];
    selectedShipping?: ShippingRate | null;
    shippingAddress?: Address;
    onSubmit: (data: Address, shipping?: ShippingRate) => void;
    onShippingRatesFetch?: (pinCode: string) => void;
    onShippingSelect?: (rate: ShippingRate) => void;
    onSameAsShippingChange?: (useSameAddress: boolean) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export function AddressForm({
    config,
    initialData,
    shippingRates = [],
    selectedShipping,
    shippingAddress,
    onSubmit,
    onShippingRatesFetch,
    onShippingSelect,
    onSameAsShippingChange,
    isLoading = false,
    disabled = false
}: AddressFormProps) {
    const [useSameAsShipping, setUseSameAsShipping] = React.useState(false);
    const lastFetchedPinCode = React.useRef<string>("");

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm<Address>({
        resolver: zodResolver(addressSchema),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        defaultValues: React.useMemo(() => initialData, []),
        mode: "onChange",
    });


    React.useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const handleFormSubmit = (data: Address) => {
        if (config.showShippingOptions && !selectedShipping) {
            return;
        }
        onSubmit(data, selectedShipping || undefined);
    };

    const handleSameAsShippingChange = (checked: boolean) => {
        setUseSameAsShipping(checked);

        if (checked && shippingAddress) {
            Object.keys(shippingAddress).forEach((key) => {
                setValue(
                    key as keyof Address,
                    shippingAddress[key as keyof Address]
                );
            });
            onSameAsShippingChange?.(true);
        } else {
            onSameAsShippingChange?.(false);
        }
    };

    const handlePinCodeChange = (
        value: string,
        onChange: (value: string) => void
    ) => {
        onChange(value);

        if (
            config.showShippingOptions &&
            value.length === 6 &&
            value !== lastFetchedPinCode.current &&
            onShippingRatesFetch &&
            !useSameAsShipping
        ) {
            lastFetchedPinCode.current = value;
            onShippingRatesFetch(value);
        }
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {config.icon}
                    {config.title}
                </CardTitle>
                <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Same as Shipping Checkbox */}
                    {config.showSameAsShipping && shippingAddress && (
                        <div className="flex items-center space-x-2 p-4 rounded-lg border">
                            <Checkbox
                                id="sameAsShipping"
                                checked={useSameAsShipping}
                                onCheckedChange={handleSameAsShippingChange}
                            />
                            <Label htmlFor="sameAsShipping" className="text-sm font-medium cursor-pointer">
                                Use same address as shipping
                            </Label>
                        </div>
                    )}

                    {/* Address Fields - Hidden when "Same as shipping" is checked */}
                    {!(config.showSameAsShipping && useSameAsShipping) && (
                        <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="firstName"
                                                placeholder="Enter your first name"
                                                className={errors.firstName ? 'border-red-500' : ''}
                                                disabled={disabled}
                                            />
                                        )}
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="lastName"
                                                placeholder="Enter your last name"
                                                className={errors.lastName ? 'border-red-500' : ''}
                                                disabled={disabled}
                                            />
                                        )}
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="phone"
                                            placeholder="10-digit phone number"
                                            className={errors.phone ? 'border-red-500' : ''}
                                            disabled={disabled}
                                        />
                                    )}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="addressLine1">Address Line 1</Label>
                                <Controller
                                    name="address1"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="addressLine1"
                                            placeholder="House/Flat number, Street name"
                                            className={errors.address1 ? 'border-red-500' : ''}
                                            disabled={disabled}
                                        />
                                    )}
                                />
                                {errors.address1 && (
                                    <p className="text-sm text-red-500 mt-1">{errors.address1.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                                <Controller
                                    name="address2"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="address2"
                                            placeholder="Landmark, Area"
                                            disabled={disabled}
                                        />
                                    )}
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="city"
                                                placeholder="City"
                                                className={errors.city ? 'border-red-500' : ''}
                                                disabled={disabled}
                                            />
                                        )}
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="state"
                                                placeholder="State"
                                                className={errors.state ? 'border-red-500' : ''}
                                                disabled={disabled}
                                            />
                                        )}
                                    />
                                    {errors.state && (
                                        <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Controller
                                        name="postalCode"
                                        control={control}
                                        render={({ field: { onChange, ...field } }) => (
                                            <Input
                                                {...field}
                                                id="postalCode"
                                                placeholder="6-digit PIN"
                                                maxLength={6}
                                                onChange={(e) => handlePinCodeChange(e.target.value, onChange)}
                                                className={errors.postalCode ? 'border-red-500' : ''}
                                                disabled={disabled}
                                            />
                                        )}
                                    />
                                    {errors.postalCode && (
                                        <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Shipping Options */}
                    {config.showShippingOptions && shippingRates.length > 0 && !useSameAsShipping && (
                        <div className="mt-6">
                            <Label className="text-base font-semibold">Shipping Options</Label>
                            <RadioGroup
                                value={selectedShipping?.type || ''}
                                onValueChange={(value) => {
                                    const rate = shippingRates.find(r => r.type === value);
                                    if (rate && onShippingSelect) onShippingSelect(rate);
                                }}
                                className="mt-3"
                            >
                                {shippingRates.map((rate) => (
                                    <div key={rate.type} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value={rate.type} id={rate.type} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor={rate.type} className="font-medium cursor-pointer">
                                                    {rate.name}
                                                </Label>
                                                <span className="font-semibold">₹{rate.rate}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {rate.estimatedDays} days
                                                </span>
                                                <span>{rate.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                    <Button
                        type="submit"
                        disabled={
                            (!isValid && !(config.showSameAsShipping && useSameAsShipping)) ||
                            (config.showShippingOptions &&
                                !selectedShipping &&
                                !useSameAsShipping) ||
                            isLoading ||
                            disabled
                        }
                        className="w-full mt-6"
                    >
                        {config.submitButtonText}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}