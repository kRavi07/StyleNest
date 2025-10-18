"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface CaptchaProps {
    // eslint-disable-next-line no-unused-vars
    onVerifiedChange: (isVerified: boolean) => void;
}

type Status = "idle" | "verifying" | "verified" | "error";

const TOKEN_CACHE_KEY = "captcha_token_cache";
const TOKEN_CACHE_DURATION = 1000 * 60 * 2; // 2 minutes

const CaptchaV2Widget: React.FC<CaptchaProps> = ({ onVerifiedChange }) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Save token to localStorage with timestamp
    const cacheToken = (token: string) => {
        const item = { token, ts: Date.now() };
        localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(item));
    };

    // Try to get cached token
    const getCachedToken = (): string | null => {
        const itemStr = localStorage.getItem(TOKEN_CACHE_KEY);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            if (Date.now() - item.ts < TOKEN_CACHE_DURATION) {
                return item.token;
            }
            // expired
            localStorage.removeItem(TOKEN_CACHE_KEY);
            return null;
        } catch {
            localStorage.removeItem(TOKEN_CACHE_KEY);
            return null;
        }
    };

    const verifyToken = async (token: string) => {
        try {
            const res = await fetch("/api/captcha-verify/v2", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();

            if (data.success) {
                setStatus("verified");
                onVerifiedChange(true);
                cacheToken(token); // save valid token
            } else {
                setErrorMessage("Captcha verification failed.");
                setStatus("error");
                onVerifiedChange(false);
                localStorage.removeItem(TOKEN_CACHE_KEY);
            }
        } catch (err) {
            console.error("Captcha verification error:", err);
            setErrorMessage("Server error during verification.");
            setStatus("error");
            onVerifiedChange(false);
            localStorage.removeItem(TOKEN_CACHE_KEY);
        }
    };

    const runCaptcha = async () => {
        const cachedToken = getCachedToken();
        if (cachedToken) {
            // Use cached token
            setStatus("verifying");
            await verifyToken(cachedToken);
            return;
        }

        if (!recaptchaRef.current) {
            setErrorMessage("reCAPTCHA not loaded yet.");
            setStatus("error");
            onVerifiedChange(false);
            return;
        }

        setStatus("verifying");
        setErrorMessage(null);

        try {
            const token = await recaptchaRef.current.executeAsync();
            if (!token) {
                setErrorMessage("Failed to generate captcha token.");
                setStatus("error");
                onVerifiedChange(false);
                return;
            }
            await verifyToken(token);
            recaptchaRef.current.reset(); // reset for next run
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to execute reCAPTCHA.");
            setStatus("error");
            onVerifiedChange(false);
        }
    };



    return (
        <div className="max-w-md my-2">
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY_V2!}
                size="invisible"
                hl="en"
                theme="dark"
            />

            {status === "idle" && (
                <Button
                    onClick={runCaptcha}
                    variant="outline"
                    className="w-full h-12 justify-start px-4 border border-accent bg-background hover:bg-accent/5 text-foreground transition-colors"
                >
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-5 h-5 rounded border border-accent flex items-center justify-center flex-shrink-0" />
                        <span className="text-sm font-medium">I&apos;m not a robot</span>
                    </div>
                </Button>
            )}

            {status === "verifying" && (
                <div className="w-full h-12 px-4 border border-input bg-background rounded-md flex items-center gap-3 cursor-not-allowed opacity-75">
                    <Loader2 className="w-5 h-5 text-accent animate-spin flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">Verifying...</span>
                </div>
            )}

            {status === "verified" && (
                <div className="w-full h-12 px-4 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-md flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Verified</span>
                </div>
            )}

            {status === "error" && (
                <div className="w-full space-y-2">
                    <div className="w-full h-12 px-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 rounded-md flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Verification failed</span>
                        <button
                            onClick={runCaptcha}
                            className="ml-auto text-xs text-red-600 dark:text-red-400 hover:underline"
                        >
                            Retry
                        </button>
                    </div>
                    {errorMessage && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CaptchaV2Widget;
