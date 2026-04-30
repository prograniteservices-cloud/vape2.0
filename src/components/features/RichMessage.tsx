import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Filter, ShoppingCart, Zap, Star, Tag, Info } from 'lucide-react';

interface RichMessageProps {
    content: string;
}

const BADGE_ICONS: Record<string, React.ElementType> = {
    Search,
    Filter,
    Cart: ShoppingCart,
    AI: Sparkles,
    Fast: Zap,
    Star,
    Sale: Tag,
    Info
};

export function RichMessage({ content }: RichMessageProps) {
    const parts: React.ReactNode[] = [];
    const regex = /\[(BADGE|HIGHLIGHT):([^\]]+)\]/g;
    
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex, match.index)}</span>);
        }

        const type = match[1];
        const innerContent = match[2];

        if (type === 'BADGE') {
            const [text, iconName] = innerContent.split(':');
            const Icon = (iconName && BADGE_ICONS[iconName]) || Sparkles;
            
            parts.push(
                <motion.span 
                    key={`badge-${match.index}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 mx-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] backdrop-blur-sm align-middle whitespace-nowrap"
                >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-bold text-[10px] uppercase tracking-wider">{text}</span>
                </motion.span>
            );
        } else if (type === 'HIGHLIGHT') {
            parts.push(
                <motion.div 
                    key={`highlight-${match.index}`}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="block px-3 py-2.5 my-2 w-full rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/5 border border-indigo-500/30 text-indigo-200 font-medium shadow-lg backdrop-blur-md text-sm"
                >
                    {innerContent}
                </motion.div>
            );
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
        parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>);
    }

    return (
        <span className="block leading-relaxed w-full">
            {parts.map((part, i) => (
                <React.Fragment key={i}>{part}</React.Fragment>
            ))}
        </span>
    );
}
