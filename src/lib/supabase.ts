import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e Anon Key são obrigatórios');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  image_url: string;
  specifications: Record<string, string>;
  rating: number;
  reviews_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  shipping_address: Record<string, string>;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Seller {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  approved: boolean;
  commission_rate: number;
  created_at: string;
}
