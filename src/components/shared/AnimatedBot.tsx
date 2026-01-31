'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function AnimatedBot({ size = 24, className = "" }) {
    return (
        <div className={`relative ${className}`}>
            {/* Ambient Outer Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 bg-primary blur-xl rounded-full"
            />

            {/* Pulse Rings */}
            <motion.div
                animate={{
                    scale: [1, 1.5],
                    opacity: [0.5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                }}
                className="absolute inset-0 border border-primary/50 rounded-full"
            />

            {/* Main Bot Icon Container */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-md border border-white/20 flex items-center justify-center p-1.5 shadow-lg shadow-primary/20"
            >
                <Bot size={size} className="text-primary-foreground drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]" />

                {/* Animated Antenna Dot */}
                <motion.div
                    animate={{
                        backgroundColor: ['#8b5cf6', '#d946ef', '#8b5cf6']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-white/20"
                />
            </motion.div>
        </div>
    );
}
