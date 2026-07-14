import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { InventoryMetrics } from "@/components/dashboard/InventoryMetrics";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { LowStockTable } from "@/components/dashboard/LowStockTable";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      <InventoryMetrics />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        <LowStockTable />
      </div>
    </div>
  );
}