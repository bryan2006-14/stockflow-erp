"use client";

import { useMemo, useState } from "react";

import { Product } from "@/types/inventory";
import { PurchaseCartItem } from "@/types/purchases";

export function usePurchaseCart() {
  const [items, setItems] = useState<PurchaseCartItem[]>([]);

  function addProduct(product: Product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          quantity: 1,
          unitCost: Number(product.purchase_price),
          currentStock: Number(product.stock),
        },
      ];
    });
  }

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(1, quantity || 1),
            }
          : item
      )
    );
  }

  function updateUnitCost(
    productId: string,
    unitCost: number
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              unitCost: Math.max(0, unitCost || 0),
            }
          : item
      )
    );
  }

  function removeProduct(productId: string) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity * item.unitCost,
        0
      ),
    [items]
  );

  return {
    items,
    subtotal,
    addProduct,
    updateQuantity,
    updateUnitCost,
    removeProduct,
    clearCart,
  };
}