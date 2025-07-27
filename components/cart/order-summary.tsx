"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { Cart } from "@/hooks/context/cart/cart-context";
import { formatCurrency } from "@/lib/utils";

interface Props {
    cart: Cart;
    promoCode: string;
    setPromoCode: (code: string) => void;
    isApplyingPromo: boolean;
    handleApplyPromo: () => void;
    handleCheckout: () => void;
}

export default function OrderSummary({
    cart,
    promoCode,
    setPromoCode,
    isApplyingPromo,
    handleApplyPromo,
    handleCheckout,
}: Props) {
    const subtotal = cart.subtotal;
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-card border rounded-lg overflow-hidden sticky top-20">
            <div className="px-6 py-4 bg-muted/50">
                <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                        {formatCurrency(subtotal)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>{
                        formatCurrency(tax)
                    }</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                        {formatCurrency(total)}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyPromo} disabled={isApplyingPromo}>
                        {isApplyingPromo && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                        Apply
                    </Button>
                </div>

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                    Shipping and taxes calculated at checkout.
                </p>
            </div>
        </div>
    );
}
