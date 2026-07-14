"use client";

import { useEffect, useState } from "react";
import { Unit } from "@/types/inventory";
import { unitService } from "@/services/inventory/unit.service";

export function useUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await unitService.getAll();
      setUnits(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    units,
    loading,
    reload: load,
  };
}