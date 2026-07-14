"use client";

import { useState } from "react";

import { useProfile } from "@/hooks/useProfile";
import { useCategories } from "@/hooks/inventory/useCategories";
import { useBrands } from "@/hooks/inventory/useBrands";
import { useUnits } from "@/hooks/inventory/useUnits";
import { productService } from "@/services/inventory/product.service";

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

interface ProductCreateDialogProps {
  onRefresh: () => void;
}

export function ProductCreateDialog({ onRefresh }: ProductCreateDialogProps) {
  const { profile } = useProfile();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { units } = useUnits();

  const [open, setOpen] = useState(false);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [unitId, setUnitId] = useState("");

  const [purchasePrice, setPurchasePrice] = useState("0");
  const [salePrice, setSalePrice] = useState("0");
  const [stock, setStock] = useState("0");
  const [minStock, setMinStock] = useState("0");

  async function handleCreate() {
    if (!profile?.company_id) return;
    if (!sku.trim() || !name.trim()) return;

    await productService.create({
      company_id: profile.company_id,
      sku: sku.trim(),
      name: name.trim(),
      description: description.trim() || null,
      image_url: null,
      category_id: categoryId || null,
      brand_id: brandId || null,
      unit_id: unitId || null,
      purchase_price: Number(purchasePrice),
      sale_price: Number(salePrice),
      stock: Number(stock),
      min_stock: Number(minStock),
      is_active: true,
    });

    setSku("");
    setName("");
    setDescription("");
    setCategoryId("");
    setBrandId("");
    setUnitId("");
    setPurchasePrice("0");
    setSalePrice("0");
    setStock("0");
    setMinStock("0");

    setOpen(false);
    onRefresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nuevo producto</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nuevo producto</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>

          <div>
            <Label>Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Descripción</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label>Categoría</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Sin categoría</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Marca</Label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Sin marca</option>
              {brands.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Unidad</Label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Sin unidad</option>
              {units.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.abbreviation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Precio compra</Label>
            <Input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>

          <div>
            <Label>Precio venta</Label>
            <Input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </div>

          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div>
            <Label>Stock mínimo</Label>
            <Input
              type="number"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleCreate} className="mt-4 w-full">
          Guardar producto
        </Button>
      </DialogContent>
    </Dialog>
  );
}