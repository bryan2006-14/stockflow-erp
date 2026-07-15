export type PurchasePaymentMethod =
  | "cash"
  | "card"
  | "transfer"
  | "credit";

export type PurchaseStatus =
  | "draft"
  | "completed"
  | "cancelled";

export interface PurchaseCartItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitCost: number;
  currentStock: number;
}

export interface RegisterPurchaseInput {
  supplierId: string | null;
  paymentMethod: PurchasePaymentMethod;
  discount: number;
  tax: number;
  notes: string;
  items: Array<{
    product_id: string;
    quantity: number;
    unit_cost: number;
  }>;
}

export interface Purchase {
  id: string;
  company_id: string;
  supplier_id: string | null;
  user_id: string | null;
  purchase_number: string;
  status: PurchaseStatus;
  payment_method: PurchasePaymentMethod;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseWithSupplier extends Purchase {
  suppliers?: {
    business_name: string;
    document_number: string | null;
    contact_name: string | null;
  } | null;
}