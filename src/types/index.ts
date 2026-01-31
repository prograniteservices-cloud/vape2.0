// Category Tree Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  children?: Category[];
  isLeaf?: boolean;
  color?: string;
  shape?: 'small-rect' | 'medium-rect' | 'large-rect' | 'circle' | 'pill';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryPath: string[];
  brand?: string;
  flavor?: string;
  hits?: number;
  color?: string;
  inStock: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
