import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  limit 
} from 'firebase/firestore';
import { Product } from '@/types';

const PRODUCTS_COLLECTION = 'products';

/**
 * Fetch products for a specific organization (shop)
 * @param organizationId The unique ID of the shop
 */
export async function getInventory(organizationId: string): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION), 
    where('organization_id', '==', organizationId)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Product));
}

/**
 * Find a product by barcode for a specific organization
 */
export async function getProductByBarcode(organizationId: string, barcode: string): Promise<Product | null> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    where('organization_id', '==', organizationId),
    where('barcode', '==', barcode),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Product;
}

/**
 * Update stock level for a product
 */
export async function updateStock(productId: string, newStock: number) {
  const productRef = doc(db, PRODUCTS_COLLECTION, productId);
  await updateDoc(productRef, {
    stock: newStock,
    updated_at: new Date().toISOString()
  });
}
