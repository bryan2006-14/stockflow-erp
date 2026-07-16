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

async getLatestSales(): Promise<LatestSale[]> {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      id,
      sale_number,
      total,
      created_at,
      customers (
        first_name,
        last_name,
        business_name
      )
    `)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  return (data ?? []).map((sale) => ({
    ...sale,
    total: Number(sale.total),
    customers: Array.isArray(sale.customers)
      ? sale.customers[0] ?? null
      : sale.customers,
  })) as LatestSale[];
},

async getLatestPurchases(): Promise<LatestPurchase[]> {
  const { data, error } = await supabase
    .from("purchases")
    .select(`
      id,
      purchase_number,
      total,
      created_at,
      suppliers (
        business_name
      )
    `)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  return (data ?? []).map((purchase) => ({
    ...purchase,
    total: Number(purchase.total),
    suppliers: Array.isArray(purchase.suppliers)
      ? purchase.suppliers[0] ?? null
      : purchase.suppliers,
  })) as LatestPurchase[];
},

async getTopSellingProducts(): Promise<TopSellingProduct[]> {
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

  if (error) throw error;

  const grouped = new Map<string, TopSellingProduct>();

  for (const item of data ?? []) {
    const key = item.product_id ?? item.product_sku;
    const current = grouped.get(key);

    if (current) {
      current.quantity += Number(item.quantity);
      current.total += Number(item.subtotal);
    } else {
      grouped.set(key, {
        product_id: item.product_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        quantity: Number(item.quantity),
        total: Number(item.subtotal),
      });
    }
  }

  return Array.from(grouped.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
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


export interface LatestSale {
  id: string;
  sale_number: string;
  total: number;
  created_at: string;
  customers: {
    first_name: string;
    last_name: string | null;
    business_name: string | null;
  } | null;
}

export interface LatestPurchase {
  id: string;
  purchase_number: string;
  total: number;
  created_at: string;
  suppliers: {
    business_name: string;
  } | null;
}

export interface TopSellingProduct {
  product_id: string | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  total: number;
}