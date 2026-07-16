"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  BarChart3,
  Boxes,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FolderTree,
  History,
  LayoutDashboard,
  Package,
  PackagePlus,
  Ruler,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { AppLogo } from "./AppLogo";

interface MenuChild {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: MenuChild[];
}

const menu: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventario",
    icon: Boxes,
    children: [
      {
        title: "Productos",
        href: "/inventory/products",
        icon: Package,
      },
      {
        title: "Categorías",
        href: "/inventory/categories",
        icon: FolderTree,
      },
      {
        title: "Marcas",
        href: "/inventory/brands",
        icon: Tags,
      },
      {
        title: "Unidades",
        href: "/inventory/units",
        icon: Ruler,
      },
      {
        title: "Movimientos",
        href: "/inventory/movements",
        icon: PackagePlus,
      },
      {
        title: "Kardex",
        href: "/inventory/kardex",
        icon: History,
      },
    ],
  },
  {
    title: "Ventas",
    icon: ShoppingCart,
    children: [
      {
        title: "Historial de ventas",
        href: "/sales",
        icon: CircleDollarSign,
      },
    ],
  },
  {
    title: "Compras",
    icon: PackagePlus,
    children: [
      {
        title: "Historial de compras",
        href: "/purchases",
        icon: Package,
      },
    ],
  },
  {
    title: "Gestión comercial",
    icon: Users,
    children: [
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
    ],
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

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Inventario: pathname.startsWith("/inventory"),
    Ventas: pathname.startsWith("/sales"),
    Compras: pathname.startsWith("/purchases"),
    "Gestión comercial":
      pathname.startsWith("/customers") ||
      pathname.startsWith("/suppliers"),
  });

  function toggleGroup(title: string) {
    setOpenGroups((current) => ({
      ...current,
      [title]: !current[title],
    }));
  }

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r bg-card lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="border-b px-5 py-5">
        <AppLogo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Menú principal
        </p>

        <ul className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const groupActive = item.children.some((child) =>
                isRouteActive(pathname, child.href)
              );

              const isOpen =
                openGroups[item.title] ?? groupActive;

              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.title)}
                    aria-expanded={isOpen}
                    className={`
                      flex w-full items-center justify-between rounded-xl px-3 py-2.5
                      text-sm font-medium transition-colors
                      ${
                        groupActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </span>

                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <ul className="ml-5 mt-1 space-y-1 border-l pl-3">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const active = isRouteActive(
                          pathname,
                          child.href
                        );

                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`
                                flex items-center gap-3 rounded-lg px-3 py-2
                                text-sm transition-colors
                                ${
                                  active
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }
                              `}
                            >
                              <ChildIcon className="h-4 w-4 shrink-0" />
                              <span className="truncate">
                                {child.title}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            const active = item.href
              ? isRouteActive(pathname, item.href)
              : false;

            return (
              <li key={item.title}>
                <Link
                  href={item.href ?? "#"}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-sm font-medium transition-colors
                    ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/70 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
            BD
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              Brayan Delgado
            </p>

            <p className="truncate text-xs text-muted-foreground">
              Administrador
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}