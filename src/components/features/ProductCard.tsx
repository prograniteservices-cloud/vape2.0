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

const shimmerClassMap: Record<string, string> = {
  'circle': 'card-shimmer-circle',
  'pill': 'card-shimmer-pill',
  'small-rect': 'card-shimmer-rect',
  'medium-rect': 'card-shimmer-rect',
  'large-rect': 'card-shimmer-rect',
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

  const shimmerClass = shimmerClassMap[shape || 'medium-rect'] || 'card-shimmer-rect';

  // Task 3: 3D Tilt/Perspective Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (max 8 degrees)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03) translateY(-8px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    // Smooth transition back to flat state (300ms)
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateY(0)';
  };

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        card-glow-container card-glow-cyan
        card-shimmer ${shimmerClass}
        glass-card interactive-card
        card-animated-border
        ${shapeStyles[shape]}
        flex flex-col p-4
        relative overflow-hidden group cursor-pointer
        border-cyan-500/30 hover:border-cyan-400/50
      `}
      style={{
        background: product.color
          ? `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, ${product.color}15 100%)`
          : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(20,184,166,0.1) 100%)',
        // Task 3: Enable 3D transforms with smooth transition
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Task 7: Ambient Background Glow */}
      <div
        className="card-ambient-glow"
        style={{ '--card-accent-color': product.color || '#14b8a6' } as React.CSSProperties}
      />

      {/* Task 1: Dual-Layer Glow System */}
      <div className="card-glow-layer-1" />
      <div className="card-glow-layer-2" />

      {/* Legacy Glow Effect - kept for compatibility */}
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

      {/* Product Info with Task 6: Parallax */}
      <div className="relative z-10 flex-1 flex flex-col card-content">
        {/* Brand */}
        {product.brand && (
          <p className="card-subtitle text-xs text-cyan-400 font-medium uppercase tracking-wider mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="card-title text-lg font-bold text-foreground group-hover:text-white transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Flavor */}
        {product.flavor && (
          <p className="card-subtitle text-sm text-muted-foreground group-hover:text-white/70 transition-colors mb-2">
            {product.flavor}
          </p>
        )}

        {/* Price Section */}
        <div className="mt-auto flex items-center gap-2 card-subtitle">
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
