"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield } from "lucide-react";
import { PaymentResponse } from "@/types";

interface PaymentInfoCardProps {
    status: string;
    payment: PaymentResponse;
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({ payment, status }) => {
    return (
        <Card className="h-full border bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                    <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    Payment Information
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
                <motion.div
                    className="space-y-3 sm:space-y-4"
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Payment Status */}
                    <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <span className="text-muted-foreground font-medium text-sm sm:text-base">
                            Payment Status
                        </span>
                        <Badge
                            className={`${status === "paid"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-700"
                                : "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700"
                                } text-xs sm:text-sm`}
                        >
                            {status === "paid" ? (
                                <>
                                    <Shield className="w-3 h-3 mr-1" />
                                    Secured & Paid
                                </>
                            ) : (
                                <>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </>
                            )}
                        </Badge>
                    </div>

                    {/* Payment Method */}
                    <div className="flex justify-between items-center text-sm sm:text-base">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="font-semibold">
                            {payment.method}
                            {payment.card ? ` • ${payment.card.type?.toLocaleUpperCase()} ${payment.card.network} ${payment.card.last4}` : ""}
                            {payment.upi ? ` • ${payment.upi.vpa}` : ""}
                            {payment.wallet ? ` • ${payment.wallet.name}` : ""}
                        </span>
                    </div>




                    {/* Paid On */}
                    <div className="flex justify-between items-center text-sm sm:text-base">
                        <span className="text-muted-foreground">Paid On</span>
                        <span className="font-mono text-xs sm:text-sm">
                            {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "—"}
                        </span>
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );
};

export default PaymentInfoCard;
