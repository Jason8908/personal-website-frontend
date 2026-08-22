"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date/format";
import type { Education } from "@/services/education/types";

export function EducationAdminCard({
  education,
  onEdit,
  onDelete,
}: {
  education: Education;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { school, degree, fieldOfStudy, description, startDate, endDate } = education;
  const start = formatDate(startDate, "MMM yyyy", { timeZone: "utc" });
  const end = formatDate(endDate, "MMM yyyy", { timeZone: "utc" });

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground">
            {degree}, {fieldOfStudy}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            <span className="font-medium text-highlight">{school}</span> &middot; {start} - {end}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            aria-label={`Edit ${degree} at ${school}`}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label={`Delete ${degree} at ${school}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </article>
  );
}
