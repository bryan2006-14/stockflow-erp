"use client";

import { useCallback, useEffect, useState } from "react";

import {
  CommercialMetrics,
  dashboardService,
  MonthlyCommercialData,
} from "@/services/dashboard/dashboard.service";

const initialMetrics: CommercialMetrics = {
  salesToday: 0,
  salesThisMonth: 0,
  purchasesThisMonth: 0,
  totalCustomers: 0,
  totalSuppliers: 0,
  monthlyProfit: 0,
};

export function useCommercialDashboard() {
  const [metrics, setMetrics] =
    useState<CommercialMetrics>(initialMetrics);

  const [chartData, setChartData] = useState<
    MonthlyCommercialData[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [metricsData, monthlyData] =
        await Promise.all([
          dashboardService.getCommercialMetrics(),
          dashboardService.getMonthlyCommercialData(),
        ]);

      setMetrics(metricsData);
      setChartData(monthlyData);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudo cargar el dashboard comercial.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    metrics,
    chartData,
    loading,
    error,
    reload: load,
  };
}