"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { projectService } from "@/services";
import type { Project } from "@/services";
import { ProjectCard } from "./project-card";

export function ProjectList() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await projectService.getAllProjects();
        if (!mounted) return;
        setProjects(res.data ?? []);
      } catch {
        if (!mounted) return;
        toast.error("Unable to get projects");
        setProjects([]);
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
    window.addEventListener("projects:refresh", refresh);
    return () => {
      mounted = false;
      window.removeEventListener("projects:refresh", refresh);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return <div className="text-muted-foreground text-sm">There are no projects to display.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}


