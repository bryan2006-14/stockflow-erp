import { createClient } from "@/lib/supabase/client";

import {
  CreateStockMovement,
  StockMovement,
} from "@/types/inventory";

const supabase = createClient();

export const stockMovementService = {
  async getAll(): Promise<StockMovement[]> {
    const { data, error } = await supabase
      .from("stock_movements")
      .select(`
        id,
        company_id,
        product_id,
        user_id,
        movement_type,
        quantity,
        previous_stock,
        new_stock,
        reason,
        reference,
        created_at,
        products (
          name,
          sku
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((movement) => ({
      ...movement,
      quantity: Number(movement.quantity),
      previous_stock: Number(movement.previous_stock),
      new_stock: Number(movement.new_stock),
      products: Array.isArray(movement.products)
        ? movement.products[0] ?? null
        : movement.products,
    })) as StockMovement[];
  },

  async create(values: CreateStockMovement): Promise<void> {
    const { error } = await supabase.rpc(
      "register_stock_movement",
      {
        p_product_id: values.productId,
        p_movement_type: values.movementType,
        p_quantity: values.quantity,
        p_reason: values.reason?.trim() || null,
        p_reference: values.reference?.trim() || null,
      }
    );

    if (error) {
      throw error;
    }
  },
};