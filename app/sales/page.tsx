"use client";

import { DataTable } from "@/components/data-table/DataTable";

import { useSales } from "@/hooks/sales/useSales";
import { saleColumns } from "@/features/sales/sale-columns";
import { SaleDialog } from "@/features/sales/SaleDialog";

export default function SalesPage() {
  const {
    sales,
    loading,
    error,
    reload,
  } = useSales();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ventas
          </h1>

          <p className="text-muted-foreground">
            Registra ventas, descuenta inventario y consulta el historial.
          </p>
        </div>

        <SaleDialog onRefresh={reload} />
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
          columns={saleColumns}
          data={sales}
          searchKey="sale_number"
          searchPlaceholder="Buscar venta..."
        />
      )}
    </div>
  );
}