"use client";

import { useState } from "react";

import { useCategories } from "@/hooks/inventory/useCategories";
import { useProfile } from "@/hooks/useProfile";
import { categoryService } from "@/services/inventory/category.service";
import { getCategoryColumns } from "@/features/inventory/categories/category-columns";

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

export default function CategoriesPage() {
  const { categories, loading, reload } = useCategories();
  const { profile, loading: profileLoading } = useProfile();
const columns = getCategoryColumns(reload);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreate() {
    if (!profile?.company_id) {
      alert("No se encontró la empresa del usuario.");
      return;
    }

    if (!name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    await categoryService.create({
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
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="text-muted-foreground">
            Organiza tus productos por categorías.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={profileLoading}>Nueva categoría</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva categoría</DialogTitle>
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
        <p className="text-muted-foreground">Cargando categorías...</p>
      ) : (
        <DataTable
  columns={columns}
  data={categories}
  searchKey="name"
  searchPlaceholder="Buscar categoría..."
/>
      )}
    </div>
  );
}