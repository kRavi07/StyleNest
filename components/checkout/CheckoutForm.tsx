/* eslint-disable no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useCartStore } from '@/hooks/store/cart/use-cart';
import { useCheckoutData } from '@/hooks/useCheckoutData';
import { useRazorpay } from '@/hooks/useRazorpay';
import { CheckoutFormData, ShippingAddress } from '@/types/checkout';

import { ProgressSteps } from './ProgressSteps';
import ShippingAddressForm from './ShippingAddressForm';
import { PaymentMethodForm } from './PaymentMethodForm';
import { OrderReview } from './OrderReview';
import { OrderSummary } from './OrderSummary';
import { EmptyCart } from './EmptyCart';
import { Address } from '@/types';
import { FormProvider, useForm } from 'react-hook-form';
import { useCreateOrder } from '@/lib/react-query/order/query';
import { useCreatePaymentOrder } from '@/lib/react-query/user/payment/query';
import { toast } from 'sonner';
import { useGetAddresses } from '@/lib/react-query/user/query';

const STEPS = ['Shipping', 'Payment', 'Review'];
const TAX_RATE = 0.18;

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cart, subtotal, totalItemCount } = useCartStore((state) => state);
  const [validatingSig, setvalidatingSig] = useState(false);
  const { initiatePayment } = useRazorpay();
  const { mutateAsync: createOrder } = useCreateOrder()
  const { data: addresses, isLoading: addressesLoading } = useGetAddresses();
  const { data: paymentData, mutateAsync: createPaymentOrder } = useCreatePaymentOrder();

  const {
    currentStep,
    shippingRates,
    selectedShipping,
    isLoading,
    isProcessing,
    error,
    setSelectedShipping,
    setIsProcessing,
    setError,
    fetchShippingRates,
    calculateTotal,
    nextStep,
    prevStep
  } = useCheckoutData();

  // React Hook Form setup
  const form = useForm<CheckoutFormData>({
    defaultValues: {
      shippingAddress: {
        firstName: "",
        lastName: "",
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        country: 'India'
      } as ShippingAddress,
      billingAddress: {
        firstName: "",
        lastName: "",
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        country: 'India'
      } as ShippingAddress,
      useSameBillingAddress: false,
      paymentMethod: 'razorpay' as 'razorpay' | 'cod'
    }
  });

  const { watch, setValue, getValues, handleSubmit } = form;
  const watchedData = watch();

  // Show loading spinner during initial load
  if (isLoading && currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show empty cart if no items
  if (!cart || cart.length === 0) {
    return <EmptyCart />;
  }

  const handleShippingSubmit = async (data: Partial<CheckoutFormData>) => {

    const shippingAddress = data.shippingAddress;
    const billingAddress = data.billingAddress;



    if (!shippingAddress) {
      setError('Shipping address is required');
      console.error('Shipping address is missing');
      return;
    }

    if (!billingAddress) {
      setError('Billing address is required');
      console.error('Billing address is missing');
      return;
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'postalCode', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field as keyof ShippingAddress]);

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      console.error('Missing required fields in shipping address:', missingFields);
      return;
    }


    try {
      if (!shippingAddress.postalCode) {
        toast.error("Please enter a valid postal code.");
      }


      await fetchShippingRates(shippingAddress.postalCode);


      nextStep();
    } catch (error) {
      setError('Failed to fetch shipping rates. Please check your postal code and try again.');
      console.error('Shipping rates error:', error);
    }
  };




  const handlePaymentSubmit = (paymentMethod: 'razorpay' | 'cod') => {
    setValue('paymentMethod', paymentMethod);
    nextStep();
  };

  const handlePlaceOrder = async () => {
    if (!cart || !selectedShipping) return;

    setIsProcessing(true);
    setError('');

    try {
      const formData = getValues();
      formData.shippingAddress.country = 'India';
      formData.billingAddress.country = 'India';

      const res = await createOrder({
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress,
        paymentMethod: formData.paymentMethod,
        shippingRate: 0,
        cartItems: cart,
        subtotal,
        total: subtotal
      })




      if (!res) {
        throw new Error('Failed to create order');
      }

      const order = res.data;

      if (formData.paymentMethod === 'cod') {
        router.push(`/checkout-new/success?orderId=${order._id}`);
        return;
      }
    } catch (error) {
      setError('Failed to create order. Please try again.');
    } finally {

      setIsProcessing(false);
    }
  }

  /* Create Razorpay payment
  const paymentResponse = await fetch('/api/payments/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: order._id })
  });

  if (!paymentResponse.ok) {
    throw new Error('Failed to create payment');
  }

  const paymentData = await paymentResponse.json();


  // Initialize Razorpay payment
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: paymentData.data.amount,
    currency: paymentData.data.currency,
    name: 'Drimcot Trends',
    description: `Order #${paymentData.data.orderDetails.orderNumber}`,
    order_id: paymentData.data.orderId,


    handler: async (response: any) => {
      try {
        setvalidatingSig(true)
        const verifyResponse = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order._id,
            razorpayOrderId: paymentData.data.orderId,
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
      name: `${formData.shippingAddress.firstName} ${formData.shippingAddress.lastName}`,
      contact: formData.shippingAddress.phone
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
};*/


  const total = subtotal;

  if (addressesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 dark:border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {
          validatingSig ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 dark:border-yellow-400"></div>
            </div>
          ) : (
            <>
              <ProgressSteps currentStep={currentStep} steps={STEPS} />

              <FormProvider {...form}>
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {currentStep === 1 && (
                      <div className='space-y-6'>
                        <ShippingAddressForm
                          onSubmit={handleShippingSubmit}
                          initialData={watchedData.shippingAddress}
                          savedAddresses={addresses.addresses}
                        />


                      </div>
                    )}

                    {currentStep === 2 && (
                      <PaymentMethodForm
                        initialPaymentMethod={"cod"}
                        onSubmit={handlePaymentSubmit}
                        onBack={prevStep}
                      />
                    )}

                    {currentStep === 3 && (
                      <OrderReview
                        shippingAddress={watchedData.shippingAddress}
                        paymentMethod={"cod"}
                        shippingRate={selectedShipping!}
                        total={total}
                        onPlaceOrder={handlePlaceOrder}
                        onBack={prevStep}
                        isProcessing={isProcessing}
                        error={error}
                      />
                    )}
                  </div>

                  <div className="lg:col-span-1">
                    <OrderSummary
                      cartItems={cart}
                      subtotal={subtotal}
                      selectedShipping={selectedShipping}
                      taxRate={TAX_RATE}
                    />
                  </div>
                </div>
              </FormProvider>
            </>
          )
        }
      </div>
    </div>
  );
}