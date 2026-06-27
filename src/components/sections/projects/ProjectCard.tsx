import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/services/project/types";

export function ProjectCard({
  project,
  githubLabel,
}: {
  project: Project;
  githubLabel: string;
}) {
  const { name, description, imageUrl, githubUrl, websiteUrl, skills } = project;

  return (
    <article className="flex basis-full flex-col overflow-hidden rounded-xl border border-border bg-card sm:basis-[calc(50%-0.75rem)]">
      {imageUrl && (
        <div className="relative aspect-video w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground">{name}</h3>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={githubLabel}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaGithub className="size-5" />
            </a>
          )}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm text-highlight hover:underline"
          >
            {websiteUrl}
          </a>
        )}
        {skills.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
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
