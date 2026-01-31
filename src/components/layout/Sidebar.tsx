'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, ChatMessage } from '@/types';
import { categoryTree, hasChildren } from '@/lib/data';
import { ChevronRight, ChevronDown, MessageCircle, Send, Sparkles, X } from 'lucide-react';

// Keyword detection patterns
const FLAVOR_KEYWORDS = ['watermelon', 'strawberry', 'grape', 'mango', 'blueberry', 'peach', 'mint', 'vanilla'];
const BRAND_KEYWORDS = ['elfbar', 'geekbar', 'lostmary', 'hyde'];
const HIT_COUNTS = ['5000', '10000', '15000', '20000'];
const COLOR_PREFERENCES = ['red', 'blue', 'black', 'pink', 'teal'];
const NICOTINE_TERMS = ['nicotine', 'strength', 'mg', 'salt', 'percent', 'freebase'];

// Category navigation map
const NAVIGATION_PATHS: Record<string, string> = {
  watermelon: 'Vapes > Flavor > Watermelon',
  strawberry: 'Vapes > Flavor > Strawberry',
  grape: 'Vapes > Flavor > Grape',
  mango: 'Vapes > Flavor > Mango',
  blueberry: 'Vapes > Flavor > Blueberry',
  peach: 'Vapes > Flavor > Peach',
  mint: 'Vapes > Flavor > Mint',
  vanilla: 'Vapes > Flavor > Vanilla',
  elfbar: 'Vapes > Brands > Elf Bar',
  geekbar: 'Vapes > Brands > Geek Bar',
  lostmary: 'Vapes > Brands > Lost Mary',
  hyde: 'Vapes > Brands > Hyde',
};

function detectKeywords(input: string): {
  flavors: string[];
  brands: string[];
  hits: string[];
  colors: string[];
  nicotine: boolean;
} {
  const lowerInput = input.toLowerCase();
  
  return {
    flavors: FLAVOR_KEYWORDS.filter(flavor => lowerInput.includes(flavor)),
    brands: BRAND_KEYWORDS.filter(brand => lowerInput.includes(brand)),
    hits: HIT_COUNTS.filter(hit => lowerInput.includes(hit)),
    colors: COLOR_PREFERENCES.filter(color => lowerInput.includes(color)),
    nicotine: NICOTINE_TERMS.some(term => lowerInput.includes(term)),
  };
}

function generateContextualResponse(
  input: string,
  detected: {
    flavors: string[];
    brands: string[];
    hits: string[];
    colors: string[];
    nicotine: boolean;
  }
): string {
  const lowerInput = input.toLowerCase();
  const responses: string[] = [];

  // Handle general greetings
  if (['hi', 'hello', 'hey', 'what'].some(greeting => lowerInput.includes(greeting)) && detected.flavors.length === 0 && detected.brands.length === 0) {
    return "Hi! I'm your vape shop assistant. I can help you find the perfect product. Try asking about flavors like watermelon or strawberry, or brands like Elf Bar!";
  }

  // Flavor recommendations
  if (detected.flavors.length > 0) {
    const flavor = detected.flavors[0];
    const navPath = NAVIGATION_PATHS[flavor] || `Vapes > Flavor > ${flavor.charAt(0).toUpperCase() + flavor.slice(1)}`;
    
    if (detected.flavors.length === 1) {
      responses.push(`I found some great ${flavor}-flavored vapes! ${flavor.charAt(0).toUpperCase() + flavor.slice(1)} is a popular choice. Try clicking ${navPath} to see our selection.`);
    } else {
      const flavorsList = detected.flavors.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ');
      responses.push(`I see you're interested in ${flavorsList} flavors! We have a great variety. Try the navigation menu to browse all ${detected.flavors[0]}-flavored options.`);
    }
  }

  // Brand recommendations
  if (detected.brands.length > 0) {
    const brand = detected.brands[0];
    const brandDisplay = brand === 'elfbar' ? 'Elf Bar' : brand === 'geekbar' ? 'Geek Bar' : brand === 'lostmary' ? 'Lost Mary' : 'Hyde';
    const navPath = NAVIGATION_PATHS[brand];
    responses.push(`${brandDisplay} makes excellent disposables! Try clicking ${navPath} to explore their full lineup.`);
  }

  // Hit count guidance
  if (detected.hits.length > 0) {
    const hits = detected.hits[0];
    responses.push(`Looking for a ${hits} puff vape? We have several options in that range. Most ${hits} puff devices are rechargeable and offer great value!`);
  }

  // Color preferences
  if (detected.colors.length > 0) {
    const colorsList = detected.colors.join(', ');
    responses.push(`I can help you find vapes in ${colorsList}! Colors vary by brand and model - check individual product pages for color availability.`);
  }

  // Nicotine information
  if (detected.nicotine) {
    responses.push(`Most disposables come in 5% (50mg) nicotine salt strength, which provides a smooth throat hit. Some brands offer lower strengths (2%, 3%). Let me know if you prefer a specific nicotine level!`);
  }

  // Default response if no keywords matched
  if (responses.length === 0) {
    if (lowerInput.includes('disposable')) {
      responses.push(`Disposable vapes are our specialty! We carry top brands like Elf Bar, Geek Bar, Lost Mary, and Hyde. What flavor or puff count are you looking for?`);
    } else if (lowerInput.includes('help')) {
      responses.push(`I can help you find vapes by flavor (watermelon, strawberry, mango, etc.), brand (Elf Bar, Geek Bar, Lost Mary, Hyde), puff count (5000, 10000, 15000, 20000), or color. What would you like to explore?`);
    } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('cheap') || lowerInput.includes('expensive')) {
      responses.push(`We have vapes in all price ranges! Generally, higher puff counts cost more but offer better value. Check out our Sale category for the best deals!`);
    } else {
      responses.push(`I can help you find ${input.toLowerCase()}. Try browsing the categories on the left, or ask me about specific flavors, brands, or features!`);
    }
  }

  return responses.join(' ');
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex justify-start"
    >
      <div className="glass-card text-foreground rounded-2xl rounded-bl-sm p-3 flex items-center gap-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
      </div>
    </motion.div>
  );
}

