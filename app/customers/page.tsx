"use client";

import { DataTable } from "@/components/data-table/DataTable";

import { useCustomers } from "@/hooks/customers/useCustomers";

import { getCustomerColumns } from "@/features/customers/customer-columns";

import { CustomerCreateDialog } from "@/features/customers/CustomerCreateDialog";

export default function CustomersPage() {
  const {
    customers,
    loading,
    error,
    reload,
  } = useCustomers();

  const columns = getCustomerColumns(reload);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Clientes
          </h1>

          <p className="text-muted-foreground">
            Gestiona personas y empresas para tus ventas.
          </p>
        </div>

        <CustomerCreateDialog onRefresh={reload} />
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
          data={customers}
          searchKey="customer"
          searchPlaceholder="Buscar cliente..."
        />
      )}
    </div>
  );
}