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
import AccountSidebar from '@/components/account/account-sidebar';


const layout = ({ children }: { children: React.ReactNode }) => {


    return (
        <div className="container mx-auto min-h-screen" >
            <div className="flex flex-col  md:flex-row gap-8">
                <AccountSidebar />
                {children}
            </div>
        </div>
    )
}

export default layout