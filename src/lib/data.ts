import { Category, Product } from '@/types';
import inventoryData from '../data/inventory.json';

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
    { id: 'e-liquids', name: 'E-Liquids', slug: 'e-liquids', description: 'Premium flavors for every device', color: '#06b6d4', shape: 'pill' },
    { id: 'glassware', name: 'Glassware', slug: 'glassware', description: 'Artisan pipes and bongs', color: '#a855f7', shape: 'circle' },
    { id: 'miscellaneous', name: 'Miscellaneous', slug: 'miscellaneous', description: 'General store items', color: '#6b7280', shape: 'medium-rect' },
  ],
};

const categoryMap: Record<string, string> = {
    'Vapes': 'vapes',
    'Cigarettes': 'cigarettes',
    'Lighters & Torches': 'lighters-torches',
    'Smoking Accessories': 'smoking-accessories',
    'Adult Novelties': 'adult-novelties',
    'Vape Devices': 'vape-devices',
    'Candy & Snacks': 'candy-snacks',
    'CBD & Delta': 'cbd-delta',
    'Cigars': 'cigars',
    'Chewing Tobacco': 'chewing-tobacco',
    'E-Liquids': 'e-liquids',
    'Glassware': 'glassware',
    'Miscellaneous': 'miscellaneous',
    'All Items': 'root'
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

// Map inventory items to Product type
export const products: Product[] = (inventoryData as any[]).map((item, index) => {
    const categoryId = categoryMap[item.category] || 'miscellaneous';
    const priceStr = typeof item.price === 'string' ? item.price.replace('$', '') : String(item.price || '0');
    const price = parseFloat(priceStr) || 0;

    return {
        id: `prod-${index}`,
        name: item.name || 'Unknown Product',
        description: item.description || `High-quality ${item.name || 'product'} from the ${item.category || 'miscellaneous'} collection.`,
        price: price,
        imageUrl: item.image || '',
        categoryPath: [categoryId],
        inStock: true,
        organization_id: 'default-shop',
        stock: 15,
        updated_at: new Date().toISOString()
    };
});

export function getProductsByCategory(categoryId: string): Product[] {
  if (categoryId === 'root') return products;
  return products.filter(product => product.categoryPath.includes(categoryId));
}