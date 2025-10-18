import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Education } from "@/services";
import { formatDate } from "@/lib/date/format";

type EducationCardProps = {
  education: Education;
};

export function EducationCard({ education }: EducationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
          <span className="font-semibold">{education.school}</span>
          <span className="text-muted-foreground text-sm">{education.degree} • {education.fieldOfStudy}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="text-sm text-muted-foreground">
          {formatDate(education.startDate, "MM/dd/yyyy", { timeZone: "local" })} - {education.endDate ? formatDate(education.endDate, "MM/dd/yyyy", { timeZone: "local" }) : "Present"}
        </div>
        {education.description ? (
          <p className="text-sm leading-6 text-foreground">{education.description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}