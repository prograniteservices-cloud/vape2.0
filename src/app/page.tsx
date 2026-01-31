'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Product } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/layout/Dashboard';
import { Menu } from 'lucide-react';
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
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

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
    <>
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0f0f1a] border-b border-white/10 z-30">
        <h1 className="text-xl font-bold gradient-text">Vape Shop</h1>
        <button
          onClick={toggleMobileSidebar}
          className="hamburger-btn"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </header>

      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <PageTransition mode={viewMode + (selectedCategory?.id || 'root')}>
        <Dashboard
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onBrowse={handleBrowse}
          onNavigateToRoot={handleNavigateToRoot}
          viewMode={viewMode}
          products={productsToDisplay}
        />
      </PageTransition>
    </>
  );
}
