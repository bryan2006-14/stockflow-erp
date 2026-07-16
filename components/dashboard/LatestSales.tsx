"use client";

import Link from "next/link";
import { ArrowRight, ReceiptText } from "lucide-react";

import { useDashboardActivity } from "@/hooks/dashboard/useDashboardActivity";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

function getCustomerName(
  customer: {
    first_name: string;
    last_name: string | null;
    business_name: string | null;
  } | null
) {
  if (!customer) return "Cliente general";

  return (
    customer.business_name ||
    `${customer.first_name} ${customer.last_name ?? ""}`.trim()
  );
}

export function LatestSales() {
  const { sales, loading } = useDashboardActivity();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <ReceiptText className="h-5 w-5 text-emerald-600" />
          Últimas ventas
        </CardTitle>

        <Button asChild variant="ghost" size="sm">
          <Link href="/sales">
            Ver todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : sales.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Todavía no existen ventas.
          </p>
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-4 rounded-xl border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {getCustomerName(sale.customers)}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">
                      {sale.sale_number}
                    </span>

                    <span>•</span>

                    <span>
                      {new Date(sale.created_at).toLocaleDateString(
                        "es-PE"
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {currency.format(sale.total)}
                  </p>

                  <Badge variant="secondary">
                    Completada
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}