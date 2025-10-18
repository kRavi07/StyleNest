import { CheckoutProvider } from "@/hooks/store/checkout-context";

// app/checkout/layout.tsx
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <CheckoutProvider>{children}</CheckoutProvider>;
}
