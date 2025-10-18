"use client"

import { motion } from "framer-motion"
import { fadeUp, stagger, hoverLift } from "@/lib/utils/animation"

export function BrandStory() {
    const isMen = true
    const heading = isMen ? "Tailored for the Elegant & Modern Man" : "Refined for the Elegant Woman"
    const copy = isMen
        ? "Drimcot refines essentials with architectural lines and tactile fabrics. Constructed to move with you and built to last — from precise suiting to elevated daily layers. Effortless layers and statement pieces — coming soon."
        : "Drimcot Womens refines modern essentials with sculptural silhouettes and tactile fabrics. Effortless layers and statement pieces — coming soon."
    const image = isMen ? "/images/men-runway-mono.png" : "/images/women-look-1.jpg"

    return (
        <section id="story" className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
            >
                <motion.div variants={fadeUp} className="flex flex-col gap-4">
                    <h2 className="font-serif text-3xl md:text-5xl tracking-tight">{heading}</h2>
                    <p className="text-muted-foreground leading-relaxed">{copy}</p>
                    <div className="pt-2">
                        <a href="#lookbook" className="btn-outline-brand rounded-full">
                            View Lookbook
                        </a>
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} className="relative" initial="rest" whileHover="hover">
                    <motion.img
                        variants={hoverLift}
                        src={image}
                        alt={isMen ? "Drimcot mens runway monochrome look" : "Drimcot womens editorial"}
                        decoding="async"
                        loading="lazy"
                        className="w-full rounded-lg border border-border/60 object-cover"
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}
