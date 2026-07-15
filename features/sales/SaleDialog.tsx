"use client";

import { useState } from "react";

import { PaymentMethod } from "@/types/sales";
import { useSaleCart } from "@/hooks/sales/useSaleCart";
import { saleService } from "@/services/sales/sale.service";

import { SaleCustomerSelect } from "./SaleCustomerSelect";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { SaleProductSearch } from "./SaleProductSearch";
import { SaleCart } from "./SaleCart";
import { SaleSummary } from "./SaleSummary";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SaleDialogProps {
  onRefresh: () => void | Promise<void>;
}

export function SaleDialog({ onRefresh }: SaleDialogProps) {
  const {
    items,
    subtotal,
    addProduct,
    updateQuantity,
    removeProduct,
    clearCart,
  } = useSaleCart();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState("");

  function resetForm() {
    setCustomerId("");
    setPaymentMethod("cash");
    setDiscount(0);
    setTax(0);
    setNotes("");
    setError(null);
    clearCart();
  }

  async function handleRegisterSale() {
    setError(null);

    if (items.length === 0) {
      setError("Agrega al menos un producto.");
      return;
    }

    if (discount > subtotal) {
      setError("El descuento no puede superar el subtotal.");
      return;
    }

    setSaving(true);

    try {
      await saleService.register({
        customerId: customerId || null,
        paymentMethod,
        discount,
        tax,
        notes,
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        })),
      });

      resetForm();
      setOpen(false);
      await onRefresh();
    } catch (requestError) {
      console.error(requestError);

      const message =
        requestError instanceof Error
          ? requestError.message
          : "No se pudo registrar la venta.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Nueva venta</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Nueva venta</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <SaleCustomerSelect
                value={customerId}
                onChange={setCustomerId}
              />

              <PaymentMethodSelect
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </div>

            <SaleProductSearch onAddProduct={addProduct} />

            <SaleCart
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveProduct={removeProduct}
            />
          </div>

          <div className="space-y-6">
            <SaleSummary
              subtotal={subtotal}
              discount={discount}
              tax={tax}
              onDiscountChange={setDiscount}
              onTaxChange={setTax}
            />

            <div className="space-y-2">
              <Label htmlFor="sale-notes">Notas</Label>

              <Input
                id="sale-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Observaciones de la venta"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleRegisterSale}
              disabled={saving || items.length === 0}
              className="w-full"
            >
              {saving ? "Registrando..." : "Registrar venta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}