import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StockFlow ERP",
    template: "%s | StockFlow ERP",
  },
  description:
    "Sistema ERP moderno para la gestión de inventario, ventas, compras, clientes y proveedores.",
  applicationName: "StockFlow ERP",
  keywords: [
    "ERP",
    "inventario",
    "ventas",
    "compras",
    "StockFlow",
  ],
  authors: [
    {
      name: "Brayan Delgado",
    },
  ],
  creator: "Brayan Delgado",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}