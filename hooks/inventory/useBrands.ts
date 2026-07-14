"use client";

import { useEffect, useState } from "react";
import { Brand } from "@/types/inventory";
import { brandService } from "@/services/inventory/brand.service";

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await brandService.getAll();
      setBrands(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    brands,
    loading,
    reload: load,
  };
}