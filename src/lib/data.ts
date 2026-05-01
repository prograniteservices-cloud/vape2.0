import { Category, Product } from '@/types';
import inventoryData from '../data/inventory.json';

type InventoryItem = {
    name?: string;
    price?: number | string;
    category?: string;
    description?: string;
    image?: string;
};

export const categoryTree: Category = {
  id: 'root',
  name: 'All Products',
  slug: 'all',
  children: [
    { id: 'vapes', name: 'Vapes', slug: 'vapes', description: 'Disposable and rechargeable vape devices', color: '#8b5cf6', shape: 'circle' },
    { id: 'cigarettes', name: 'Cigarettes', slug: 'cigarettes', description: 'Premium tobacco brands', color: '#ef4444', shape: 'medium-rect' },
    { id: 'lighters-torches', name: 'Lighters & Torches', slug: 'lighters-torches', description: 'Reliable fire starters', color: '#f59e0b', shape: 'small-rect' },
    { id: 'smoking-accessories', name: 'Smoking Accessories', slug: 'smoking-accessories', description: 'Rolling papers, filters, and more', color: '#10b981', shape: 'pill' },
    { id: 'adult-novelties', name: 'Adult Novelties', slug: 'adult-novelties', description: 'Premium lifestyle products', color: '#ec4899', shape: 'large-rect' },
    { id: 'vape-devices', name: 'Vape Devices', slug: 'vape-devices', description: 'Advanced mods and pods', color: '#3b82f6', shape: 'medium-rect' },
    { id: 'candy-snacks', name: 'Candy & Snacks', slug: 'candy-snacks', description: 'Sweet treats and quick bites', color: '#fbbf24', shape: 'circle' },
    { id: 'cbd-delta', name: 'CBD & Delta', slug: 'cbd-delta', description: 'Hemp-derived wellness products', color: '#14b8a6', shape: 'large-rect' },
    { id: 'cigars', name: 'Cigars', slug: 'cigars', description: 'Exquisite hand-rolled cigars', color: '#78716c', shape: 'medium-rect' },
    { id: 'chewing-tobacco', name: 'Chewing Tobacco', slug: 'chewing-tobacco', description: 'Traditional smokeless tobacco', color: '#4b5563', shape: 'small-rect' },
    { id: 'pipe-tobacco', name: 'Pipe Tobacco', slug: 'pipe-tobacco', description: 'Loose tobacco and pipe blends', color: '#92400e', shape: 'small-rect' },
    { id: 'hookah-shisha', name: 'Hookah & Shisha', slug: 'hookah-shisha', description: 'Hookah tobacco, shisha flavors, and supplies', color: '#0f766e', shape: 'large-rect' },
    { id: 'e-liquids', name: 'E-Liquids', slug: 'e-liquids', description: 'Premium flavors for every device', color: '#06b6d4', shape: 'pill' },
    { id: 'glassware', name: 'Glassware', slug: 'glassware', description: 'Artisan pipes and bongs', color: '#a855f7', shape: 'circle' },
    { id: 'beverages', name: 'Beverages', slug: 'beverages', description: 'Drinks, energy drinks, and bottled beverages', color: '#0284c7', shape: 'pill' },
    { id: 'miscellaneous', name: 'Miscellaneous', slug: 'miscellaneous', description: 'General store items', color: '#6b7280', shape: 'medium-rect' },
  ],
};

// Robust mapping with case-insensitive matching
export const rawCategoryMap: Record<string, string> = {
    'vapes': 'vapes',
    'cigarettes': 'cigarettes',
    'lighters & torches': 'lighters-torches',
    'smoking accessories': 'smoking-accessories',
    'adult novelties': 'adult-novelties',
    'vape devices': 'vape-devices',
    'candy & snacks': 'candy-snacks',
    'cbd & delta': 'cbd-delta',
    'cigars': 'cigars',
    'chewing tobacco': 'chewing-tobacco',
    'pipe tobacco': 'pipe-tobacco',
    'hookah & shisha': 'hookah-shisha',
    'e-liquids': 'e-liquids',
    'glassware': 'glassware',
    'beverages': 'beverages',
    'miscellaneous': 'miscellaneous',
    'all items': 'root'
};

export function categoryNameToId(categoryName: string | null | undefined): string {
    const normalized = String(categoryName || '').trim().toLowerCase();
    return rawCategoryMap[normalized] || 'miscellaneous';
}

export function getCategoryFallbackImage(categoryId: string): string {
    const imageMap: Record<string, string> = {
        'vapes': '/assets/categories/vapes.png',
        'vape-devices': '/assets/categories/vape_devices.png',
        'cigarettes': '/assets/categories/cigarettes.png',
        'lighters-torches': '/assets/categories/lighters_torches.png',
        'smoking-accessories': '/assets/categories/smoking_accessories.png',
        'adult-novelties': '/assets/categories/adult_novelties.png',
        'candy-snacks': '/assets/categories/candy_snacks.png',
        'cbd-delta': '/assets/categories/cbd_delta.png',
        'cigars': '/assets/categories/cigars.png',
        'e-liquids': '/assets/categories/e_liquids.png',
        'glassware': '/assets/categories/glassware.png',
        'miscellaneous': '/assets/categories/miscellaneous.png',
    };

    return imageMap[categoryId] || '/assets/categories/miscellaneous.png';
}

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

// Map inventory items to Product type with safe parsing
export const products: Product[] = (inventoryData as InventoryItem[]).map((item, index) => {
    // Robust category matching
    const rawCategory = String(item.category || '').trim().toLowerCase();
    const categoryId = rawCategoryMap[rawCategory] || 'miscellaneous';
    
    // Improved price parsing
    let price = 0;
    if (typeof item.price === 'number') {
        price = item.price;
    } else if (typeof item.price === 'string') {
        price = parseFloat(item.price.replace(/[$,]/g, '')) || 0;
    }

    return {
        id: `prod-${index}`,
        name: String(item.name || 'Unknown Product').trim(),
        description: item.description || `High-quality ${item.name || 'product'} from our collection.`,
        price: price,
        imageUrl: item.image || getCategoryFallbackImage(categoryId),
        categoryPath: [categoryId],
        inStock: true,
        organization_id: 'default-shop',
        stock: 15,
        updated_at: new Date().toISOString(),
        nicotine: undefined,
        hits: undefined,
    };
});


export function getProductsByCategory(categoryId: string): Product[] {
  if (!categoryId || categoryId === 'root') return products || [];
  if (!Array.isArray(products)) return [];
  
  return products.filter(product => {
    if (!product || !product.categoryPath) return false;
    return Array.isArray(product.categoryPath) && product.categoryPath.includes(categoryId);
  });
}
