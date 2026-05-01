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
    onNavigate?: (categoryId: string, searchQuery?: string, sortOrder?: string) => void;
    onPulse?: (target: string) => void;
    resetKey?: number;
}) {
    const [responseMessage, setResponseMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
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
    
    // Pre-initialize speech synthesis voices (Chrome autoplay workaround)
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.getVoices();
            const handler = () => window.speechSynthesis.getVoices();
            window.speechSynthesis.addEventListener('voiceschanged', handler);
            return () => window.speechSynthesis.removeEventListener('voiceschanged', handler);
        }
    }, []);

    const speakWithBrowser = (text: string): Promise<void> => {
        return new Promise((resolve) => {
            if (typeof window === 'undefined' || !window.speechSynthesis) {
                resolve();
                return;
            }
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            utterance.onend = () => resolve();
            utterance.onerror = () => resolve();
            window.speechSynthesis.speak(utterance);
        });
    };

    const playAudio = async (text: string) => {
        if (!text.trim()) return;

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

            try {
                await audio.play();
            } catch {
                URL.revokeObjectURL(url);
                throw new Error('autoplay');
            }

            return new Promise<void>((resolve) => {
                audio.onended = () => {
                    URL.revokeObjectURL(url);
                    resolve();
                };
                audio.onerror = () => {
                    URL.revokeObjectURL(url);
                    resolve();
                };
            });
        } catch {
            await speakWithBrowser(text);
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isProcessing) return;
        
        console.log("[AIBot] Sending message:", text);
        setIsProcessing(true);
        setError(null);
        setResponseMessage('');
        
        try {
            const aiResponse = await chatWithGemini(text);
            console.log("[AIBot] Received response:", aiResponse);
            
            if (typeof aiResponse === 'object' && (aiResponse as any).error) {
                throw new Error((aiResponse as any).error);
            }

            let displayString = aiResponse;
            
            let navCatId: string | undefined;
            let navSearchQuery: string | undefined;
            let navSortOrder: string | undefined;

            const showTag = aiResponse.match(/\[SHOW:[^\]]+\]/);
            if (showTag) {
              const tagContent = showTag[0].slice(6, -1);
              const parts = tagContent.split(':');
              navCatId = parts[0];

              if (parts.length > 1) {
                const last = parts[parts.length - 1];
                if (['cheapest', 'priciest'].includes(last)) {
                  navSortOrder = last;
                  navSearchQuery = parts.slice(1, -1).filter(Boolean).join(':') || undefined;
                } else {
                  navSearchQuery = parts.slice(1).join(':');
                }
              }

              console.log("[AIBot] Navigation command detected:", navCatId, navSearchQuery, navSortOrder);
              if (onNavigate) onNavigate(navCatId, navSearchQuery, navSortOrder);
              displayString = aiResponse.replace(/\[SHOW:[^\]]+\]/g, '').trim();
            }

            // Fallback spoken response when [SHOW:...] consumed the entire response
            if (!displayString && navCatId) {
              const catName = navCatId.replace(/-/g, ' ');
              if (navSearchQuery && navSortOrder) {
                displayString = `Here are the ${navSortOrder} ${navSearchQuery} in ${catName}.`;
              } else if (navSearchQuery) {
                displayString = `Found ${navSearchQuery} in ${catName} for you.`;
              } else if (navSortOrder) {
                displayString = `Showing you ${catName}, sorted by ${navSortOrder}.`;
              } else {
                displayString = `Showing you ${catName}.`;
              }
            }

            const pulseMatch = displayString.match(/\[PULSE:([a-zA-Z0-9-]+)\]/);
            if (pulseMatch) {
                const target = pulseMatch[1];
                console.log("[AIBot] Pulse command detected:", target);
                if (onPulse) onPulse(target);
                displayString = displayString.replace(/\[PULSE:([a-zA-Z0-9-]+)\]/g, '').trim();
            }
            
            setResponseMessage(displayString);
            setState('talking');
            
            await playAudio(displayString);
        } catch (error: any) {
            console.error("[AIBot] Error:", error);
            const errorMessage = error?.message || "Connection Error";
            setError(errorMessage);
            setResponseMessage(`API Error: ${errorMessage}`);
            setState('talking');
            await playAudio("I encountered a connection error.");
        } finally {
            setIsProcessing(false);
            setState('idle');
        }
    };

    const handleSpeechEnd = async (transcript: string) => {
        if (!transcript.trim()) {
            setState('idle');
            return;
        }
        await handleSendMessage(transcript);
    };

    const handleTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const text = formData.get('textInput') as string;
        if (!text.trim() || isProcessing) return;
        
        form.reset();
        await handleSendMessage(text);
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

            <form onSubmit={handleTextSubmit} className="w-full relative mt-4">
                <input 
                    type="text" 
                    name="textInput"
                    disabled={isProcessing || state === 'talking'}
                    placeholder="Or type here to chat..." 
                    className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all disabled:opacity-50"
                />
            </form>
        </div>
    );
}
