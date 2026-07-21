import {
  Building2,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { CompanySettingsForm } from "@/components/settings/CompanySettingsForm";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Settings className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Configuración
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Administra los datos generales de tu empresa.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <CompanySettingsForm />

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>

              <h2 className="font-semibold">
                Datos empresariales
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                La información registrada podrá utilizarse
                posteriormente en comprobantes, reportes y documentos
                generados por el sistema.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>

              <h2 className="font-semibold">
                Empresa vinculada
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Los cambios se aplican únicamente a la empresa
                asociada con tu perfil de usuario.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}