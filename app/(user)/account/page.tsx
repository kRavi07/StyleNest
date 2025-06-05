"use client";

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

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter();

  console.log(user, isAuthenticated, isLoading);


  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Loading your account...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold mb-6">Account Overview</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <UserProfile user={user} />
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Saved Addresses</CardTitle>
                <Button>Add New Address</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You don&apos;t have any saved addresses yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Order Confirmations and Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your orders and shipping updates.
                    </p>
                  </div>
                  <Button variant="outline">Enabled</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Promotional Emails</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new products, sales, and offers.
                    </p>
                  </div>
                  <Button variant="outline">Disabled</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Newsletter</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive our weekly newsletter with fashion tips and trends.
                    </p>
                  </div>
                  <Button variant="outline">Disabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>


  );
}