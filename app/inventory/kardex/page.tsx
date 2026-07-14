"use client";

import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, History } from "lucide-react";

import { useProducts } from "@/hooks/inventory/useProducts";
import { useStockMovements } from "@/hooks/inventory/useStockMovements";
import { movementColumns } from "@/features/inventory/movements/movement-columns";

import { DataTable } from "@/components/data-table/DataTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function KardexPage() {
  const { products, loading: productsLoading } = useProducts();

  const {
    movements,
    loading: movementsLoading,
    error,
  } = useStockMovements();

  const [productId, setProductId] = useState("");

  const filteredMovements = useMemo(() => {
    if (!productId) {
      return movements;
    }

    return movements.filter(
      (movement) => movement.product_id === productId
    );
  }, [movements, productId]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  );

  const totals = useMemo(() => {
    return filteredMovements.reduce(
      (result, movement) => {
        const isEntry = [
          "initial",
          "purchase",
          "entry",
        ].includes(movement.movement_type);

        const isExit = ["sale", "exit"].includes(
          movement.movement_type
        );

        if (isEntry) {
          result.entries += Number(movement.quantity);
        }

        if (isExit) {
          result.exits += Number(movement.quantity);
        }

        return result;
      },
      {
        entries: 0,
        exits: 0,
      }
    );
  }, [filteredMovements]);

  const loading = productsLoading || movementsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Kardex
        </h1>

        <p className="text-muted-foreground">
          Consulta el historial de entradas y salidas de inventario.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Filtro de producto
          </CardTitle>
        </CardHeader>

        <CardContent>
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="h-10 w-full max-w-lg rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Todos los productos</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.sku} — {product.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <ArrowDownToLine className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total entradas
              </p>

              <p className="text-2xl font-bold">
                {totals.entries}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-destructive/10 p-3">
              <ArrowUpFromLine className="h-5 w-5 text-destructive" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total salidas
              </p>

              <p className="text-2xl font-bold">
                {totals.exits}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-xl bg-primary/10 p-3">
              <History className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Stock actual
              </p>

              <p className="text-2xl font-bold">
                {selectedProduct
                  ? Number(selectedProduct.stock)
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-72 animate-pulse rounded-xl border bg-muted/50" />
      ) : (
        <DataTable
          columns={movementColumns}
          data={filteredMovements}
          searchPlaceholder="Buscar movimiento..."
        />
      )}
    </div>
  );
}