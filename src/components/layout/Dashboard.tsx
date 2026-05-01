'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Product } from '@/types';
import { hasChildren, categoryTree } from '@/lib/data';
import { Sparkles, ArrowLeft, ChevronRight, X, Zap, Droplets } from 'lucide-react';
import { ProductCard } from '@/components/features/ProductCard';
import { CategoryCard } from '@/components/features/CategoryCard';

interface DashboardProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onBrowse: () => void;
  onNavigateToRoot: () => void;
  viewMode: 'categories' | 'products';
  products: Product[];
  resultLabel?: string | null;
  compact?: boolean;
}

export function Dashboard({
  selectedCategory,
  onSelectCategory,
  onBrowse,
  onNavigateToRoot,
  viewMode,
  products,
  resultLabel,
  compact = false
}: DashboardProps) {
  const [expandedProduct, setExpandedProduct] = useState<Product | null>(null);

  const isVapeProduct = (product: Product) =>
    product.categoryPath?.some(cat => ['vapes', 'vape-devices', 'e-liquids'].includes(cat));
  
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
            ? (resultLabel ? `Results: ${resultLabel}` : (selectedCategory ? selectedCategory.name : 'Products'))
            : (selectedCategory ? selectedCategory.name : 'Collections')
          }
        </h2>
        <p className="text-sm text-white/40 font-medium max-w-xl">
          {viewMode === 'products'
            ? `Displaying ${products.length} ranked selections.`
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
              onClick={() => setExpandedProduct(product)}
              shape="medium-rect"
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {expandedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedProduct(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] glass-card rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
              style={{
                background: `linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.6) 100%)`,
              }}
            >
              <div
                className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
                style={{ background: expandedProduct.color ? `${expandedProduct.color}30` : '#8b5cf630' }}
              />
              <div
                className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none"
                style={{ background: expandedProduct.color ? `${expandedProduct.color}20` : '#8b5cf620' }}
              />

              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                  {expandedProduct.categoryPath?.map((cat, i) => (
                    <span key={cat} className="flex items-center gap-2">
                      {i > 0 && <span className="text-white/10">/</span>}
                      <span className="text-white/50">{cat.replace(/-/g, ' ')}</span>
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setExpandedProduct(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 relative aspect-square md:aspect-auto md:min-h-[400px] bg-black/40 overflow-hidden">
                    <img
                      src={expandedProduct.imageUrl}
                      alt={expandedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent md:bg-gradient-to-r md:from-zinc-950/80 md:via-transparent md:to-transparent" />
                    <div className="absolute bottom-4 left-4 md:hidden">
                      <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-lg">
                        {expandedProduct.name}
                      </h2>
                      <p className="text-3xl font-black text-primary mt-1">
                        ${expandedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col gap-5 relative z-10">
                    <div className="hidden md:block">
                      <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                        {expandedProduct.name}
                      </h2>
                      <p className="text-3xl font-black text-primary mt-1">
                        ${expandedProduct.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {expandedProduct.brand && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/60 px-3 py-1 rounded-full border border-white/5">
                          {expandedProduct.brand}
                        </span>
                      )}
                      {expandedProduct.flavor && (
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/60 px-3 py-1 rounded-full border border-white/5">
                          {expandedProduct.flavor}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${expandedProduct.inStock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                        {expandedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <p className="text-sm text-white/60 leading-relaxed border-l-2 border-primary/30 pl-4">
                      {expandedProduct.description}
                    </p>

                    {isVapeProduct(expandedProduct) && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Specifications</p>
                        <div className="glass-card px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-2">
                            <Zap size={14} className="text-amber-400" />
                            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Amount of Hits</span>
                          </div>
                          <span className="text-sm text-white/20 font-mono">— puffs</span>
                        </div>
                        <div className="glass-card px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between group hover:border-primary/30 transition-all">
                          <div className="flex items-center gap-2">
                            <Droplets size={14} className="text-cyan-400" />
                            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Nicotine %</span>
                          </div>
                          <span className="text-sm text-white/20 font-mono">—</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 border-t border-white/5 px-6 py-3 flex items-center justify-between relative z-10">
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                  {expandedProduct.organization_id || 'VapeOS'}
                </span>
                <button
                  onClick={() => setExpandedProduct(null)}
                  className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
