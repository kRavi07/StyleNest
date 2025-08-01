"use client";

import { useContext } from "react";
import { AuthContext } from "@/components/providers/auth-provider";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
