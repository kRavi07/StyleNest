"use client";

import { useState } from "react";
import Link from "next/link";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import { useLogin } from "@/lib/react-query/auth/queries";
import { useSearchParams } from "next/navigation";
import CaptchaWidget from "@/components/common/captcha/captcha-verification";
import CaptchaV2Widget from "@/components/common/captcha/google-captcha-v2";
import { toast } from "sonner";
import { useAuth } from "@/hooks/store/auth";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutateAsync: login } = useLogin();
  const { login: authLogin } = useAuth()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);


  const searchParam = useSearchParams();
  const redirect = searchParam.get("redirect");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);

      toast.promise(login({ email: data.email, password: data.password }), {
        loading: "Logging in...",
        success: (data) => {
          authLogin(data.data);
          router.push(redirect ?? "/" as any);
          return "Login successful";
        },
        error: (err) => {
          const msg = err instanceof Error ? err.message : 'Failed to login. Please try again.';
          return msg
        }
      })


    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }




  return (
    <div className="container max-w-md mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Please sign in to your account.
        </p>
      </div>

      <div className="bg-card border rounded-lg shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
              <Link
                href="/"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <CaptchaV2Widget onVerifiedChange={setIsCaptchaVerified} />

            <Button type="submit" className="w-full" disabled={!isCaptchaVerified || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">
                Don&apos;t have an account?
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </div>
        </div>


      </div>
    </div>
  );
}