import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/services";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Globe } from "lucide-react";
// Prefer simple-icons for brand marks
import { SiGithub } from "react-icons/si"
import Image from "next/image";
import { ProjectDialog } from "@/components/admin/dashboard/sections/project-dialog";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden">
      <ProjectDialog project={project} open={open} onOpenChange={setOpen} />
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="overflow-hidden cursor-pointer transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg"
      >
      <CardHeader>
        <CardTitle className="leading-tight font-semibold text-base md:text-lg">
          {project.name}
        </CardTitle>
        <div className="mt-2 grid gap-2">
          <div className="flex items-start gap-2 text-sm">
            <SiGithub className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground break-all"
                aria-label="GitHub"
              >
                {project.githubUrl}
              </a>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            {project.websiteUrl ? (
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground break-all"
                aria-label="Website"
              >
                {project.websiteUrl}
              </a>
            ) : (
              <span className="text-muted-foreground">N/A</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-[200px,1fr] md:gap-6">
          {project.imageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted md:aspect-[4/3]">
              <Image
                src={project.imageUrl}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="hidden md:block" />
          )}

          <div className="flex min-w-0 flex-col gap-4">
            <p className="text-sm text-muted-foreground leading-6 break-words">
              {project.description}
            </p>

            {project.skills?.length ? (
              <>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
      </Card>
    </div>
  );
}


