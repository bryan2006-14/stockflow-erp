"use client";

import { useCallback, useEffect, useState } from "react";

import { Supplier } from "@/types/inventory";
import { supplierService } from "@/services/suppliers/supplier.service";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudieron cargar los proveedores.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    suppliers,
    loading,
    error,
    reload: load,
  };
}
