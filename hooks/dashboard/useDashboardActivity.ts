"use client";

import { useCallback, useEffect, useState } from "react";

import {
  dashboardService,
  LatestPurchase,
  LatestSale,
  TopSellingProduct,
} from "@/services/dashboard/dashboard.service";

export function useDashboardActivity() {
  const [sales, setSales] = useState<LatestSale[]>([]);
  const [purchases, setPurchases] = useState<LatestPurchase[]>([]);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [salesData, purchasesData, productsData] =
        await Promise.all([
          dashboardService.getLatestSales(),
          dashboardService.getLatestPurchases(),
          dashboardService.getTopSellingProducts(),
        ]);

      setSales(salesData);
      setPurchases(purchasesData);
      setTopProducts(productsData);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudo cargar la actividad reciente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    sales,
    purchases,
    topProducts,
    loading,
    error,
    reload: load,
  };
}