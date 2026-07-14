"use client";

import { useState } from "react";

import { useUnits } from "@/hooks/inventory/useUnits";
import { useProfile } from "@/hooks/useProfile";
import { unitService } from "@/services/inventory/unit.service";
import { getUnitColumns } from "@/features/inventory/units/unit-columns";

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

export default function UnitsPage() {
  const { units, loading, reload } = useUnits();
  const { profile, loading: profileLoading } = useProfile();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");

  const columns = getUnitColumns(reload);

  async function handleCreate() {
    if (!profile?.company_id) return;
    if (!name.trim() || !abbreviation.trim()) return;

    await unitService.create({
      company_id: profile.company_id,
      name: name.trim(),
      abbreviation: abbreviation.trim(),
      is_active: true,
    });

    setName("");
    setAbbreviation("");
    setOpen(false);
    reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unidades</h1>
          <p className="text-muted-foreground">
            Gestiona unidades como unidad, caja, kilo o litro.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={profileLoading}>Nueva unidad</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva unidad</DialogTitle>
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

              <Button onClick={handleCreate} className="w-full">
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando unidades...</p>
      ) : (
        <DataTable
          columns={columns}
          data={units}
          searchKey="name"
          searchPlaceholder="Buscar unidad..."
        />
      )}
    </div>
  );
}