"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DashboardMetrics,
  dashboardService,
} from "@/services/dashboard/dashboard.service";

const initialMetrics: DashboardMetrics = {
  totalProducts: 0,
  totalCategories: 0,
  totalBrands: 0,
  totalUnits: 0,
  lowStockProducts: 0,
  inventoryCostValue: 0,
  inventorySaleValue: 0,
  potentialProfit: 0,
};

export function useDashboardMetrics() {
  const [metrics, setMetrics] =
    useState<DashboardMetrics>(initialMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getMetrics();
      setMetrics(data);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudieron cargar las métricas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  return {
    metrics,
    loading,
    error,
    reload: loadMetrics,
  };
}