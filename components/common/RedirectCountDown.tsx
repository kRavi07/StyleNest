// components/RedirectCountdown.tsx
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRedirectWithCountdown } from "@/hooks/useRedirectWithCountdown";

interface RedirectCountdownProps {
    seconds: number;
    target: string;
}

export function RedirectCountdown({ seconds, target }: RedirectCountdownProps) {
    const countdown = useRedirectWithCountdown(seconds, target);

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={countdown}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.4 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-yellow-500dark:text-yellow-200"
                >
                    {countdown}
                </motion.span>
            </AnimatePresence>

            <p className="text-md text-gray-600 dark:text-gray-200">
                Redirecting you to{" "}
                <a href={target} className="text-blue-600 underline">
                    {target.split("/")[1]}
                </a>
            </p>
        </div>
    );
}
