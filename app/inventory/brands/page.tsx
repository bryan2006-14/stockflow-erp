"use client";

import { useState } from "react";

import { useBrands } from "@/hooks/inventory/useBrands";
import { useProfile } from "@/hooks/useProfile";
import { brandService } from "@/services/inventory/brand.service";
import { getBrandColumns } from "@/features/inventory/brands/brand-columns";

import { DataTable } from "@/components/data-table/DataTable";
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

export default function BrandsPage() {
  const { brands, loading, reload } = useBrands();
  const { profile, loading: profileLoading } = useProfile();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const columns = getBrandColumns(reload);

  async function handleCreate() {
    if (!profile?.company_id) return;
    if (!name.trim()) return;

    await brandService.create({
      company_id: profile.company_id,
      name: name.trim(),
      description: description.trim() || null,
      is_active: true,
    });

    setName("");
    setDescription("");
    setOpen(false);
    reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marcas</h1>
          <p className="text-muted-foreground">
            Gestiona las marcas de tus productos.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={profileLoading}>Nueva marca</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva marca</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Descripción</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button onClick={handleCreate} className="w-full">
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando marcas...</p>
      ) : (
        <DataTable
          columns={columns}
          data={brands}
          searchKey="name"
          searchPlaceholder="Buscar marca..."
        />
      )}
    </div>
  );
}