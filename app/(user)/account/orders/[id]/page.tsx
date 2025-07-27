"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch order");
        }

        setOrder(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Order Details</h1>
        <Badge
          variant="outline"
          className={`
            ${order.status === "completed" ? "bg-green-50 text-green-700" : ""}
            ${order.status === "pending" ? "bg-yellow-50 text-yellow-700" : ""}
            ${order.status === "processing" ? "bg-blue-50 text-blue-700" : ""}
            capitalize px-4 py-1 text-sm
          `}
        >
          {order.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order #{order._id}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.street}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <p className="font-medium">Total</p>
            <p className="text-xl font-semibold text-yellow-600">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
