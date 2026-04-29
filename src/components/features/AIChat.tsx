'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles, Send, Tag, HelpCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { ChatMessage } from '@/lib/mockChat';
import { AnimatedBot } from '../shared/AnimatedBot';
import { chatWithGemini } from '@/lib/gemini';

// Type for Rich Content Card
interface RichContentProps {
    type?: 'product' | 'category' | 'promo';
    data: any;
}

function RichContentCard({ type, data }: RichContentProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-lg group hover:border-primary/30 transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-2 mb-1">
                {type === 'promo' ? <Sparkles size={12} className="text-amber-400" /> : <Tag size={12} className="text-primary" />}
                <span className="font-semibold text-white/90">Suggestion</span>
            </div>
            <div className="text-muted-foreground group-hover:text-white transition-colors">{data}</div>
        </motion.div>
    );
}

export function AIChat({ onNavigate }: { onNavigate?: (categoryId: string) => void }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('WebkitSpeechRecognition' in window || 'speechRecognition' in window)) {
            const SpeechRecognition = (window as any).WebkitSpeechRecognition || (window as any).speechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                handleSend(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const speak = (text: string) => {
        if (!isSpeaking || typeof window === 'undefined') return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Initial Greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 'intro',
                role: 'ai',
                content: "Hello! I'm your Vape Assistant. You can speak to me by clicking the microphone!",
                timestamp: new Date()
            }]);
        }
    }, []);

    const handleSend = async (text: string) => {
        const messageText = text || inputValue;
        if (!messageText.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const responseText = await chatWithGemini(messageText);
            let displayString = responseText;
            const match = responseText.match(/\[SHOW:([a-zA-Z0-9-]+)\]/);
            if (match) {
                const catId = match[1];
                if (onNavigate) onNavigate(catId);
                displayString = responseText.replace(/\[SHOW:([a-zA-Z0-9-]+)\]/g, '').trim();
            }

            const aiMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'ai',
                content: displayString,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            speak(displayString);
        } catch (error) {
            console.error("Gemini Error:", error);
            const errorMsg: ChatMessage = {
                id: Date.now().toString(),
                role: 'ai',
                content: "I'm having trouble connecting. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
            {/* Main Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
                {/* Visual Bot Centerpiece */}
                <div className="flex flex-col items-center justify-center py-8">
                    <motion.div 
                        animate={{ 
                            scale: isListening ? [1, 1.1, 1] : 1,
                            boxShadow: isListening ? ["0 0 20px rgba(139,92,246,0.3)", "0 0 40px rgba(139,92,246,0.6)", "0 0 20px rgba(139,92,246,0.3)"] : "0 0 0px rgba(0,0,0,0)"
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-32 h-32 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative mb-4"
                    >
                        <AnimatedBot size={64} />
                        {isListening && (
                            <motion.div 
                                layoutId="pulse"
                                className="absolute inset-0 rounded-full border-2 border-primary"
                                initial={{ opacity: 0, scale: 1 }}
                                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.5, 1.8] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        )}
                    </motion.div>
                    <h2 className="text-2xl font-bold gradient-text">How can I help you today?</h2>
                    <p className="text-white/40 text-sm mt-1">Speak or type your request below</p>
                </div>

                <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mb-8 max-w-md mx-auto">
                    <p className="text-xs font-bold text-primary/80 uppercase tracking-tighter flex items-center gap-1.5 justify-center">
                        <Sparkles size={12} />
                        Try asking
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            "Find watermelon flavored vapes",
                            "What vapes have 10000 hits?",
                            "Show me items on sale"
                        ].map((text) => (
                            <button 
                                key={text}
                                onClick={() => handleSend(text)}
                                className="text-center text-xs p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-white/70 hover:text-white"
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                                max-w-[80%] p-4 rounded-3xl text-sm shadow-xl
                                ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-zinc-900 text-white/90 border border-white/10 rounded-tl-none'
                                }
                            `}>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-900 p-4 rounded-3xl rounded-tl-none border border-white/10 flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <motion.div 
                                    key={i}
                                    animate={{ y: [0, -5, 0] }} 
                                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} 
                                    className="w-1.5 h-1.5 bg-primary rounded-full" 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Centered Controls Area */}
            <div className="p-6 mt-auto">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                    <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-2 pl-5 rounded-full shadow-2xl focus-within:border-primary/50 transition-all">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                            placeholder="Type or speak a message..."
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white py-2"
                        />
                        <div className="flex items-center gap-1 pr-1">
                            <button
                                onClick={toggleListening}
                                className={`p-2.5 rounded-full transition-all ${isListening ? 'bg-red-500 text-white' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                            <button
                                onClick={() => setIsSpeaking(!isSpeaking)}
                                className="p-2.5 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-all"
                            >
                                {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </button>
                            <button
                                onClick={() => handleSend(inputValue)}
                                className="p-2.5 bg-primary text-white rounded-full hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
