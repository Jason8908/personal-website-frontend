import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardHeader() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl md:text-3xl">Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="px-0" />
    </Card>
  );
}


