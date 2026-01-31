'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { categoryTree } from '@/lib/data';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/layout/Dashboard';
import { motion } from 'framer-motion';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBrowse = () => {
    // In a real app, this would show products
    // For now, we'll just show a toast or notification
    alert('Browse mode: Showing all items in ' + (selectedCategory?.name || 'All Products'));
  };

  return (
    <>
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />
      <Dashboard
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onBrowse={handleBrowse}
      />
    </>
  );
}
