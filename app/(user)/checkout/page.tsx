"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShieldCheck, CreditCard, CheckCheck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useAuth } from "@/hooks/store/auth";

const checkoutSchema = z.object({
  email: z.string().email(),
  shippingAddress: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    address1: z.string().min(5, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(2, "Country is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
  billingAddress: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    address1: z.string().min(5, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(2, "Country is required"),
    phone: z.string().min(10, "Valid phone number is required"),
  }),
  payment: z.object({
    method: z.enum(["credit_card", "paypal"]),
    cardNumber: z.string().optional(),
    cardholderName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
  }),
  sameAsShipping: z.boolean().default(false),
  saveInformation: z.boolean().default(false),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<"information" | "shipping" | "payment">("information");

  // Calculate order summary
  const subtotal = cart.subtotal;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      shippingAddress: {
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        phone: "",
      },
      billingAddress: {
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        phone: "",
      },
      payment: {
        method: "credit_card",
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        cvv: "",
      },
      sameAsShipping: true,
      saveInformation: false,
    },
  });

  // Copy shipping address to billing address when same as shipping is checked
  const watchSameAsShipping = form.watch("sameAsShipping");
  const watchShippingAddress = form.watch("shippingAddress");

  React.useEffect(() => {
    if (watchSameAsShipping) {
      form.setValue("billingAddress", watchShippingAddress);
    }
  }, [watchSameAsShipping, watchShippingAddress, form]);

  const handleSubmit = (data: CheckoutFormValues) => {
    if (cart.items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add items before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Clear cart after successful order
      clearCart();

      // Redirect to order confirmation
      router.push("/checkout/confirmation");

      setIsProcessing(false);
    }, 2000);
  };

  // If cart is empty, redirect to cart page
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Empty Cart</h1>
        <p className="text-muted-foreground mb-8">
          Your cart is empty. Add items before checking out.
        </p>
        <Button onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">
        Complete your purchase by providing the information below.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Checkout Steps */}
              <Tabs
                value={currentStep}
                onValueChange={(value) => setCurrentStep(value as any)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="information">Information</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="payment">Payment</TabsTrigger>
                </TabsList>

                {/* Information Step */}
                <TabsContent value="information" className="space-y-6 pt-6">
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Contact Information</h2>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="saveInformation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Save my information for faster checkout next time</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      Continue to Shipping
                    </Button>
                  </div>
                </TabsContent>

                {/* Shipping Step */}
                <TabsContent value="shipping" className="space-y-6 pt-6">
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Shipping Address</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress.firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingAddress.lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="shippingAddress.address1"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingAddress.address2"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress.zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP / Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingAddress.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="shippingAddress.phone"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Billing Address</h2>

                    <FormField
                      control={form.control}
                      name="sameAsShipping"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Same as shipping address</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {!watchSameAsShipping && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="billingAddress.firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="billingAddress.lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="billingAddress.address1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="billingAddress.address2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="billingAddress.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="billingAddress.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State / Province</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="billingAddress.zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP / Postal Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="billingAddress.country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="billingAddress.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("information")}
                    >
                      Back to Information
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setCurrentStep("payment")}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </TabsContent>

                {/* Payment Step */}
                <TabsContent value="payment" className="space-y-6 pt-6">
                  <div className="bg-card border rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Payment Method</h2>

                    <FormField
                      control={form.control}
                      name="payment.method"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-2 border rounded-md p-4">
                                <RadioGroupItem value="credit_card" id="payment-credit-card" />
                                <label
                                  htmlFor="payment-credit-card"
                                  className="flex items-center justify-between w-full cursor-pointer"
                                >
                                  <div className="flex items-center">
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    <span>Credit / Debit Card</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                                  </div>
                                </label>
                              </div>

                              <div className="flex items-center space-x-2 border rounded-md p-4">
                                <RadioGroupItem value="paypal" id="payment-paypal" />
                                <label
                                  htmlFor="payment-paypal"
                                  className="flex items-center justify-between w-full cursor-pointer"
                                >
                                  <span>PayPal</span>
                                  <div className="w-12 h-6 bg-slate-200 rounded"></div>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("payment.method") === "credit_card" && (
                      <div className="space-y-4 mt-6">
                        <FormField
                          control={form.control}
                          name="payment.cardholderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="payment.cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="•••• •••• •••• ••••"
                                  maxLength={19}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="payment.expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="MM / YY" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="payment.cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="•••" maxLength={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center mt-6 text-sm text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      <span>Your payment information is secured with industry-standard encryption.</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      Back to Shipping
                    </Button>
                    <Button
                      type="submit"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Complete Order"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg overflow-hidden sticky top-20">
            <div className="px-6 py-4 bg-muted/50">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="max-h-64 overflow-y-auto mb-4">
                {cart.items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded bg-muted/20 flex-shrink-0"
                      style={{
                        backgroundImage: `url(${item.product.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">{item.product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> | </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
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
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}