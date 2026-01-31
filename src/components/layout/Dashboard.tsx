'use client';

import { motion } from 'framer-motion';
import { Category, Product } from '@/types';
import { hasChildren, categoryTree } from '@/lib/data';
import { Sparkles, Package, ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/components/features/ProductCard';

interface DashboardProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onBrowse: () => void;
  onNavigateToRoot: () => void;
  viewMode: 'categories' | 'products';
  products: Product[];
}

const shapeStyles: Record<string, string> = {
  'small-rect': 'col-span-1 row-span-1',
  'medium-rect': 'col-span-2 row-span-1',
  'large-rect': 'col-span-2 row-span-2',
  'circle': 'col-span-1 row-span-1 aspect-square rounded-full',
  'pill': 'col-span-2 row-span-1 rounded-full',
};

const productShapes: ('small-rect' | 'medium-rect' | 'large-rect' | 'circle' | 'pill')[] = [
  'medium-rect', 'small-rect', 'large-rect', 'circle', 'pill',
  'small-rect', 'medium-rect', 'circle', 'medium-rect', 'small-rect',
  'large-rect', 'pill', 'small-rect', 'medium-rect', 'circle',
];

export function Dashboard({ 
  selectedCategory, 
  onSelectCategory, 
  onBrowse, 
  onNavigateToRoot,
  viewMode,
  products 
}: DashboardProps) {
  const getCategoriesToDisplay = (): Category[] => {
    if (!selectedCategory) {
      return categoryTree.children || [];
    }

    if (hasChildren(selectedCategory)) {
      return selectedCategory.children || [];
    } else {
      const path = findParentPath(categoryTree, selectedCategory.id);
      if (path && path.length > 0) {
        const parent = path[path.length - 1];
        return parent.children || [];
      }
      return [];
    }
  };

  const categories = getCategoriesToDisplay();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const breadcrumb = selectedCategory
    ? getCategoryPath(categoryTree, selectedCategory.id) || []
    : [];

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
  };

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
    <main className="main-content flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8">
      {breadcrumb.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6"
        >
          <button
            onClick={onNavigateToRoot}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            All Products
          </button>
          {breadcrumb.slice(1).map((cat, index) => (
            <span key={cat.id} className="flex items-center gap-2">
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => onSelectCategory(cat)}
                className={`${
                  index === breadcrumb.length - 2
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                } transition-colors`}
              >
                {cat.name}
              </button>
            </span>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-4xl font-bold text-foreground mb-2">
          {viewMode === 'products' 
            ? (selectedCategory ? `${selectedCategory.name} Products` : 'All Products')
            : (selectedCategory ? selectedCategory.name : 'Browse Categories')
          }
        </h2>
        <p className="text-lg text-muted-foreground">
          {viewMode === 'products'
            ? `${products.length} item${products.length !== 1 ? 's' : ''} found`
            : (selectedCategory?.description || 'Select a category to explore our products')
          }
        </p>
      </motion.div>

      {viewMode === 'categories' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBrowse}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-2"
        >
          <Sparkles size={20} />
          Browse All Items
        </motion.button>
      )}

      {viewMode === 'products' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToCategories}
          className="mb-8 px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/80 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Categories
        </motion.button>
      )}

      {viewMode === 'categories' ? (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="dashboard-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px]"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectCategory(category)}
                className={`
                  glass-card interactive-card 
                  ${shapeStyles[category.shape || 'medium-rect']}
                  dashboard-card-${category.shape || 'medium-rect'}
                  flex items-center justify-center p-4 sm:p-6
                  relative overflow-hidden group
                `}
                style={{
                  background: category.color
                    ? `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, ${category.color}20 100%)`
                    : undefined,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${category.color || '#8b5cf6'}30 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 text-center">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-white transition-colors">
                    {category.name}
                  </h3>
                  {hasChildren(category) && (
                    <p className="text-sm text-muted-foreground mt-2 group-hover:text-white/80 transition-colors">
                      {category.children?.length} options
                    </p>
                  )}
                </div>

                <div
                  className="absolute top-0 right-0 w-16 h-16 opacity-20"
                  style={{
                    background: `linear-gradient(225deg, ${category.color || '#8b5cf6'} 0%, transparent 70%)`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {categories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-muted-foreground">
                No categories found. Try selecting a different category.
              </p>
            </motion.div>
          )}
        </>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="dashboard-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
              >
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                  shape={productShapes[index % productShapes.length]}
                  discount={product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : undefined}
                />
              </motion.div>
            ))}
          </motion.div>

          {products.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="mx-auto mb-4 text-muted-foreground" size={64} />
              <p className="text-xl text-muted-foreground mb-2">
                No products found
              </p>
              <p className="text-muted-foreground">
                Try browsing a different category or go back to view all categories.
              </p>
            </motion.div>
          )}
        </>
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
