"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { fade } from "@/lib/utils/animation"

const menSources = [
    "/images/men-look-1.png",
    "/images/men-look-2.png",
    "/images/men-look-5.jpg",
    "/images/men-look-6.jpg",
    "/images/men-look-7.jpg",
]

export function Moodboard() {
    const sources = menSources;
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % sources.length)
        }, 3500)
        return () => clearInterval(id)
    }, [sources])

    return (
        <section id="lookbook" className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24" aria-label="Lookbook">
            <div className="grid grid-cols-1 gap-6">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border/60">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={`${sources[index]}`}
                            variants={fade}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            src={sources[index]}
                            alt="Moodboard visual"
                            decoding="async"
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-contain bg-[#f8f8f8] dark:bg-[#121212]"
                        />
                    </AnimatePresence>
                </div>
                <div className="mx-auto flex items-center gap-2">
                    {sources.map((_, i) => (
                        <button
                            key={`moodboard-dot-${i}`}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => setIndex(i)}
                            className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-accent" : "bg-foreground/30"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
