import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectList } from "@/components/admin/dashboard/sections/project-list";

export function ProjectsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>
          Placeholder: manage your projects. Add project, edit details, and showcase order.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <ProjectList />
      </CardContent>
    </Card>
  );
}


