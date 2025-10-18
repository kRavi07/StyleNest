"use client"

import { Separator } from "@/components/ui/separator"
import { PaymentDetails } from "@/types/admin"

interface RefundListProps {
    payment: PaymentDetails
}

export function RefundList({ payment }: RefundListProps) {
    if (!payment.refund_status || payment.amount_refunded === 0) return null

    return (
        <>
            <Separator />
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-orange-600">Refunds ({payment.amount_refunded})</h4>
                <div className="space-y-2 max-h-20 overflow-y-auto">
                    {/* <div key={refund.id} className="flex justify-between items-center text-xs p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                            <div>
                                <CopyableField text={refund.id} field={`refund-${refund.id}`}>
                                    <span className="font-mono">{refund.id}</span>
                                </CopyableField>
                                <div className="text-muted-foreground mt-1">
                                    {new Date(refund.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">{formatCurrency(refund.amount, refund.currency)}</div>
                                <Badge variant="outline" className="text-xs">{refund.status}</Badge>
                            </div>
                        </div>*/}

                </div>
            </div>
        </>
    )
}
