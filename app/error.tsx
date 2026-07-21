"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold">
            Ocurrió un problema
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            StockFlow no pudo completar esta operación. Puedes
            intentarlo nuevamente o regresar al panel principal.
          </p>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-5 w-full rounded-lg border bg-muted/50 p-3 text-left">
              <p className="break-words font-mono text-xs text-muted-foreground">
                {error.message}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Intentar nuevamente
            </Button>

            <Button asChild variant="outline">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Ir al dashboard
              </Link>
            </Button>
          </div>

          {error.digest && (
            <p className="mt-5 font-mono text-xs text-muted-foreground">
              Código: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}