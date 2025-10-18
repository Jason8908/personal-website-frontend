import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EducationTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          This area will show a list of education entries with actions.
        </div>
      </CardContent>
    </Card>
  );
}


