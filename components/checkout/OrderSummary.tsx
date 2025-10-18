import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Clock } from 'lucide-react';
import { ShippingRate } from '@/types/checkout';
import { CartItem } from '@/hooks/store/cart/use-cart';
import Image from 'next/image';

interface OrderSummaryProps {
    cartItems: CartItem[];
    subtotal: number;
    selectedShipping: ShippingRate | null;
    taxRate: number;
}

export function OrderSummary({ cartItems, subtotal, selectedShipping, taxRate }: OrderSummaryProps) {

    const total = subtotal;

    return (
        <Card className="shadow-lg sticky top-8">
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                {item.product.image?.[0] ? (
                                    <Image
                                        src={"https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                                        alt={"key" + item.id}
                                        className="w-full h-full object-cover rounded-lg"
                                        width={48}
                                        height={48}
                                    />
                                ) : (
                                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.product.name}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-sm">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {selectedShipping && (
                        <div className="flex justify-between">
                            <span>Shipping ({selectedShipping.name})</span>
                            <div className="flex gap-2">
                                <span className="text-sm text-green-500">
                                    FREE
                                </span>

                                <span className='line-through'>₹{selectedShipping.rate}</span>
                            </div>
                        </div>
                    )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>

                {selectedShipping && (
                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                        <Clock className="h-3 w-3 inline mr-1" />
                        Estimated delivery: {selectedShipping.estimatedDays} days
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
