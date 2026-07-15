"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";

import { Product } from "@/types/inventory";
import { useProducts } from "@/hooks/inventory/useProducts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SaleProductSearchProps {
  onAddProduct: (product: Product) => void;
}

export function SaleProductSearch({
  onAddProduct,
}: SaleProductSearchProps) {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products
      .filter((product) => product.is_active)
      .filter((product) => Number(product.stock) > 0)
      .filter((product) => {
        if (!term) return true;

        return (
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term)
        );
      })
      .slice(0, 12);
  }, [products, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar productos</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay productos disponibles.
          </p>
        ) : (
          <div className="grid gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">{product.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {product.sku} · Stock: {product.stock}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-600">
                    S/ {Number(product.sale_price).toFixed(2)}
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => onAddProduct(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Agregar
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}