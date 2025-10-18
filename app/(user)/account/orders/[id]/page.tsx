"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import OrderDetails from "@/components/account/order-details";
import { useGetOrder } from "@/lib/react-query/order/query";


export default function OrderPage() {

  const { id } = useParams();

  const { data: order, isLoading: loading, error } = useGetOrder(id as string);

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
            <p className="text-red-600">Error: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) return null;

  return (
    <OrderDetails order={order?.data} loading={loading} error={error} />
  )


}
