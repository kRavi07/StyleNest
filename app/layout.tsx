import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ReactQueryClientProviders from "@/components/providers/query-client-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Attire | Premium Clothing Store",
  description: "Discover the latest fashion trends and premium clothing at Attire",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
        </ThemeProvider>
      </body>
    </html>
  );
}