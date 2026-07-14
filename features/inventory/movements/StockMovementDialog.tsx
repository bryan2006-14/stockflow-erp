"use client";

import { useEffect, useMemo, useState } from "react";

import { useProducts } from "@/hooks/inventory/useProducts";
import { stockMovementService } from "@/services/inventory/stock-movement.service";

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

interface StockMovementDialogProps {
  onRefresh: () => void | Promise<void>;
}

export function StockMovementDialog({
  onRefresh,
}: StockMovementDialogProps) {
  const { products, reload: reloadProducts } = useProducts();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [productId, setProductId] = useState("");
  const [movementType, setMovementType] =
    useState<"entry" | "exit">("entry");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [productId, products]
  );

  useEffect(() => {
    if (!open) {
      setFormError(null);
    }
  }, [open]);

  function resetForm() {
    setProductId("");
    setMovementType("entry");
    setQuantity("");
    setReason("");
    setReference("");
    setFormError(null);
  }

  async function handleSubmit() {
    setFormError(null);

    const numericQuantity = Number(quantity);

    if (!productId) {
      setFormError("Selecciona un producto.");
      return;
    }

    if (
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      setFormError("La cantidad debe ser mayor que cero.");
      return;
    }

    if (
      movementType === "exit" &&
      selectedProduct &&
      numericQuantity > Number(selectedProduct.stock)
    ) {
      setFormError(
        `Stock insuficiente. Disponible: ${selectedProduct.stock}.`
      );
      return;
    }

    setSaving(true);

    try {
      await stockMovementService.create({
        productId,
        movementType,
        quantity: numericQuantity,
        reason,
        reference,
      });

      await Promise.all([
        onRefresh(),
        reloadProducts(),
      ]);

      resetForm();
      setOpen(false);
    } catch (requestError) {
      console.error(requestError);

      const message =
        requestError instanceof Error
          ? requestError.message
          : "No se pudo registrar el movimiento.";

      setFormError(message);
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
        <Button>Registrar movimiento</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo movimiento de inventario</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="movement-product">Producto</Label>

            <select
              id="movement-product"
              value={productId}
              onChange={(event) =>
                setProductId(event.target.value)
              }
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Seleccionar producto</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} — {product.name}
                </option>
              ))}
            </select>

            {selectedProduct && (
              <p className="text-xs text-muted-foreground">
                Stock actual: {selectedProduct.stock}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement-type">
              Tipo de movimiento
            </Label>

            <select
              id="movement-type"
              value={movementType}
              onChange={(event) =>
                setMovementType(
                  event.target.value as "entry" | "exit"
                )
              }
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="entry">Entrada de stock</option>
              <option value="exit">Salida de stock</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement-quantity">
              Cantidad
            </Label>

            <Input
              id="movement-quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={quantity}
              onChange={(event) =>
                setQuantity(event.target.value)
              }
              placeholder="Ejemplo: 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement-reason">Motivo</Label>

            <Input
              id="movement-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Ejemplo: Compra a proveedor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movement-reference">
              Referencia
            </Label>

            <Input
              id="movement-reference"
              value={reference}
              onChange={(event) =>
                setReference(event.target.value)
              }
              placeholder="Ejemplo: OC-0001"
            />
          </div>

          {formError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full"
          >
            {saving
              ? "Registrando..."
              : "Registrar movimiento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}