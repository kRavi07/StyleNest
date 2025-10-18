"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NotFoundIllustration } from "@/components/common/not-found-illustration"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10 dark:from-background dark:via-accent/10 dark:to-secondary/20 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 70px)`,
                        color: "#f97316",
                    }}
                />
            </div>

            <div className="max-w-3xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Illustration */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <NotFoundIllustration />
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl md:text-7xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4 font-[family-name:var(--font-montserrat)]"
                    >
                        Oops! Page Not Found
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-foreground/70 dark:text-foreground/80 mb-8 max-w-xl mx-auto text-pretty"
                    >
                        Looks like our robot got lost in cyberspace! The page you are looking for doesn&apos;t exist or has been moved.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-lg hover:shadow-2xl transition-all group hover:scale-105"
                            >
                                <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Go to Home
                            </Button>
                        </Link>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-accent dark:border-accent/80 text-accent dark:text-accent/90 hover:bg-accent hover:text-white dark:hover:text-white font-bold transition-all group bg-transparent hover:scale-105"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </Button>
                    </motion.div>

                    {/* Helpful Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-12 p-6 bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-lg border-2 border-border dark:border-border/50"
                    >
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Search className="w-5 h-5 text-accent dark:text-accent/90" />
                            <h3 className="font-bold text-lg font-[family-name:var(--font-montserrat)] text-foreground">
                                Looking for something?
                            </h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Check out our homepage for the latest deals and offers, or use the navigation menu to find what you need.
                        </p>
                    </motion.div>

                    {/* Fun Error Code */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-8 text-xs bg-gradient-to-r from-primary/60 to-secondary/60 bg-clip-text text-transparent font-mono font-bold"
                    >
                        ERROR_CODE: 404_ROBOT_CONFUSED
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
