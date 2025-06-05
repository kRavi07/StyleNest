"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const auth = localStorage.getItem("drimcot-auth");
      const { token } = auth ? JSON.parse(auth) : { token: null };

      if (token) {
        try {
          // In a real app, you would verify the token with your API
          // For demo purposes, we'll just check if it exists and use mock data
          const userData = localStorage.getItem("user");
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (error) {
          console.error("Authentication error:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Mock login function (would call your API in a real app)
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, we'll use hardcoded credentials
      if (email === "user@example.com" && password === "password") {
        const mockUser: User = {
          id: "1",
          name: "John Doe",
          email: "user@example.com",
          role: "user"
        };

        setUser(mockUser);
        localStorage.setItem("token", "mock-jwt-token");
        localStorage.setItem("user", JSON.stringify(mockUser));

        toast({
          title: "Login successful",
          description: "Welcome back!"
        });

        router.push("/account");
      } else if (email === "admin@example.com" && password === "password") {
        const mockAdmin: User = {
          id: "2",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin"
        };

        setUser(mockAdmin);
        localStorage.setItem("token", "mock-jwt-token-admin");
        localStorage.setItem("user", JSON.stringify(mockAdmin));

        toast({
          title: "Login successful",
          description: "Welcome back, Admin!"
        });

        router.push("/admin");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive"
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role: "user"
      };

      setUser(newUser);
      localStorage.setItem("token", "mock-jwt-token");
      localStorage.setItem("user", JSON.stringify(newUser));

      toast({
        title: "Registration successful",
        description: "Your account has been created"
      });

      router.push("/account");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
        variant: "destructive"
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });

    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthContext }