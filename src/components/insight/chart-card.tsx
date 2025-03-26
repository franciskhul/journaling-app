import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ChartCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-amber-200">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <span className="mr-2">{icon}</span>
        <CardTitle className="font-fugaz text-amber-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">{children}</CardContent>
    </Card>
  );
}
