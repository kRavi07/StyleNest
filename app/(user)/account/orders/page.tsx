"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, PackageCheck, PackageX, Search, Eye } from "lucide-react";
import { useAuth } from "@/hooks/store/auth";
import { useGetOrders } from "@/lib/react-query/order/query";



export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth((state: any) => state);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { data: orders, isLoading: isLoadingOrders, isError } = useGetOrders({
    status: "all",
    page: 1,
    limit: 10
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  //update url with active tab
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("status", activeTab.toLowerCase());
    window.history.replaceState({}, "", url);
  }, [activeTab]);



  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Loading your orders...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoadingOrders) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (!orders || orders?.data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg">No orders found.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg">Error loading orders.</p>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {activeTab === "all" ? "All Orders" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`}
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 h-10 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders found</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeTab === "all"
                      ? "You haven't placed any orders yet."
                      : `You don't have any ${activeTab} orders.`}
                  </p>
                  <Button asChild>
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders?.data.map((order: any) => (
                    <div key={order._id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order._id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium mb-2">Items</h3>
                        <div className="space-y-3">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <p>{item.name}</p>
                                <div className="text-sm text-muted-foreground">
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.size && item.color && <span> | </span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                  <span> | Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <p className="font-medium">{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {order.status === "shipped" || order.status === "delivered" ? (
                              <>
                                <PackageCheck className="h-4 w-4 inline-block mr-1" />
                                {order.status === "shipped" ? "Your order is on the way" : "Your order has been delivered"}
                              </>
                            ) : order.status === "canceled" ? (
                              <>
                                <PackageX className="h-4 w-4 inline-block mr-1" />
                                Order has been canceled
                              </>
                            ) : (
                              <>
                                <Package className="h-4 w-4 inline-block mr-1" />
                                Preparing your order
                              </>
                            )}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-sm mt-1">
                              Tracking: <span className="font-medium">{order.trackingNumber}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Order Total</p>
                          <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}