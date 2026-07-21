"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Package,
  ReceiptText,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useReports } from "@/hooks/reports/useReports";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("es-PE", {
  notation: "compact",
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 1,
});

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  loading: boolean;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            {loading ? (
              <Skeleton className="mt-3 h-8 w-32" />
            ) : (
              <p className="mt-2 truncate text-2xl font-bold">
                {value}
              </p>
            )}

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportsDashboard() {
  const {
    summary,
    monthlyReport,
    bestSellingProducts,
    lowStockProducts,
    loading,
    error,
    reload,
  } = useReports();

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />

          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void reload()}
            >
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Ventas acumuladas"
          value={currencyFormatter.format(summary.salesTotal)}
          description={`Total del año ${new Date().getFullYear()}`}
          icon={ShoppingCart}
          loading={loading}
        />

        <MetricCard
          title="Compras acumuladas"
          value={currencyFormatter.format(summary.purchasesTotal)}
          description={`Total del año ${new Date().getFullYear()}`}
          icon={Package}
          loading={loading}
        />

        <MetricCard
          title="Resultado comercial"
          value={currencyFormatter.format(summary.profit)}
          description={
            summary.profit >= 0
              ? "Ventas menos compras"
              : "Las compras superan las ventas"
          }
          icon={
            summary.profit >= 0
              ? ArrowUpRight
              : ArrowDownRight
          }
          loading={loading}
        />

        <MetricCard
          title="Cantidad de ventas"
          value={String(summary.salesCount)}
          description="Operaciones completadas"
          icon={ReceiptText}
          loading={loading}
        />

        <MetricCard
          title="Cantidad de compras"
          value={String(summary.purchasesCount)}
          description="Operaciones completadas"
          icon={Banknote}
          loading={loading}
        />

        <MetricCard
          title="Venta promedio"
          value={currencyFormatter.format(summary.averageSale)}
          description="Promedio por operación"
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Ventas y compras mensuales
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Comparación del año {new Date().getFullYear()}.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => void reload()}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Actualizar
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <Skeleton className="h-[360px] w-full" />
          ) : (
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyReport}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      compactCurrencyFormatter.format(
                        Number(value)
                      )
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      currencyFormatter.format(Number(value))
                    }
                  />

                  <Bar
                    dataKey="sales"
                    name="Ventas"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="purchases"
                    name="Compras"
                    fill="var(--chart-2)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Productos más vendidos
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : bestSellingProducts.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No hay ventas registradas.
              </p>
            ) : (
              <div className="space-y-3">
                {bestSellingProducts.map((product, index) => (
                  <div
                    key={
                      product.productId ??
                      `${product.sku}-${index}`
                    }
                    className="flex items-center justify-between gap-4 rounded-xl border p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {product.name}
                        </p>

                        <p className="font-mono text-xs text-muted-foreground">
                          {product.sku || "Sin SKU"}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold">
                        {product.quantity} unidades
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {currencyFormatter.format(product.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Productos con stock bajo
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

                <p className="text-sm font-medium">
                  El inventario se encuentra estable
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  No hay productos debajo del stock mínimo.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 rounded-xl border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {product.name}
                      </p>

                      <p className="font-mono text-xs text-muted-foreground">
                        {product.sku || "Sin SKU"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <Badge
                        variant={
                          product.stock === 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        Stock: {product.stock}
                      </Badge>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Mínimo: {product.minStock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}