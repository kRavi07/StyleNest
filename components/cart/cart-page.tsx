"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderSummary from "./order-summary";
import CartItemCard from "./cart-item";
import { useCartStore } from "@/hooks/store/cart/use-cart";
export default function CartPage() {
    const router = useRouter();
    const { items, subtotal, updateQuantity, removeItem, clearCart } = useCartStore((state) => state);
    const { toast } = useToast();
    const [promoCode, setPromoCode] = useState("");
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);

    const handleApplyPromo = () => {
        if (!promoCode.trim()) {
            toast({
                title: "Error",
                description: "Please enter a promo code.",
                variant: "destructive",
            });
            return;
        }

        setIsApplyingPromo(true);
        setTimeout(() => {
            toast({
                title: "Invalid promo code",
                description: "The promo code you entered is invalid or has expired.",
                variant: "destructive",
            });
            setIsApplyingPromo(false);
        }, 1000);
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            toast({
                title: "Empty cart",
                description: "Your cart is empty. Add items before checking out.",
                variant: "destructive",
            });
            return;
        }
        router.push("/checkout");
    };

    const cartItems = useMemo(() => items, [items]);

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg container mx-auto px-4 py-8">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                    Looks like you havent added any products to your cart yet.
                </p>
                <Button asChild>
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
            <p className="text-muted-foreground mb-8">
                Review and modify your items before checkout.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-card border rounded-lg overflow-hidden">
                        <div className="px-6 py-4 bg-muted/50 flex justify-between">
                            <h2 className="font-semibold">Cart Items ({cartItems.length})</h2>
                            <button
                                onClick={() => {
                                    clearCart();
                                    toast({
                                        title: "Cart cleared",
                                        description: "All items have been removed from your cart.",
                                    });
                                }}
                                className="text-sm text-muted-foreground hover:text-destructive flex items-center"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Clear All
                            </button>
                        </div>

                        <AnimatePresence>
                            {cartItems.map((item) => (
                                <motion.div
                                    key={`${item.product._id}-${item.size}-${item.color}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <CartItemCard
                                        item={item}
                                        onQuantityChange={updateQuantity}
                                        onRemove={removeItem}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary
                        cart={{
                            items: cartItems,
                            subtotal,
                        }}
                        promoCode={promoCode}
                        setPromoCode={setPromoCode}
                        isApplyingPromo={isApplyingPromo}
                        handleApplyPromo={handleApplyPromo}
                        handleCheckout={handleCheckout}
                    />
                </div>
            </div>
        </div>
    );
}
