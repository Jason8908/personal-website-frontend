import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Experience } from "@/services";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/date/format";

type ExperienceCardProps = {
  experience: Experience;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
          <span className="font-semibold">{experience.position}</span>
          <span className="text-muted-foreground text-sm">{experience.company}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-sm text-muted-foreground">
          {formatDate(experience.startDate, "MM/dd/yyyy", { timeZone: "local" })} - {experience.endDate ? formatDate(experience.endDate, "MM/dd/yyyy", { timeZone: "local" }) : "Present"}
        </div>

        {experience.bulletPoints?.length ? (
          <ul className="list-disc pl-5 text-sm leading-6">
            {experience.bulletPoints.map((bp, idx) => (
              <li key={idx}>{bp}</li>
            ))}
          </ul>
        ) : null}

        {experience.skills?.length ? (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {experience.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}


