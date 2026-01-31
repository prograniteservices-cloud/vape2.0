import { Category, Product } from '@/types';

export const categoryTree: Category = {
  id: 'root',
  name: 'All Products',
  slug: 'all',
  children: [
    {
      id: 'vapes',
      name: 'Vapes',
      slug: 'vapes',
      description: 'Disposable and rechargeable vape devices',
      children: [
        {
          id: 'flavor',
          name: 'Flavor',
          slug: 'flavor',
          description: 'Choose your favorite flavor',
          children: [
            { id: 'watermelon', name: 'Watermelon', slug: 'watermelon', isLeaf: true, shape: 'circle', color: '#ef4444' },
            { id: 'strawberry', name: 'Strawberry', slug: 'strawberry', isLeaf: true, shape: 'medium-rect', color: '#ec4899' },
            { id: 'grape', name: 'Grape', slug: 'grape', isLeaf: true, shape: 'circle', color: '#8b5cf6' },
            { id: 'mango', name: 'Mango', slug: 'mango', isLeaf: true, shape: 'large-rect', color: '#f59e0b' },
            { id: 'blueberry', name: 'Blueberry', slug: 'blueberry', isLeaf: true, shape: 'small-rect', color: '#3b82f6' },
            { id: 'peach', name: 'Peach', slug: 'peach', isLeaf: true, shape: 'pill', color: '#f97316' },
            { id: 'mint', name: 'Mint', slug: 'mint', isLeaf: true, shape: 'circle', color: '#14b8a6' },
            { id: 'vanilla', name: 'Vanilla', slug: 'vanilla', isLeaf: true, shape: 'medium-rect', color: '#fbbf24' },
          ],
        },
        {
          id: 'hits',
          name: 'Hits',
          slug: 'hits',
          description: 'Number of puffs per device',
          children: [
            { id: 'hits-5000', name: '5,000 Hits', slug: '5000-hits', isLeaf: true, shape: 'small-rect', color: '#10b981' },
            { id: 'hits-10000', name: '10,000 Hits', slug: '10000-hits', isLeaf: true, shape: 'medium-rect', color: '#22c55e' },
            { id: 'hits-15000', name: '15,000 Hits', slug: '15000-hits', isLeaf: true, shape: 'large-rect', color: '#16a34a' },
            { id: 'hits-20000', name: '20,000 Hits', slug: '20000-hits', isLeaf: true, shape: 'circle', color: '#15803d' },
          ],
        },
        {
          id: 'brand',
          name: 'Brand',
          slug: 'brand',
          description: 'Popular vape brands',
          children: [
            { id: 'brand-elfbar', name: 'Elf Bar', slug: 'elfbar', isLeaf: true, shape: 'medium-rect', color: '#6366f1' },
            { id: 'brand-geekbar', name: 'Geek Bar', slug: 'geekbar', isLeaf: true, shape: 'pill', color: '#8b5cf6' },
            { id: 'brand-lostmary', name: 'Lost Mary', slug: 'lostmary', isLeaf: true, shape: 'circle', color: '#a855f7' },
            { id: 'brand-funky republic', name: 'Funky Republic', slug: 'funky-republic', isLeaf: true, shape: 'large-rect', color: '#d946ef' },
            { id: 'brand-hyde', name: 'Hyde', slug: 'hyde', isLeaf: true, shape: 'small-rect', color: '#c026d3' },
          ],
        },
        {
          id: 'color',
          name: 'Color',
          slug: 'color',
          description: 'Device colors',
          children: [
            { id: 'color-red', name: 'Red', slug: 'red', isLeaf: true, shape: 'circle', color: '#ef4444' },
            { id: 'color-blue', name: 'Blue', slug: 'blue', isLeaf: true, shape: 'circle', color: '#3b82f6' },
            { id: 'color-black', name: 'Black', slug: 'black', isLeaf: true, shape: 'medium-rect', color: '#1f2937' },
            { id: 'color-pink', name: 'Pink', slug: 'pink', isLeaf: true, shape: 'pill', color: '#ec4899' },
            { id: 'color-teal', name: 'Teal', slug: 'teal', isLeaf: true, shape: 'circle', color: '#14b8a6' },
          ],
        },
        {
          id: 'sale',
          name: 'On Sale',
          slug: 'sale',
          description: 'Discounted items',
          isLeaf: true,
          shape: 'large-rect',
          color: '#f59e0b',
        },
      ],
    },
    {
      id: 'e-liquid',
      name: 'E-Liquid',
      slug: 'e-liquid',
      description: 'Vape juice and refills',
      children: [
        {
          id: 'eliquid-flavor',
          name: 'Flavor',
          slug: 'eliquid-flavor',
          children: [
            { id: 'eliquid-fruity', name: 'Fruity', slug: 'fruity', isLeaf: true, shape: 'medium-rect', color: '#f97316' },
            { id: 'eliquid-dessert', name: 'Dessert', slug: 'dessert', isLeaf: true, shape: 'circle', color: '#fbbf24' },
            { id: 'eliquid-menthol', name: 'Menthol', slug: 'menthol', isLeaf: true, shape: 'small-rect', color: '#06b6d4' },
            { id: 'eliquid-tobacco', name: 'Tobacco', slug: 'tobacco', isLeaf: true, shape: 'pill', color: '#78716c' },
          ],
        },
        {
          id: 'nicotine-strength',
          name: 'Nicotine Strength',
          slug: 'nicotine-strength',
          children: [
            { id: 'nic-0mg', name: '0mg (Nicotine Free)', slug: '0mg', isLeaf: true, shape: 'small-rect', color: '#22c55e' },
            { id: 'nic-3mg', name: '3mg', slug: '3mg', isLeaf: true, shape: 'circle', color: '#84cc16' },
            { id: 'nic-6mg', name: '6mg', slug: '6mg', isLeaf: true, shape: 'medium-rect', color: '#eab308' },
            { id: 'nic-12mg', name: '12mg', slug: '12mg', isLeaf: true, shape: 'pill', color: '#f59e0b' },
            { id: 'nic-18mg', name: '18mg', slug: '18mg', isLeaf: true, shape: 'large-rect', color: '#ef4444' },
          ],
        },
      ],
    },
    {
      id: 'accessories',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Chargers, cases, and more',
      children: [
        { id: 'chargers', name: 'Chargers', slug: 'chargers', isLeaf: true, shape: 'medium-rect', color: '#3b82f6' },
        { id: 'cases', name: 'Cases', slug: 'cases', isLeaf: true, shape: 'pill', color: '#6366f1' },
        { id: 'lanyards', name: 'Lanyards', slug: 'lanyards', isLeaf: true, shape: 'small-rect', color: '#8b5cf6' },
        { id: 'cartridges', name: 'Cartridges', slug: 'cartridges', isLeaf: true, shape: 'circle', color: '#a855f7' },
      ],
    },
  ],
};

// Helper function to find a category by ID
export function findCategoryById(category: Category, id: string): Category | null {
  if (category.id === id) return category;
  if (category.children) {
    for (const child of category.children) {
      const found = findCategoryById(child, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper function to get breadcrumb path
export function getCategoryPath(category: Category, targetId: string, path: Category[] = []): Category[] | null {
  if (category.id === targetId) return [...path, category];
  if (category.children) {
    for (const child of category.children) {
      const result = getCategoryPath(child, targetId, [...path, category]);
      if (result) return result;
    }
  }
  return null;
}

// Helper to check if a category has children
export function hasChildren(category: Category): boolean {
  return !!(category.children && category.children.length > 0);
}
