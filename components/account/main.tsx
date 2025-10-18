"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    User,
    Bell,
    Settings,
    Package,
    Check,
    MapPin
} from 'lucide-react';
import OrderPage from './order-page';
import AddressCard from './address-card';
import AddAddressComponent from './add-address';
import { useGetAddresses, useGetProfile, useUpdateProfile } from '@/lib/react-query/user/query';
import { AddressResponse } from '@/types';
import UserProfile from './profile';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const EcommerceProfilePage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { theme } = useTheme();
    const [editingField, setEditingField] = useState("" as string | null);
    const { data: addresses, isLoading } = useGetAddresses();
    const { data: user, isLoading: userLoading } = useGetProfile();

    const { mutateAsync: updateProfile } = useUpdateProfile()

    const [preferences, setPreferences] = useState({
        orderUpdates: true,
        deals: true,
        newArrivals: false,
        restock: true,
        reviews: false
    });











    const cardClasses = theme === 'dark'
        ? 'backdrop-blur-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300'
        : 'backdrop-blur-xl bg-white/80 border border-gray-200/50 hover:bg-white/90 transition-all duration-300';


    const handleProfileFieldUpdate = (field: string, value: any) => {
        toast.promise(
            updateProfile({ field, value }),
            {
                loading: 'Updating profile...',
                success: 'Profile updated successfully!',
                error: 'Error updating profile.'
            }
        );

    };



    return (
        <div >
            {/* Premium Background Effects *
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>*/}

            <div className="relative z-10  lg:max-w-7xl w-full mx-auto p-6">


                {/* Enhanced Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 p-2 rounded-2xl bg-white dark:bg-slate-800/30 backdrop-blur-sm w-fit mx-auto">
                    {[
                        { id: 'overview', icon: User, label: 'Overview' },
                        { id: 'orders', icon: Package, label: 'Orders' },
                        { id: 'addresses', icon: MapPin, label: 'Addresses' },
                        { id: 'settings', icon: Settings, label: 'Settings' }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-gray-400 hover:text-orange-500  dark:hover:bg-slate-700/50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="xl:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <>
                                <Card className={cardClasses}>
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold">Personal Information</h2>
                                        </div>

                                        {!userLoading && user && <UserProfile user={user} onFieldUpdate={handleProfileFieldUpdate} />}
                                    </CardContent>
                                </Card>

                            </>
                        )}

                        {activeTab === 'orders' && (
                            <OrderPage />
                        )}


                        {activeTab === 'addresses' && (
                            <Card className={cardClasses}>
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                                                <MapPin className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold">Shipping Addresses</h2>
                                        </div>
                                        <AddAddressComponent />
                                    </div>

                                    <div className="space-y-4">
                                        {
                                            addresses?.addresses?.length === 0 && !isLoading && (
                                                <p className="text-center opacity-70">No saved addresses. Please add one.</p>
                                            )
                                        }
                                        {addresses && addresses?.addresses?.map((address: AddressResponse, index: number) => (
                                            <AddressCard key={index} address={address} />
                                        ))}

                                    </div>
                                </CardContent>
                            </Card>
                        )}



                        {activeTab === 'settings' && (
                            <Card className={cardClasses}>
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                            <Bell className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold">Notification Preferences</h2>
                                    </div>

                                    <div className="space-y-6">
                                        {Object.entries(preferences).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-700/20">
                                                <div>
                                                    <p className="font-semibold">
                                                        {key === 'orderUpdates' && 'Order Updates'}
                                                        {key === 'deals' && 'Deals & Promotions'}
                                                        {key === 'newArrivals' && 'New Arrivals'}
                                                        {key === 'restock' && 'Back in Stock Alerts'}
                                                        {key === 'reviews' && 'Review Reminders'}
                                                    </p>
                                                    <p className="text-sm opacity-70 mt-1">
                                                        {key === 'orderUpdates' && 'Get notified about your order status and shipping updates'}
                                                        {key === 'deals' && 'Receive exclusive deals, coupons, and promotional offers'}
                                                        {key === 'newArrivals' && 'Be the first to know about new products and collections'}
                                                        {key === 'restock' && 'Get alerted when out-of-stock items are available again'}
                                                        {key === 'reviews' && 'Reminders to review your purchased items'}
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={value}
                                                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, [key]: checked }))}
                                                    className="data-[state=checked]:bg-blue-600"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                </div>

                {/* Save Changes Button */}
                {editingField && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <Button
                            onClick={() => setEditingField(null)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Save All Changes
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EcommerceProfilePage;