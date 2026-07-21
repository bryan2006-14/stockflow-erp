import { createClient } from "@/lib/supabase/client";

export interface ReportSummary {
  salesTotal: number;
  purchasesTotal: number;
  profit: number;
  salesCount: number;
  purchasesCount: number;
  averageSale: number;
}

export interface MonthlyReport {
  month: string;
  sales: number;
  purchases: number;
  profit: number;
}

export interface BestSellingProduct {
  productId: string | null;
  name: string;
  sku: string;
  quantity: number;
  total: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
}

function getCurrentYearRange() {
  const year = new Date().getFullYear();

  return {
    start: `${year}-01-01T00:00:00.000Z`,
    end: `${year + 1}-01-01T00:00:00.000Z`,
  };
}

function getMonthName(monthIndex: number) {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  return months[monthIndex];
}

export const reportService = {
  async getSummary(): Promise<ReportSummary> {
    const supabase = createClient();

    const { start, end } = getCurrentYearRange();

    const [salesResult, purchasesResult] = await Promise.all([
      supabase
        .from("sales")
        .select("id, total, created_at")
        .eq("status", "completed")
        .gte("created_at", start)
        .lt("created_at", end),

      supabase
        .from("purchases")
        .select("id, total, created_at")
        .eq("status", "completed")
        .gte("created_at", start)
        .lt("created_at", end),
    ]);

    if (salesResult.error) {
      throw salesResult.error;
    }

    if (purchasesResult.error) {
      throw purchasesResult.error;
    }

    const sales = salesResult.data ?? [];
    const purchases = purchasesResult.data ?? [];

    const salesTotal = sales.reduce(
      (total, sale) => total + Number(sale.total ?? 0),
      0
    );

    const purchasesTotal = purchases.reduce(
      (total, purchase) => total + Number(purchase.total ?? 0),
      0
    );

    return {
      salesTotal,
      purchasesTotal,
      profit: salesTotal - purchasesTotal,
      salesCount: sales.length,
      purchasesCount: purchases.length,
      averageSale: sales.length > 0 ? salesTotal / sales.length : 0,
    };
  },

  async getMonthlyReport(): Promise<MonthlyReport[]> {
    const supabase = createClient();

    const { start, end } = getCurrentYearRange();

    const [salesResult, purchasesResult] = await Promise.all([
      supabase
        .from("sales")
        .select("total, created_at")
        .eq("status", "completed")
        .gte("created_at", start)
        .lt("created_at", end),

      supabase
        .from("purchases")
        .select("total, created_at")
        .eq("status", "completed")
        .gte("created_at", start)
        .lt("created_at", end),
    ]);

    if (salesResult.error) {
      throw salesResult.error;
    }

    if (purchasesResult.error) {
      throw purchasesResult.error;
    }

    const report: MonthlyReport[] = Array.from(
      { length: 12 },
      (_, monthIndex) => ({
        month: getMonthName(monthIndex),
        sales: 0,
        purchases: 0,
        profit: 0,
      })
    );

    for (const sale of salesResult.data ?? []) {
      const monthIndex = new Date(sale.created_at).getMonth();

      report[monthIndex].sales += Number(sale.total ?? 0);
    }

    for (const purchase of purchasesResult.data ?? []) {
      const monthIndex = new Date(purchase.created_at).getMonth();

      report[monthIndex].purchases += Number(
        purchase.total ?? 0
      );
    }

    return report.map((item) => ({
      ...item,
      profit: item.sales - item.purchases,
    }));
  },

  async getBestSellingProducts(): Promise<BestSellingProduct[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("sale_items")
      .select(`
        product_id,
        product_name,
        product_sku,
        quantity,
        subtotal,
        sales!inner (
          status
        )
      `)
      .eq("sales.status", "completed");

    if (error) {
      throw error;
    }

    const groupedProducts = new Map<string, BestSellingProduct>();

    for (const item of data ?? []) {
      const key =
        item.product_id ??
        item.product_sku ??
        item.product_name;

      const currentProduct = groupedProducts.get(key);

      if (currentProduct) {
        currentProduct.quantity += Number(item.quantity ?? 0);
        currentProduct.total += Number(item.subtotal ?? 0);
      } else {
        groupedProducts.set(key, {
          productId: item.product_id,
          name: item.product_name,
          sku: item.product_sku,
          quantity: Number(item.quantity ?? 0),
          total: Number(item.subtotal ?? 0),
        });
      }
    }

    return Array.from(groupedProducts.values())
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 10);
  },

  async getLowStockProducts(): Promise<LowStockProduct[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("products")
      .select("id, name, sku, stock, min_stock")
      .eq("is_active", true)
      .order("stock", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? [])
      .filter(
        (product) =>
          Number(product.stock ?? 0) <=
          Number(product.min_stock ?? 0)
      )
      .slice(0, 10)
      .map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock: Number(product.stock ?? 0),
        minStock: Number(product.min_stock ?? 0),
      }));
  },
};