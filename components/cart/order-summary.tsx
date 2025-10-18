"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { CartState } from "@/hooks/store/cart/use-cart";
import { useLoadUser } from "@/lib/react-query/user/query";
import { useRouter } from "next/navigation";

interface Props {
    cart: CartState;
    promoCode: string;
    setPromoCode: (code: string) => void;
    isApplyingPromo: boolean;
    handleApplyPromo: () => void;
    handleCheckout: () => void;
    isPending: boolean;
}

export default function OrderSummary({
    cart,
    handleCheckout,
    isPending
}: Props) {
    const { isError, isLoading } = useLoadUser();
    const router = useRouter();

    const subtotal = cart.subtotal;

    const total = cart.subtotal;

    const handleLogin = () => {
        router.replace('/auth/login?redirect=/cart');
    }




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
                    <div className="flex gap-2">
                        <span className="text-muted-foreground line-through ">
                            {formatCurrency(90)}
                        </span>
                        <span className="text-green-300">Free</span>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                        {formatCurrency(total)}
                    </span>
                </div>

                {/*<div className="flex items-center space-x-2">
                    <Input
                        placeholder="Promo Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyPromo} disabled={isApplyingPromo}>
                        {isApplyingPromo && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                        Apply
                    </Button>
                </div>*/}

                {
                    !isError ? (
                        <Button className="w-full" onClick={handleCheckout} disabled={cart.items.length === 0 || isPending || isLoading}>
                            {
                                isPending ? "Processing..." : "Checkout"
                            }
                        </Button>
                    ) : (
                        <Button className="w-full" variant="secondary" onClick={handleLogin}>
                            Login to Checkout
                        </Button>

                    )
                }

                <p className="text-xs text-muted-foreground text-center">
                    Shipping and taxes calculated at checkout.
                </p>
            </div>
        </div>
    );
}
