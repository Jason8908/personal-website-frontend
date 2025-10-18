import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Education } from "@/services";
import { formatDate } from "@/lib/date/format";
import { EducationDialog } from "@/components/admin/dashboard/sections/education-dialog";

type EducationCardProps = {
  education: Education;
};

export function EducationCard({ education }: EducationCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <EducationDialog education={education} open={open} onOpenChange={setOpen} />
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
        className="cursor-pointer transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
      >
      <CardHeader>
        <CardTitle className="leading-tight font-semibold">{education.school}</CardTitle>
        <div className="text-muted-foreground text-sm break-words leading-snug">
          {education.degree}
          {education.fieldOfStudy ? ` • ${education.fieldOfStudy}` : ""}
        </div>
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
    </div>
  );
}