"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";

import { useCompanySettings } from "@/hooks/settings/useCompanySettings";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyFormState {
  name: string;
  ruc: string;
  email: string;
  phone: string;
  address: string;
}

const initialForm: CompanyFormState = {
  name: "",
  ruc: "",
  email: "",
  phone: "",
  address: "",
};

export function CompanySettingsForm() {
  const {
    company,
    loading,
    saving,
    error,
    success,
    reload,
    updateCompany,
    clearMessages,
  } = useCompanySettings();

  const [form, setForm] =
    useState<CompanyFormState>(initialForm);

  const [validationError, setValidationError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!company) {
      return;
    }

    setForm({
      name: company.name,
      ruc: company.ruc,
      email: company.email,
      phone: company.phone,
      address: company.address,
    });
  }, [company]);

  function updateField(
    field: keyof CompanyFormState,
    value: string
  ) {
    clearMessages();
    setValidationError(null);

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setValidationError(null);
    clearMessages();

    if (!form.name.trim()) {
      setValidationError(
        "El nombre de la empresa es obligatorio."
      );

      return;
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      setValidationError(
        "Ingresa un correo electrónico válido."
      );

      return;
    }

    await updateCompany(form);
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Building2 className="h-5 w-5 text-primary" />
          </div>

          <div>
            <CardTitle>Información de la empresa</CardTitle>

            <CardDescription className="mt-1">
              Estos datos identifican a tu empresa dentro de
              StockFlow ERP.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {(validationError || error) && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />

            <AlertDescription>
              {validationError || error}
            </AlertDescription>

            {error && (
              <div
                data-slot="alert-action"
                className="absolute right-2 top-2"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void reload()}
                >
                  Reintentar
                </Button>
              </div>
            )}
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />

            <AlertDescription className="text-emerald-700 dark:text-emerald-300">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company-name">
                Nombre de la empresa
              </Label>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="company-name"
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="StockFlow Demo"
                  className="pl-9"
                  maxLength={120}
                  disabled={saving}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-ruc">RUC</Label>

              <Input
                id="company-ruc"
                value={form.ruc}
                onChange={(event) =>
                  updateField(
                    "ruc",
                    event.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="20123456789"
                inputMode="numeric"
                maxLength={11}
                disabled={saving}
              />

              <p className="text-xs text-muted-foreground">
                El RUC peruano contiene 11 dígitos.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-email">
                Correo electrónico
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="company-email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  placeholder="administracion@empresa.com"
                  className="pl-9"
                  maxLength={150}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-phone">
                Teléfono
              </Label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="company-phone"
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="+51 999 999 999"
                  className="pl-9"
                  maxLength={30}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-address">
              Dirección
            </Label>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <textarea
                id="company-address"
                value={form.address}
                onChange={(event) =>
                  updateField("address", event.target.value)
                }
                placeholder="Av. Principal 123, Nueva Cajamarca, San Martín"
                className="flex min-h-24 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={250}
                disabled={saving}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => {
                if (!company) {
                  return;
                }

                setValidationError(null);
                clearMessages();

                setForm({
                  name: company.name,
                  ruc: company.ruc,
                  email: company.email,
                  phone: company.phone,
                  address: company.address,
                });
              }}
            >
              Restablecer
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}

              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}