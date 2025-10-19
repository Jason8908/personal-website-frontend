"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { educationService } from "@/services/education/education.service";
import type { Education } from "@/services/education/types";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { EducationList } from "./EducationList";
import { useTranslations } from "next-intl";

type EducationSectionProps = {
  className?: string;
};

export function EducationSection({ className }: EducationSectionProps) {
  const t = useTranslations("Sections.education");
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
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">
            <Spinner className="size-8 text-secondary" />
          </div>
        ) : education && education.length > 0 ? (
          <EducationList items={education} />
        ) : (
          <div className="rounded-xl border border-dashed border-border/30 bg-card/30 p-8 text-center">
            <p className="text-foreground/80">{t("empty")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default EducationSection;


