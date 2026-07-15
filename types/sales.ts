export type PaymentMethod =
  | "cash"
  | "card"
  | "transfer"
  | "yape"
  | "plin"
  | "credit";

export type SaleStatus = "draft" | "completed" | "cancelled";

export interface SaleCartItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  stock: number;
}

export interface RegisterSaleInput {
  customerId: string | null;
  paymentMethod: PaymentMethod;
  discount: number;
  tax: number;
  notes: string;
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface Sale {
  id: string;
  company_id: string;
  customer_id: string | null;
  user_id: string | null;
  sale_number: string;
  status: SaleStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaleWithCustomer extends Sale {
  customers?: {
    first_name: string;
    last_name: string | null;
    business_name: string | null;
    document_number: string | null;
  } | null;
}