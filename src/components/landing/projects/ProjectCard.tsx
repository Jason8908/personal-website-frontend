import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/services/project/types";
import { GlobeIcon } from "lucide-react";
import { SiGithub } from "react-icons/si";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const hasCover = Boolean(project.imageUrl);

  return (
    <Card className="overflow-hidden transform-gpu transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg border border-border pt-0">
      {hasCover ? (
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={project.imageUrl as string}
            alt={project.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      ) : null}

      <CardHeader className="flex flex-row items-start justify-between gap-6">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">{project.name}</CardTitle>
          <p className="text-lg text-foreground/80 leading-relaxed">{project.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {project.githubUrl ? (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              <SiGithub className="size-5" />
            </Link>
          ) : null}
          {project.websiteUrl ? (
            <Link
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              <GlobeIcon className="h-5 w-5" />
            </Link>
          ) : null}
        </div>
      </CardHeader>

      {project.skills?.length ? (
        <CardContent className="pt-0 pb-4">
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, idx) => (
              <Badge key={idx} variant="outline" className="border-foreground/30 text-foreground/80">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}

export default ProjectCard;