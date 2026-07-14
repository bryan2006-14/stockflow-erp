export interface Category {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Brand {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Unit {
  id: string;
  company_id: string;
  name: string;
  abbreviation: string;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  category_id: string | null;
  brand_id: string | null;
  unit_id: string | null;
  sku: string;
  name: string;
  description: string | null;
  image_url: string | null;
  purchase_price: number;
  sale_price: number;
  stock: number;
  min_stock: number;
  is_active: boolean;
  created_at: string;
}

export type StockMovementType =
  | "initial"
  | "purchase"
  | "sale"
  | "entry"
  | "exit"
  | "adjustment";

export interface StockMovement {
  id: string;
  company_id: string;
  product_id: string;
  user_id: string | null;
  movement_type: StockMovementType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string | null;
  reference: string | null;
  created_at: string;

  products?: {
    name: string;
    sku: string;
  } | null;
}

export interface CreateStockMovement {
  productId: string;
  movementType: "entry" | "exit";
  quantity: number;
  reason?: string;
  reference?: string;
}