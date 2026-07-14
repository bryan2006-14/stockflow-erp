"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

import { StockMovement } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";

function getMovementLabel(type: StockMovement["movement_type"]) {
  const labels: Record<StockMovement["movement_type"], string> = {
    initial: "Stock inicial",
    purchase: "Compra",
    sale: "Venta",
    entry: "Entrada",
    exit: "Salida",
    adjustment: "Ajuste",
  };

  return labels[type];
}

export const movementColumns: ColumnDef<StockMovement>[] = [
  {
    accessorKey: "created_at",
    header: "Fecha",
    cell: ({ row }) => {
      return new Intl.DateTimeFormat("es-PE", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(row.original.created_at));
    },
  },
  {
    id: "product",
    header: "Producto",
    cell: ({ row }) => (
      <div className="min-w-[220px]">
        <p className="font-medium">
          {row.original.products?.name ?? "Producto eliminado"}
        </p>

        <p className="font-mono text-xs text-muted-foreground">
          {row.original.products?.sku ?? "Sin SKU"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "movement_type",
    header: "Movimiento",
    cell: ({ row }) => {
      const movement = row.original;
      const isEntry = ["entry", "purchase", "initial"].includes(
        movement.movement_type
      );

      return (
        <Badge variant={isEntry ? "default" : "secondary"}>
          {isEntry ? (
            <ArrowDownToLine className="mr-1 h-3.5 w-3.5" />
          ) : (
            <ArrowUpFromLine className="mr-1 h-3.5 w-3.5" />
          )}

          {getMovementLabel(movement.movement_type)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      const isExit = ["exit", "sale"].includes(
        row.original.movement_type
      );

      return (
        <span
          className={
            isExit
              ? "font-semibold text-destructive"
              : "font-semibold text-emerald-600"
          }
        >
          {isExit ? "-" : "+"}
          {row.original.quantity}
        </span>
      );
    },
  },
  {
    id: "stock",
    header: "Cambio de stock",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {row.original.previous_stock}
        {" → "}
        <strong>{row.original.new_stock}</strong>
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Motivo",
    cell: ({ row }) => (
      <div className="max-w-[220px]">
        <p className="truncate">
          {row.original.reason || "Sin motivo"}
        </p>

        {row.original.reference && (
          <p className="truncate text-xs text-muted-foreground">
            Ref: {row.original.reference}
          </p>
        )}
      </div>
    ),
  },
];