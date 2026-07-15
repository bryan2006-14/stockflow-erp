"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Supplier,
  SupplierDocumentType,
} from "@/types/inventory";

import { supplierService } from "@/services/suppliers/supplier.service";

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

interface SupplierActionsProps {
  supplier: Supplier;
  onRefresh: () => void | Promise<void>;
}

export function SupplierActions({
  supplier,
  onRefresh,
}: SupplierActionsProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [documentType, setDocumentType] =
    useState<SupplierDocumentType>(
      supplier.document_type
    );

  const [documentNumber, setDocumentNumber] = useState(
    supplier.document_number ?? ""
  );

  const [businessName, setBusinessName] = useState(
    supplier.business_name
  );

  const [contactName, setContactName] = useState(
    supplier.contact_name ?? ""
  );

  const [email, setEmail] = useState(supplier.email ?? "");
  const [phone, setPhone] = useState(supplier.phone ?? "");
  const [address, setAddress] = useState(
    supplier.address ?? ""
  );

  async function handleUpdate() {
    setFormError(null);

    if (!businessName.trim()) {
      setFormError("La razón social es obligatoria.");
      return;
    }

    if (
      documentType === "RUC" &&
      documentNumber.trim() &&
      documentNumber.trim().length !== 11
    ) {
      setFormError("El RUC debe tener 11 dígitos.");
      return;
    }

    setSaving(true);

    try {
      await supplierService.update(supplier.id, {
        document_type: documentType,
        document_number: documentNumber.trim() || null,
        business_name: businessName.trim(),
        contact_name: contactName.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
      });

      setOpen(false);
      await onRefresh();
    } catch (error) {
      console.error(error);

      setFormError(
        "No se pudo actualizar el proveedor. Revisa el documento."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Eliminar al proveedor "${supplier.business_name}"?`
    );

    if (!confirmed) return;

    try {
      await supplierService.delete(supplier.id);
      await onRefresh();
    } catch (error) {
      console.error(error);

      alert(
        "No se pudo eliminar el proveedor. Puede estar relacionado con una compra."
      );
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Acciones de ${supplier.business_name}`}
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
            <DialogTitle>Editar proveedor</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`supplier-type-${supplier.id}`}>
                Tipo de documento
              </Label>

              <select
                id={`supplier-type-${supplier.id}`}
                value={documentType}
                onChange={(event) =>
                  setDocumentType(
                    event.target.value as SupplierDocumentType
                  )
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="RUC">RUC</option>
                <option value="DNI">DNI</option>
                <option value="CE">
                  Carné de extranjería
                </option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`supplier-document-${supplier.id}`}
              >
                Número de documento
              </Label>

              <Input
                id={`supplier-document-${supplier.id}`}
                value={documentNumber}
                onChange={(event) =>
                  setDocumentNumber(event.target.value)
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor={`supplier-business-${supplier.id}`}
              >
                Razón social
              </Label>

              <Input
                id={`supplier-business-${supplier.id}`}
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor={`supplier-contact-${supplier.id}`}
              >
                Persona de contacto
              </Label>

              <Input
                id={`supplier-contact-${supplier.id}`}
                value={contactName}
                onChange={(event) =>
                  setContactName(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`supplier-email-${supplier.id}`}>
                Correo
              </Label>

              <Input
                id={`supplier-email-${supplier.id}`}
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`supplier-phone-${supplier.id}`}>
                Teléfono
              </Label>

              <Input
                id={`supplier-phone-${supplier.id}`}
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor={`supplier-address-${supplier.id}`}
              >
                Dirección
              </Label>

              <Input
                id={`supplier-address-${supplier.id}`}
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
              />
            </div>
          </div>

          {formError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          )}

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