"use client";

import {
  Banknote,
  CircleDollarSign,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

import { useCommercialDashboard } from "@/hooks/dashboard/useCommercialDashboard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function CommercialMetrics() {
  const { metrics, loading, error } =
    useCommercialDashboard();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <DashboardCard
        title="Ventas de hoy"
        value={currencyFormatter.format(
          metrics.salesToday
        )}
        description="Ingresos registrados hoy"
        icon={<Banknote className="h-5 w-5" />}
      />

      <DashboardCard
        title="Ventas del mes"
        value={currencyFormatter.format(
          metrics.salesThisMonth
        )}
        description="Ventas completadas este mes"
        icon={
          <CircleDollarSign className="h-5 w-5" />
        }
      />

      <DashboardCard
        title="Compras del mes"
        value={currencyFormatter.format(
          metrics.purchasesThisMonth
        )}
        description="Inversión en inventario"
        icon={<ShoppingBag className="h-5 w-5" />}
      />

      <DashboardCard
        title="Resultado mensual"
        value={currencyFormatter.format(
          metrics.monthlyProfit
        )}
        description="Ventas menos compras"
        icon={<TrendingUp className="h-5 w-5" />}
      />

      <DashboardCard
        title="Clientes"
        value={String(metrics.totalCustomers)}
        description="Clientes activos"
        icon={<Users className="h-5 w-5" />}
      />

      <DashboardCard
        title="Proveedores"
        value={String(metrics.totalSuppliers)}
        description="Proveedores activos"
        icon={<Truck className="h-5 w-5" />}
      />
    </div>
  );
}
