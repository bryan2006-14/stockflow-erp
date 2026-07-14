"use client";

import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <button className="rounded-lg border p-2 transition hover:bg-muted">
        <Bell className="h-5 w-5" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-xl border px-2 py-1.5 transition hover:bg-muted">
            <Avatar>
              <AvatarFallback>BD</AvatarFallback>
            </Avatar>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold">Brayan</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>

            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Mi perfil
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}