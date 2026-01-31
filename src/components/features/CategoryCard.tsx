'use client';

import { motion } from 'framer-motion';
import { Category } from '@/types';
import { hasChildren } from '@/lib/data';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  shape?: 'small-rect' | 'medium-rect' | 'large-rect' | 'circle' | 'pill';
  className?: string;
}

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

export function CategoryCard({
  category,
  onClick,
  shape = 'medium-rect',
  className = '',
}: CategoryCardProps) {
  const shimmerClass = shimmerClassMap[shape] || 'card-shimmer-rect';

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
      variants={{
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
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        card-glow-container card-glow-purple
        card-shimmer ${shimmerClass}
        glass-card interactive-card
        card-animated-border
        ${shapeStyles[shape]}
        dashboard-card-${shape}
        flex items-center justify-center p-4 sm:p-6
        relative overflow-hidden group cursor-pointer
        ${className}
      `}
      style={{
        background: category.color
          ? `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, ${category.color}20 100%)`
          : undefined,
        // Task 3: Enable 3D transforms with smooth transition
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Task 7: Ambient Background Glow */}
      <div
        className="card-ambient-glow"
        style={{ '--card-accent-color': category.color || '#8b5cf6' } as React.CSSProperties}
      />

      {/* Task 1: Dual-Layer Glow System */}
      <div className="card-glow-layer-1" />
      <div className="card-glow-layer-2" />

      {/* Legacy glow effect for fallback */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${category.color || '#8b5cf6'}30 0%, transparent 70%)`,
        }}
      />

      {/* Card Content with Task 6: Parallax */}
      <div className="relative z-10 text-center card-content">
        <h3 className="card-title text-xl font-bold text-foreground group-hover:text-white transition-colors">
          {category.name}
        </h3>
        {hasChildren(category) && (
          <p className="card-subtitle text-sm text-muted-foreground mt-2 group-hover:text-white/80 transition-colors">
            {category.children?.length} options
          </p>
        )}
      </div>

      {/* Corner Decoration */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-20"
        style={{
          background: `linear-gradient(225deg, ${category.color || '#8b5cf6'} 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
