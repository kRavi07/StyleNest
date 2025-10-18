"use client"

import { XCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { PaymentDetails } from "@/types/admin"

interface PaymentErrorProps {
    payment: PaymentDetails
}

export function PaymentError({ payment }: PaymentErrorProps) {
    if (payment.status !== 'failed' || !payment.error_code) return null

    return (
        <>
            <Separator />
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Error Details
                </h4>
                <div className="text-xs space-y-1">
                    <div>
                        <span className="text-muted-foreground">Code:</span>
                        <span className="ml-1 font-mono text-red-600">{payment.error_code}</span>
                    </div>
                    {payment.error_description && (
                        <div>
                            <span className="text-muted-foreground">Description:</span>
                            <span className="ml-1">{payment.error_description}</span>
                        </div>

                    )}
                    {payment.error_reason && (
                        <div>
                            <span className="text-muted-foreground">Reason:</span>
                            <span className="ml-1">{payment.error_reason}</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
