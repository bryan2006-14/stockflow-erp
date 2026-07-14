"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Brand } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { BrandActions } from "./BrandActions";

export function getBrandColumns(onRefresh: () => void): ColumnDef<Brand>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const brand = row.original;

        return (
          <div>
            <p className="font-medium">{brand.name}</p>
            <p className="text-sm text-muted-foreground">
              {brand.description || "Sin descripción"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "default" : "secondary"}>
          {row.original.is_active ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Creación",
      cell: ({ row }) =>
        new Date(row.original.created_at).toLocaleDateString("es-PE"),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <BrandActions brand={row.original} onRefresh={onRefresh} />
      ),
    },
  ];
}