'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Product } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/layout/Dashboard';
import { AIChat } from '@/components/features/AIChat';
import { ThinkingGraphic } from '@/components/features/ThinkingGraphic';
import { Menu, Sparkles, ShoppingBag, Bot } from 'lucide-react';
import { hasChildren, getProductsByCategory, products as allProducts } from '@/lib/data';

// Page transition wrapper
function PageTransition({ children, mode }: { children: React.ReactNode; mode: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  const [appMode, setAppMode] = useState<'ai' | 'shop'>('ai');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'categories' | 'products'>('categories');
  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCategory = (category: Category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setIsMobileSidebarOpen(false);

    // Simulate loading for smooth transition
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

  const handleBrowse = () => {
    setIsLoading(true);
    setViewMode('products');

    setTimeout(() => {
      if (selectedCategory) {
        const products = getProductsByCategory(selectedCategory.id);
        setProductsToDisplay(products);
      } else {
        setProductsToDisplay(allProducts);
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

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground relative">

      {/* Premium Mode Switcher */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <button
          onClick={() => setAppMode('ai')}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
            ${appMode === 'ai'
              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 scale-105'
              : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }
          `}
        >
          <Bot size={18} />
          <span>AI Assistant</span>
        </button>
        <button
          onClick={() => setAppMode('shop')}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
            ${appMode === 'shop'
              ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
              : 'text-muted-foreground hover:text-white hover:bg-white/5'
            }
          `}
        >
          <ShoppingBag size={18} />
          <span>Browse Shop</span>
        </button>
      </div>

      {appMode === 'shop' && (
        <header className="md:hidden flex items-center justify-between p-4 bg-[#0f0f1a] border-b border-white/10 z-30 pt-20">
          <h1 className="text-xl font-bold gradient-text">Vape Shop</h1>
          <button
            onClick={toggleMobileSidebar}
            className="hamburger-btn"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </header>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/50 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex overflow-hidden relative">
        <PageTransition mode={appMode}>
          {appMode === 'ai' ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
              {/* Background Ambient Effects */}
              <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none opacity-50" />

              <div className="w-full max-w-7xl h-[80vh] relative z-10 pt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Chat Interface */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full max-w-2xl mx-auto lg:mx-0 flex flex-col"
                >
                  <AIChat />
                </motion.div>

                {/* Thinking Graphic (Desktop Only) */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="hidden lg:flex h-full items-center justify-center relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl" />
                  <ThinkingGraphic />
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full pt-20 md:pt-0">
              <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={closeMobileSidebar}
              />
              <Dashboard
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onBrowse={handleBrowse}
                onNavigateToRoot={handleNavigateToRoot}
                viewMode={viewMode}
                products={productsToDisplay}
              />
            </div>
          )}
        </PageTransition>
      </main>
    </div>
  );
}
