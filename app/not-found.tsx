import Link from "next/link";
import {
  ArrowLeft,
  FileQuestion,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Página no encontrada
        </h1>

        <p className="mt-4 text-muted-foreground">
          La página que intentas abrir no existe, fue movida o no
          está disponible.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Ir al dashboard
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}