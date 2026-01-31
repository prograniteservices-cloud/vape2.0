'use client';

import { useState } from 'react';
import { Category, Product } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/layout/Dashboard';
import { Menu } from 'lucide-react';
import { hasChildren, getProductsByCategory, products as allProducts } from '@/lib/data';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'categories' | 'products'>('categories');
  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsMobileSidebarOpen(false);
    
    if (!hasChildren(category)) {
      setViewMode('products');
      const products = getProductsByCategory(category.id);
      setProductsToDisplay(products);
    } else {
      setViewMode('categories');
      setProductsToDisplay([]);
    }
  };

  const handleBrowse = () => {
    setViewMode('products');
    
    if (selectedCategory) {
      const products = getProductsByCategory(selectedCategory.id);
      setProductsToDisplay(products);
    } else {
      setProductsToDisplay(allProducts);
    }
  };

  const handleNavigateToRoot = () => {
    setSelectedCategory(null);
    setViewMode('categories');
    setProductsToDisplay([]);
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

      <Dashboard
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onBrowse={handleBrowse}
        onNavigateToRoot={handleNavigateToRoot}
        viewMode={viewMode}
        products={productsToDisplay}
      />
    </>
  );
}
