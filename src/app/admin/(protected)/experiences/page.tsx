"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminListPage } from "@/components/admin/AdminListPage";
import { DeleteEntityDialog } from "@/components/admin/DeleteEntityDialog";
import { ExperienceAdminCard } from "@/components/admin/experiences/ExperienceAdminCard";
import { ExperienceFormDialog } from "@/components/admin/experiences/ExperienceFormDialog";
import { useAdminCollection } from "@/components/admin/useAdminCollection";
import { isNotFound, isUnauthorized } from "@/lib/http/apiErrors";
import { ROUTES } from "@/lib/routes";
import { experienceService } from "@/services";
import type { Experience } from "@/services/experience/types";

// Module scope: a changing identity would re-fire the collection's effect.
const loadExperiences = () => experienceService.getAllExperiences();
const byStartDateDesc = (a: Experience, b: Experience) =>
  new Date(b.startDate).getTime() - new Date(a.startDate).getTime();

export default function AdminExperiencesPage() {
  const router = useRouter();
  const { status, items, reload, retry } = useAdminCollection(loadExperiences, byStartDateDesc);
  const [dialog, setDialog] = useState<{ mode: "create" } | { mode: "edit"; item: Experience } | null>(
    null
  );
  const [pendingDelete, setPendingDelete] = useState<Experience | null>(null);

  const suggestions = useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.skills))).sort(),
    [items]
  );

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await experienceService.deleteExperience(pendingDelete.id);
      await reload();
      toast.success("Experience deleted");
    } catch (error) {
      if (isUnauthorized(error)) {
        toast.error("Your session expired. Please sign in again.");
        router.replace(ROUTES.admin.login);
        return;
      }
      if (isNotFound(error)) {
        // Already gone — treat as success and resync.
        toast.success("Experience deleted");
        await reload();
        return;
      }
      console.error("Deleting experience failed", error);
      toast.error("Couldn't delete this experience. Please try again.");
      throw error;
    }
  }

  return (
    <>
      <AdminListPage
        title="Experience"
        description="Roles shown on the public experience timeline."
        actionLabel="New experience"
        onAction={() => setDialog({ mode: "create" })}
        status={status}
        isEmpty={items.length === 0}
        emptyTitle="No experience yet"
        emptyDescription="Add your first role and it will appear on the public site."
        onRetry={retry}
      >
        {items.map((item) => (
          <ExperienceAdminCard
            key={item.id}
            experience={item}
            onEdit={() => setDialog({ mode: "edit", item })}
            onDelete={() => setPendingDelete(item)}
          />
        ))}
      </AdminListPage>

      {dialog && (
        <ExperienceFormDialog
          // Reset form state when switching records; Radix keeps children mounted.
          key={dialog.mode === "edit" ? dialog.item.id : "new"}
          open
          onOpenChange={(next) => !next && setDialog(null)}
          editing={dialog.mode === "edit" ? dialog.item : null}
          suggestions={suggestions}
          onSaved={reload}
        />
      )}

      <DeleteEntityDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title="Delete this experience?"
        description={
          pendingDelete
            ? `"${pendingDelete.position}" at ${pendingDelete.company} will be permanently removed from the public site.`
            : ""
        }
        onConfirm={confirmDelete}
      />
    </>
  );
}
