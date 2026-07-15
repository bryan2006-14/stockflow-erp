"use client";

import { useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SaleSummaryProps {
  subtotal: number;
  discount: number;
  tax: number;
  onDiscountChange: (value: number) => void;
  onTaxChange: (value: number) => void;
}

export function SaleSummary({
  subtotal,
  discount,
  tax,
  onDiscountChange,
  onTaxChange,
}: SaleSummaryProps) {
  const total = useMemo(
    () => Math.max(subtotal - discount + tax, 0),
    [subtotal, discount, tax]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">
            S/ {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale-discount">Descuento</Label>
          <Input
            id="sale-discount"
            type="number"
            min="0"
            step="0.01"
            value={discount}
            onChange={(event) =>
              onDiscountChange(
                Math.max(Number(event.target.value) || 0, 0)
              )
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale-tax">Impuesto</Label>
          <Input
            id="sale-tax"
            type="number"
            min="0"
            step="0.01"
            value={tax}
            onChange={(event) =>
              onTaxChange(
                Math.max(Number(event.target.value) || 0, 0)
              )
            }
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total</span>

            <span className="text-2xl font-bold text-primary">
              S/ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}