"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { PurchaseCartItem } from "@/types/purchases";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PurchaseCartProps {
  items: PurchaseCartItem[];
  onUpdateQuantity: (
    productId: string,
    quantity: number
  ) => void;
  onUpdateUnitCost: (
    productId: string,
    unitCost: number
  ) => void;
  onRemoveProduct: (productId: string) => void;
}

export function PurchaseCart({
  items,
  onUpdateQuantity,
  onUpdateUnitCost,
  onRemoveProduct,
}: PurchaseCartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos de la compra</CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Todavía no agregaste productos.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const itemTotal =
                item.quantity * item.unitCost;

              return (
                <div
                  key={item.productId}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {item.sku} · Stock actual:{" "}
                        {item.currentStock}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        onRemoveProduct(item.productId)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Cantidad
                      </p>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onUpdateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(event) =>
                            onUpdateQuantity(
                              item.productId,
                              Number(event.target.value)
                            )
                          }
                          className="w-24 text-center"
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            onUpdateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Costo unitario
                      </p>

                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitCost}
                        onChange={(event) =>
                          onUpdateUnitCost(
                            item.productId,
                            Number(event.target.value)
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <p className="font-bold">
                      S/ {itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}