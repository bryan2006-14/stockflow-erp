"use client";

import { useCallback, useEffect, useState } from "react";

import { StockMovement } from "@/types/inventory";
import { stockMovementService } from "@/services/inventory/stock-movement.service";

export function useStockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await stockMovementService.getAll();
      setMovements(data);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudieron cargar los movimientos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    movements,
    loading,
    error,
    reload: load,
  };
}