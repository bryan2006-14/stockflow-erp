import { createClient } from "@/lib/supabase/client";
import {
  RegisterSaleInput,
  Sale,
  SaleWithCustomer,
} from "@/types/sales";

const supabase = createClient();

export const saleService = {
  async register(values: RegisterSaleInput): Promise<Sale> {
    const { data, error } = await supabase.rpc("register_sale", {
      p_customer_id: values.customerId,
      p_payment_method: values.paymentMethod,
      p_discount: values.discount,
      p_tax: values.tax,
      p_notes: values.notes.trim() || null,
      p_items: values.items,
    });

    if (error) {
      throw error;
    }

    return data as Sale;
  },

  async getAll(): Promise<SaleWithCustomer[]> {
    const { data, error } = await supabase
      .from("sales")
      .select(`
        *,
        customers (
          first_name,
          last_name,
          business_name,
          document_number
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((sale) => ({
      ...sale,
      subtotal: Number(sale.subtotal),
      discount: Number(sale.discount),
      tax: Number(sale.tax),
      total: Number(sale.total),
      customers: Array.isArray(sale.customers)
        ? sale.customers[0] ?? null
        : sale.customers,
    })) as SaleWithCustomer[];
  },

  async cancel(id: string): Promise<void> {
    const { error } = await supabase
      .from("sales")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw error;
    }
  },
};