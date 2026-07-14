"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { month: "Ene", sales: 4200 },
  { month: "Feb", sales: 5100 },
  { month: "Mar", sales: 4800 },
  { month: "Abr", sales: 6300 },
  { month: "May", sales: 7200 },
  { month: "Jun", sales: 8100 },
];

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas últimos 6 meses</CardTitle>
      </CardHeader>

      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="sales"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}