import { createClient } from "@/lib/supabase/client";

export interface CommercialMetrics {
  salesToday: number;
  salesThisMonth: number;
  purchasesThisMonth: number;
  totalCustomers: number;
  totalSuppliers: number;
  monthlyProfit: number;
}

export interface MonthlyCommercialData {
  month: string;
  sales: number;
  purchases: number;
}

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

async getCommercialMetrics(): Promise<CommercialMetrics> {
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString();

  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  const [
    salesTodayResult,
    monthlySalesResult,
    monthlyPurchasesResult,
    customersResult,
    suppliersResult,
  ] = await Promise.all([
    supabase
      .from("sales")
      .select("total")
      .eq("status", "completed")
      .gte("created_at", todayStart),

    supabase
      .from("sales")
      .select("total")
      .eq("status", "completed")
      .gte("created_at", monthStart),

    supabase
      .from("purchases")
      .select("total")
      .eq("status", "completed")
      .gte("created_at", monthStart),

    supabase
      .from("customers")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("is_active", true),

    supabase
      .from("suppliers")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("is_active", true),
  ]);

  const errors = [
    salesTodayResult.error,
    monthlySalesResult.error,
    monthlyPurchasesResult.error,
    customersResult.error,
    suppliersResult.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    throw errors[0];
  }

  const salesToday = (salesTodayResult.data ?? []).reduce(
    (total, sale) => total + Number(sale.total),
    0
  );

  const salesThisMonth = (
    monthlySalesResult.data ?? []
  ).reduce(
    (total, sale) => total + Number(sale.total),
    0
  );

  const purchasesThisMonth = (
    monthlyPurchasesResult.data ?? []
  ).reduce(
    (total, purchase) => total + Number(purchase.total),
    0
  );

  return {
    salesToday,
    salesThisMonth,
    purchasesThisMonth,
    totalCustomers: customersResult.count ?? 0,
    totalSuppliers: suppliersResult.count ?? 0,
    monthlyProfit: salesThisMonth - purchasesThisMonth,
  };
},

async getMonthlyCommercialData(): Promise<MonthlyCommercialData[]> {
  const now = new Date();

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - 5,
    1
  );

  const [salesResult, purchasesResult] = await Promise.all([
    supabase
      .from("sales")
      .select("total, created_at")
      .eq("status", "completed")
      .gte("created_at", startDate.toISOString()),

    supabase
      .from("purchases")
      .select("total, created_at")
      .eq("status", "completed")
      .gte("created_at", startDate.toISOString()),
  ]);

  if (salesResult.error) throw salesResult.error;
  if (purchasesResult.error) throw purchasesResult.error;

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    );

    const month = new Intl.DateTimeFormat("es-PE", {
      month: "short",
    }).format(date);

    const sales = (salesResult.data ?? [])
      .filter((sale) => {
        const saleDate = new Date(sale.created_at);

        return (
          saleDate.getMonth() === date.getMonth() &&
          saleDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce(
        (total, sale) => total + Number(sale.total),
        0
      );

    const purchases = (purchasesResult.data ?? [])
      .filter((purchase) => {
        const purchaseDate = new Date(
          purchase.created_at
        );

        return (
          purchaseDate.getMonth() === date.getMonth() &&
          purchaseDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce(
        (total, purchase) =>
          total + Number(purchase.total),
        0
      );

    return {
      month,
      sales,
      purchases,
    };
  });
},

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