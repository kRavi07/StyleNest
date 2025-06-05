'use client';
import React from 'react'
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Package, CreditCard, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/store/auth";
import UserProfile from "@/components/account/profile";


const AccountSidebar = () => {

    const { user, isAuthenticated, isLoading, logout } = useAuth()

    const router = useRouter();
    const handleLogout = () => {
        logout();
    };

    if (!user) return null;


    return (
        <div className="w-full mt-16 md:w-64 flex-shrink-0">
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex flex-col items-center">
                        <Avatar className="h-16 w-16 mb-2">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-lg">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-center">{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground text-center">{user.email}</p>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/account">
                                <User className="mr-2 h-4 w-4" />
                                Account Overview
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/account/orders">
                                <Package className="mr-2 h-4 w-4" />
                                Orders
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/account/payment">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Payment Methods
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/account/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                Account Settings
                            </Link>
                        </Button>
                        <Separator className="my-2" />
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </nav>
                </CardContent>
            </Card>
        </div>


    )
}

export default AccountSidebar