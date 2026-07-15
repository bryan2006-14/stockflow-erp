"use client";

import { useCallback, useEffect, useState } from "react";

import { Customer } from "@/types/inventory";
import { customerService } from "@/services/customers/customer.service";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (requestError) {
      console.error(requestError);
      setError("No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    customers,
    loading,
    error,
    reload: load,
  };
}