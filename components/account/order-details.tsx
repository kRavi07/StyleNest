"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    MapPin,
    Calendar,
    ArrowLeft,
    Star,
    Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { OrderDetails as Order } from "@/types/order"
import PaymentInfoCard from "./order/payment-detail"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"



interface OrderDetailsProps {
    order: Order | null
    loading: boolean
    error: string | null
}

export default function OrderDetails({ order, loading, error }: OrderDetailsProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6 lg:space-y-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shimmer" />
                            <div className="space-y-2 sm:space-y-3 w-full">
                                <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 shimmer" />
                                <Skeleton className="h-3 sm:h-4 w-32 sm:w-40 shimmer" />
                            </div>
                        </div>
                        <Skeleton className="h-32 sm:h-40 w-full rounded-xl shimmer" />
                        <Skeleton className="h-24 sm:h-32 w-full rounded-xl shimmer" />
                        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                            <Skeleton className="h-64 sm:h-80 w-full rounded-xl shimmer" />
                            <Skeleton className="h-64 sm:h-80 w-full rounded-xl shimmer" />
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 max-w-sm sm:max-w-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                    >
                        <Card className="border-destructive/20 bg-destructive/5 backdrop-blur-sm">
                            <CardContent className="p-6 sm:p-8 text-center">
                                <motion.div
                                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-destructive/10 flex items-center justify-center"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                >
                                    <Package className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
                                </motion.div>
                                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">Order Not Found</h2>
                                <p className="text-muted-foreground mb-6 sm:mb-8 text-base sm:text-lg">{error}</p>
                                <Button
                                    onClick={() => window.history.back()}
                                    variant="outline"
                                    className="w-full h-10 sm:h-12 text-base sm:text-lg font-medium hover:scale-105 transition-transform"
                                >
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                    Go Back
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        )
    }

    if (!order) return null

    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "delivered":
                return {
                    icon: CheckCircle,
                    color: "text-emerald-600 dark:text-emerald-400",
                    bg: "bg-emerald-50 dark:bg-emerald-950/50",
                    border: "border-emerald-200 dark:border-emerald-800",
                    gradient: "from-emerald-500 to-green-600",
                }
            case "processing":
            case "shipped":
                return {
                    icon: Truck,
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-blue-50 dark:bg-blue-950/50",
                    border: "border-blue-200 dark:border-blue-800",
                    gradient: "from-blue-500 to-indigo-600",
                }
            case "pending":
                return {
                    icon: Clock,
                    color: "text-amber-600 dark:text-amber-400",
                    bg: "bg-amber-50 dark:bg-amber-950/50",
                    border: "border-amber-200 dark:border-amber-800",
                    gradient: "from-amber-500 to-orange-600",
                }
            default:
                return {
                    icon: Package,
                    color: "text-muted-foreground",
                    bg: "bg-muted",
                    border: "border-border",
                    gradient: "from-gray-500 to-gray-600",
                }
        }
    }

    const statusInfo = getStatusInfo(order.status)
    const StatusIcon = statusInfo.icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
                <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.history.back()}
                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-card/50 backdrop-blur-sm hover:bg-muted/50 border"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Button>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                        <motion.h1
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-amber-600 bg-clip-text text-transparent"
                            initial={{ x: -20 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Order Details
                        </motion.h1>
                        <motion.p
                            className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                        </motion.p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 sm:mb-12"
                >
                    <Card className="border-2 bg-gradient-to-r from-card to-card/80 backdrop-blur-sm shadow-2xl hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                                    <motion.div
                                        className={`p-3 sm:p-4 rounded-2xl ${statusInfo.bg} border-2 ${statusInfo.border} relative overflow-hidden flex-shrink-0`}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                        <StatusIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${statusInfo.color} relative z-10`} />
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                                            <motion.h2
                                                className="text-xl sm:text-2xl font-bold text-foreground truncate"
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                Order # {order.orderNumber}
                                            </motion.h2>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.6, type: "spring" }}
                                                className="flex-shrink-0"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className={`${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} capitalize font-semibold px-3 sm:px-4 py-1 text-xs sm:text-sm`}
                                                >
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    {order.status}
                                                </Badge>
                                            </motion.div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-muted-foreground text-sm sm:text-base">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span className="font-medium">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 flex-shrink-0" />
                                                <span className="font-medium">
                                                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <motion.div
                                    className="text-left xl:text-right flex-shrink-0"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <p className="text-muted-foreground mb-1 sm:mb-2 text-base sm:text-lg">Total Amount</p>
                                    <motion.p
                                        className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent"
                                        animate={{ scale: [1, 1.02, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                    >
                                        {order.total.toFixed(2)}
                                    </motion.p>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mb-8 sm:mb-12"
                >
                    <Card className="border bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                                <motion.div
                                    animate={{ scale: 1.3 }}
                                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </motion.div>
                                Order Journey
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 px-4 sm:px-6">
                            <div className="flex items-center justify-between relative px-2 sm:px-4 overflow-x-auto">
                                {/* Progress line */}
                                <div className="absolute top-6 sm:top-8 left-6 sm:left-8 right-6 sm:right-8 h-0.5 sm:h-1 bg-border rounded-full"></div>
                                <motion.div
                                    className="absolute top-6 sm:top-8 left-6 sm:left-8 h-0.5 sm:h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{
                                        width: order.status === "delivered" ? "100%" : order.status === "processing" ? "50%" : "25%",
                                    }}
                                    transition={{ duration: 1.5, delay: 1 }}
                                />

                                {[
                                    { status: "pending", label: "Order Placed", icon: Clock },
                                    { status: "processing", label: "Processing", icon: Package },
                                    { status: "shipped", label: "Shipped", icon: Truck },
                                    { status: "delivered", label: "Delivered", icon: CheckCircle },

                                ].map((step, index) => {
                                    const isActive = order.status === step.status
                                    const isPassed =
                                        ["processing", "completed"].includes(order.status) &&
                                        index < ["pending", "processing", "completed"].indexOf(order.status) + 1

                                    return (
                                        <motion.div
                                            key={step.status}
                                            className="flex flex-col items-center relative z-10 min-w-0 flex-1"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 1.2 + index * 0.2, type: "spring" }}
                                        >
                                            <motion.div
                                                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 sm:border-3 flex items-center justify-center transition-all duration-500 ${isActive || isPassed
                                                    ? "bg-gradient-to-r from-amber-500 to-amber-400 border-amber-500 text-white shadow-lg shadow-amber-500/30"
                                                    : "bg-card border-border text-muted-foreground"
                                                    }`}
                                                whileHover={{ scale: 1.1 }}
                                                animate={
                                                    isActive
                                                        ? {
                                                            boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0.4)", "0 0 0 20px rgba(245, 158, 11, 0)"],
                                                        }
                                                        : {}
                                                }
                                                transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                                            >
                                                <step.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                                            </motion.div>
                                            <motion.p
                                                className={`mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-center ${isActive ? "text-amber-600" : "text-muted-foreground"}`}
                                                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                                                transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
                                            >
                                                {step.label}
                                            </motion.p>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2 mb-8 sm:mb-12"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="h-full border bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6">
                                <motion.address
                                    className="not-italic text-sm sm:text-base leading-relaxed"
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.6 }}
                                >
                                    <div className="font-semibold text-foreground mb-2 sm:mb-3 text-base sm:text-lg">
                                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                    </div>
                                    <div className="text-muted-foreground space-y-1 sm:space-y-2">
                                        <div>{order.shippingAddress.address1}
                                            {order.shippingAddress.address2 && `, ${order.shippingAddress.address2}`}
                                        </div>
                                        <div>
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                        </div>
                                        <div className="font-medium">{order.shippingAddress.country}</div>
                                    </div>
                                </motion.address>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        {order.payment && <PaymentInfoCard payment={order.payment} status={order.paymentStatus} />}
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.8 }}
                    className="mb-8 sm:mb-12"
                >
                    <Card className="border bg-card/80 backdrop-blur-sm">
                        <CardHeader className="px-4 sm:px-6">
                            <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
                                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                                Your Premium Items ({order.items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6">
                            <div className="space-y-4 sm:space-y-6">
                                {order.items.map((item, index) => (
                                    <motion.div
                                        key={item.productId}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 2 + index * 0.1 }}
                                        onHoverStart={() => setHoveredItem(item.productId)}
                                        onHoverEnd={() => setHoveredItem(null)}
                                        className="group"
                                    >
                                        <motion.div
                                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border hover:border-primary/30 transition-all duration-300"
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <motion.div
                                                className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden flex-shrink-0 border-2"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <Image
                                                    src={"https://placeholder.com/80x80?text=placeholder.svg"}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover"
                                                    width={80}
                                                    height={80}
                                                />
                                            </motion.div>
                                            <div className="flex-1 min-w-0">
                                                <motion.h4
                                                    className="font-semibold text-foreground text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors"
                                                    animate={hoveredItem === item.productId ? { x: 5 } : { x: 0 }}
                                                >
                                                    {item.name}
                                                </motion.h4>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground text-sm sm:text-base">
                                                    <span className="font-medium">
                                                        Qty: {item.quantity} × {formatCurrency(item.price)}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.div
                                                className="text-left sm:text-right self-start sm:self-center"
                                                animate={hoveredItem === item.productId ? { scale: 1.1 } : { scale: 1 }}
                                            >
                                                <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </motion.div>
                                        </motion.div>
                                        {index < order.items.length - 1 && <Separator className="my-4 sm:my-6" />}
                                    </motion.div>
                                ))}
                            </div>

                            <Separator className="my-6 sm:my-8" />

                            <motion.div
                                className="space-y-3 sm:space-y-4"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 2.5 }}
                            >
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-semibold">{(order.total * 0.9).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-semibold">{(order.total * 0.05).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm sm:text-base">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span className="font-semibold">{formatCurrency(order.total)}</span>
                                </div>
                                <Separator />
                                <motion.div
                                    className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-muted/50 border"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <span className="text-xl sm:text-2xl font-bold text-foreground">Total</span>
                                    <motion.span
                                        className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                                    >
                                        {formatCurrency(order.total)}
                                    </motion.span>
                                </motion.div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/*
                <motion.div
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.8 }}
                >
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                            size="lg"
                        >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="hidden sm:inline">Download Premium Invoice</span>
                            <span className="sm:hidden">Download Invoice</span>
                        </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outline"
                            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold border-2 hover:bg-muted/50 transition-all duration-300 bg-transparent"
                            size="lg"
                        >
                            <Truck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="hidden sm:inline">Track Your Package</span>
                            <span className="sm:hidden">Track Package</span>
                        </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outline"
                            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold border-2 hover:bg-muted/50 transition-all duration-300 bg-transparent"
                            size="lg"
                        >
                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="hidden sm:inline">Premium Support</span>
                            <span className="sm:hidden">Support</span>
                        </Button>
                    </motion.div>
                </motion.div>
                */}
            </div>
        </div>
    )
}
