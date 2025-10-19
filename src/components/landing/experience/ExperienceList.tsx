import type { Experience } from "@/services/experience/types";
import { ExperienceItem } from "./ExperienceItem";

type ExperienceListProps = {
  items: Experience[];
};

export function ExperienceList({ items }: ExperienceListProps) {
  if (!items.length) return null;

  const sorted = [...items].sort((a, b) => {
    const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity;
    const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity;
    const aStart = new Date(a.startDate).getTime();
    const bStart = new Date(b.startDate).getTime();
    const aKey = isFinite(aEnd) ? aEnd : Math.max(aEnd, aStart);
    const bKey = isFinite(bEnd) ? bEnd : Math.max(bEnd, bStart);
    return bKey - aKey;
  });

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-0 bottom-0 w-px bg-foreground/40" aria-hidden />
      <ol className="space-y-6">
        {sorted.map((item, idx) => (
          <ExperienceItem key={item.id} item={item} isFirst={idx === 0} />
        ))}
      </ol>
    </div>
  );
}

export default ExperienceList;