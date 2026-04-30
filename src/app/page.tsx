'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Product } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/layout/Dashboard';
import { AIVoiceBot } from '@/components/features/AIVoiceBot';
import { Menu, Sparkles, Bot, Package, Layers, X } from 'lucide-react';
import { hasChildren, getProductsByCategory, products as allProducts, findCategoryById, categoryTree } from '@/lib/data';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'categories' | 'products'>('categories');
  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCategory = (category: Category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setIsMobileSidebarOpen(false);

    setTimeout(() => {
      if (!hasChildren(category)) {
        setViewMode('products');
        const products = getProductsByCategory(category.id);
        setProductsToDisplay(products);
      } else {
        setViewMode('categories');
        setProductsToDisplay([]);
      }
      setIsLoading(false);
    }, 150);
  };

  const handleNavigateToRoot = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedCategory(null);
      setViewMode('categories');
      setProductsToDisplay([]);
      setIsLoading(false);
    }, 150);
  };

  const handleChatNavigate = (categoryId: string) => {
    const category = findCategoryById(categoryTree, categoryId);
    if (category) {
      handleSelectCategory(category);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white relative font-sans">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[100px]" />
      </div>

      {/* Left Panel: Navigation & Products (Compressed) */}
      <div className="w-[320px] lg:w-[380px] h-full border-r border-white/5 bg-zinc-950/40 backdrop-blur-3xl z-20 flex flex-col hidden md:flex shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">VapeOS <span className="text-primary">v2</span></h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold leading-none mt-0.5">Enterprise Edition</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2 text-xs font-bold text-white/60 mb-3 px-2">
              <Layers size={14} className="text-primary" />
              <span>NAVIGATOR</span>
            </div>
            <Sidebar
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
             <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                  <Package size={14} className="text-accent" />
                  <span>PREVIEW</span>
                </div>
                {selectedCategory && (
                   <button 
                    onClick={handleNavigateToRoot}
                    className="text-[10px] text-primary hover:underline font-bold"
                   >
                     RESET
                   </button>
                )}
             </div>
             <Dashboard
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onBrowse={() => {}}
                onNavigateToRoot={handleNavigateToRoot}
                viewMode={viewMode}
                products={productsToDisplay}
                compact={true}
              />
          </div>
        </div>
      </div>

      {/* Center Panel: Verbal AI Chat */}
      <main className="flex-1 h-full flex flex-col z-10 relative">
        <header className="md:hidden flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/10 relative z-50">
          <h1 className="text-xl font-bold gradient-text">VapeOS</h1>
          <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 relative z-50">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <AIVoiceBot onNavigate={handleChatNavigate} />
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-zinc-950 z-[70] md:hidden p-6 border-r border-white/10 shadow-2xl overflow-y-auto"
            >
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <Bot size={20} className="text-primary" />
                    <h2 className="text-lg font-bold">Navigator</h2>
                  </div>
                  <button 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-2 -mr-2 text-white/40 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
               </div>
               <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
