'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { categoryTree, hasChildren } from '@/lib/data';
import { ChevronRight, ChevronDown, MessageCircle, Sparkles, X, Bot } from 'lucide-react';




interface SidebarProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ selectedCategory, onSelectCategory, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['vapes']));

  // Auto-expand parent categories when a child is selected
  useEffect(() => {
    if (selectedCategory) {
      const path = findCategoryPath(categoryTree, selectedCategory.id);
      if (path && path.length > 0) {
        setExpandedCategories(prev => {
          const newExpanded = new Set(prev);
          path.forEach((cat: Category) => newExpanded.add(cat.id));
          return newExpanded;
        });
      }
    }
  }, [selectedCategory]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryTree = (category: Category, depth = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory?.id === category.id;
    const hasKids = hasChildren(category);
    const isChildSelected = selectedCategory && category.children?.some(child =>
      child.id === selectedCategory.id || child.children?.some(grandchild =>
        grandchild.id === selectedCategory.id
      )
    );

    return (
      <div key={category.id} className="select-none">
        <motion.div
          layout
          className={`
            category-tree-item flex items-center gap-2 py-2.5 px-3 rounded-lg cursor-pointer
            transition-all duration-200
            ${isSelected ? 'active bg-primary/20 border border-primary/30' : ''}
            ${isChildSelected ? 'bg-primary/10' : 'hover:bg-white/5'}
          `}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => {
            if (hasKids) {
              toggleCategory(category.id);
            }
            handleCategorySelect(category);
          }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          {hasKids && (
            <motion.span
              className="text-muted-foreground"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} />
            </motion.span>
          )}
          <span className={`
            text-sm transition-colors duration-200
            ${isSelected ? 'text-primary font-semibold' : 'text-foreground'}
            ${isChildSelected && !isSelected ? 'text-primary/80' : ''}
          `}>
            {category.name}
          </span>
          {hasKids && (
            <span className="ml-auto text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
              {category.children?.length}
            </span>
          )}
          {category.id === 'sale' && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium"
            >
              HOT
            </motion.span>
          )}
        </motion.div>

        <AnimatePresence>
          {hasKids && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                exit={{ x: -10 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                {category.children?.map((child) => renderCategoryTree(child, depth + 1))}
              </motion.div>
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

// Helper function to find the path from root to a category
function findCategoryPath(root: Category, targetId: string, path: Category[] = []): Category[] | null {
  if (root.id === targetId) {
    return path;
  }

  if (root.children) {
    for (const child of root.children) {
      const result = findCategoryPath(child, targetId, [...path, root]);
      if (result) {
        return result;
      }
    }
  }

  return null;
}
