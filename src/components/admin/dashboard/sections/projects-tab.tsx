import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectList } from "@/components/admin/dashboard/sections/project-list";
import { CreateProjectButton } from "@/components/admin/dashboard/sections/create-project-button";

export function ProjectsTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Projects</CardTitle>
          <CreateProjectButton />
        </div>
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


