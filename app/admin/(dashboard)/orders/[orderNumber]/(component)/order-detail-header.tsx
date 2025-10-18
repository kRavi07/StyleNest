"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Calendar, User, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { OrderSummaryWithPayment } from "@/types/admin"
import { PaymentCard } from "@/components/admin/payments/payment-card"

interface OrderDetailHeaderProps {
    order: OrderSummaryWithPayment
}

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    returned: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
    refunded: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300",
}

export function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
    const router = useRouter()

    const handleRefundInitiate = () => {
    }

    return (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/orders`)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Orders
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Order Info */}
                <Card className="lg:col-span-4">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge className={statusColors[order.status]}>{order?.status?.toUpperCase()}</Badge>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Info */}
                <Card className="lg:col-span-3">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Customer Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{order.customer.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{order.customer.email}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {
                    order.payment && (
                        <PaymentCard
                            payment={order.payment}
                            onRefundInitiate={handleRefundInitiate}
                        />
                    )
                }
            </div>
        </motion.div>
    )
}