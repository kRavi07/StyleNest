"use client"

import {
    CreditCard,
    Smartphone,
    Building2,
    Wallet,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Shield
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CopyableField } from "@/components/ui/copyable-field"
import { TransactionDetails } from "./transaction-details"
import { RefundList } from "./refund-list"
import { PaymentError } from "./payment-failure"
import { PaymentActions } from "./payment-action"
import { PaymentDetails } from "@/types/admin"
import { PaymentMethodDetails } from "./payment-method-details"


interface PaymentCardProps {
    payment: PaymentDetails
    onRefundInitiate?: () => void
}

const paymentStatusColors = {
    created: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    captured: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    authorized: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    refunded: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    partial_refunded: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
}

const getPaymentMethodIcon = (method: string | undefined) => {
    if (!method) null;
    switch (method) {
        case 'card': return <CreditCard className="h-4 w-4" />
        case 'upi': return <Smartphone className="h-4 w-4" />
        case 'netbanking': return <Building2 className="h-4 w-4" />
        case 'wallet': return <Wallet className="h-4 w-4" />
        default: return <DollarSign className="h-4 w-4" />
    }
}

const getPaymentStatusIcon = (status: string) => {
    switch (status) {
        case 'captured': return <CheckCircle className="h-4 w-4 text-green-600" />
        case 'failed': return <XCircle className="h-4 w-4 text-red-600" />
        case 'authorized': return <Clock className="h-4 w-4 text-blue-600" />
        case 'refunded':
        case 'partial_refunded': return <AlertTriangle className="h-4 w-4 text-orange-600" />
        default: return <Clock className="h-4 w-4 text-gray-600" />
    }
}

export function PaymentCard({ payment, onRefundInitiate }: PaymentCardProps) {

    const formatCurrency = (amount: number, currency: string = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount / 100)
    }

    return (
        <Card className="lg:col-span-5">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Payment Details
                    <Badge className={`ml-auto ${paymentStatusColors[payment.status]}`}>
                        {payment.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Payment Method & Amount */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            {getPaymentMethodIcon(payment.method)}
                            {payment.method?.toUpperCase()}
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(payment.amount, payment.currency)}
                        </div>
                    </div>
                    <div className="space-y-1 text-right">
                        <div className="flex items-center justify-end gap-1">
                            {getPaymentStatusIcon(payment.status)}
                            <span className="text-sm font-medium">Status</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Fee: {formatCurrency(payment?.fee || 0, payment.currency)}
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Payment IDs */}
                <div className="space-y-2 w-full">
                    <CopyableField text={payment.id} field="paymentId">
                        <span className="text-xs font-medium text-muted-foreground w-16">Payment ID</span>
                        <span className="text-sm font-mono text-blue-600 truncate">{payment.id}</span>
                    </CopyableField>

                    <CopyableField text={payment.order_id} field="orderId">
                        <span className="text-xs font-medium text-muted-foreground w-16">Order ID</span>
                        <span className="text-sm font-mono text-gray-600 truncate">{payment.order_id}</span>
                    </CopyableField>
                </div>

                <Separator />

                {/* Payment Method Specific Details */}
                <PaymentMethodDetails payment={payment} />

                {/* Transaction Details */}
                <TransactionDetails payment={payment} />

                {/* Refunds */}
                <RefundList payment={payment} />

                {/* Error Information */}
                <PaymentError payment={payment} />

                {/* Actions */}
                <PaymentActions payment={payment} onRefundInitiate={onRefundInitiate} />
            </CardContent>
        </Card>
    )
}
