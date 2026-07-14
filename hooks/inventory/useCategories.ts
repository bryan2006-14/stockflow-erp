"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/inventory";
import { categoryService } from "@/services/inventory/category.service";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    categories,
    loading,
    reload: load,
  };
}