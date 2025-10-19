import type { Education } from "@/services/education/types";
import { formatDate, formatDateRange } from "@/lib/date/format";

type EducationItemProps = {
  item: Education;
};

export function EducationItem({ item }: EducationItemProps) {
  return (
    <li className="rounded-xl border border-border bg-card/50 p-5 shadow">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-2xl font-semibold">
            {item.degree} ({item.fieldOfStudy})
          </h3>
          <p className="text-base text-foreground/70">
            {formatDateRange(item.startDate, item.endDate, "MMMM yyyy")}
          </p>
        </div>
        <p className="text-xl font-semibold text-foreground text-secondary">
          {item.school}
        </p>
        {item.description ? (
          <div className="mt-2">
            <p className="text-base leading-relaxed text-foreground/85">
              {item.description}
            </p>
          </div>
        ) : null}
      </div>
    </li>
  );
}

export default EducationItem;