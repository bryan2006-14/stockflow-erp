"use client";

import { useState } from "react";

import { useProfile } from "@/hooks/useProfile";
import { supplierService } from "@/services/suppliers/supplier.service";
import { SupplierDocumentType } from "@/types/inventory";

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

interface SupplierCreateDialogProps {
  onRefresh: () => void | Promise<void>;
}

export function SupplierCreateDialog({
  onRefresh,
}: SupplierCreateDialogProps) {
  const { profile, loading: profileLoading } = useProfile();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [documentType, setDocumentType] =
    useState<SupplierDocumentType>("RUC");

  const [documentNumber, setDocumentNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  function resetForm() {
    setDocumentType("RUC");
    setDocumentNumber("");
    setBusinessName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setFormError(null);
  }

  async function handleCreate() {
    setFormError(null);

    if (!profile?.company_id) {
      setFormError("No se encontró la empresa del usuario.");
      return;
    }

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
      await supplierService.create({
        company_id: profile.company_id,
        document_type: documentType,
        document_number: documentNumber.trim() || null,
        business_name: businessName.trim(),
        contact_name: contactName.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        is_active: true,
      });

      resetForm();
      setOpen(false);
      await onRefresh();
    } catch (error) {
      console.error(error);

      setFormError(
        "No se pudo crear el proveedor. Revisa que el documento no esté repetido."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={profileLoading}>
          Nuevo proveedor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo proveedor</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="supplier-document-type">
              Tipo de documento
            </Label>

            <select
              id="supplier-document-type"
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
              <option value="CE">Carné de extranjería</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier-document-number">
              Número de documento
            </Label>

            <Input
              id="supplier-document-number"
              value={documentNumber}
              onChange={(event) =>
                setDocumentNumber(event.target.value)
              }
              placeholder="Ejemplo: 20123456789"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="supplier-business-name">
              Razón social
            </Label>

            <Input
              id="supplier-business-name"
              value={businessName}
              onChange={(event) =>
                setBusinessName(event.target.value)
              }
              placeholder="Ejemplo: Tech Import Perú S.A.C."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="supplier-contact-name">
              Persona de contacto
            </Label>

            <Input
              id="supplier-contact-name"
              value={contactName}
              onChange={(event) =>
                setContactName(event.target.value)
              }
              placeholder="Ejemplo: Carlos Mendoza"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier-email">Correo</Label>

            <Input
              id="supplier-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ventas@proveedor.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier-phone">Teléfono</Label>

            <Input
              id="supplier-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="987654321"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="supplier-address">Dirección</Label>

            <Input
              id="supplier-address"
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              placeholder="Av. Principal 123, Lima"
            />
          </div>
        </div>

        {formError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}

        <Button
          onClick={handleCreate}
          disabled={saving}
          className="mt-4 w-full"
        >
          {saving ? "Guardando..." : "Guardar proveedor"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}