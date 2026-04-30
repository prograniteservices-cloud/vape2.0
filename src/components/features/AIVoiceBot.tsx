'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, Volume2, Sparkles } from 'lucide-react';
import { useVoiceEngine } from '@/lib/voice-engine';
import { chatWithGemini } from '@/lib/gemini';

export function AIVoiceBot({ onNavigate }: { onNavigate?: (categoryId: string) => void }) {
    const [responseMessage, setResponseMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
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
            // Fallback to speech synthesis if Cloud TTS fails
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
            // Get response from Gemini
            const aiResponse = await chatWithGemini(transcript);
            let displayString = aiResponse;
            
            // Handle navigation logic if Gemini returned a SHOW command
            const match = aiResponse.match(/\[SHOW:([a-zA-Z0-9-]+)\]/);
            if (match) {
                const catId = match[1];
                if (onNavigate) onNavigate(catId);
                displayString = aiResponse.replace(/\[SHOW:([a-zA-Z0-9-]+)\]/g, '').trim();
            }
            
            setResponseMessage(displayString);
            setState('talking');
            
            // Play the audio
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
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {(state !== 'idle' || responseMessage) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl max-w-[300px] shadow-2xl relative overflow-hidden"
                    >
                        {/* Glass reflection */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        
                        <div className="relative z-10">
                            {state === 'listening' && (
                                <div className="flex items-center gap-3 text-primary">
                                    <div className="flex gap-1">
                                        <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary rounded-full" />
                                        <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }} className="w-1 bg-primary rounded-full" />
                                        <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-primary rounded-full" />
                                    </div>
                                    <span className="text-sm font-medium">Listening...</span>
                                </div>
                            )}
                            
                            {(state === 'thinking' || isProcessing) && (
                                <div className="flex items-center gap-3 text-accent">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm font-medium">Thinking...</span>
                                </div>
                            )}

                            {state === 'talking' && (
                                <div className="flex items-start gap-3">
                                    <Volume2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-white/90 leading-relaxed">{responseMessage}</p>
                                </div>
                            )}

                            {/* Show live transcript while listening */}
                            {state === 'listening' && transcript && (
                                <p className="text-xs text-white/60 mt-2 italic">"{transcript}"</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleListening}
                className={`relative group flex items-center justify-center w-16 h-16 rounded-full shadow-2xl overflow-hidden transition-colors ${
                    state === 'listening' ? 'bg-primary' : 
                    state === 'talking' ? 'bg-emerald-500' : 
                    state === 'thinking' ? 'bg-accent' : 
                    'bg-slate-800 border border-white/10 hover:bg-slate-700'
                }`}
            >
                {/* Glowing Orb Effect */}
                {state !== 'idle' && (
                    <motion.div 
                        className="absolute inset-0 bg-white/20"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
                
                {state === 'listening' ? (
                    <Mic className="w-6 h-6 text-white relative z-10" />
                ) : state === 'talking' ? (
                    <Volume2 className="w-6 h-6 text-white relative z-10" />
                ) : state === 'thinking' ? (
                    <Sparkles className="w-6 h-6 text-white relative z-10 animate-pulse" />
                ) : (
                    <MicOff className="w-6 h-6 text-white/50 relative z-10 group-hover:text-white transition-colors" />
                )}
            </motion.button>
        </div>
    );
}
