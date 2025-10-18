"use client"

import { motion } from "framer-motion"

export function ComingSoonIllustration() {
    return (
        <svg
            width="400"
            height="400"
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-md mx-auto"
        >
            {/* Gift Box */}
            <motion.g
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            >
                {/* Box Base - More vibrant orange */}
                <rect x="120" y="180" width="160" height="140" fill="#f97316" rx="8" />
                <rect x="120" y="180" width="160" height="40" fill="#ea580c" rx="8" />

                {/* Ribbon Vertical - Vibrant pink */}
                <rect x="185" y="180" width="30" height="140" fill="#ec4899" />

                {/* Ribbon Horizontal */}
                <rect x="120" y="235" width="160" height="30" fill="#ec4899" />

                {/* Bow - Enhanced pink shades */}
                <motion.g
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                >
                    <ellipse cx="170" cy="170" rx="25" ry="15" fill="#f472b6" />
                    <ellipse cx="230" cy="170" rx="25" ry="15" fill="#f472b6" />
                    <circle cx="200" cy="170" r="12" fill="#ec4899" />
                </motion.g>
            </motion.g>

            {/* Sparkles - More vibrant yellow/gold */}
            {[
                { x: 80, y: 120, delay: 0 },
                { x: 320, y: 140, delay: 0.2 },
                { x: 100, y: 280, delay: 0.4 },
                { x: 300, y: 260, delay: 0.6 },
                { x: 200, y: 100, delay: 0.3 },
                { x: 340, y: 220, delay: 0.5 },
            ].map((sparkle, i) => (
                <motion.g
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: sparkle.delay,
                        repeatDelay: 0.5,
                    }}
                >
                    <path
                        d={`M ${sparkle.x} ${sparkle.y - 10} L ${sparkle.x + 2} ${sparkle.y - 2} L ${sparkle.x + 10} ${sparkle.y} L ${sparkle.x + 2} ${sparkle.y + 2} L ${sparkle.x} ${sparkle.y + 10} L ${sparkle.x - 2} ${sparkle.y + 2} L ${sparkle.x - 10} ${sparkle.y} L ${sparkle.x - 2} ${sparkle.y - 2} Z`}
                        fill="#fbbf24"
                    />
                </motion.g>
            ))}

            {/* Floating Coins - Brighter gold colors */}
            {[
                { x: 60, y: 200, delay: 0 },
                { x: 340, y: 180, delay: 0.3 },
            ].map((coin, i) => (
                <motion.g
                    key={i}
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: coin.delay,
                        ease: "easeInOut",
                    }}
                >
                    <circle cx={coin.x} cy={coin.y} r="20" fill="#fbbf24" />
                    <circle cx={coin.x} cy={coin.y} r="15" fill="#f59e0b" />
                    <text x={coin.x} y={coin.y + 5} textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">
                        $
                    </text>
                </motion.g>
            ))}
        </svg>
    )
}
