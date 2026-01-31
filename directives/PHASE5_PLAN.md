# Phase 5 Implementation Plan: Card Grid Enhancements & Advanced Hover Effects

**Project**: vape2.0  
**Phase**: 5 - Core Development - Cards  
**Goal Statement**: Transform the existing card grid into a premium 2026-era interactive experience with advanced hover effects, sophisticated micro-interactions, and refined visual polish that elevates the user experience beyond basic animations.

---

## Current State Assessment

**Existing Implementation**:
- ✓ Irregular card shapes (small-rect, medium-rect, large-rect, circle, pill)
- ✓ Glassmorphism base (rgba(255,255,255,0.08) bg, 20px blur, white/15 border)
- ✓ Basic hover effects (scale: 1.03, y: -8, tap: 0.97)
- ✓ Simple radial gradient glow on hover
- ✓ Framer Motion installed and operational
- ✓ CSS custom properties defined in globals.css

**Enhancement Opportunities**:
- Hover effects lack depth and tactile feedback
- No shimmer/sheen animation on interaction
- Missing 3D perspective effects for premium feel
- Glow effects are subtle and uniform
- No magnetic cursor attraction effect
- Border animations are static

---

## Phase 5 Tasks

### Task 1: Implement Advanced Glow System
**Description**: Replace basic radial gradient with multi-layer animated glow system

**Implementation**:
```css
/* globals.css additions */
.card-glow-layer-1 {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    var(--card-accent-color) 60deg,
    transparent 120deg,
    var(--card-accent-color) 180deg,
    transparent 240deg,
    var(--card-accent-color) 300deg,
    transparent 360deg
  );
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.4s ease;
}

.card-glow-layer-2 {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    120% 120% at 50% 0%,
    var(--card-accent-color) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}
```

**Acceptance Criteria**:
- [ ] Dual-layer glow system renders smoothly
- [ ] Glow color adapts to card's accent color (purple for categories, cyan for products)
- [ ] Opacity transitions are 300-400ms for natural feel
- [ ] No performance impact on scroll (60fps maintained)
- [ ] Glow effect is visible but not overwhelming

---

### Task 2: Create Shimmer/Sheen Effect
**Description**: Add metallic sheen animation that sweeps across cards on hover

**Implementation**:
```css
/* globals.css */
@keyframes shimmer-sweep {
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}

.card-shimmer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

.card-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  transform: translateX(-100%) skewX(-15deg);
  opacity: 0;
}

.group:hover .card-shimmer::after {
  animation: shimmer-sweep 0.8s ease-out forwards;
  opacity: 1;
}
```

**Acceptance Criteria**:
- [ ] Sheen sweeps across card diagonally on hover enter
- [ ] Animation duration is 800ms with ease-out timing
- [ ] Effect triggers only once per hover (no infinite loop)
- [ ] Opacity peaks at 0.15 for subtle effect
- [ ] Works across all card shapes (including circle and pill)

---

### Task 3: Add 3D Tilt/Perspective Effect
**Description**: Implement subtle 3D tilt that follows cursor position within card bounds

**Implementation**:
```tsx
// Dashboard.tsx & ProductCard.tsx enhancement
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 20; // Max ~8 degrees
  const rotateY = (centerX - x) / 20;
  
  card.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.02)
    translateY(-4px)
  `;
};

const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = '';
};
```

**Acceptance Criteria**:
- [ ] Card tilts toward cursor position (max 8 degrees rotation)
- [ ] Perspective set to 1000px for realistic depth
- [ ] Smooth transition back to flat on mouse leave (300ms)
- [ ] Scale reduction compensates for tilt to maintain size consistency
- [ ] Performance: uses CSS transforms only (no layout thrashing)

---

### Task 4: Enhance Border Animation
**Description**: Replace static borders with animated gradient borders that flow around card edges

**Implementation**:
```css
/* globals.css */
@keyframes border-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.card-animated-border {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius);
  overflow: hidden;
}

