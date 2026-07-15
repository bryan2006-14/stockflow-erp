"use client";

import { useState } from "react";

import { CustomerDocumentType } from "@/types/inventory";
import { useProfile } from "@/hooks/useProfile";
import { customerService } from "@/services/customers/customer.service";

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

interface CustomerCreateDialogProps {
  onRefresh: () => void | Promise<void>;
}

export function CustomerCreateDialog({
  onRefresh,
}: CustomerCreateDialogProps) {
  const { profile, loading: profileLoading } = useProfile();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [documentType, setDocumentType] =
    useState<CustomerDocumentType>("DNI");

  const [documentNumber, setDocumentNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  function resetForm() {
    setDocumentType("DNI");
    setDocumentNumber("");
    setFirstName("");
    setLastName("");
    setBusinessName("");
    setEmail("");
    setPhone("");
    setAddress("");
  }

  async function handleCreate() {
    if (!profile?.company_id) {
      alert("No se encontró la empresa del usuario.");
      return;
    }

    if (!firstName.trim() && !businessName.trim()) {
      alert("Ingresa un nombre o razón social.");
      return;
    }

    setSaving(true);

    try {
      await customerService.create({
        company_id: profile.company_id,
        document_type: documentType,
        document_number: documentNumber.trim() || null,
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        business_name: businessName.trim() || null,
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
      alert("No se pudo crear el cliente. Revisa el documento.");
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
        <Button disabled={profileLoading}>Nuevo cliente</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
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
              placeholder="Ejemplo: 12345678"
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
              placeholder="Opcional para empresas"
            />
          </div>

          <div className="space-y-2">
            <Label>Correo</Label>
            <Input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Dirección</Label>
            <Input
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
            />
          </div>
        </div>

        <Button
          onClick={handleCreate}
          disabled={saving}
          className="mt-4 w-full"
        >
          {saving ? "Guardando..." : "Guardar cliente"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}