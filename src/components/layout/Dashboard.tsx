'use client';

import { motion } from 'framer-motion';
import { Category, Product } from '@/types';
import { hasChildren, categoryTree } from '@/lib/data';
import { Sparkles, Package, ArrowLeft } from 'lucide-react';
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
}

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.02)
      translateZ(10px)
    `;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = '';
    card.style.transition = 'transform 300ms ease';
    setTimeout(() => {
      card.style.transition = '';
    }, 300);
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
                className={`${index === breadcrumb.length - 2
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
        <MagneticButton strength={0.3} className="mb-8">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBrowse}
            className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-2"
          >
            <Sparkles size={20} />
            Browse All Items
          </motion.button>
        </MagneticButton>
      )}

      {viewMode === 'products' && (
        <MagneticButton strength={0.3} className="mb-8">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToCategories}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/80 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Categories
          </motion.button>
        </MagneticButton>
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
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => onSelectCategory(category)}
                shape={category.shape || 'medium-rect'}
              />
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
            className="dashboard-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                className="col-span-1"
              >
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                  shape="medium-rect"
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
