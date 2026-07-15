"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Customer } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { CustomerActions } from "./CustomerActions";

export function getCustomerColumns(
  onRefresh: () => void | Promise<void>
): ColumnDef<Customer>[] {
  return [
    {
      id: "customer",
      accessorFn: (customer) =>
        customer.business_name ||
        `${customer.first_name} ${customer.last_name ?? ""}`,
      header: "Cliente",
      cell: ({ row }) => {
        const customer = row.original;

        const name =
          customer.business_name ||
          `${customer.first_name} ${
            customer.last_name ?? ""
          }`.trim();

        return (
          <div className="min-w-[220px]">
            <p className="font-medium">{name}</p>

            <p className="text-sm text-muted-foreground">
              {customer.email || "Sin correo"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "document_number",
      header: "Documento",
      cell: ({ row }) => (
        <div>
          <p className="text-xs text-muted-foreground">
            {row.original.document_type}
          </p>

          <p className="font-mono text-sm">
            {row.original.document_number || "Sin documento"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => row.original.phone || "—",
    },
    {
      accessorKey: "address",
      header: "Dirección",
      cell: ({ row }) => (
        <p className="max-w-[220px] truncate">
          {row.original.address || "—"}
        </p>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      cell: ({ row }) => (
        <Badge
          variant={row.original.is_active ? "default" : "secondary"}
        >
          {row.original.is_active ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <CustomerActions
          customer={row.original}
          onRefresh={onRefresh}
        />
      ),
    },
  ];
}