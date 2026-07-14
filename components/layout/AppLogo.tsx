import { Boxes } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
        <Boxes className="h-5 w-5" />
      </div>

      <div>
        <h1 className="text-lg font-bold tracking-tight">
          StockFlow
        </h1>

        <p className="text-xs text-muted-foreground">
          ERP SaaS
        </p>
      </div>
    </div>
  );
}