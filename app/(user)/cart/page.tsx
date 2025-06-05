"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingBag, Minus, Plus, RefreshCw } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };

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
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or has expired.",
        variant: "destructive",
      });
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add items before checking out.",
        variant: "destructive",
      });
      return;
    }

    router.push("/checkout");
  };

  // Calculate order summary
  const subtotal = cart.subtotal;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
      <p className="text-muted-foreground mb-8">
        Review and modify your items before checkout.
      </p>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apost added any products to your cart yet.
          </p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-muted/50 flex justify-between">
                <h2 className="font-semibold">Cart Items ({cart.items.length})</h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-muted-foreground hover:text-destructive flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </button>
              </div>

              {cart.items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="p-6 border-b last:border-b-0">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div
                      className="w-24 h-24 rounded bg-muted/20 flex-shrink-0"
                      style={{
                        backgroundImage: `url(${item.product.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link href={`/products/${item.product.id}`} className="font-medium hover:underline">
                            {item.product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span> | </span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          <div className="text-sm font-medium mt-2">
                            ${item.product.price.toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.inventory}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg overflow-hidden sticky top-20">
              <div className="px-6 py-4 bg-muted/50">
                <h2 className="font-semibold">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo}
                    >
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}