interface SidebarProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ selectedCategory, onSelectCategory, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['vapes']));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m your vape shop assistant. I can help you find the perfect product. What are you looking for today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Smart AI response with keyword detection
    setTimeout(() => {
      const detected = detectKeywords(userMessage.content);
      const response = generateContextualResponse(userMessage.content, detected);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setChatMessages((prev) => [...prev, aiMessage]);
    }, 1000 + Math.random() * 500); // Random delay between 1-1.5s for natural feel
  };

  const renderCategoryTree = (category: Category, depth = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory?.id === category.id;
    const hasKids = hasChildren(category);

    return (
      <div key={category.id} className="select-none">
        <motion.div
          className={`category-tree-item flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer ${
            isSelected ? 'active' : ''
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => {
            if (hasKids) {
              toggleCategory(category.id);
            }
            handleCategorySelect(category);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {hasKids && (
            <span className="text-muted-foreground">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          <span className={`text-sm ${isSelected ? 'text-primary font-semibold' : 'text-foreground'}`}>
            {category.name}
          </span>
          {category.id === 'sale' && (
            <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
              HOT
            </span>
          )}
        </motion.div>

        <AnimatePresence>
          {hasKids && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {category.children?.map((child) => renderCategoryTree(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const handleCategorySelect = (category: Category) => {
    onSelectCategory(category);
    // Close mobile sidebar when category is selected
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-sidebar-overlay md:hidden ${isMobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
      />
      
      {/* Sidebar Container */}
      <aside 
        className={`
          glass-sidebar flex flex-col overflow-hidden
          fixed md:relative z-50 h-full
          transition-transform duration-300 ease-in-out
          w-[280px] md:w-64 lg:w-80
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="mobile-close-btn md:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold gradient-text">Vape Shop</h1>
          <p className="text-sm text-muted-foreground mt-1">Find your perfect vape</p>
        </div>

      {/* AI Chat Section */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-primary" size={20} />
          <h2 className="font-semibold text-foreground">AI Assistant</h2>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="h-48 overflow-y-auto space-y-3 mb-3 pr-1 scroll-smooth"
        >
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'glass-card text-foreground rounded-bl-sm'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Category Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="text-accent" size={18} />
          <h2 className="font-semibold text-foreground">Categories</h2>
        </div>
        <div className="space-y-1">
          {categoryTree.children?.map((category) => renderCategoryTree(category))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-center">
        <p className="text-xs text-muted-foreground">
          Must be 21+ to purchase
        </p>
      </div>
      </aside>
    </>
  );
}
