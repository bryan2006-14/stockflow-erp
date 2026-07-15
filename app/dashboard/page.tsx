import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CommercialMetrics } from "@/components/dashboard/CommercialMetrics";
import { InventoryMetrics } from "@/components/dashboard/InventoryMetrics";
import { LowStockTable } from "@/components/dashboard/LowStockTable";
import { SalesChart } from "@/components/dashboard/SalesChart";

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
            Ventas, compras, clientes y resultado mensual.
          </p>
        </div>

        <CommercialMetrics />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        <LowStockTable />
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">
            Resumen de inventario
          </h2>

          <p className="text-sm text-muted-foreground">
            Estado y valorización actual del stock.
          </p>
        </div>

        <InventoryMetrics />
      </section>
    </div>
  );
}