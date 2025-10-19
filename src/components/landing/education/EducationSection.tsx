"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { educationService } from "@/services/education/education.service";
import type { Education } from "@/services/education/types";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type EducationSectionProps = {
  className?: string;
};

export function EducationSection({ className }: EducationSectionProps) {
  const [education, setEducation] = useState<Education[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await educationService.getAllEducation();
        if (!isMounted) return;
        setEducation(res.data ?? []);
      } catch {
        if (!isMounted) return;
        setEducation([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="education" className={cn("w-full px-6 py-20", className)}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex items-center justify-center gap-3">
          <GraduationCap className="h-12 w-12 text-secondary" aria-hidden="true" />
          <h2 className="text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Education
          </h2>
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">
            <Spinner className="size-8 text-secondary" />
          </div>
        ) : education && education.length > 0 ? (
          <ul className="grid gap-6">
            {education.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-card/50 p-5 shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-2xl font-semibold">
                      {item.degree} ({item.fieldOfStudy})
                    </h3>
                    <p className="text-base text-foreground/70">
                      {formatDateRange(item.startDate, item.endDate)}
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
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border/30 bg-card/30 p-8 text-center">
            <p className="text-foreground/80">Nothing here yet. Check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const startStr = start.toLocaleString(undefined, { month: "short", year: "numeric" });
  const endStr = isNaN(end.getTime()) ? "Present" : end.toLocaleString(undefined, { month: "short", year: "numeric" });
  return `${startStr} - ${endStr}`;
}

export default EducationSection;


