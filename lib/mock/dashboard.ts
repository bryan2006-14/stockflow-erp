import {
  Boxes,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

export const dashboardStats = [
  {
    title: "Ventas",
    value: "S/ 48,520",
    description: "+12% respecto al mes anterior",
    icon: DollarSign,
  },
  {
    title: "Productos",
    value: "1,280",
    description: "35 con stock bajo",
    icon: Boxes,
  },
  {
    title: "Clientes",
    value: "356",
    description: "18 nuevos este mes",
    icon: Users,
  },
  {
    title: "Ingresos",
    value: "+18%",
    description: "Crecimiento mensual",
    icon: TrendingUp,
  },
];