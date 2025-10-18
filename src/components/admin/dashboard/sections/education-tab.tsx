import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationList } from "@/components/admin/dashboard/sections/education-list";

export function EducationTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <EducationList />
      </CardContent>
    </Card>
  );
}


