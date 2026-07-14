"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Brand } from "@/types/inventory";
import { brandService } from "@/services/inventory/brand.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BrandActionsProps {
  brand: Brand;
  onRefresh: () => void;
}

export function BrandActions({ brand, onRefresh }: BrandActionsProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(brand.name);
  const [description, setDescription] = useState(brand.description ?? "");

  async function handleUpdate() {
    if (!name.trim()) return;

    await brandService.update(brand.id, {
      name: name.trim(),
      description: description.trim() || null,
    });

    setOpen(false);
    onRefresh();
  }

  async function handleDelete() {
    const confirmDelete = confirm(`¿Eliminar marca "${brand.name}"?`);
    if (!confirmDelete) return;

    await brandService.delete(brand.id);
    onRefresh();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar marca</DialogTitle>
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

            <Button onClick={handleUpdate} className="w-full">
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}