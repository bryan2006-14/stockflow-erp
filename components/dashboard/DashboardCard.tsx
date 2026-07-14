import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
}

export function DashboardCard({
  title,
  value,
  description,
  icon,
}: DashboardCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        {icon}
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold">
          {value}
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}