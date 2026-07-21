"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BestSellingProduct,
  LowStockProduct,
  MonthlyReport,
  ReportSummary,
  reportService,
} from "@/services/reports/report.service";

const initialSummary: ReportSummary = {
  salesTotal: 0,
  purchasesTotal: 0,
  profit: 0,
  salesCount: 0,
  purchasesCount: 0,
  averageSale: 0,
};

export function useReports() {
  const [summary, setSummary] =
    useState<ReportSummary>(initialSummary);

  const [monthlyReport, setMonthlyReport] = useState<
    MonthlyReport[]
  >([]);

  const [bestSellingProducts, setBestSellingProducts] =
    useState<BestSellingProduct[]>([]);

  const [lowStockProducts, setLowStockProducts] = useState<
    LowStockProduct[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        summaryData,
        monthlyData,
        bestProductsData,
        lowStockData,
      ] = await Promise.all([
        reportService.getSummary(),
        reportService.getMonthlyReport(),
        reportService.getBestSellingProducts(),
        reportService.getLowStockProducts(),
      ]);

      setSummary(summaryData);
      setMonthlyReport(monthlyData);
      setBestSellingProducts(bestProductsData);
      setLowStockProducts(lowStockData);
    } catch (requestError) {
      console.error("Error loading reports:", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudieron cargar los reportes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  return {
    summary,
    monthlyReport,
    bestSellingProducts,
    lowStockProducts,
    loading,
    error,
    reload: loadReports,
  };
}