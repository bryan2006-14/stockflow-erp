import { Boxes } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Boxes className="h-8 w-8 animate-pulse text-primary" />

          <span className="absolute inset-0 animate-ping rounded-2xl border border-primary/30" />
        </div>

        <div>
          <p className="font-semibold">Cargando StockFlow</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Estamos preparando la información.
          </p>
        </div>

        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}