.card-animated-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.15),
    var(--card-accent-color),
    rgba(255, 255, 255, 0.15),
    var(--card-accent-color),
    rgba(255, 255, 255, 0.15)
  );
  background-size: 300% 100%;
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover .card-animated-border::before {
  opacity: 1;
  animation: border-flow 3s ease infinite;
}
```

**Acceptance Criteria**:
- [ ] Border gradient flows smoothly (3s loop, ease timing)
- [ ] Animation starts only on hover
- [ ] Border width remains 1px with gradient effect
- [ ] Works with all border-radius values (circle, pill, rect)
- [ ] Graceful fallback for browsers without mask support

---

### Task 5: Add Magnetic Button Effect for CTAs
**Description**: Create subtle magnetic attraction for "Browse All Items" and action buttons

**Implementation**:
```tsx
// MagneticButton component
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0.3 to 0.6 recommended
}

export function MagneticButton({ 
  children, 
  className, 
  strength = 0.4 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  
  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0, 0)';
    }
  };
  
  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </button>
  );
}
```

**Acceptance Criteria**:
- [ ] Button follows cursor within 50px radius
- [ ] Movement limited to 30% of cursor distance (strength: 0.3)
- [ ] Smooth return to center on mouse leave (200ms)
- [ ] Applied to "Browse All Items" and "Back to Categories" buttons
- [ ] No jitter or stuttering during movement

---

### Task 6: Implement Content Parallax on Hover
**Description**: Add subtle parallax effect to card content (text/icons) that moves independently of card

**Implementation**:
```tsx
// Card content structure enhancement
<div className="relative z-10 text-center card-content">
  <h3 className="card-title text-xl font-bold text-foreground">
    {category.name}
  </h3>
  <p className="card-subtitle text-sm text-muted-foreground mt-2">
    {category.children?.length} options
  </p>
</div>

// CSS
.card-content {
  transition: transform 0.3s ease;
}

.group:hover .card-title {
  transform: translateY(-4px);
  transition-delay: 0.05s;
}

.group:hover .card-subtitle {
  transform: translateY(-2px);
  transition-delay: 0.1s;
}
```

**Acceptance Criteria**:
- [ ] Title moves upward 4px on hover
- [ ] Subtitle moves upward 2px with 50ms delay
- [ ] Staggered movement creates depth perception
- [ ] Text remains centered and readable
- [ ] Works on all card sizes and shapes

---

### Task 7: Create Ambient Background Pulse
**Description**: Add subtle pulsing animation to cards even when not hovered (ambient attention)

**Implementation**:
```css
/* globals.css */
@keyframes ambient-pulse {
  0%, 100% {
    opacity: 0.03;
    transform: scale(1);
  }
  50% {
    opacity: 0.06;
    transform: scale(1.02);
  }
}

