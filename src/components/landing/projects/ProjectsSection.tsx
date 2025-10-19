"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { projectService } from "@/services/project/project.service";
import type { Project } from "@/services/project/types";
import { ProjectsList } from "./ProjectsList";
import { cn } from "@/lib/utils";

type ProjectsSectionProps = {
  className?: string;
};

export function ProjectsSection({ className }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await projectService.getAllProjects();
        if (!mounted) return;
        setProjects(res.data ?? []);
      } catch {
        if (!mounted) return;
        setProjects([]);
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
    <section id="projects" className={cn("w-full px-6 py-20", className)}>
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 flex items-center justify-center gap-3">
          <Sparkles className="h-12 w-12 text-secondary" aria-hidden="true" />
          <h2 className="text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Projects
          </h2>
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">
            <Spinner className="size-8 text-secondary" />
          </div>
        ) : projects && projects.length > 0 ? (
          <ProjectsList items={projects} />
        ) : (
          <div className="rounded-xl border border-dashed border-border/30 bg-card/30 p-8 text-center">
            <p className="text-foreground/80">Nothing here yet. Check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectsSection;