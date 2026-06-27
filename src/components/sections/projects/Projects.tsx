"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { projectService } from "@/services/project/project.service";
import type { Project } from "@/services/project/types";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Spinner } from "@/components/ui/spinner";

type Status = "loading" | "error" | "ready";

export function Projects() {
  const t = useTranslations("Projects");
  const [status, setStatus] = useState<Status>("loading");
  const [items, setItems] = useState<Project[]>([]);

  useEffect(() => {
    let active = true;
    projectService
      .getAllProjects()
      .then((res) => {
        if (!active) return;
        setItems(res.data);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  const isEmpty = status === "ready" && items.length === 0;

  return (
    <section id="projects" className="scroll-mt-20">
      <SectionHeading title={t("title")} />

      {status === "loading" && (
        <div className="flex justify-center py-10">
          <Spinner className="size-8 text-muted-foreground" />
        </div>
      )}

      {(status === "error" || isEmpty) && (
        <p className="py-10 text-center text-muted-foreground">{t("empty")}</p>
      )}

      {status === "ready" && items.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {items.map((project) => (
            <ProjectCard key={project.id} project={project} githubLabel={t("github")} />
          ))}
        </div>
      )}
    </section>
  );
}
