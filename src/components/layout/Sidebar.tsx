'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/types';
import { categoryTree, hasChildren } from '@/lib/data';
import { ChevronRight, ChevronDown, MessageCircle, Sparkles, X, Bot, Camera } from 'lucide-react';
import { BarcodeScanner } from '../features/BarcodeScanner';




interface SidebarProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ selectedCategory, onSelectCategory, onCloseMobile }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['vapes']));
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (barcode: string) => {
    console.log('Scanned barcode:', barcode);
    // TODO: Look up product in Firebase/GCP
  };

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
            category-tree-item flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer
            transition-all duration-200
            ${isSelected ? 'active bg-primary/20 border border-primary/30' : ''}
            ${isChildSelected ? 'bg-primary/10' : 'hover:bg-white/5'}
          `}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
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
              <ChevronRight size={14} />
            </motion.span>
          )}
          <span className={`
            text-xs transition-colors duration-200
            ${isSelected ? 'text-primary font-semibold' : 'text-foreground'}
            ${isChildSelected && !isSelected ? 'text-primary/80' : ''}
          `}>
            {category.name}
          </span>
          {hasKids && (
            <span className="ml-auto text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded-full">
              {category.children?.length}
            </span>
          )}
        </motion.div>

        <AnimatePresence>
          {hasKids && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="py-0.5">
                {category.children?.map((child) => renderCategoryTree(child, depth + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const handleCategorySelect = (category: Category) => {
    onSelectCategory(category);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={() => setIsScannerOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-xl transition-all font-bold group text-xs"
      >
        <Camera size={16} className="group-hover:scale-110 transition-transform" />
        <span>Scan Product</span>
      </button>

      <div className="space-y-1">
        {categoryTree.children?.map((category) => renderCategoryTree(category))}
      </div>

      <AnimatePresence>
        {isScannerOpen && (
          <BarcodeScanner 
            onScan={handleScan} 
            onClose={() => setIsScannerOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
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
