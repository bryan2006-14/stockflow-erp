"use client";

import { useCallback, useEffect, useState } from "react";

import { PurchaseWithSupplier } from "@/types/purchases";
import { purchaseService } from "@/services/purchases/purchase.service";

export function usePurchases() {
  const [purchases, setPurchases] = useState<
    PurchaseWithSupplier[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await purchaseService.getAll();
      setPurchases(data);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudieron cargar las compras.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    purchases,
    loading,
    error,
    reload: load,
  };
}