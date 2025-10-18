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
import { formatDate } from "@/lib/date/format";
import type { Experience } from "@/services";
import { CalendarIcon, XIcon } from "lucide-react";

type ExperienceDialogProps = {
  experience: Experience;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ExperienceDialog({ experience, open, onOpenChange }: ExperienceDialogProps) {
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
              {experience.position}
            </DialogTitle>
            <div className="text-muted-foreground text-sm">{experience.company}</div>
            <DialogDescription>
              <span className="inline-flex items-center gap-2 text-foreground text-sm">
                <CalendarIcon className="size-4 text-muted-foreground" />
                <span>
                  {formatDate(experience.startDate, "MM/dd/yyyy", { timeZone: "local" })}
                  {" "}-{" "}
                  {experience.endDate
                    ? formatDate(experience.endDate, "MM/dd/yyyy", { timeZone: "local" })
                    : "Present"}
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>

          {experience.bulletPoints?.length ? (
            <section className="space-y-3">
              <h3 className="text-sm font-medium">Highlights</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm leading-6">
                {experience.bulletPoints.map((bp, idx) => (
                  <li key={idx}>{bp}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {experience.skills?.length ? (
            <>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-sm font-medium">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {experience.skills.map((skill) => (
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
              <Button variant="destructive">Delete</Button>
              <Button variant="outline">Edit</Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}


