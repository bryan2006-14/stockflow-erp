"use client";

import { ColumnDef } from "@tanstack/react-table";

import { PurchaseWithSupplier } from "@/types/purchases";
import { Badge } from "@/components/ui/badge";

const paymentLabels = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  credit: "Crédito",
};

export const purchaseColumns: ColumnDef<PurchaseWithSupplier>[] =
  [
    {
      accessorKey: "purchase_number",
      header: "Compra",
      cell: ({ row }) => (
        <div>
          <p className="font-mono font-medium">
            {row.original.purchase_number}
          </p>

          <p className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("es-PE", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(
              new Date(row.original.created_at)
            )}
          </p>
        </div>
      ),
    },
    {
      id: "supplier",
      header: "Proveedor",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.suppliers?.business_name ??
              "Sin proveedor"}
          </p>

          <p className="text-xs text-muted-foreground">
            {row.original.suppliers?.document_number ??
              "Sin documento"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "payment_method",
      header: "Pago",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {paymentLabels[
            row.original.payment_method
          ]}
        </Badge>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-semibold">
          S/ {Number(row.original.total).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "completed"
              ? "default"
              : row.original.status === "cancelled"
                ? "destructive"
                : "secondary"
          }
        >
          {row.original.status === "completed"
            ? "Completada"
            : row.original.status === "cancelled"
              ? "Cancelada"
              : "Borrador"}
        </Badge>
      ),
    },
  ];