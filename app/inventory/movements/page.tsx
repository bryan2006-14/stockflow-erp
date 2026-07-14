"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { useStockMovements } from "@/hooks/inventory/useStockMovements";
import { movementColumns } from "@/features/inventory/movements/movement-columns";
import { StockMovementDialog } from "@/features/inventory/movements/StockMovementDialog";

export default function StockMovementsPage() {
  const {
    movements,
    loading,
    error,
    reload,
  } = useStockMovements();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Movimientos de inventario
          </h1>

          <p className="text-muted-foreground">
            Registra entradas y salidas manteniendo un historial de stock.
          </p>
        </div>

        <StockMovementDialog onRefresh={reload} />
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-72 animate-pulse rounded-xl border bg-muted/50" />
      ) : (
        <DataTable
          columns={movementColumns}
          data={movements}
          searchKey="reason"
          searchPlaceholder="Buscar por motivo..."
        />
      )}
    </div>
  );
}