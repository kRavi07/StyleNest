"use client"

import { motion } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OrderDetailHeader } from "./(component)/order-detail-header"
import { OrderItemsTable } from "./(component)/order-items-table"
import { OrderSummary } from "./(component)/order-summary"
import OrderAddressComponent from "./(component)/order-address-details"
import { useGetOrder } from "@/lib/react-query/admin/query/orders"

interface OrderDetailPageProps {
    params: {
        orderNumber: string
    }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { data: order, isLoading, error, isError } = useGetOrder(params.orderNumber)

    if (isError) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error?.message || "Failed to load order details. Please try again."}</AlertDescription>
                </Alert>
            </motion.div>
        )
    }

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading order details...</span>
                </div>
            </motion.div>
        )
    }

    if (!order) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto p-6">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Order not found.</AlertDescription>
                </Alert>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto p-6 space-y-6"
        >
            <OrderDetailHeader order={order} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <OrderItemsTable items={order.items} />
                </div>
                <div>
                    <OrderSummary order={order} />
                </div>
            </div>
            <OrderAddressComponent shippingAddress={order.shippingAddress} billingAddress={order.billingAddress} />
        </motion.div>
    )
}
