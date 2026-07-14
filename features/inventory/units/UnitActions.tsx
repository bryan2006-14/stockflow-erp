"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Unit } from "@/types/inventory";
import { unitService } from "@/services/inventory/unit.service";

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

interface UnitActionsProps {
  unit: Unit;
  onRefresh: () => void;
}

export function UnitActions({ unit, onRefresh }: UnitActionsProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(unit.name);
  const [abbreviation, setAbbreviation] = useState(unit.abbreviation);

  async function handleUpdate() {
    if (!name.trim() || !abbreviation.trim()) return;

    await unitService.update(unit.id, {
      name: name.trim(),
      abbreviation: abbreviation.trim(),
    });

    setOpen(false);
    onRefresh();
  }

  async function handleDelete() {
    const confirmDelete = confirm(`¿Eliminar unidad "${unit.name}"?`);
    if (!confirmDelete) return;

    await unitService.delete(unit.id);
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
            <DialogTitle>Editar unidad</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Abreviatura</Label>
              <Input
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
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