import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    MapPin,
    Home,
    Building,
    Phone,
    Copy,
    Check,
    Edit3,
    User,
    Globe
} from 'lucide-react';
import { ShippingAddress } from '@/types/checkout';

const OrderAddressComponent = ({ shippingAddress, billingAddress }: {

    shippingAddress: ShippingAddress,
    billingAddress: ShippingAddress
}) => {
    const [copiedField, setCopiedField] = useState<any>(null);



    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };


    const CopyableField = ({ text, field, children }: {
        text: string,
        field: string,
        children: React.ReactNode
    }) => (
        <div className="group flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md p-2 -m-2 transition-colors">
            <div className="flex items-center gap-2 flex-1">
                {children}
            </div>
            <button
                onClick={() => handleCopy(text, field)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all duration-200"
                title="Copy to clipboard"
            >
                {copiedField === field ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                    <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
            </button>
        </div>
    );

    const AddressCard = ({ address, title, icon, isPrimary = false }: {
        address: ShippingAddress,
        title: string,
        icon: React.ReactNode,
        isPrimary?: boolean
    }) => (
        <Card className={`
      group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-0 
      ${isPrimary
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 ring-1 ring-blue-200 dark:ring-blue-800'
                : 'bg-white/80 dark:bg-gray-900/80 ring-1 ring-gray-200 dark:ring-gray-800'
            }
    `}>
            {isPrimary && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-10 rounded-full -translate-y-4 translate-x-4"></div>
            )}

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <div className={`
              p-2 rounded-lg transition-colors
              ${isPrimary
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }
            `}>
                            {icon}
                        </div>
                        {title}
                    </CardTitle>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <Edit3 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Name and Company */}
                <div className="space-y-2">
                    <CopyableField text={`${address.firstName} ${address.lastName}`} field={`${address.firstName}-name`}>
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{address
                            .firstName} {address.lastName}</span>
                    </CopyableField>


                </div>

                <Separator className="dark:bg-gray-700" />

                {/* Address */}
                <div className="space-y-2">
                    <CopyableField
                        text={`${address.address1}${address.address2 ? `, ${address.address2}` : ''}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`}
                        field={`${address.address1}-address`}
                    >
                        <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-gray-700 dark:text-gray-300">{address.address1}</p>
                            {address.address2 && (
                                <p className="text-gray-700 dark:text-gray-300">{address.address2}</p>
                            )}
                            <p className="text-gray-700 dark:text-gray-300">
                                {address.city}, {address.state} {address.postalCode}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <Globe className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{address.country}</span>
                            </div>
                        </div>
                    </CopyableField>
                </div>

                <Separator className="dark:bg-gray-700" />

                {/* Contact Information */}
                <div className="space-y-3">
                    <CopyableField text={address.phone} field={`${address.phone}-phone`}>
                        <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <a
                            href={`tel:${address.phone}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            {address.phone}
                        </a>
                    </CopyableField>

                </div>
            </CardContent>
        </Card>
    );

    const isSameAddress = JSON.stringify(billingAddress) === JSON.stringify(shippingAddress);

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto p-6 space-y-8">


                {/* Address Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                            <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Delivery Information
                        </h2>
                    </div>

                    {isSameAddress ? (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Billing & Shipping Address</h3>
                            </div>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                                The billing and shipping addresses are identical for this order.
                            </p>
                            <AddressCard
                                address={billingAddress}
                                title="Address"
                                icon={<Home className="w-5 h-5" />}
                                isPrimary={true}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <AddressCard
                                address={billingAddress}
                                title="Billing Address"
                                icon={<Building className="w-5 h-5" />}
                                isPrimary={false}
                            />
                            <AddressCard
                                address={shippingAddress}
                                title="Shipping Address"
                                icon={<Home className="w-5 h-5" />}
                                isPrimary={true}
                            />
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center pt-6">
                    <Button className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white px-6 py-2">
                        Track Order
                    </Button>
                    <Button variant="outline" className="border-gray-300 dark:border-gray-700 px-6 py-2">
                        Download Invoice
                    </Button>
                    <Button variant="outline" className="border-gray-300 dark:border-gray-700 px-6 py-2">
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderAddressComponent;