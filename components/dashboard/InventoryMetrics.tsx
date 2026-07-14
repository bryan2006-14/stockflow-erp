"use client";

import {
  AlertTriangle,
  Boxes,
  DollarSign,
  FolderTree,
  PackageCheck,
  Ruler,
  Tags,
  TrendingUp,
} from "lucide-react";

import { useDashboardMetrics } from "@/hooks/dashboard/useDashboardMetrics";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

export function InventoryMetrics() {
  const { metrics, loading, error } = useDashboardMetrics();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl border bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Productos"
        value={String(metrics.totalProducts)}
        description="Productos registrados"
        icon={<Boxes className="h-5 w-5 text-primary" />}
      />

      <DashboardCard
        title="Categorías"
        value={String(metrics.totalCategories)}
        description="Categorías disponibles"
        icon={<FolderTree className="h-5 w-5 text-primary" />}
      />

      <DashboardCard
        title="Marcas"
        value={String(metrics.totalBrands)}
        description="Marcas registradas"
        icon={<Tags className="h-5 w-5 text-primary" />}
      />

      <DashboardCard
        title="Unidades"
        value={String(metrics.totalUnits)}
        description="Unidades de medida"
        icon={<Ruler className="h-5 w-5 text-primary" />}
      />

      <DashboardCard
        title="Stock bajo"
        value={String(metrics.lowStockProducts)}
        description="Productos que requieren atención"
        icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
      />

      <DashboardCard
        title="Costo del inventario"
        value={currencyFormatter.format(metrics.inventoryCostValue)}
        description="Valor según precio de compra"
        icon={<DollarSign className="h-5 w-5 text-primary" />}
      />

      <DashboardCard
        title="Valor de venta"
        value={currencyFormatter.format(metrics.inventorySaleValue)}
        description="Valor potencial del inventario"
        icon={<PackageCheck className="h-5 w-5 text-primary" />}
      />

      <DashboardCard
        title="Ganancia potencial"
        value={currencyFormatter.format(metrics.potentialProfit)}
        description="Venta estimada menos costo"
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
      />
    </div>
  );
}