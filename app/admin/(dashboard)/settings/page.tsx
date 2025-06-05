"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Button>
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Manage your store details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="Commerce Hub" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" type="email" defaultValue="support@commercehub.example" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" type="url" defaultValue="https://commercehub.example" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea id="storeAddress" defaultValue="123 Commerce St, Suite 101&#10;San Francisco, CA 94103&#10;United States" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeLogo">Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted">
                    <Icons.store className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <Button variant="outline" type="button">
                    <Icons.image className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure your store's localization settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="defaultCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                      <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightUnit">Weight Unit</Label>
                  <Select defaultValue="kg">
                    <SelectTrigger id="weightUnit">
                      <SelectValue placeholder="Select weight unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="g">Grams (g)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                      <SelectItem value="oz">Ounces (oz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america_los_angeles">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america_los_angeles">America/Los Angeles (UTC-07:00)</SelectItem>
                      <SelectItem value="america_new_york">America/New York (UTC-04:00)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (UTC+01:00)</SelectItem>
                      <SelectItem value="asia_tokyo">Asia/Tokyo (UTC+09:00)</SelectItem>
                      <SelectItem value="australia_sydney">Australia/Sydney (UTC+10:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure the payment options available to your customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="stripe" className="flex items-center gap-2">
                      <Icons.billing className="h-4 w-4" />
                      Stripe
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Accept credit cards, Apple Pay, Google Pay
                    </p>
                  </div>
                  <Switch id="stripe" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="paypal" className="flex items-center gap-2">
                      <Icons.billing className="h-4 w-4" />
                      PayPal
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Accept PayPal payments
                    </p>
                  </div>
                  <Switch id="paypal" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="bankTransfer" className="flex items-center gap-2">
                      <Icons.billing className="h-4 w-4" />
                      Bank Transfer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Accept direct bank transfers
                    </p>
                  </div>
                  <Switch id="bankTransfer" />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="cashOnDelivery" className="flex items-center gap-2">
                      <Icons.billing className="h-4 w-4" />
                      Cash on Delivery
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to pay when receiving goods
                    </p>
                  </div>
                  <Switch id="cashOnDelivery" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Configure tax rates and calculations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="enableTaxes" defaultChecked />
                <Label htmlFor="enableTaxes">Enable automatic tax calculations</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxBasis">Tax Calculation Based On</Label>
                  <Select defaultValue="shipping">
                    <SelectTrigger id="taxBasis">
                      <SelectValue placeholder="Select tax basis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shipping">Customer shipping address</SelectItem>
                      <SelectItem value="billing">Customer billing address</SelectItem>
                      <SelectItem value="shop">Shop base address</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxClass">Default Tax Class</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger id="defaultTaxClass">
                      <SelectValue placeholder="Select tax class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Rate</SelectItem>
                      <SelectItem value="reduced">Reduced Rate</SelectItem>
                      <SelectItem value="zero">Zero Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Display Prices in Shop</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="priceExcludingTax"
                      name="priceDisplay"
                      defaultChecked
                      className="text-primary border-input h-4 w-4"
                    />
                    <Label htmlFor="priceExcludingTax" className="font-normal">
                      Excluding tax
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="priceIncludingTax"
                      name="priceDisplay"
                      className="text-primary border-input h-4 w-4"
                    />
                    <Label htmlFor="priceIncludingTax" className="font-normal">
                      Including tax
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Methods</CardTitle>
              <CardDescription>
                Configure shipping options and delivery rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="flatRate" className="flex items-center gap-2">
                      <Icons.shipping className="h-4 w-4" />
                      Flat Rate Shipping
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Charge a fixed rate for shipping
                    </p>
                  </div>
                  <Switch id="flatRate" defaultChecked />
                </div>
                <div className="pl-6 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="flatRateAmount">Rate Amount</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                        <Input id="flatRateAmount" defaultValue="5.00" className="pl-7" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flatRateTitle">Method Title</Label>
                      <Input id="flatRateTitle" defaultValue="Standard Shipping" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="freeShipping" className="flex items-center gap-2">
                      <Icons.shipping className="h-4 w-4" />
                      Free Shipping
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Offer free shipping over a minimum order amount
                    </p>
                  </div>
                  <Switch id="freeShipping" defaultChecked />
                </div>
                <div className="pl-6 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="freeShippingMinimum">Minimum Order Amount</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                        <Input id="freeShippingMinimum" defaultValue="50.00" className="pl-7" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freeShippingTitle">Method Title</Label>
                      <Input id="freeShippingTitle" defaultValue="Free Shipping" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="localPickup" className="flex items-center gap-2">
                      <Icons.shipping className="h-4 w-4" />
                      Local Pickup
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to pick up orders from your location
                    </p>
                  </div>
                  <Switch id="localPickup" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Shipping Zones</CardTitle>
              <CardDescription>
                Define shipping regions and their specific rates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">United States</h3>
                    <p className="text-sm text-muted-foreground">All US states and territories</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <Separator />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Canada</h3>
                    <p className="text-sm text-muted-foreground">All Canadian provinces</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <Separator />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Europe</h3>
                    <p className="text-sm text-muted-foreground">EU member countries</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
                <Separator />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Rest of World</h3>
                    <p className="text-sm text-muted-foreground">All other countries</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Icons.edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
              
              <Button variant="outline">
                <Icons.add className="mr-2 h-4 w-4" />
                Add Shipping Zone
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage API access for external integrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Analytics Integration</h3>
                    <p className="text-sm text-muted-foreground">Created on Jun 15, 2023</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icons.view className="mr-2 h-4 w-4" />
                      View Key
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Inventory Management</h3>
                    <p className="text-sm text-muted-foreground">Created on May 22, 2023</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icons.view className="mr-2 h-4 w-4" />
                      View Key
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button variant="outline">
                <Icons.add className="mr-2 h-4 w-4" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export store data for backup or analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <Icons.file className="mr-2 h-4 w-4" />
                  Export Products
                </Button>
                <Button variant="outline">
                  <Icons.file className="mr-2 h-4 w-4" />
                  Export Orders
                </Button>
                <Button variant="outline">
                  <Icons.file className="mr-2 h-4 w-4" />
                  Export Customers
                </Button>
                <Button variant="outline">
                  <Icons.file className="mr-2 h-4 w-4" />
                  Export Complete Store Data
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dangerous Zone</CardTitle>
              <CardDescription>
                Actions that can potentially cause major changes to your store.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-destructive">Clear Test Data</h3>
                <p className="text-sm text-muted-foreground">
                  Remove all test orders, customers, and transactions. This action cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Clear Test Data
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium text-destructive">Reset Store</h3>
                <p className="text-sm text-muted-foreground">
                  Reset your store to its initial state. All products, orders, and settings will be removed.
                  This action cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Reset Store
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}