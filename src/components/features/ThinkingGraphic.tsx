'use client';

import { motion } from 'framer-motion';

export function ThinkingGraphic() {
    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                {/* Core - The Brain */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-xl"
                />

                {/* Orbital Rings - Rotating Particles */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 border-2 border-primary/20 rounded-full"
                        style={{
                            rotateX: 60 + i * 15,
                            rotateY: 20 + i * 10,
                        }}
                        animate={{
                            rotateZ: [0, 360],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <motion.div
                            className="w-3 h-3 bg-accent rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-lg shadow-accent/50"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                ))}

                {/* Figure-8 Path Simulation */}
                <svg className="absolute inset-0 w-full h-full overflow-visible opacity-50" viewBox="0 0 100 100">
                    <motion.path
                        d="M 20 50 C 20 20, 50 20, 50 50 C 50 80, 80 80, 80 50 C 80 20, 50 20, 50 50 C 50 80, 20 80, 20 50"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="0.5"
                        strokeDasharray="10 10"
                        animate={{ strokeDashoffset: [0, 200] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Floating Particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 bg-white/40 rounded-full"
                        initial={{
                            x: 200,
                            y: 200,
                            scale: 0
                        }}
                        animate={{
                            x: 200 + Math.cos(i * 30 * (Math.PI / 180)) * 120,
                            y: 200 + Math.sin(i * 30 * (Math.PI / 180)) * 120,
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
