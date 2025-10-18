import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationList } from "@/components/admin/dashboard/sections/education-list";
import { CreateEducationButton } from "@/components/admin/dashboard/sections/create-education-button";

export function EducationTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Education</CardTitle>
          <CreateEducationButton />
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <EducationList />
      </CardContent>
    </Card>
  );
}