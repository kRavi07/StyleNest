import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ReactQueryClientProviders from "@/components/providers/query-client-provider";
import { Toaster } from "sonner";
import GoogleCaptchaProviderClient from "@/lib/provider/google-captcha";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drimcot | Premium Clothing Store",
  description: "Discover the latest fashion trends and premium clothing at Drimcot. Shop now for exclusive styles and quality apparel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GoogleCaptchaProviderClient>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
          >
            <ReactQueryClientProviders>
              {
                children
              }
            </ReactQueryClientProviders>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </GoogleCaptchaProviderClient>
      </body>
    </html>
  );
}