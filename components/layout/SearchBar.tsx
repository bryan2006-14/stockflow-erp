"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <Search
        className="
          absolute
          left-3
          top-1/2
          h-4
          w-4
          -translate-y-1/2
          text-muted-foreground
        "
      />

      <input
        type="text"
        placeholder="Buscar productos, clientes, ventas..."
        className="
          w-full
          rounded-xl
          border
          bg-background
          py-2
          pl-10
          pr-4
          text-sm
          outline-none
          transition
          focus:border-indigo-500
          focus:ring-2
          focus:ring-indigo-300
        "
      />
    </div>
  );
}