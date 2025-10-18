import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Shield, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { ShippingAddress, ShippingRate } from '@/types/checkout';
import { formatCurrency } from '@/lib/utils';

interface OrderReviewProps {
    shippingAddress: ShippingAddress;
    paymentMethod: 'razorpay' | 'cod';
    shippingRate: ShippingRate;
    total: number;
    onPlaceOrder: () => void;
    onBack: () => void;
    isProcessing: boolean;
    error: string;
}

export function OrderReview({
    shippingAddress,
    paymentMethod,
    shippingRate,
    total,
    onPlaceOrder,
    onBack,
    isProcessing,
    error
}: OrderReviewProps) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Review Your Order
                </CardTitle>
                <CardDescription>
                    Please review your order details before placing
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Shipping Address Summary */}
                <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <div className=" p-3 rounded-lg text-sm">
                        <p className="font-medium">{shippingAddress.firstName},{shippingAddress.lastName}</p>
                        <p>{shippingAddress.address1}</p>
                        {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                        <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
                        <p>Phone: {shippingAddress.phone}</p>
                    </div>
                </div>

                {/* Shipping Method Summary */}
                <div>
                    <h3 className="font-semibold mb-2">Shipping Method</h3>
                    <div className=" p-3 rounded-lg text-sm">
                        <p className="font-medium">{shippingRate.name}</p>
                        <p className="flex gap-2"> <span className='text-green-500'>FREE</span>
                            <span className='line-through'>{formatCurrency(shippingRate.rate)}</span> </p>
                        <p>{shippingRate.estimatedDays} days</p>

                    </div>
                </div>

                {/* Payment Method Summary */}
                <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <div className="p-3 rounded-lg text-sm">
                        {paymentMethod === 'razorpay' ? (
                            <span className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-green-600" />
                                Pay Online (Razorpay)
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-orange-600" />
                                Cash on Delivery
                            </span>
                        )}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                        Back
                    </Button>
                    <Button
                        onClick={onPlaceOrder}
                        disabled={isProcessing}
                        className="flex-1 bg-accent hover:bg-accent/90"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Place Order - ₹${total.toFixed(2)}`
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
