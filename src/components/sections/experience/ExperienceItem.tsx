import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date/format";
import type { Experience } from "@/services/experience/types";

export function ExperienceItem({
  experience,
  presentLabel,
  isMostRecent = false,
}: {
  experience: Experience;
  presentLabel: string;
  isMostRecent?: boolean;
}) {
  const { company, position, bulletPoints, skills, startDate, endDate } = experience;
  const start = formatDate(startDate, "MMM yyyy", { timeZone: "utc" });
  const end = endDate ? formatDate(endDate, "MMM yyyy", { timeZone: "utc" }) : presentLabel;

  return (
    <li className="relative pl-8">
      <span
        className={cn(
          "absolute top-1.5 rounded-full border-2 border-background -left-[6.5px] size-3 bg-foreground",
          isMostRecent && "shadow-[0_0_10px_2px_rgba(234,251,255,0.6)]"
        )}
      />
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{position}</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-highlight">{company}</span> &middot; {start} - {end}
          </p>
        </div>
        {bulletPoints.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
            {bulletPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        )}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
