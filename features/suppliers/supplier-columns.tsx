"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Supplier } from "@/types/inventory";

import { Badge } from "@/components/ui/badge";
import { SupplierActions } from "./SupplierActions";

export function getSupplierColumns(
  onRefresh: () => void | Promise<void>
): ColumnDef<Supplier>[] {
  return [
    {
      accessorKey: "business_name",
      header: "Proveedor",
      cell: ({ row }) => {
        const supplier = row.original;

        return (
          <div className="min-w-[220px]">
            <p className="font-medium">
              {supplier.business_name}
            </p>

            <p className="text-sm text-muted-foreground">
              {supplier.contact_name || "Sin contacto asignado"}
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
            {row.original.document_number ||
              "Sin documento"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contacto",
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <p>{row.original.email || "Sin correo"}</p>

          <p className="text-sm text-muted-foreground">
            {row.original.phone || "Sin teléfono"}
          </p>
        </div>
      ),
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
          variant={
            row.original.is_active
              ? "default"
              : "secondary"
          }
        >
          {row.original.is_active
            ? "Activo"
            : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <SupplierActions
          supplier={row.original}
          onRefresh={onRefresh}
        />
      ),
    },
  ];
}