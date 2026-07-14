"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Product } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "./ProductActions";

export type ProductWithRelations = Product & {
  categories?: {
    name: string;
  } | null;
  brands?: {
    name: string;
  } | null;
  units?: {
    name: string;
    abbreviation: string;
  } | null;
};

export function getProductColumns(
  onRefresh: () => void
): ColumnDef<ProductWithRelations>[] {
  return [
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.sku}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Producto",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="min-w-[220px]">
            <p className="font-medium">{product.name}</p>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {product.description || "Sin descripción"}
            </p>
          </div>
        );
      },
    },
    {
      id: "category",
      header: "Categoría",
      cell: ({ row }) => row.original.categories?.name ?? "-",
    },
    {
      id: "brand",
      header: "Marca",
      cell: ({ row }) => row.original.brands?.name ?? "-",
    },
    {
      id: "unit",
      header: "Unidad",
      cell: ({ row }) => row.original.units?.abbreviation ?? "-",
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const product = row.original;
        const stock = Number(product.stock);
        const minStock = Number(product.min_stock);
        const isLowStock = stock <= minStock;

        return (
          <Badge variant={isLowStock ? "destructive" : "default"}>
            {stock} / mín. {minStock}
          </Badge>
        );
      },
    },
    {
      id: "prices",
      header: "Precios",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="min-w-[140px] space-y-1 text-sm">
            <p>
              Compra:{" "}
              <span className="font-semibold">
                S/ {Number(product.purchase_price).toFixed(2)}
              </span>
            </p>

            <p className="text-green-600">
              Venta:{" "}
              <span className="font-semibold">
                S/ {Number(product.sale_price).toFixed(2)}
              </span>
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
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ProductActions product={row.original} onRefresh={onRefresh} />
      ),
    },
  ];
}