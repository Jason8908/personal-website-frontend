"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { experienceService } from "@/services/experience/experience.service";
import type { Experience } from "@/services/experience/types";
import { ExperienceList } from "./ExperienceList";
import { cn } from "@/lib/utils";

type ExperienceSectionProps = {
  className?: string;
};

export function ExperienceSection({ className }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await experienceService.getAllExperiences();
        if (!mounted) return;
        setExperiences(res.data ?? []);
      } catch {
        if (!mounted) return;
        setExperiences([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="experience" className={cn("w-full px-6 py-20", className)}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex items-center justify-center gap-3">
          <BriefcaseBusiness className="h-12 w-12 text-secondary" aria-hidden="true" />
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Experience
          </h2>
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">
            <Spinner className="size-8 text-secondary" />
          </div>
        ) : experiences && experiences.length > 0 ? (
          <ExperienceList items={experiences} />
        ) : (
          <div className="rounded-xl border border-dashed border-border/30 bg-card/30 p-8 text-center">
            <p className="text-foreground/80">Nothing here yet. Check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ExperienceSection;