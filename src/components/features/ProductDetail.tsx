'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Package, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '@/types';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  // Handle escape key press
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      alert(`Added ${product.name} to cart!`);
    }
  };

  // Build category breadcrumb
  const breadcrumbPath = product?.categoryPath || [];

  if (!product) return null;

  // Check if product is on sale (we'll assume price < 20 is on sale for demo)
  const isOnSale = product.price < 20;
  const originalPrice = isOnSale ? product.price * 1.25 : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop / Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                aria-label="Close modal"
              >
                <X size={24} className="text-white" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
                    <motion.img
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Stock Badge */}
                    <div className="absolute top-4 left-4">
                      {product.inStock ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                          <CheckCircle size={14} />
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-medium">
                          <XCircle size={14} />
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                  {/* Category Breadcrumb */}
                  {breadcrumbPath.length > 0 && (
                    <motion.nav
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap"
                    >
                      {breadcrumbPath.map((category, index) => (
                        <span key={index} className="flex items-center gap-2">
                          <span className="hover:text-foreground transition-colors cursor-pointer">
                            {category}
                          </span>
                          {index < breadcrumbPath.length - 1 && (
                            <span className="text-muted-foreground">/</span>
                          )}
                        </span>
                      ))}
                    </motion.nav>
                  )}

                  {/* Product Name */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-2xl md:text-3xl font-bold text-foreground mb-4"
                  >
                    {product.name}
                  </motion.h1>

                  {/* Price */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <span className="text-3xl font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                    {isOnSale && (
                      <span className="px-2 py-1 rounded bg-accent/20 text-accent text-sm font-semibold">
                        20% OFF
                      </span>
                    )}
                  </motion.div>

                  {/* Product Details Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="grid grid-cols-2 gap-4 mb-6"
                  >
                    {product.brand && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                        <Package size={18} className="text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Brand</p>
                          <p className="text-sm font-medium text-foreground">{product.brand}</p>
                        </div>
                      </div>
                    )}
                    {product.flavor && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                        <div className="w-4 h-4 rounded-full bg-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">Flavor</p>
                          <p className="text-sm font-medium text-foreground">{product.flavor}</p>
                        </div>
                      </div>
                    )}
                    {product.hits && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                        <div className="w-4 h-4 rounded-full bg-chart-3" />
                        <div>
                          <p className="text-xs text-muted-foreground">Hits</p>
                          <p className="text-sm font-medium text-foreground">
                            {product.hits.toLocaleString()} puffs
                          </p>
                        </div>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: product.color }}
                        />
                        <div>
                          <p className="text-xs text-muted-foreground">Color</p>
                          <p className="text-sm font-medium text-foreground capitalize">{product.color}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Description
                    </h3>
                    <p className="text-foreground leading-relaxed">{product.description}</p>
                  </motion.div>

                  {/* Add to Cart Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`mt-auto w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 ${
                      product.inStock
                        ? 'bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25'
                        : 'bg-muted cursor-not-allowed opacity-50'
                    }`}
                  >
                    <ShoppingCart size={20} />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
