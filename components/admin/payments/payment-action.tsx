"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentDetails } from "@/types/admin"

interface PaymentActionsProps {
    payment: PaymentDetails
    onRefundInitiate?: () => void
}

export function PaymentActions({ payment, onRefundInitiate }: PaymentActionsProps) {
    const openRazorpayDashboard = () => {
        window.open(`https://dashboard.razorpay.com/app/payments/${payment.id}`, '_blank')
    }

    return (
        <div className="flex gap-2 pt-2">
            <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={openRazorpayDashboard}
            >
                <ExternalLink className="h-3 w-3 mr-1" />
                View in Razorpay
            </Button>
            {payment.status === 'captured' && onRefundInitiate && (
                <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={onRefundInitiate}
                >
                    Initiate Refund
                </Button>
            )}
        </div>
    )
}
