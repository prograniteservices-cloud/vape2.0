'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Product } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/layout/Dashboard';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIVoiceBot } from '@/components/features/AIVoiceBot';
import { Menu, Bot, Layers, X, RefreshCw, Download } from 'lucide-react';
import { hasChildren, getProductsByCategory, findCategoryById, categoryTree } from '@/lib/data';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'categories' | 'products'>('categories');
  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [pwaReady, setPwaReady] = useState(false);
  const [searchLabel, setSearchLabel] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWAInstalled(isStandalone);
    if (isStandalone) {
      setPwaReady(true);
      return;
    }

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const hasDismissed = localStorage.getItem('pwa-dismissed');
    if (isIOSDevice && !hasDismissed) setShowInstallBanner(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!hasDismissed) setShowInstallBanner(true);
    };

    navigator.serviceWorker.register('/sw.js');
    window.addEventListener('beforeinstallprompt', handler);
    setPwaReady(true);

    return () => window.removeEventListener('beforeinstallprompt', handler);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setIsPWAInstalled(true);
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallBanner(true);
      localStorage.removeItem('pwa-dismissed');
    }
  };

  const handlePulse = (target: string) => {
    setActiveHighlight(target);
    setTimeout(() => setActiveHighlight(null), 4000);
  };

  const handleResetDemo = () => {
    setSelectedCategory(null);
    setViewMode('categories');
    setProductsToDisplay([]);
    setActiveHighlight(null);
    setSearchLabel(null);
    setResetKey(prev => prev + 1);
  };

  const handleSelectCategory = (category: Category) => {
    console.log("[Navigation] Selecting category:", category.id);
    setSearchLabel(null);
    setSelectedCategory(category);
    setIsMobileSidebarOpen(false);

    try {
      if (!hasChildren(category)) {
        console.log("[Navigation] Category has no children, fetching products...");
        const products = getProductsByCategory(category.id);
        console.log(`[Navigation] Found ${products?.length || 0} products.`);
        setProductsToDisplay(products.slice(0, 50));
        setViewMode('products');
      } else {
        console.log("[Navigation] Category has children, switching view...");
        setProductsToDisplay([]);
        setViewMode('categories');
      }
    } catch (err) {
      console.error("[Navigation] CRITICAL ERROR:", err);
    }
  };

  const filterAndSortProducts = (products: Product[], searchQuery?: string, sortOrder?: string): Product[] => {
    let result = products;

    if (searchQuery) {
      const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      result = result.filter(p =>
        terms.every(term =>
          p.name.toLowerCase().includes(term) ||
          (p.description && p.description.toLowerCase().includes(term))
        )
      );
    }

    if (sortOrder === 'cheapest') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'priciest') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  };

  const handleNavigateToRoot = () => {
    setSelectedCategory(null);
    setViewMode('categories');
    setProductsToDisplay([]);
    setSearchLabel(null);
  };

  const runSemanticSearch = async (query: string, fallbackProducts: Product[], sortOrder?: string) => {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit: 36 }),
    });

    if (!res.ok) {
      throw new Error(`Search API failed with ${res.status}`);
    }

    const data = await res.json();
    let results = Array.isArray(data.products) ? data.products as Product[] : [];

    if (sortOrder === 'cheapest') {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'priciest') {
      results = [...results].sort((a, b) => b.price - a.price);
    }

    return results.length > 0 ? results : fallbackProducts;
  };

  const handleChatNavigate = async (categoryId: string, searchQuery?: string, sortOrder?: string) => {
    const category = findCategoryById(categoryTree, categoryId);
    if (!category) return;

    if (searchQuery || sortOrder) {
      const staticProducts = getProductsByCategory(category.id);
      const filtered = filterAndSortProducts(staticProducts, searchQuery, sortOrder).slice(0, 50);
      const query = [searchQuery, category.name].filter(Boolean).join(' ');

      setSelectedCategory(category);
      setViewMode('products');
      setSearchLabel(searchQuery || `${category.name} search`);
      setProductsToDisplay(filtered);

      try {
        const semanticResults = await runSemanticSearch(query, filtered, sortOrder);
        setProductsToDisplay(semanticResults.slice(0, 50));
      } catch (error) {
        console.error('[Search] Falling back to local catalog filter:', error);
      }

      return;
    }

    handleSelectCategory(category);
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
          <div className={`flex-1 overflow-y-auto scrollbar-hide p-4 transition-all duration-500 ${activeHighlight === 'sidebar' ? 'bg-emerald-500/10 shadow-[inset_0_0_30px_rgba(16,185,129,0.2)] border-emerald-500/30' : 'bg-white/5'}`}>
            <div className="flex items-center gap-2 text-xs font-bold text-white/60 mb-3 px-2">
              <Layers size={14} className="text-primary" />
              <span>NAVIGATOR</span>
            </div>
            <Sidebar
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>
        </div>
      </div>

      {/* Center Panel: Verbal AI Chat or Dashboard */}
      <main className="flex-1 h-full flex flex-col z-10 relative">
        {/* PWA Install Banner */}
        <AnimatePresence>
          {showInstallBanner && (
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Download size={18} className="text-white" />
                <span className="text-xs font-bold text-white">
                  {deferredPrompt
                    ? 'Install VapeOS on your device'
                    : 'Install VapeOS — tap Share → Add to Home Screen'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {deferredPrompt && (
                  <button
                    onClick={handleInstall}
                    className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold hover:bg-white/90 transition-colors"
                  >
                    Install
                  </button>
                )}
                <button onClick={() => { setShowInstallBanner(false); setIsPWAInstalled(true); localStorage.setItem('pwa-dismissed', '1'); }} className="p-1 text-white/70 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="md:hidden flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/10 relative z-50">
          <h1 className="text-xl font-bold gradient-text">VapeOS</h1>
          <div className="flex gap-3 items-center">
            {pwaReady && !isPWAInstalled && (
              <button 
                onClick={handleInstall}
                className="text-xs font-bold flex items-center gap-1.5 bg-primary/20 hover:bg-primary/30 px-3 py-1.5 rounded-lg border border-primary/40 hover:border-primary/60 transition-all text-white/90"
              >
                <Download size={14} /> {deferredPrompt ? 'Install App' : isIOS ? 'Add to Home Screen' : 'Install App'}
              </button>
            )}
            <button 
              onClick={handleResetDemo}
              className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest font-bold flex items-center gap-1 bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors relative z-50"
            >
              <RefreshCw size={10} /> Reset
            </button>
            <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 relative z-50">
              <Menu size={24} />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden relative">
          {selectedCategory ? (
            <div className="w-full h-full overflow-y-auto">
              <ErrorBoundary>
                <Dashboard 
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                  onBrowse={() => {}}
                  onNavigateToRoot={handleNavigateToRoot}
                  viewMode={viewMode}
                  products={productsToDisplay}
                  resultLabel={searchLabel}
                  compact={false}
                />
              </ErrorBoundary>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <AIVoiceBot onNavigate={handleChatNavigate} onPulse={handlePulse} resetKey={resetKey} />
            </div>
          )}
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
