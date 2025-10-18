/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  Gift,
  RefreshCw,
  Shield,
  ArrowLeft
} from 'lucide-react';
import Confetti from 'react-confetti';
import { cn } from '@/lib/utils';
import { usePreventBackNavigation } from '@/hooks/usePreventBackNavigation';
import { ShippingAddress } from '@/types/checkout';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  }
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  finalAmount: number;
  items: Array<{
    productId: string,
    name: string;
    sku: string;
    quantity: number;
    total: number;
    price: number
  }>;
  shippingAddress: ShippingAddress;
  createdAt: string;
  razorpayPaymentId?: string;
}

function SuccessContent() {
  usePreventBackNavigation()
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);

    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'shipped': return 'bg-blue-500';
      case 'delivered': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Order not found</h2>
            <p className="text-gray-600 mb-4">We couldn&apos;t find the order details</p>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="absolute top-10 left-10 text-muted-foreground/10 dark:text-muted-foreground/20">
        <Sparkles className="h-16 w-16" />
      </div>
      <div className="absolute top-32 right-20 text-muted-foreground/10 dark:text-muted-foreground/20">
        <Gift className="h-12 w-12" />
      </div>
      <div className="absolute bottom-20 left-20 text-muted-foreground/10 dark:text-muted-foreground/20">
        <Package className="h-20 w-20" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 animate-bounce">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">🎉 Order Placed Successfully!</h1>
            <p className="text-xl text-muted-foreground mb-2">
              Thank you for your purchase,{" "}
              <span className="font-semibold text-foreground">{order.customer.name}</span>!
            </p>
            <p className="text-muted-foreground">
              Your order <span className="font-semibold text-green-600 dark:text-green-400">#{order.orderNumber}</span>{" "}
              has been confirmed
            </p>

            <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Continue Shopping
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg border-green-200 dark:border-green-800/50">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 pt-2">
                    <Package className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-semibold text-lg text-foreground">Order #{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={cn(getStatusColor(order.status), "text-white")}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Payment: <span className="font-medium text-foreground">{order.paymentStatus}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4" role="list" aria-label="Order progress">
                    <div className="flex items-center gap-3" role="listitem">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Order Confirmed</p>
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3" role="listitem">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground">Processing</p>
                        <p className="text-sm text-muted-foreground">We &#39;re preparing your order</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3" role="listitem">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <Truck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground">Shipped</p>
                        <p className="text-sm text-muted-foreground">On the way to you</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {paymentId && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">Payment Method</span>
                        <Badge variant="secondary">Razorpay</Badge>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Payment ID</span>
                        <code className="text-xs bg-background px-2 py-1 rounded border font-mono">{paymentId}</code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount Paid</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">₹{order.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800/50">
                    <address className="not-italic">
                      <p className="font-semibold text-foreground">{order.shippingAddress.firstName}
                        {order.shippingAddress.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{order.shippingAddress.address1}</p>
                      {order.shippingAddress.address2 && (
                        <p className="text-sm text-muted-foreground">{order.shippingAddress.address2}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-sm text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
                    </address>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-lg sticky top-8">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg">
                  <CardTitle className="pt-2">Order Summary</CardTitle>
                  <CardDescription>
                    ₹{order.total} • {order.items.length} items
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Items */}
                  <div className="space-y-3 mb-4" role="list" aria-label="Order items">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between" role="listitem">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm text-foreground">₹{item.price}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm" role="list" aria-label="Price breakdown">
                    <div className="flex justify-between" role="listitem">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between" role="listitem">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">₹{order.shipping}</span>
                    </div>
                    <div className="flex justify-between" role="listitem">
                      <span className="text-muted-foreground">Tax (GST)</span>
                      <span className="text-foreground">₹{order.tax}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-foreground">Total Paid</span>
                    <span className="text-green-600 dark:text-green-400">₹{order.total}</span>
                  </div>

                  <div className="space-y-3 mt-6">
                    {/*<Button
                      variant="outline"
                      className="w-full hover:bg-muted/50 transition-colors bg-transparent"
                      onClick={() => window.print()}
                      aria-label="Download invoice as PDF"
                    >
                      <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                      Download Invoice
                    </Button>*/}
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 transition-colors"
                      onClick={() => router.push("/account/orders")}
                    >
                      Track Order
                      <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full hover:bg-muted/50 transition-colors"
                      onClick={() => router.replace("/")}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="mt-8 shadow-lg border-blue-200 dark:border-blue-800/50">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold mb-1 text-foreground">Estimated Delivery</h3>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                    <Package className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold mb-1 text-foreground">Order Tracking</h3>
                  <p className="text-sm text-muted-foreground">Track your order anytime</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold mb-1 text-foreground">Free Returns</h3>
                  <p className="text-sm text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}