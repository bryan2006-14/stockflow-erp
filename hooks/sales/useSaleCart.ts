"use client";

import { useMemo, useState } from "react";
import { Product } from "@/types/inventory";
import { SaleCartItem } from "@/types/sales";

export function useSaleCart() {
  const [items, setItems] = useState<SaleCartItem[]>([]);

  function addProduct(product: Product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= Number(product.stock)) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      if (Number(product.stock) <= 0) {
        return currentItems;
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          quantity: 1,
          unitPrice: Number(product.sale_price),
          stock: Number(product.stock),
        },
      ];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(quantity, item.stock)
              ),
            }
          : item
      )
    );
  }

  function removeProduct(productId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity * item.unitPrice,
        0
      ),
    [items]
  );

  return {
    items,
    subtotal,
    addProduct,
    updateQuantity,
    removeProduct,
    clearCart,
  };
}