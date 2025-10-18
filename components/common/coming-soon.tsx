"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Sparkles } from "lucide-react"
import { useState } from "react"
import { ComingSoonIllustration } from "./coming-soon-illustration"

export default function ComingSoonPage() {
    const [email, setEmail] = useState("")
    const [subscribed, setSubscribed] = useState(false)

    // Set target date to 30 days from now
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 30)

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            setSubscribed(true)
            setTimeout(() => setSubscribed(false), 3000)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/20 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/30 dark:bg-primary/40 rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                        }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
                            x: [null, Math.random() * window.innerWidth],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </div>

            <div className="max-w-4xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                        className="inline-block mb-4"
                    >
                        <Sparkles className="w-12 h-12 text-secondary dark:text-secondary/90" />
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500  bg-clip-text text-transparent mb-4 font-[family-name:var(--font-montserrat)] text-balance"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.6 }}
                    >
                        Exciting Offers Coming Soon!
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-foreground/70 dark:text-foreground/80 max-w-2xl mx-auto text-pretty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Get ready for amazing deals and exclusive offers that will blow your mind. Be the first to know when we
                        launch!
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-12"
                >
                    <ComingSoonIllustration />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-center mb-6 font-[family-name:var(--font-montserrat)] text-foreground">
                        Launching Soon - Stay Updated!
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="max-w-md mx-auto"
                >
                    <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 h-12 text-base bg-background dark:bg-card border-2 border-border dark:border-border focus:border-primary dark:focus:border-primary"
                        />
                        <Button
                            type="submit"
                            size="lg"
                            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold h-12 px-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105"
                        >
                            <Bell className="w-5 h-5 mr-2" />
                            Notify Me!
                        </Button>
                    </form>

                    {subscribed && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mt-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent font-bold text-lg"
                        >
                            ✨ Thanks! We&apos;ll notify you when we launch!
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-12 text-sm text-muted-foreground"
                >
                    <p>Join thousands of others waiting for our exclusive launch offers</p>
                </motion.div>
            </div>
        </div>
    )
}
