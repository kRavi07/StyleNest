import { useEffect, useCallback, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentStatus = "idle" | "processing" | "failed";

interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export function useRazorpay() {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [failureResponse, setFailureResponse] =
    useState<RazorpayFailureResponse | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    const handleLoad = () => console.log("Razorpay SDK loaded");
    const handleError = () =>
      console.error("❌ Failed to load Razorpay script");

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initiatePayment = useCallback((options: any) => {
    if (!window.Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }

    setStatus("processing");
    setFailureResponse(null);

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", (response: RazorpayFailureResponse) => {
      console.error("Payment failed:", response);
      setStatus("failed");
      setFailureResponse(response);
    });

    razorpay.open();
  }, []);

  return { initiatePayment, status, failureResponse };
}
