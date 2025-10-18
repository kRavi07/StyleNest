"use client"
import { useCheckout } from '@/hooks/store/checkout-context';
import React from 'react'
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Clock } from 'lucide-react';

const ShippingType = () => {

    const { shippingRates, setSelectedShipping, selectedShipping } = useCheckout();


    return (
        <div className="mt-6">
            < Label className="text-base font-semibold">Shipping Options</Label>
            <RadioGroup
                value={selectedShipping?.type || ''}
                onValueChange={(value) => {
                    const rate = shippingRates.find(r => r.type === value);
                    if (rate) setSelectedShipping(rate);
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
    )
}

export default ShippingType