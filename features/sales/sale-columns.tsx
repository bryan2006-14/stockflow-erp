"use client";

import { ColumnDef } from "@tanstack/react-table";

import { SaleWithCustomer } from "@/types/sales";
import { Badge } from "@/components/ui/badge";

function getCustomerName(sale: SaleWithCustomer) {
  const customer = sale.customers;

  if (!customer) {
    return "Cliente general";
  }

  return (
    customer.business_name ||
    `${customer.first_name} ${customer.last_name ?? ""}`.trim()
  );
}

function getPaymentLabel(paymentMethod: SaleWithCustomer["payment_method"]) {
  const labels = {
    cash: "Efectivo",
    card: "Tarjeta",
    transfer: "Transferencia",
    yape: "Yape",
    plin: "Plin",
    credit: "Crédito",
  };

  return labels[paymentMethod];
}

export const saleColumns: ColumnDef<SaleWithCustomer>[] = [
  {
    accessorKey: "sale_number",
    header: "Venta",
    cell: ({ row }) => (
      <div>
        <p className="font-mono font-medium">
          {row.original.sale_number}
        </p>

        <p className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat("es-PE", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(row.original.created_at))}
        </p>
      </div>
    ),
  },
  {
    id: "customer",
    header: "Cliente",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          {getCustomerName(row.original)}
        </p>

        <p className="text-xs text-muted-foreground">
          {row.original.customers?.document_number || "Sin documento"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "payment_method",
    header: "Pago",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {getPaymentLabel(row.original.payment_method)}
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
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "cancelled"
                ? "destructive"
                : "secondary"
          }
        >
          {status === "completed"
            ? "Completada"
            : status === "cancelled"
              ? "Cancelada"
              : "Borrador"}
        </Badge>
      );
    },
  },
];