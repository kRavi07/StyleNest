"use client"

import { motion } from "framer-motion"

export function NotFoundIllustration() {
    return (
        <svg
            width="400"
            height="300"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-lg mx-auto"
        >
            {/* Lost Character - Cute Robot */}
            <motion.g initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {/* Robot Body - More vibrant orange */}
                <rect x="150" y="120" width="100" height="120" rx="15" fill="#f97316" />

                {/* Robot Head - Vibrant pink */}
                <rect x="160" y="80" width="80" height="60" rx="10" fill="#ec4899" />

                {/* Antenna */}
                <motion.g
                    animate={{ rotate: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    style={{ originX: "200px", originY: "80px" }}
                >
                    <line x1="200" y1="80" x2="200" y2="50" stroke="#1e293b" strokeWidth="3" />
                    <circle cx="200" cy="45" r="8" fill="#fbbf24" />
                    <motion.circle
                        cx="200"
                        cy="45"
                        r="8"
                        fill="#fbbf24"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                </motion.g>

                {/* Eyes - Blinking */}
                <motion.g
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                >
                    <circle cx="180" cy="105" r="8" fill="#ffffff" />
                    <circle cx="220" cy="105" r="8" fill="#ffffff" />
                    <circle cx="180" cy="105" r="4" fill="#0f172a" />
                    <circle cx="220" cy="105" r="4" fill="#0f172a" />
                </motion.g>

                {/* Sad Mouth */}
                <path d="M 175 125 Q 200 120 225 125" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />

                {/* Arms - Vibrant pink */}
                <motion.rect
                    x="120"
                    y="140"
                    width="30"
                    height="15"
                    rx="7"
                    fill="#f472b6"
                    animate={{ rotate: [-20, -10, -20] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    style={{ originX: "150px", originY: "147px" }}
                />
                <motion.rect
                    x="250"
                    y="140"
                    width="30"
                    height="15"
                    rx="7"
                    fill="#f472b6"
                    animate={{ rotate: [20, 10, 20] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    style={{ originX: "250px", originY: "147px" }}
                />

                {/* Legs - Darker legs */}
                <rect x="165" y="240" width="25" height="40" rx="5" fill="#1e293b" />
                <rect x="210" y="240" width="25" height="40" rx="5" fill="#1e293b" />

                {/* Feet - Vibrant orange */}
                <ellipse cx="177" cy="280" rx="20" ry="8" fill="#fb923c" />
                <ellipse cx="222" cy="280" rx="20" ry="8" fill="#fb923c" />
            </motion.g>

            {/* Question Marks Floating - More vibrant purple/pink */}
            {[
                { x: 100, y: 100, delay: 0 },
                { x: 300, y: 120, delay: 0.3 },
                { x: 80, y: 180, delay: 0.6 },
                { x: 320, y: 200, delay: 0.9 },
            ].map((mark, i) => (
                <motion.text
                    key={i}
                    x={mark.x}
                    y={mark.y}
                    fontSize="40"
                    fill="#a78bfa"
                    opacity="0.7"
                    fontWeight="bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -20, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: mark.delay,
                    }}
                >
                    ?
                </motion.text>
            ))}

            {/* 404 Text in Background - Better visibility */}
            <text
                x="200"
                y="150"
                fontSize="120"
                fill="#f97316"
                opacity="0.15"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="var(--font-montserrat)"
            >
                404
            </text>
        </svg>
    )
}
