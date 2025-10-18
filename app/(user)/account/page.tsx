"use client";

import { useAuth } from "@/hooks/store/auth";
import EcommerceProfilePage from "@/components/account/main";

export default function AccountPage() {
  const { user, isLoading } = useAuth((state: any) => state);




  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 dark:text-gray-200 font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }


  return (
    <EcommerceProfilePage />
  );
}