"use client"

import { Separator } from "@/components/ui/separator"
import { CopyableField } from "@/components/ui/copyable-field"
import { PaymentDetails } from "@/types/admin"


interface TransactionDetailsProps {
    payment: PaymentDetails
}

export function TransactionDetails({ payment }: TransactionDetailsProps) {
    if (!payment) return null

    return (
        <>
            <Separator />
            <div className="space-y-2">
                <h4 className="text-sm font-medium">Transaction Details</h4>
                <div className="grid grid-cols-1 gap-1 text-xs">
                    {payment.acquirer_data?.rrn && (
                        <CopyableField text={payment.acquirer_data?.rrn} field="rrn">
                            <span className="text-muted-foreground">RRN:</span>
                            <span className="font-mono">{payment.acquirer_data.rrn}</span>
                        </CopyableField>
                    )}
                    {payment.acquirer_data?.auth_code && (
                        <CopyableField text={payment.acquirer_data.auth_code} field="authCode">
                            <span className="text-muted-foreground">Auth Code:</span>
                            <span className="font-mono">{payment.acquirer_data.auth_code}</span>
                        </CopyableField>
                    )}
                    {payment.acquirer_data?.transaction_id && (
                        <CopyableField text={payment.acquirer_data.transaction_id} field="upiTxnId">
                            <span className="text-muted-foreground">UPI Txn ID:</span>
                            <span className="font-mono text-xs">{payment.acquirer_data.transaction_id}</span>
                        </CopyableField>
                    )}
                </div>
            </div>
        </>
    )
}