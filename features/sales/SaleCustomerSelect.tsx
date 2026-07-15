"use client";

import { Customer } from "@/types/inventory";
import { useCustomers } from "@/hooks/customers/useCustomers";
import { Label } from "@/components/ui/label";

interface SaleCustomerSelectProps {
  value: string;
  onChange: (customerId: string) => void;
}

function getCustomerName(customer: Customer) {
  return (
    customer.business_name ||
    `${customer.first_name} ${customer.last_name ?? ""}`.trim()
  );
}

export function SaleCustomerSelect({
  value,
  onChange,
}: SaleCustomerSelectProps) {
  const { customers, loading } = useCustomers();

  return (
    <div className="space-y-2">
      <Label htmlFor="sale-customer">Cliente</Label>

      <select
        id="sale-customer"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading}
        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
      >
        <option value="">Cliente general</option>

        {customers
          .filter((customer) => customer.is_active)
          .map((customer) => (
            <option key={customer.id} value={customer.id}>
              {getCustomerName(customer)}
              {customer.document_number
                ? ` — ${customer.document_number}`
                : ""}
            </option>
          ))}
      </select>
    </div>
  );
}