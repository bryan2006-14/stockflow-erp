"use client";

import { useCallback, useEffect, useState } from "react";

import { SaleWithCustomer } from "@/types/sales";
import { saleService } from "@/services/sales/sale.service";

export function useSales() {
  const [sales, setSales] = useState<SaleWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await saleService.getAll();
      setSales(data);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudieron cargar las ventas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    sales,
    loading,
    error,
    reload: load,
  };
}