"use client";

import { PaymentMethod } from "@/types/sales";
import { Label } from "@/components/ui/label";

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function PaymentMethodSelect({
  value,
  onChange,
}: PaymentMethodSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="payment-method">Método de pago</Label>

      <select
        id="payment-method"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as PaymentMethod)
        }
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
      >
        <option value="cash">Efectivo</option>
        <option value="card">Tarjeta</option>
        <option value="transfer">Transferencia</option>
        <option value="yape">Yape</option>
        <option value="plin">Plin</option>
        <option value="credit">Crédito</option>
      </select>
    </div>
  );
}