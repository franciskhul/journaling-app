import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import React from "react";

export default function ChartCard({
  title,
  icon,
  description,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  description?: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-amber-200">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <span className="mr-2">{icon}</span>
        <CardTitle className="font-fugaz text-amber-900">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-amber-600">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-full flex items-center justify-center bg-amber-50 rounded-lg">
        {children}
      </CardContent>
    </Card>
  );
}
