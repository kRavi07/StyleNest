"use client"

import { CreditCard, Smartphone, Building2, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CopyableField } from "@/components/ui/copyable-field"
import { PaymentDetails } from "@/types/admin"

interface PaymentMethodDetailsProps {
    payment: PaymentDetails
}

export function PaymentMethodDetails({ payment }: PaymentMethodDetailsProps) {
    if (payment.method === 'card' && payment.card) {
        return (
            <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Card Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-muted-foreground">Last 4:</span>
                        <span className="font-mono ml-1">••••{payment.card.last4}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Network:</span>
                        <span className="ml-1 capitalize">{payment.card.network}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-1 capitalize">{payment.card.type}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Issuer:</span>
                        <span className="ml-1">{payment.card.issuer}</span>
                    </div>
                </div>
                {payment.card.international && (
                    <Badge variant="outline" className="text-xs">International Card</Badge>
                )}
            </div>
        )
    }

    if (payment.method === 'upi' && payment.upi) {
        return (
            <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    UPI Details
                </h4>
                <CopyableField text={payment?.upi?.vpa ?? ""} field="upiId">
                    <span className="text-xs text-muted-foreground">UPI ID:</span>
                    <span className="text-sm font-mono">{payment.upi.vpa}</span>
                </CopyableField>
            </div>
        )
    }

    if (payment.method === 'wallet' && payment.wallet) {
        return (
            <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Wallet
                </h4>
                <div className="text-sm">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="ml-1 capitalize">{payment.wallet}</span>
                </div>
            </div>
        )
    }

    if (payment.method === 'netbanking' && payment.bank) {
        return (
            <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Net Banking
                </h4>
                <div className="text-sm">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="ml-1">{payment.bank}</span>
                </div>
            </div>
        )
    }

    return null
}