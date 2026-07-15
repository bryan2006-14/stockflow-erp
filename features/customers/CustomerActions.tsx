"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Customer,
  CustomerDocumentType,
} from "@/types/inventory";

import { customerService } from "@/services/customers/customer.service";

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

interface CustomerActionsProps {
  customer: Customer;
  onRefresh: () => void | Promise<void>;
}

export function CustomerActions({
  customer,
  onRefresh,
}: CustomerActionsProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [documentType, setDocumentType] =
    useState<CustomerDocumentType>(customer.document_type);

  const [documentNumber, setDocumentNumber] = useState(
    customer.document_number ?? ""
  );

  const [firstName, setFirstName] = useState(customer.first_name);
  const [lastName, setLastName] = useState(customer.last_name ?? "");
  const [businessName, setBusinessName] = useState(
    customer.business_name ?? ""
  );

  const [email, setEmail] = useState(customer.email ?? "");
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [address, setAddress] = useState(customer.address ?? "");

  async function handleUpdate() {
    if (!firstName.trim() && !businessName.trim()) {
      alert("Ingresa un nombre o razón social.");
      return;
    }

    setSaving(true);

    try {
      await customerService.update(customer.id, {
        document_type: documentType,
        document_number: documentNumber.trim() || null,
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        business_name: businessName.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
      });

      setOpen(false);
      await onRefresh();
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el cliente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const customerName =
      customer.business_name ||
      `${customer.first_name} ${customer.last_name ?? ""}`.trim();

    const confirmed = window.confirm(
      `¿Eliminar al cliente "${customerName}"?`
    );

    if (!confirmed) return;

    try {
      await customerService.delete(customer.id);
      await onRefresh();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el cliente.");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Acciones del cliente"
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Tipo de documento</Label>

              <select
                value={documentType}
                onChange={(event) =>
                  setDocumentType(
                    event.target.value as CustomerDocumentType
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">Carné de extranjería</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Número de documento</Label>
              <Input
                value={documentNumber}
                onChange={(event) =>
                  setDocumentNumber(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Nombres</Label>
              <Input
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Apellidos</Label>
              <Input
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Razón social</Label>
              <Input
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Correo</Label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Dirección</Label>
              <Input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
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