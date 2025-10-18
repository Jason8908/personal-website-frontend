"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { educationService } from "@/services";
import type { Education } from "@/services";
import { EducationCard } from "./education-card";

export function EducationList() {
  const [loading, setLoading] = useState(true);
  const [education, setEducation] = useState<Education[] | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await educationService.getAllEducation();
        if (!mounted) return;
        setEducation(res.data ?? []);
      } catch {
        if (!mounted) return;
        toast.error("Unable to get education history");
        setEducation([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    function refresh() {
      setLoading(true);
      load();
    }
    window.addEventListener("education:refresh", refresh);
    return () => {
      mounted = false;
      window.removeEventListener("education:refresh", refresh);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!education || education.length === 0) {
    return <div className="text-muted-foreground text-sm">There are no education entries to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {education.map((e) => (
        <EducationCard key={e.id} education={e} />
      ))}
    </div>
  );
}


