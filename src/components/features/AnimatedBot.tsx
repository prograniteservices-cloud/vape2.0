'use client';

import { motion } from 'framer-motion';
import { VoiceState } from '@/lib/voice-engine';

interface AnimatedBotProps {
    state: VoiceState;
}

export function AnimatedBot({ state }: AnimatedBotProps) {
    // Determine colors based on state
    const colors = {
        idle: 'from-slate-600 to-slate-800',
        listening: 'from-primary to-blue-500',
        thinking: 'from-accent to-purple-500',
        talking: 'from-emerald-400 to-teal-600',
        error: 'from-red-500 to-rose-700'
    };

    const glowColors = {
        idle: 'bg-slate-600/20',
        listening: 'bg-primary/40',
        thinking: 'bg-accent/40',
        talking: 'bg-emerald-500/40',
        error: 'bg-red-500/40'
    };

    const isActive = state !== 'idle';

    return (
        <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Outer Ambient Glow (Dual-layer glow technique) */}
            <motion.div
                className={`absolute inset-[-50%] rounded-full blur-[20px] transition-colors duration-700 ${glowColors[state]}`}
                animate={{
                    scale: state === 'listening' ? [1, 1.2, 1] : state === 'talking' ? [1, 1.1, 1] : 1,
                    opacity: isActive ? [0.4, 0.8, 0.4] : 0.2
                }}
                transition={{
                    duration: state === 'listening' ? 1 : 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Inner Core Glow */}
            <motion.div
                className={`absolute inset-0 rounded-full blur-[10px] transition-colors duration-500 ${glowColors[state]}`}
                animate={{
                    scale: state === 'thinking' ? [0.8, 1.2, 0.8] : 1,
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Main Avatar Body (Glassmorphism) */}
            <motion.div
                className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${colors[state]} p-[1px] overflow-hidden shadow-2xl transition-all duration-500`}
                animate={{
                    borderRadius: state === 'talking' ? ['30%', '40%', '30%'] : '35%',
                    rotate: state === 'thinking' ? [0, 5, -5, 0] : 0
                }}
                transition={{
                    duration: state === 'thinking' ? 2 : 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                }}
            >
                {/* Glass Highlight */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50" />

                <div className="w-full h-full bg-black/40 rounded-[inherit] flex items-center justify-center relative overflow-hidden">
                    {/* Bot "Eye" or Center Indicator */}
                    <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                        animate={{
                            scale: state === 'listening' ? [1, 0.6, 1] : state === 'talking' ? [1, 1.5, 1] : 1,
                            opacity: state === 'idle' ? 0.5 : 1
                        }}
                        transition={{
                            duration: state === 'listening' ? 0.5 : 0.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Talking Audio Waves */}
                    {state === 'talking' && (
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-50">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-0.5 bg-white rounded-full"
                                    animate={{ height: [4, 16, 4] }}
                                    transition={{
                                        duration: 0.4,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
