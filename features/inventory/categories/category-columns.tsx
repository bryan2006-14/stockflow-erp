"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Category } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { CategoryActions } from "./CategoryActions";

export function getCategoryColumns(
  onRefresh: () => void
): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const category = row.original;

        return (
          <div>
            <p className="font-medium">{category.name}</p>
            <p className="text-sm text-muted-foreground">
              {category.description || "Sin descripción"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      cell: ({ row }) => {
        const isActive = row.original.is_active;

        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Activo" : "Inactivo"}
          </Badge>
        );
      },
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
        <CategoryActions category={row.original} onRefresh={onRefresh} />
      ),
    },
  ];
}