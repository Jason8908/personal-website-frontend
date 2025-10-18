import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EducationTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>
          Placeholder: manage your education history. Add entries, edit, and reorder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          This area will show a list of education entries with actions.
        </div>
      </CardContent>
    </Card>
  );
}


