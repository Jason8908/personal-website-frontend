import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExperienceList } from "@/components/admin/dashboard/sections/experience-list";
import { CreateExperienceButton } from "@/components/admin/dashboard/sections/create-experience-button";

export function ExperiencesTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Experiences</CardTitle>
          <CreateExperienceButton />
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <ExperienceList />
      </CardContent>
    </Card>
  );
}


