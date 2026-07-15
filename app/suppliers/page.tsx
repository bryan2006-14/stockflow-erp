"use client";

import { DataTable } from "@/components/data-table/DataTable";

import { useSuppliers } from "@/hooks/suppliers/useSuppliers";

import { getSupplierColumns } from "@/features/suppliers/supplier-columns";

import { SupplierCreateDialog } from "@/features/suppliers/SupplierCreateDialog";

export default function SuppliersPage() {
  const {
    suppliers,
    loading,
    error,
    reload,
  } = useSuppliers();

  const columns = getSupplierColumns(reload);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Proveedores
          </h1>

          <p className="text-muted-foreground">
            Gestiona las empresas que abastecen tu inventario.
          </p>
        </div>

        <SupplierCreateDialog onRefresh={reload} />
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
          columns={columns}
          data={suppliers}
          searchKey="business_name"
          searchPlaceholder="Buscar proveedor..."
        />
      )}
    </div>
  );
}