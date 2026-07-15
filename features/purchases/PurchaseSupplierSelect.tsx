"use client";

import { useSuppliers } from "@/hooks/suppliers/useSuppliers";
import { Label } from "@/components/ui/label";

interface PurchaseSupplierSelectProps {
  value: string;
  onChange: (supplierId: string) => void;
}

export function PurchaseSupplierSelect({
  value,
  onChange,
}: PurchaseSupplierSelectProps) {
  const { suppliers, loading } = useSuppliers();

  return (
    <div className="space-y-2">
      <Label htmlFor="purchase-supplier">
        Proveedor
      </Label>

      <select
        id="purchase-supplier"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        disabled={loading}
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
      >
        <option value="">Seleccionar proveedor</option>

        {suppliers
          .filter((supplier) => supplier.is_active)
          .map((supplier) => (
            <option
              key={supplier.id}
              value={supplier.id}
            >
              {supplier.business_name}
              {supplier.document_number
                ? ` — ${supplier.document_number}`
                : ""}
            </option>
          ))}
      </select>
    </div>
  );
}