.card-ambient-glow {
  position: absolute;
  inset: -10px;
  border-radius: inherit;
  background: radial-gradient(
    circle at center,
    var(--card-accent-color) 0%,
    transparent 70%
  );
  animation: ambient-pulse 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

/* Pause ambient animation on hover */
.group:hover .card-ambient-glow {
  animation-play-state: paused;
}
```

**Acceptance Criteria**:
- [ ] Ambient glow pulses every 4 seconds
- [ ] Opacity ranges from 0.03 to 0.06 (very subtle)
- [ ] Scale pulses 1% (1.00 to 1.02)
- [ ] Animation pauses on hover (prevents conflict)
- [ ] Creates living, breathing interface feel

---

### Task 8: Optimize Performance & Accessibility
**Description**: Ensure all effects are performant and respect user preferences

**Implementation**:
```css
/* globals.css - Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  .card-glow-layer-1,
  .card-glow-layer-2,
  .card-shimmer::after,
  .card-animated-border::before,
  .card-ambient-glow {
    animation: none !important;
    opacity: 0 !important;
    transition: none !important;
  }
  
  .interactive-card {
    transform: none !important;
    transition: none !important;
  }
}

/* GPU acceleration hints */
.glass-card {
  will-change: transform;
  transform: translateZ(0);
}

/* Contain paint for better performance */
.dashboard-grid {
  contain: layout style paint;
}
```

**Acceptance Criteria**:
- [ ] All animations disabled when prefers-reduced-motion is true
- [ ] GPU acceleration enabled with will-change and translateZ
- [ ] Paint containment applied to grid container
- [ ] No layout shifts during animations (CLS = 0)
- [ ] 60fps maintained on mid-range devices during scroll

---

## 2026 Design Aesthetic Principles

### Visual Hierarchy
1. **Depth through Layering**: Multiple glow layers create perceived depth
2. **Motion as Feedback**: Every interaction has purposeful animation
3. **Tactile Responsiveness**: Cards feel physical and responsive
4. **Living Interface**: Subtle ambient motion keeps UI feeling alive

### Color Enhancements
- **Accent Intensity**: Increase glow saturation by 20% on hover
- **Dynamic Borders**: Border colors shift through accent palette
- **Soft Shadows**: Elevated cards cast softer, colored shadows

### Shape Refinements
- **Circle Cards**: Enhanced radial glow following circumference
- **Pill Cards**: Horizontal sheen sweep matching elongated shape
- **Large Rects**: Corner-specific glow intensification

---

## Technical Implementation Notes

### File Modifications Required

1. **`src/app/globals.css`**:
   - Add all new CSS keyframe animations
   - Define glow layer classes
   - Add shimmer and border animation styles
   - Include reduced-motion media queries
   - Add performance optimization hints

2. **`src/components/layout/Dashboard.tsx`**:
   - Add 3D tilt mouse event handlers
   - Implement magnetic button effect
   - Update card structure for parallax content
   - Add ambient glow elements

3. **`src/components/features/ProductCard.tsx`**:
   - Apply 3D tilt effect
   - Add shimmer overlay
   - Implement content parallax
   - Add dual-layer glow system
   - Create animated border wrapper

4. **New Component: `src/components/shared/MagneticButton.tsx`**:
   - Create reusable magnetic button component
   - Export for use across dashboard
   - Support configurable strength parameter

### Animation Timing Standards

| Animation Type | Duration | Easing | Delay |
|----------------|----------|--------|-------|
| Hover Scale | 300ms | cubic-bezier(0.4, 0, 0.2, 1) | 0ms |
| Glow Fade | 400ms | ease | 0ms |
| Shimmer Sweep | 800ms | ease-out | 0ms |
| 3D Tilt | Real-time | linear | 0ms |
| Border Flow | 3000ms | ease | 0ms (loop) |
| Magnetic Return | 200ms | ease-out | 0ms |
| Content Parallax | 300ms | ease | 50-100ms |
| Ambient Pulse | 4000ms | ease-in-out | 0ms (loop) |

### Performance Budget
- **Max paint time per card**: 16ms (60fps)
- **Concurrent animations**: Max 5 cards animating simultaneously
- **Memory overhead**: <5MB for all animation layers
- **Bundle size increase**: <5KB CSS, <2KB JS

### Testing Checklist
- [ ] Chrome/Edge: 120+ fps on desktop
- [ ] Firefox: Smooth animations, no jank
- [ ] Safari: Webkit prefix compatibility
- [ ] Mobile (iOS): 60fps maintained
- [ ] Mobile (Android): 60fps maintained
- [ ] Tablet: Proper touch interaction
- [ ] Reduced Motion: All effects disabled

---

## Done When Checklist

- [ ] Task 1 Complete: Dual-layer glow system implemented and visible
- [ ] Task 2 Complete: Shimmer effect triggers on all card hovers
- [ ] Task 3 Complete: 3D tilt effect responds to cursor position
- [ ] Task 4 Complete: Animated gradient borders flow smoothly
- [ ] Task 5 Complete: Magnetic buttons follow cursor within radius
- [ ] Task 6 Complete: Content parallax creates layered depth
- [ ] Task 7 Complete: Ambient pulse visible on idle cards
- [ ] Task 8 Complete: Reduced motion respected, 60fps maintained
- [ ] Build Successful: `npm run build` passes without errors
- [ ] TypeScript Clean: `npx tsc --noEmit` has zero errors
- [ ] Lint Passing: `npm run lint` shows no warnings
- [ ] Manual Testing: All effects visible and smooth across devices
- [ ] Documentation: Any new utilities added to comments

---

## Success Metrics

1. **Visual Impact**: Cards feel premium and engaging
2. **Performance**: No frame drops during scroll or interaction
3. **Accessibility**: All users can interact comfortably
4. **Consistency**: Effects match across all card types
5. **Delight**: Users notice and appreciate the micro-interactions

---

**Estimated Effort**: 4-6 hours  
**Priority Order**: Tasks 1→2→3→4→5→6→7→8  
**Dependencies**: None (all work is enhancement layer on existing code)  
**Risk Level**: Low (non-breaking visual enhancements only)

**Last Updated**: 2026-01-30  
**Plan Status**: Ready for Implementation
