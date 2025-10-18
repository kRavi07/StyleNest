import React from 'react';
import { CreditCard } from 'lucide-react';
import { Address } from '@/types';
import { AddressForm } from './AddressForm';
import { ShippingRate } from '@/types/checkout';

interface BillingAddressFormProps {
    initialData: Address;
    shippingAddress?: Address;
    // eslint-disable-next-line no-unused-vars
    onSubmit: (data: Address, shipping: ShippingRate | undefined) => void;
    // eslint-disable-next-line no-unused-vars
    onSameAsShippingChange?: (useSameAddress: boolean) => void;
    isLoading?: boolean;
    showSameAsShipping?: boolean;
}

export function BillingAddressForm({
    showSameAsShipping = true,
    ...props
}: BillingAddressFormProps) {
    const config = {
        type: 'billing' as const,
        title: 'Billing Address',
        description: 'Enter your billing address details',
        icon: <CreditCard className="h-5 w-5" />,
        showShippingOptions: false,
        showSameAsShipping,
        submitButtonText: 'Continue'
    };


    return (
        <AddressForm
            config={config}
            {...props}
        />
    );
}