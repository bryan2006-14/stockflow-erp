import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CommercialMetrics } from "@/components/dashboard/CommercialMetrics";
import { InventoryMetrics } from "@/components/dashboard/InventoryMetrics";
import { LatestPurchases } from "@/components/dashboard/LatestPurchases";
import { LatestSales } from "@/components/dashboard/LatestSales";
import { LowStockTable } from "@/components/dashboard/LowStockTable";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProducts } from "@/components/dashboard/TopProducts";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            Resumen comercial
          </h2>

          <p className="text-sm text-muted-foreground">
            Rendimiento general de ventas y compras.
          </p>
        </div>

        <CommercialMetrics />
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>

        <LowStockTable />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LatestSales />
        <LatestPurchases />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InventoryMetrics />
        </div>

        <TopProducts />
      </div>
    </div>
  );
}