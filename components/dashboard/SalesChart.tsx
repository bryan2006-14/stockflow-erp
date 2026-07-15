"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useCommercialDashboard } from "@/hooks/dashboard/useCommercialDashboard";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

export function SalesChart() {
  const { chartData, loading } =
    useCommercialDashboard();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Ventas y compras — últimos 6 meses
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[360px]">
        {loading ? (
          <div className="h-full animate-pulse rounded-xl bg-muted/50" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis dataKey="month" />

              <YAxis
                tickFormatter={(value) =>
                  `S/${Number(value).toLocaleString("es-PE")}`
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
                fill="currentColor"
                className="text-emerald-500"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="purchases"
                name="Compras"
                fill="currentColor"
                className="text-indigo-500"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}