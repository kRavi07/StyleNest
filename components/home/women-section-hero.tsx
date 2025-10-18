"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { fadeUp, stagger } from "@/lib/utils/animation"
import { WaitiListForm } from "../common/waitlist-form"

export function ComingSoonHero() {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
    const y = useTransform(scrollYProgress, [0, 1], [0, 60])

    const isMen = false
    const heroImage = isMen ? "/images/men-hero-2.png" : "/images/women-hero.jpg"
    const title = isMen ? "Drimcot Men" : "Drimcot Women"
    const blurb = isMen
        ? "Modern menswear. Tailored silhouettes and precision details — engineered for movement."
        : "Editorial womenswear. Modern essentials and statement silhouettes — refined for everyday elegance."
    const primaryCta = "Join Waitlist"

    return (
        <section ref={ref} className="relative isolate min-h-[88vh] flex items-center">
            {/* Subtle vignette */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_-10%,rgba(0,0,0,0.25),transparent)] dark:bg-[radial-gradient(90%_60%_at_50%_-10%,rgba(255,255,255,0.06),transparent)]" />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center gap-10">
                <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col items-center gap-4">
                    <motion.h1 variants={fadeUp} className="font-serif text-balance text-5xl md:text-7xl tracking-tight">
                        {title}
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-pretty max-w-xl text-sm md:text-base text-muted-foreground">
                        {blurb}
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex items-center gap-3">
                        <a href="#waitlist" className="btn-brand  rounded-full">
                            {primaryCta}
                        </a>
                    </motion.div>
                </motion.div>

                {/* Central image with parallax */}
                <motion.div style={{ y }} className="relative w-full max-w-4xl">
                    <motion.img
                        src={heroImage}
                        alt={isMen ? "Drimcot menswear editorial" : "Drimcot womenswear editorial"}
                        decoding="async"
                        loading="lazy"
                        className="rounded-lg border border-border/60 object-cover"
                        style={{
                            transform: "translateY(-50%)",
                            width: "100%",
                        }}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    />
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-md font-semibold uppercase tracking-widest text-accent"
                >
                    {isMen ? "Men — Launching Soon" : "Women — Coming Soon"}
                </motion.p>

                <div id="waitlist">

                    <WaitiListForm />
                </div>
            </div>
        </section>
    )
}
