"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/services/project/types";

export function ProjectAdminCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { name, description, imageUrl, githubUrl, websiteUrl, skills } = project;

  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-5">
      {imageUrl && (
        <div className="relative hidden aspect-video w-32 shrink-0 overflow-hidden rounded-md sm:block">
          <Image src={imageUrl} alt="" fill className="object-cover" sizes="128px" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onEdit}
              aria-label={`Edit ${name}`}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              aria-label={`Delete ${name}`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </div>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>

        {(githubUrl || websiteUrl) && (
          <div className="mt-2 flex flex-col gap-1 text-sm">
            {githubUrl && (
              <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
                <FaGithub className="size-3.5 shrink-0" />
                <span className="truncate">{githubUrl}</span>
              </span>
            )}
            {websiteUrl && <span className="truncate text-highlight">{websiteUrl}</span>}
          </div>
        )}

        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
