"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  XCircle,
  AlertTriangle,
  CreditCard,
  RefreshCw,
  ArrowLeft,
  Phone,
  Mail,
  Clock,
  Shield,
  HelpCircle,
  Package,
  MapPin,
  Truck,
} from "lucide-react"
import Image from "next/image"
import { useGetOrder } from "@/lib/react-query/order/query"
import { useRazorpay } from "@/hooks/useRazorpay"

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}


function ErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { initiatePayment, status, failureResponse } = useRazorpay();
  const [, setvalidatingSig] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  const orderId = searchParams.get("orderId")
  const reason = searchParams.get("reason") || "unknown"


  const { data, isLoading, isSuccess, isError } = useGetOrder(orderId as string)

  const order = isSuccess && data?.data

  useEffect(() => {
    if (status === "failed" && failureResponse) {
      console.error("error", failureResponse)
      setError(failureResponse?.error?.reason)
      setIsProcessing(false)
    }

    if (error && status === "failed" && !isProcessing) {
      router.push(`/checkout-new/error?orderId=${orderId}&reason=${failureResponse?.error?.reason}`)

    }
  }, [isError, reason, failureResponse, status, error, isProcessing, router, orderId])




  const getErrorDetails = (reason: string) => {
    switch (reason) {
      case "payment_cancelled":
        return {
          title: "Payment Cancelled",
          description: "You cancelled the payment process. Your order is still pending.",
          icon: <XCircle className="h-12 w-12 text-orange-500 dark:text-orange-400" />,
          color: "orange",
          canRetry: true,
        }
      case "payment_failed":
        return {
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try again with a different payment method.",
          icon: <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />,
          color: "red",
          canRetry: true,
        }
      case "verification_failed":
        return {
          title: "Payment Verification Failed",
          description: "We could not verify your payment. Please contact support if money was deducted.",
          icon: <Shield className="h-12 w-12 text-red-500 dark:text-red-400" />,
          color: "red",
          canRetry: false,
        }
      case "verification_error":
        return {
          title: "Technical Error",
          description: "A technical error occurred during payment verification. Please contact support.",
          icon: <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />,
          color: "red",
          canRetry: false,
        }
      default:
        return {
          title: "Something Went Wrong",
          description: "An unexpected error occurred. Please try again or contact support.",
          icon: <HelpCircle className="h-12 w-12 text-muted-foreground" />,
          color: "gray",
          canRetry: true,
        }
    }
  }

  const handleRetryPayment = async () => {


    try {




      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order?.total * 100,
        currency: "INR",
        name: 'DrimCot',
        description: `Order #${order.orderNumber}`,
        order_id: order.razorpayOrderId,


        handler: async (response: any) => {
          try {
            setvalidatingSig(true)
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order._id,
                razorpayOrderId: order.razorpayOrderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            if (verifyResponse.ok) {
              router.push(`/checkout-new/success?orderId=${order._id}&paymentId=${response.razorpay_payment_id}`);
            } else {
              router.push(`/checkout-new/error?orderId=${order._id}&reason=verification_failed`);
            }
          } catch (error) {
            router.push(`/checkout-new/error?orderId=${order._id}&reason=verification_error`);
          } finally {
            setvalidatingSig(false)
          }

        },
        modal: {
          ondismiss: () => {
            router.push(`/checkout-new/error?orderId=${order._id}&reason=payment_cancelled`);
          }
        },
        prefill: {
          name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
          contact: order.shippingAddress.phone,
          email: order.customer.email
        },
        theme: {
          color: "#F37254"
        },
      };

      initiatePayment(options);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const errorDetails = getErrorDetails(reason)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-destructive"></div>
      </div>
    )
  }

  if (isSuccess) {

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-card rounded-full mb-6 shadow-lg border">
                {errorDetails.icon}
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{errorDetails.title}</h1>
              <p className="text-xl text-muted-foreground mb-6 text-pretty">{errorDetails.description}</p>

              {order && (
                <div className="bg-card border rounded-lg p-4 shadow-sm max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Order Number:</span>
                    <Badge variant="outline" className="font-mono">
                      #{order.orderNumber}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                      {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Payment Status:</span>
                    <Badge variant={order.paymentStatus === "pending" ? "destructive" : "default"}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Total Amount:</span>
                    <span className="text-lg font-bold text-foreground">₹{order.total}</span>
                  </div>
                </div>
              )}
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-lg border-destructive/20">
                  <CardHeader className="bg-destructive/5 dark:bg-destructive/10 border-b">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      What Happened?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {reason === "payment_cancelled" && (
                      <Alert className="border-orange-200 dark:border-orange-800">
                        <Clock className="h-4 w-4" />
                        <AlertDescription className="text-foreground">
                          Your order has been created but payment is still pending. You can complete the payment now or
                          try again later.
                        </AlertDescription>
                      </Alert>
                    )}

                    {reason === "payment_failed" && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          The payment was declined by your bank or payment provider. Please check your payment details and
                          try again.
                        </AlertDescription>
                      </Alert>
                    )}

                    {(reason === "verification_failed" || reason === "verification_error") && (
                      <Alert variant="destructive">
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          If money has been deducted from your account, please don&apos;t worry. Contact our support team
                          with your order number and we will resolve this quickly.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      {errorDetails.canRetry && order && (
                        <Button onClick={handleRetryPayment} className="flex-1" aria-label="Retry payment for this order">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry Payment
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => router.push("/account/orders")}
                        className="flex-1"
                        aria-label="View all your orders"
                      >
                        View Orders
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="flex-1"
                        aria-label="Return to homepage and continue shopping"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {order && (
                  <>
                    {/* Order Summary */}
                    <Card className="shadow-lg">
                      <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b">
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <Package className="h-5 w-5 text-primary" />
                          Order Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {order.items?.map((item: any, index: number) => (
                            <div key={item._id || index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                              {item.image && (
                                <Image
                                  src="https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                  width={64}
                                  height={64}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-md border"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="font-medium text-foreground">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-foreground">₹{order.subtotal?.toFixed(2) || "0.00"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-foreground">₹{order.shippingCost?.toFixed(2) || "0.00"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="text-foreground">₹{order.tax?.toFixed(2) || "0.00"}</span>
                          </div>
                          {order.discount && order.discount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Discount</span>
                              <span className="text-green-600 dark:text-green-400">-₹{order.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-semibold text-lg">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">₹{order.total}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order & Shipping Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="shadow-lg">
                        <CardHeader className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
                          <CardTitle className="flex items-center gap-2 text-foreground">
                            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Order Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Order Number</p>
                              <p className="font-semibold text-foreground">#{order.orderNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Order Date</p>
                              <p className="font-medium text-foreground">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Order Status</p>
                              <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Payment Status</p>
                              <Badge variant={order.paymentStatus === "pending" ? "destructive" : "default"}>
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                              </Badge>
                            </div>
                            {order.paymentMethod && (
                              <div>
                                <p className="text-sm text-muted-foreground">Payment Method</p>
                                <p className="font-medium text-foreground">{order.paymentMethod}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {order.shippingAddress && (
                        <Card className="shadow-lg">
                          <CardHeader className="bg-green-50 dark:bg-green-950/20 border-b border-green-200 dark:border-green-800">
                            <CardTitle className="flex items-center gap-2 text-foreground">
                              <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
                              Shipping Address
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <address className="not-italic space-y-1 text-foreground">
                              <p className="font-semibold">{order.shippingAddress.fullName}</p>
                              <p>{order.shippingAddress.addressLine1}</p>
                              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                {order.shippingAddress.postalCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                              <p className="text-muted-foreground mt-2">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                {order.shippingAddress.phone}
                              </p>
                            </address>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Customer support information */}
              <aside className="lg:col-span-1" aria-label="Customer support information">
                <Card className="shadow-lg sticky top-8">
                  <CardHeader className="bg-card border-b">
                    <CardTitle className="text-card-foreground">Need Help?</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Our support team is here to assist you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm text-card-foreground">Call Support</p>
                          <p className="text-xs text-muted-foreground">+91 1800-123-4567</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="font-medium text-sm text-card-foreground">Email Support</p>
                          <p className="text-xs text-muted-foreground">support@yourstore.com</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <h3 className="font-semibold text-sm mb-2 text-card-foreground">💡 Quick Tips</h3>
                      <ul className="text-xs text-muted-foreground space-y-1" role="list">
                        <li>• Check your internet connection</li>
                        <li>• Ensure sufficient balance in your account</li>
                        <li>• Try a different payment method</li>
                        <li>• Clear browser cache and cookies</li>
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4 bg-transparent"
                      aria-label="Contact customer support"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </aside>
            </div>

            {/* Frequently Asked Questions */}
            <section className="mt-8" aria-labelledby="faq-heading">
              <Card className="shadow-lg">
                <CardHeader className="bg-muted/50 border-b">
                  <CardTitle id="faq-heading" className="text-foreground">
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-foreground">Will I be charged if payment failed?</h3>
                      <p className="text-sm text-muted-foreground">
                        No, if the payment failed, no amount will be deducted from your account. If you see a deduction,
                        it is usually a temporary hold that will be released within 3-5 business days.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-foreground">Can I change my payment method?</h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, you can retry the payment with a different payment method. Your order will remain active for
                        24 hours.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-foreground">What if money was deducted?</h3>
                      <p className="text-sm text-muted-foreground">
                        If money was deducted but the order shows as failed, please contact our support team immediately
                        with your order number and transaction details.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-foreground">How long is my order valid?</h3>
                      <p className="text-sm text-muted-foreground">
                        Your order will remain active for 24 hours. After that, it will be automatically cancelled and any
                        held amounts will be released.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-destructive"></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
