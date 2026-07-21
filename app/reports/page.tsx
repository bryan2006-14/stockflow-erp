import { BarChart3 } from "lucide-react";

import { ReportsDashboard } from "@/components/reports/ReportsDashboard";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-primary/10 p-2">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">
              Reportes
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Analiza las ventas, compras e inventario de tu empresa.
          </p>
        </div>
      </div>

      <ReportsDashboard />
    </div>
  );
}