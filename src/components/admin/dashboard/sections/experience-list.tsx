"use client";

import { useEffect, useState } from "react";
import { experienceService } from "@/services";
import type { Experience } from "@/services";
import { ExperienceCard } from "./experience-card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function ExperienceList() {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<Experience[] | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await experienceService.getAllExperiences();
        if (!mounted) return;
        setExperiences(res.data ?? []);
      } catch (err) {
        if (!mounted) return;
        toast.error("Unable to get experiences");
        setExperiences([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        There are no experiences to display.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {experiences.map((exp) => (
        <ExperienceCard key={exp.id} experience={exp} />
      ))}
    </div>
  );
}


