import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperienceList } from "@/components/admin/dashboard/sections/experience-list";

export function ExperiencesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiences</CardTitle>
        <CardDescription>
          Placeholder: list and manage professional experiences. Create, edit, delete coming soon.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <ExperienceList />
      </CardContent>
    </Card>
  );
}


