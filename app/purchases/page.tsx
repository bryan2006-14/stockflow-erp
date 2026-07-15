"use client";

import { DataTable } from "@/components/data-table/DataTable";

import { usePurchases } from "@/hooks/purchases/usePurchases";

import { PurchaseDialog } from "@/features/purchases/PurchaseDialog";
import { purchaseColumns } from "@/features/purchases/purchase-columns";

export default function PurchasesPage() {
  const {
    purchases,
    loading,
    error,
    reload,
  } = usePurchases();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Compras
          </h1>

          <p className="text-muted-foreground">
            Registra compras, actualiza costos y aumenta el inventario.
          </p>
        </div>

        <PurchaseDialog onRefresh={reload} />
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
          columns={purchaseColumns}
          data={purchases}
          searchKey="purchase_number"
          searchPlaceholder="Buscar compra..."
        />
      )}
    </div>
  );
}