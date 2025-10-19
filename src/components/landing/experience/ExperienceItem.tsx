import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateRange } from "@/lib/date/format";
import type { Experience } from "@/services/experience/types";

type ExperienceItemProps = {
  item: Experience;
  isFirst?: boolean;
};

export function ExperienceItem({ item, isFirst = false }: ExperienceItemProps) {
  return (
    <li className="relative pl-10">
      <span
        className={
          "absolute left-4 top-5 -translate-x-1/2 -translate-y-1/2 rounded-full z-10 " +
          (isFirst ? "h-3 w-3 bg-primary" : "h-2 w-2 bg-foreground")
        }
        aria-hidden
      />
      <div className="rounded-xl bg-card/50 p-5 shadow">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-2xl font-semibold text-foreground">
            {item.position}
          </h3>
          <p className="text-md text-foreground/70">
            {buildDateRange(item.startDate, item.endDate)}
          </p>
        </div>
        <p className="mt-1 text-xl font-semibold text-primary">{item.company}</p>

        {item.bulletPoints?.length ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-foreground/85">
            {item.bulletPoints.map((bp, idx) => (
              <li key={idx} className="text-md leading-relaxed">
                {bp}
              </li>
            ))}
          </ul>
        ) : null}

        {item.skills?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.skills.map((skill, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="border-foreground/30 text-foreground/80 hover:bg-foreground/5 px-2.5 py-0.5 text-sm"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}

function buildDateRange(startIso: string, endIso?: string): string {
  const end = endIso ? new Date(endIso) : new Date('');
  if (!endIso || isNaN(end.getTime())) {
    return `${formatDate(startIso, "MMM yyyy")} - Present`;
  }
  return formatDateRange(startIso, endIso, "MMM yyyy");
}

export default ExperienceItem;