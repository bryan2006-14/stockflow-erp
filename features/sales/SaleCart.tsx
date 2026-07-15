"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

import { SaleCartItem } from "@/types/sales";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SaleCartProps {
  items: SaleCartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
}

export function SaleCart({
  items,
  onUpdateQuantity,
  onRemoveProduct,
}: SaleCartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carrito</CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Todavía no agregaste productos.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const itemTotal = item.quantity * item.unitPrice;

              return (
                <div
                  key={item.productId}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.name}</p>

                      <p className="text-xs text-muted-foreground">
                        {item.sku} · Disponible: {item.stock}
                      </p>

                      <p className="mt-1 text-sm">
                        S/ {item.unitPrice.toFixed(2)} c/u
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveProduct(item.productId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
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
                        max={item.stock}
                        value={item.quantity}
                        onChange={(event) =>
                          onUpdateQuantity(
                            item.productId,
                            Number(event.target.value)
                          )
                        }
                        className="w-20 text-center"
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