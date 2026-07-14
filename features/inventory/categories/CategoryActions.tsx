"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types/inventory";
import { categoryService } from "@/services/inventory/category.service";

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

interface CategoryActionsProps {
  category: Category;
  onRefresh: () => void;
}

export function CategoryActions({ category, onRefresh }: CategoryActionsProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");

  async function handleUpdate() {
    if (!name.trim()) return;

    await categoryService.update(category.id, {
      name: name.trim(),
      description: description.trim() || null,
    });

    setOpen(false);
    onRefresh();
  }

  async function handleDelete() {
    const confirmDelete = confirm(`¿Eliminar categoría "${category.name}"?`);
    if (!confirmDelete) return;

    await categoryService.delete(category.id);
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
            <DialogTitle>Editar categoría</DialogTitle>
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