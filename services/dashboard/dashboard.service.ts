import { createClient } from "@/lib/supabase/client";

export interface DashboardMetrics {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalUnits: number;
  lowStockProducts: number;
  inventoryCostValue: number;
  inventorySaleValue: number;
  potentialProfit: number;
}

interface ProductInventoryValue {
  stock: number | string;
  min_stock: number | string;
  purchase_price: number | string;
  sale_price: number | string;
}

const supabase = createClient();

async function getExactCount(table: string): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) throw error;

  return count ?? 0;
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const [
      totalProducts,
      totalCategories,
      totalBrands,
      totalUnits,
      productsResult,
    ] = await Promise.all([
      getExactCount("products"),
      getExactCount("categories"),
      getExactCount("brands"),
      getExactCount("units"),
      supabase
        .from("products")
        .select("stock, min_stock, purchase_price, sale_price")
        .eq("is_active", true),
    ]);

    if (productsResult.error) {
      throw productsResult.error;
    }

    const products =
      (productsResult.data as ProductInventoryValue[] | null) ?? [];

    const lowStockProducts = products.filter(
      (product) =>
        Number(product.stock) <= Number(product.min_stock)
    ).length;

    const inventoryCostValue = products.reduce(
      (total, product) =>
        total +
        Number(product.stock) * Number(product.purchase_price),
      0
    );

    const inventorySaleValue = products.reduce(
      (total, product) =>
        total + Number(product.stock) * Number(product.sale_price),
      0
    );

    return {
      totalProducts,
      totalCategories,
      totalBrands,
      totalUnits,
      lowStockProducts,
      inventoryCostValue,
      inventorySaleValue,
      potentialProfit: inventorySaleValue - inventoryCostValue,
    };
  },
};