'use client';

import { motion } from 'framer-motion';
import { Category, Product } from '@/types';
import { hasChildren, categoryTree } from '@/lib/data';
import { Sparkles, Package, ArrowLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/features/ProductCard';
import { CategoryCard } from '@/components/features/CategoryCard';
import { MagneticButton } from '@/components/shared/MagneticButton';

interface DashboardProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onBrowse: () => void;
  onNavigateToRoot: () => void;
  viewMode: 'categories' | 'products';
  products: Product[];
  compact?: boolean;
}

export function Dashboard({
  selectedCategory,
  onSelectCategory,
  onBrowse,
  onNavigateToRoot,
  viewMode,
  products,
  compact = false
}: DashboardProps) {
  
  if (compact) {
    return (
      <div className="space-y-4">
        {viewMode === 'categories' ? (
          <div className="grid grid-cols-1 gap-2.5 px-1">
             {(selectedCategory?.children || categoryTree.children)?.map((category) => (
                <div 
                  key={category.id} 
                  onClick={() => onSelectCategory(category)}
                  className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer group flex items-center justify-between"
                >
                   <div className="flex items-center gap-3">
                      <div 
                        className="w-1.5 h-8 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
                        style={{ backgroundColor: category.color || '#8b5cf6' }} 
                      />
                      <div>
                        <p className="text-xs font-bold text-white/90">{category.name}</p>
                        <p className="text-[9px] text-white/30 uppercase tracking-widest font-medium">Explore</p>
                      </div>
                   </div>
                   <ChevronRight size={14} className="text-white/20 group-hover:text-primary transition-colors" />
                </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 px-1">
            {products.map((product) => (
              <div 
                key={product.id}
                className="p-2.5 bg-white/[0.03] border border-white/[0.05] rounded-xl flex gap-3 group hover:border-primary/30 hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-900 flex-shrink-0 overflow-hidden border border-white/5 relative">
                   <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                   />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-[11px] font-bold text-white/90 truncate group-hover:text-primary transition-colors">{product.name}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] text-primary font-mono font-bold">${product.price}</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-tighter">In Stock</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const getCategoriesToDisplay = (): Category[] => {
    if (!selectedCategory) return categoryTree.children || [];
    if (hasChildren(selectedCategory)) return selectedCategory.children || [];
    
    const path = findParentPath(categoryTree, selectedCategory.id);
    return (path && path.length > 0) ? path[path.length - 1].children || [] : [];
  };

  const categories = getCategoriesToDisplay();

  const breadcrumb = selectedCategory ? getCategoryPath(categoryTree, selectedCategory.id) || [] : [];

  const handleBackToCategories = () => {
    if (selectedCategory && hasChildren(selectedCategory)) {
      onNavigateToRoot();
    } else if (selectedCategory) {
      const path = findParentPath(categoryTree, selectedCategory.id);
      if (path && path.length > 0) {
        onSelectCategory(path[path.length - 1]);
      } else {
        onNavigateToRoot();
      }
    } else {
      onNavigateToRoot();
    }
  };

  return (
    <main className="main-content flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={onNavigateToRoot}
            className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold"
          >
            All
          </button>
          {breadcrumb.slice(1).map((cat, index) => (
            <span key={cat.id} className="flex items-center gap-2">
              <span className="text-white/20">/</span>
              <button
                onClick={() => onSelectCategory(cat)}
                className={`text-xs uppercase tracking-widest font-bold transition-colors ${
                  index === breadcrumb.length - 2 ? 'text-primary' : 'text-white/40 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
          {viewMode === 'products'
            ? (selectedCategory ? selectedCategory.name : 'Products')
            : (selectedCategory ? selectedCategory.name : 'Collections')
          }
        </h2>
        <p className="text-sm text-white/40 font-medium max-w-xl">
          {viewMode === 'products'
            ? `Displaying ${products.length} premium selections.`
            : (selectedCategory?.description || 'Curated high-end vaping experiences.')
          }
        </p>
      </div>

      {viewMode === 'categories' && (
        <div className="mb-8">
          <button
            onClick={onBrowse}
            className="px-6 py-3 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
          >
            <Sparkles size={16} />
            Browse Full Catalog
          </button>
        </div>
      )}

      {viewMode === 'products' && (
        <div className="mb-8">
          <button
            onClick={handleBackToCategories}
            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Categories
          </button>
        </div>
      )}

      {viewMode === 'categories' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onSelectCategory(category)}
              shape={category.shape || 'medium-rect'}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => {}}
              shape="medium-rect"
            />
          ))}
        </div>
      )}
    </main>
  );
}

function findParentPath(root: Category, targetId: string, path: Category[] = []): Category[] | null {
  if (root.id === targetId) return path;
  if (root.children) {
    for (const child of root.children) {
      const result = findParentPath(child, targetId, [...path, root]);
      if (result) return result;
    }
  }
  return null;
}

function getCategoryPath(root: Category, targetId: string, path: Category[] = []): Category[] | null {
  if (root.id === targetId) return [...path, root];
  if (root.children) {
    for (const child of root.children) {
      const result = getCategoryPath(child, targetId, [...path, root]);
      if (result) return result;
    }
  }
  return null;
}
