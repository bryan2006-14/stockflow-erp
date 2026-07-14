"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Product } from "@/types/inventory";
import { productService } from "@/services/inventory/product.service";
import { useCategories } from "@/hooks/inventory/useCategories";
import { useBrands } from "@/hooks/inventory/useBrands";
import { useUnits } from "@/hooks/inventory/useUnits";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductActionsProps {
  product: Product;
  onRefresh: () => void;
}

export function ProductActions({
  product,
  onRefresh,
}: ProductActionsProps) {
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { units } = useUnits();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sku, setSku] = useState(product.sku);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(
    product.description ?? ""
  );

  const [categoryId, setCategoryId] = useState(
    product.category_id ?? ""
  );
  const [brandId, setBrandId] = useState(product.brand_id ?? "");
  const [unitId, setUnitId] = useState(product.unit_id ?? "");

  const [purchasePrice, setPurchasePrice] = useState(
    String(product.purchase_price)
  );
  const [salePrice, setSalePrice] = useState(
    String(product.sale_price)
  );
  const [stock, setStock] = useState(String(product.stock));
  const [minStock, setMinStock] = useState(
    String(product.min_stock)
  );

  async function handleUpdate() {
    if (!sku.trim() || !name.trim()) {
      alert("El SKU y el nombre son obligatorios.");
      return;
    }

    const purchase = Number(purchasePrice);
    const sale = Number(salePrice);
    const currentStock = Number(stock);
    const minimumStock = Number(minStock);

    if (
      [purchase, sale, currentStock, minimumStock].some(
        (value) => Number.isNaN(value) || value < 0
      )
    ) {
      alert("Los precios y cantidades deben ser números válidos.");
      return;
    }

    setSaving(true);

    try {
      await productService.update(product.id, {
        sku: sku.trim(),
        name: name.trim(),
        description: description.trim() || null,
        category_id: categoryId || null,
        brand_id: brandId || null,
        unit_id: unitId || null,
        purchase_price: purchase,
        sale_price: sale,
        stock: currentStock,
        min_stock: minimumStock,
      });

      setOpen(false);
      await onRefresh();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el producto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Deseas eliminar el producto "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await productService.delete(product.id);
      await onRefresh();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el producto.");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Acciones de ${product.name}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar producto</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`sku-${product.id}`}>SKU</Label>
              <Input
                id={`sku-${product.id}`}
                value={sku}
                onChange={(event) => setSku(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`name-${product.id}`}>Nombre</Label>
              <Input
                id={`name-${product.id}`}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor={`description-${product.id}`}>
                Descripción
              </Label>
              <Input
                id={`description-${product.id}`}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`category-${product.id}`}>
                Categoría
              </Label>

              <select
                id={`category-${product.id}`}
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">Sin categoría</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`brand-${product.id}`}>Marca</Label>

              <select
                id={`brand-${product.id}`}
                value={brandId}
                onChange={(event) => setBrandId(event.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">Sin marca</option>

                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`unit-${product.id}`}>Unidad</Label>

              <select
                id={`unit-${product.id}`}
                value={unitId}
                onChange={(event) => setUnitId(event.target.value)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="">Sin unidad</option>

                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`purchase-${product.id}`}>
                Precio de compra
              </Label>
              <Input
                id={`purchase-${product.id}`}
                type="number"
                min="0"
                step="0.01"
                value={purchasePrice}
                onChange={(event) =>
                  setPurchasePrice(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`sale-${product.id}`}>
                Precio de venta
              </Label>
              <Input
                id={`sale-${product.id}`}
                type="number"
                min="0"
                step="0.01"
                value={salePrice}
                onChange={(event) =>
                  setSalePrice(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`stock-${product.id}`}>Stock</Label>
              <Input
                id={`stock-${product.id}`}
                type="number"
                min="0"
                step="0.01"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`min-stock-${product.id}`}>
                Stock mínimo
              </Label>
              <Input
                id={`min-stock-${product.id}`}
                type="number"
                min="0"
                step="0.01"
                value={minStock}
                onChange={(event) =>
                  setMinStock(event.target.value)
                }
              />
            </div>
          </div>

          <Button
            onClick={handleUpdate}
            disabled={saving}
            className="mt-4 w-full"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}