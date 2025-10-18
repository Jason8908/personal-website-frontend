"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Project } from "@/services";
import { Globe } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Image from "next/image";
import { XIcon } from "lucide-react";

type ProjectDialogProps = {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectDialog({ project, open, onOpenChange }: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="absolute right-3 top-3">
          <DialogClose className="h-8 w-8 p-0" aria-label="Close">
            <XIcon className="size-4" />
          </DialogClose>
        </div>

        <div className="grid gap-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold leading-tight">
              {project.name}
            </DialogTitle>
            <DialogDescription className="text-foreground">
              {project.description}
            </DialogDescription>
          </DialogHeader>

          {project.imageUrl ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
              <Image src={project.imageUrl} alt={project.name} fill className="object-cover" />
            </div>
          ) : null}

          <section className="grid gap-2 text-sm">
            <div className="flex items-start gap-2">
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
            <div className="flex items-start gap-2">
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
          </section>

          {project.skills?.length ? (
            <>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-sm font-medium">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          <DialogFooter>
            <div className="flex w-full items-center justify-end gap-2">
              <Button variant="outline">Edit</Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}


