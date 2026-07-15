"use client";

import { useState } from "react";

import { PurchasePaymentMethod } from "@/types/purchases";
import { usePurchaseCart } from "@/hooks/purchases/usePurchaseCart";
import { purchaseService } from "@/services/purchases/purchase.service";

import { PurchaseSupplierSelect } from "./PurchaseSupplierSelect";
import { PurchaseProductSearch } from "./PurchaseProductSearch";
import { PurchaseCart } from "./PurchaseCart";
import { SaleSummary } from "@/features/sales/SaleSummary";

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

interface PurchaseDialogProps {
  onRefresh: () => void | Promise<void>;
}

export function PurchaseDialog({
  onRefresh,
}: PurchaseDialogProps) {
  const {
    items,
    subtotal,
    addProduct,
    updateQuantity,
    updateUnitCost,
    removeProduct,
    clearCart,
  } = usePurchaseCart();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [supplierId, setSupplierId] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PurchasePaymentMethod>("cash");

  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState("");

  function resetForm() {
    setSupplierId("");
    setPaymentMethod("cash");
    setDiscount(0);
    setTax(0);
    setNotes("");
    setError(null);
    clearCart();
  }

  async function handleRegisterPurchase() {
    setError(null);

    if (!supplierId) {
      setError("Selecciona un proveedor.");
      return;
    }

    if (items.length === 0) {
      setError("Agrega al menos un producto.");
      return;
    }

    if (discount > subtotal) {
      setError(
        "El descuento no puede superar el subtotal."
      );
      return;
    }

    setSaving(true);

    try {
      await purchaseService.register({
        supplierId,
        paymentMethod,
        discount,
        tax,
        notes,
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_cost: item.unitCost,
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
          : "No se pudo registrar la compra.";

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
        <Button>Nueva compra</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Nueva compra</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <PurchaseSupplierSelect
                value={supplierId}
                onChange={setSupplierId}
              />

              <div className="space-y-2">
                <Label htmlFor="purchase-payment">
                  Método de pago
                </Label>

                <select
                  id="purchase-payment"
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target
                        .value as PurchasePaymentMethod
                    )
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="cash">
                    Efectivo
                  </option>
                  <option value="card">Tarjeta</option>
                  <option value="transfer">
                    Transferencia
                  </option>
                  <option value="credit">
                    Crédito
                  </option>
                </select>
              </div>
            </div>

            <PurchaseProductSearch
              onAddProduct={addProduct}
            />

            <PurchaseCart
              items={items}
              onUpdateQuantity={updateQuantity}
              onUpdateUnitCost={updateUnitCost}
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
              <Label htmlFor="purchase-notes">
                Notas
              </Label>

              <Input
                id="purchase-notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Factura, orden o comentarios"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleRegisterPurchase}
              disabled={saving || items.length === 0}
              className="w-full"
            >
              {saving
                ? "Registrando..."
                : "Registrar compra"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}