'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Loader2, Volume2 } from 'lucide-react';
import { useVoiceEngine } from '@/lib/voice-engine';
import { chatWithGemini } from '@/lib/gemini';
import { AnimatedBot } from './AnimatedBot';
import { RichMessage } from './RichMessage';

export function AIVoiceBot({ 
    onNavigate,
    onPulse,
    resetKey
}: { 
    onNavigate?: (categoryId: string) => void;
    onPulse?: (target: string) => void;
    resetKey?: number;
}) {
    const [responseMessage, setResponseMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    useEffect(() => {
        setResponseMessage('');
        // Securely check for API key presence in client logs
        const hasKey = typeof process.env.NEXT_PUBLIC_GEMINI_API_KEY === 'string' && process.env.NEXT_PUBLIC_GEMINI_API_KEY.length > 20;
        console.log(`[VapeOS AI] Service Initialization: ${hasKey ? 'Armed' : 'Missing Credentials'}`);
    }, [resetKey]);

    // 3D Tilt Effect Setup
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }
    
    const playAudio = async (text: string) => {
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!res.ok) throw new Error('TTS failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            
            return new Promise((resolve) => {
                audio.onended = () => {
                    URL.revokeObjectURL(url);
                    resolve(true);
                };
                audio.play();
            });
        } catch (error) {
            console.error("Audio playback error:", error);
            if (typeof window !== 'undefined') {
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
                return new Promise(resolve => {
                    utterance.onend = () => resolve(true);
                });
            }
            return Promise.resolve(true);
        }
    };

    const handleSpeechEnd = async (transcript: string) => {
        if (!transcript.trim()) {
            setState('idle');
            return;
        }
        
        setIsProcessing(true);
        try {
            const aiResponse = await chatWithGemini(transcript);
            let displayString = aiResponse;
            
            const match = aiResponse.match(/\[SHOW:([a-zA-Z0-9-]+)\]/);
            if (match) {
                const catId = match[1];
                if (onNavigate) onNavigate(catId);
                displayString = aiResponse.replace(/\[SHOW:([a-zA-Z0-9-]+)\]/g, '').trim();
            }

            const pulseMatch = displayString.match(/\[PULSE:([a-zA-Z0-9-]+)\]/);
            if (pulseMatch) {
                const target = pulseMatch[1];
                if (onPulse) onPulse(target);
                displayString = displayString.replace(/\[PULSE:([a-zA-Z0-9-]+)\]/g, '').trim();
            }
            
            setResponseMessage(displayString);
            setState('talking');
            
            await playAudio(displayString);
            
        } catch (error) {
            console.error("Voice Interaction Error:", error);
            setResponseMessage("I'm having trouble connecting right now.");
            setState('talking');
            await playAudio("I'm having trouble connecting right now.");
        } finally {
            setIsProcessing(false);
            setState('idle');
            setResponseMessage('');
        }
    };

    const { state, setState, startListening, stopListening, isSupported, transcript } = useVoiceEngine({
        onSpeechEnd: handleSpeechEnd
    });

    if (!isSupported) {
        return null;
    }

    const toggleListening = () => {
        if (state === 'listening') {
            stopListening();
        } else if (state === 'idle' || state === 'talking' || state === 'error') {
            startListening();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-lg mx-auto" style={{ perspective: 1000 }}>
            <AnimatePresence>
                {(state !== 'idle' || responseMessage) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: 0, rotateY: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateX: rotateX as any, rotateY: rotateY as any }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        onMouseMove={handleMouse}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            transformStyle: 'preserve-3d'
                        }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full shadow-2xl relative overflow-visible cursor-default"
                    >
                        {/* Inner 3D Glass Layer */}
                        <div 
                            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl" 
                            style={{ transform: 'translateZ(-10px)' }}
                        />
                        
                        <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
                            {state === 'listening' && (
                                <div className="flex items-center gap-3 text-primary">
                                    <div className="flex gap-1">
                                        <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary rounded-full" />
                                        <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }} className="w-1 bg-primary rounded-full" />
                                        <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-primary rounded-full" />
                                    </div>
                                    <span className="text-sm font-bold tracking-wider uppercase">Listening...</span>
                                </div>
                            )}
                            
                            {(state === 'thinking' || isProcessing) && (
                                <div className="flex items-center gap-3 text-accent">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm font-bold tracking-wider uppercase">Thinking...</span>
                                </div>
                            )}

                            {state === 'talking' && (
                                <div className="flex items-start gap-3">
                                    <Volume2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                                    <RichMessage content={responseMessage} />
                                </div>
                            )}

                            {state === 'listening' && transcript && (
                                <div className="mt-3 p-2 bg-white/5 rounded-lg border border-white/5">
                                    <p className="text-xs text-white/70 italic font-medium leading-relaxed">"{transcript}"</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className="relative focus:outline-none"
            >
                <AnimatedBot state={state} />
            </motion.button>
        </div>
    );
}
