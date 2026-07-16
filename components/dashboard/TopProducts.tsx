"use client";

import { Crown, PackageOpen } from "lucide-react";

import { useDashboardActivity } from "@/hooks/dashboard/useDashboardActivity";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function TopProducts() {
  const { topProducts, loading } = useDashboardActivity();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Crown className="h-5 w-5 text-amber-500" />
          Productos más vendidos
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : topProducts.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center text-center">
            <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground" />

            <p className="font-medium">
              No existen datos de ventas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.product_id ?? product.product_sku}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {product.product_name}
                    </p>

                    <p className="font-mono text-xs text-muted-foreground">
                      {product.product_sku}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {product.quantity} vendidos
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {currency.format(product.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}