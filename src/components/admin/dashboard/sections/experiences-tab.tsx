import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ExperiencesTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiences</CardTitle>
        <CardDescription>
          Placeholder: list and manage professional experiences. Create, edit, delete coming soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          This area will show a table or list of experiences with actions.
        </div>
      </CardContent>
    </Card>
  );
}


