"use client";

import { useProducts } from "@/hooks/inventory/useProducts";
import { getProductColumns } from "@/features/inventory/products/product-columns";
import { ProductCreateDialog } from "@/features/inventory/products/ProductCreateDialog";

import { DataTable } from "@/components/data-table/DataTable";

export default function ProductsPage() {
  const { products, loading, reload } = useProducts();

  const columns = getProductColumns(reload);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona tu catálogo de productos e inventario.
          </p>
        </div>

        <ProductCreateDialog onRefresh={reload} />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando productos...</p>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          searchKey="name"
          searchPlaceholder="Buscar producto..."
        />
      )}
    </div>
  );
}