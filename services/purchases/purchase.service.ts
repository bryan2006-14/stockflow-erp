import { createClient } from "@/lib/supabase/client";

import {
  Purchase,
  PurchaseWithSupplier,
  RegisterPurchaseInput,
} from "@/types/purchases";

const supabase = createClient();

export const purchaseService = {
  async register(
    values: RegisterPurchaseInput
  ): Promise<Purchase> {
    const { data, error } = await supabase.rpc(
      "register_purchase",
      {
        p_supplier_id: values.supplierId,
        p_payment_method: values.paymentMethod,
        p_discount: values.discount,
        p_tax: values.tax,
        p_notes: values.notes.trim() || null,
        p_items: values.items,
      }
    );

    if (error) {
      throw error;
    }

    return data as Purchase;
  },

  async getAll(): Promise<PurchaseWithSupplier[]> {
    const { data, error } = await supabase
      .from("purchases")
      .select(`
        *,
        suppliers (
          business_name,
          document_number,
          contact_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((purchase) => ({
      ...purchase,
      subtotal: Number(purchase.subtotal),
      discount: Number(purchase.discount),
      tax: Number(purchase.tax),
      total: Number(purchase.total),
      suppliers: Array.isArray(purchase.suppliers)
        ? purchase.suppliers[0] ?? null
        : purchase.suppliers,
    })) as PurchaseWithSupplier[];
  },
};