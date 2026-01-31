'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, ChatMessage } from '@/types';
import { categoryTree, hasChildren } from '@/lib/data';
import { ChevronRight, ChevronDown, MessageCircle, Send, Sparkles } from 'lucide-react';

interface SidebarProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

export function Sidebar({ selectedCategory, onSelectCategory }: SidebarProps) {
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

    setChatMessages([...chatMessages, userMessage]);
    setInputMessage('');

    // Mock AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I can help you find ${inputMessage.toLowerCase()}. Try clicking on "Vapes" in the categories below, or let me know if you want something specific like flavors or brands!`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    }, 1000);
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
            onSelectCategory(category);
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

  return (
    <aside className="glass-sidebar w-80 h-full flex flex-col overflow-hidden">
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
        <div className="h-48 overflow-y-auto space-y-3 mb-3 pr-1">
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
  );
}
