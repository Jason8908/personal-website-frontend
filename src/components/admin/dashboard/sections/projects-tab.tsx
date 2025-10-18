import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>
          Placeholder: manage your projects. Add project, edit details, and showcase order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          This area will show a grid or list of projects with actions.
        </div>
      </CardContent>
    </Card>
  );
}


