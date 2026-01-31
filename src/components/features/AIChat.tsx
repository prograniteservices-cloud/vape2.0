'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles, Send, MapPin, Tag, Box } from 'lucide-react';
import { ChatMessage, SCRIPTED_RESPONSES, GUIDED_TOUR_SCRIPT } from '@/lib/mockChat';
import { AnimatedBot } from '../shared/AnimatedBot';

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

export function AIChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Initial Guided Tour
    useEffect(() => {
        const startTour = async () => {
            if (messages.length === 0) {
                setIsTyping(true);
                await new Promise(r => setTimeout(r, 1500));

                const tourMessages: ChatMessage[] = GUIDED_TOUR_SCRIPT.map((content, i) => ({
                    id: `tour-${i}`,
                    role: 'ai',
                    content,
                    timestamp: new Date(),
                    type: 'tour'
                }));

                setMessages([tourMessages[0]]);
                setIsTyping(false);

                // Sequence the rest of the tour
                for (let i = 1; i < tourMessages.length; i++) {
                    await new Promise(r => setTimeout(r, 2000));
                    setIsTyping(true);
                    await new Promise(r => setTimeout(r, 1000));
                    setMessages(prev => [...prev, tourMessages[i]]);
                    setIsTyping(false);
                }
            }
        };

        startTour();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        // Add user message
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simulate AI thinking
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 1500));

        // Get scripted response
        const responses = SCRIPTED_RESPONSES[text] || [
            "That's a great question! In the live version, I would analyze our entire catalog to give you a precise answer.",
            "For this demo, try clicking one of the suggested examples to see my specific capabilities."
        ];

        for (const content of responses) {
            setIsTyping(true);
            await new Promise(r => setTimeout(r, 1200));
            const aiMsg: ChatMessage = {
                id: Math.random().toString(),
                role: 'ai',
                content,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
            await new Promise(r => setTimeout(r, 500));
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`
                max-w-[85%] p-3 rounded-2xl text-sm
                ${msg.role === 'user'
                                    ? 'bg-primary/20 text-foreground border border-primary/20 rounded-tr-none'
                                    : 'bg-white/5 text-foreground/90 border border-white/10 rounded-tl-none shadow-lg'
                                }
              `}>
                                <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase tracking-tighter">
                                    {msg.role === 'ai' ? (
                                        <div className="w-4 h-4 relative">
                                            <AnimatedBot size={12} className="w-full h-full" />
                                        </div>
                                    ) : (
                                        <User size={12} />
                                    )}
                                    {msg.role === 'ai' ? 'Vape Assistant' : 'You'}
                                </div>
                                {msg.content}
                                {/* Rich Content Stub - Logic would expand here */}
                                {msg.role === 'ai' && msg.content.includes("15% off") && (
                                    <RichContentCard type="promo" data="Sale Category: 15% Off All Fruits" />
                                )}
                                {msg.role === 'ai' && msg.content.includes("Elf Bar") && (
                                    <RichContentCard type="category" data="Filter: Brand = Elf Bar" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Suggested Examples (Quick Replies) */}
            <div className="p-3 bg-black/40 border-t border-white/5">
                <div className="flex flex-wrap gap-2">
                    {Object.keys(SCRIPTED_RESPONSES).slice(0, 3).map((example, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(example)}
                            className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all text-muted-foreground hover:text-primary-foreground"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-black/60 border-t border-white/10 flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                    placeholder="Ask about vapes..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                    onClick={() => handleSend(inputValue)}
                    className="p-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                >
                    <Send size={14} />
                </button>
            </div>
        </div>
    );
}
