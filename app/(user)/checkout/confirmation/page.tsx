"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Home, ArrowRight } from "lucide-react";

export default function ConfirmationPage() {
  const router = useRouter();
  
  // In a real app, you would get this data from the order that was just placed
  const orderNumber = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  const orderDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>
        
        <div className="bg-card border rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-muted/50">
            <h2 className="font-semibold">Order Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Order Number</h3>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                <p>{orderDate}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h3>
              <div className="flex items-start space-x-2">
                <Home className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p>John Doe</p>
                  <p>123 Main St</p>
                  <p>Apt 4B</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Method</h3>
              <div className="flex items-start space-x-2">
                <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p>Standard Shipping</p>
                  <p className="text-muted-foreground">Estimated Delivery: {estimatedDelivery}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Method</h3>
              <p>Credit Card (ending in 4242)</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-muted/50">
            <h2 className="font-semibold">What Happens Next?</h2>
          </div>
          <div className="p-6">
            <ol className="space-y-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Order Processing</h3>
                  <p className="text-muted-foreground">
                    We're currently processing your order. You'll receive a confirmation email shortly.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Order Shipment</h3>
                  <p className="text-muted-foreground">
                    Once your order ships, we'll send you tracking information via email.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Order Delivery</h3>
                  <p className="text-muted-foreground">
                    Your order should arrive within the estimated delivery timeframe.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/account/orders')}>
            View Your Orders
          </Button>
          <Button variant="outline" onClick={() => router.push('/products')}>
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}