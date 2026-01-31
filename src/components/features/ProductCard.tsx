'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/types';
import { Package, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  shape?: 'small-rect' | 'medium-rect' | 'large-rect' | 'circle' | 'pill';
  discount?: number; // Percentage off (e.g., 20 for 20% off)
}

// Card shape styles - same pattern as Dashboard.tsx
const shapeStyles: Record<string, string> = {
  'small-rect': 'col-span-1 row-span-1',
  'medium-rect': 'col-span-2 row-span-1',
  'large-rect': 'col-span-2 row-span-2',
  'circle': 'col-span-1 row-span-1 aspect-square rounded-full',
  'pill': 'col-span-2 row-span-1 rounded-full',
};

export function ProductCard({
  product,
  onClick,
  shape = 'medium-rect',
  discount,
}: ProductCardProps) {
  const discountedPrice = discount
    ? product.price * (1 - discount / 100)
    : product.price;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        glass-card interactive-card
        ${shapeStyles[shape]}
        flex flex-col p-4
        relative overflow-hidden group
        border-cyan-500/30 hover:border-cyan-400/50
      `}
      style={{
        background: product.color
          ? `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, ${product.color}15 100%)`
          : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(20,184,166,0.1) 100%)',
      }}
    >
      {/* Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${product.color || '#14b8a6'}25 0%, transparent 70%)`,
        }}
      />

      {/* Badges */}
      <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-start pointer-events-none">
        {/* Discount Badge */}
        {discount && discount > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1"
          >
            <Tag size={12} />
            {discount}% OFF
          </motion.div>
        )}

        {/* Out of Stock Badge */}
        {!product.inStock && (
          <motion.div
            initial={{ scale: 0, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="bg-destructive/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 ml-auto"
          >
            <Package size={12} />
            Out of Stock
          </motion.div>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full h-32 mb-3 rounded-xl overflow-hidden bg-muted/50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="text-muted-foreground/50" size={40} />
          </div>
        )}

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
      </div>

      {/* Product Info */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-lg font-bold text-foreground group-hover:text-white transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Flavor */}
        {product.flavor && (
          <p className="text-sm text-muted-foreground group-hover:text-white/70 transition-colors mb-2">
            {product.flavor}
          </p>
        )}

        {/* Price Section */}
        <div className="mt-auto flex items-center gap-2">
          {discount && discount > 0 ? (
            <>
              <span className="text-xl font-bold text-accent">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-foreground group-hover:text-white transition-colors">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Corner Decoration */}
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-15"
        style={{
          background: `linear-gradient(225deg, ${product.color || '#14b8a6'} 0%, transparent 70%)`,
        }}
      />

      {/* Bottom Border Accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${product.color || '#14b8a6'} 50%, transparent 100%)`,
        }}
      />
    </motion.div>
  );
}
