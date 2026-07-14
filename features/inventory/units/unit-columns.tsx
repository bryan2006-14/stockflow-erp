"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Unit } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { UnitActions } from "./UnitActions";

export function getUnitColumns(onRefresh: () => void): ColumnDef<Unit>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">
            Abreviatura: {row.original.abbreviation}
          </p>
        </div>
      ),
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
        <UnitActions unit={row.original} onRefresh={onRefresh} />
      ),
    },
  ];
}