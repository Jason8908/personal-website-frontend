"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date/format";
import type { Experience } from "@/services/experience/types";

export function ExperienceAdminCard({
  experience,
  onEdit,
  onDelete,
}: {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { company, position, bulletPoints, skills, startDate, endDate } = experience;
  const start = formatDate(startDate, "MMM yyyy", { timeZone: "utc" });
  const end = endDate ? formatDate(endDate, "MMM yyyy", { timeZone: "utc" }) : "Present";

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground">{position}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            <span className="font-medium text-highlight">{company}</span> &middot; {start} - {end}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            aria-label={`Edit ${position} at ${company}`}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label={`Delete ${position} at ${company}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {bulletPoints.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
          {bulletPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
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
    </article>
  );
}
