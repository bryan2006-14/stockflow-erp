"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Package,
  Users,
  Truck,
  BarChart3,
  Settings,
} from "lucide-react";

import { AppLogo } from "./AppLogo";

const menu = [

  {
  title: "Kardex",
  href: "/inventory/kardex",
  icon: History,
},

  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventario",
    href: "/inventory",
    icon: Boxes,
  },
  {
    title: "Ventas",
    href: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Compras",
    href: "/purchases",
    icon: Package,
  },
  {
    title: "Clientes",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Proveedores",
    href: "/suppliers",
    icon: Truck,
  },
  {
    title: "Reportes",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 border-r bg-white lg:flex lg:flex-col dark:bg-zinc-950">
      {/* Logo */}
      <div className="border-b p-5">
        <AppLogo />
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />

                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Usuario */}
      <div className="border-t p-5">
        <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
            BD
          </div>

          <div>
            <p className="font-semibold">
              Brayan
            </p>

            <p className="text-xs text-muted-foreground">
              Administrador
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}