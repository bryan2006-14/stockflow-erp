import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-muted-foreground">
          Bienvenido nuevamente 👋
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Aquí puedes visualizar el estado general de tu empresa.
        </p>
      </div>

      <Button className="gap-2 rounded-xl">
        <Plus className="h-4 w-4" />

        Nueva Venta
      </Button>
    </div>
  );
}