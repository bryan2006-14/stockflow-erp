"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/inventory";
import { productService } from "@/services/inventory/product.service";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    products,
    loading,
    reload: load,
  };
}