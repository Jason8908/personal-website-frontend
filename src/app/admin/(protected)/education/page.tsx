"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminListPage } from "@/components/admin/AdminListPage";
import { DeleteEntityDialog } from "@/components/admin/DeleteEntityDialog";
import { EducationAdminCard } from "@/components/admin/education/EducationAdminCard";
import { EducationFormDialog } from "@/components/admin/education/EducationFormDialog";
import { useAdminCollection } from "@/components/admin/useAdminCollection";
import { isNotFound, isUnauthorized } from "@/lib/http/apiErrors";
import { ROUTES } from "@/lib/routes";
import { educationService } from "@/services";
import type { Education } from "@/services/education/types";

// Module scope: a changing identity would re-fire the collection's effect.
const loadEducation = () => educationService.getAllEducation();
const byStartDateDesc = (a: Education, b: Education) =>
  new Date(b.startDate).getTime() - new Date(a.startDate).getTime();

export default function AdminEducationPage() {
  const router = useRouter();
  const { status, items, reload, retry } = useAdminCollection(loadEducation, byStartDateDesc);
  const [dialog, setDialog] = useState<{ mode: "create" } | { mode: "edit"; item: Education } | null>(
    null
  );
  const [pendingDelete, setPendingDelete] = useState<Education | null>(null);

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await educationService.deleteEducation(pendingDelete.id);
      await reload();
      toast.success("Education deleted");
    } catch (error) {
      if (isUnauthorized(error)) {
        toast.error("Your session expired. Please sign in again.");
        router.replace(ROUTES.admin.login);
        return;
      }
      if (isNotFound(error)) {
        toast.success("Education deleted");
        await reload();
        return;
      }
      console.error("Deleting education failed", error);
      toast.error("Couldn't delete this entry. Please try again.");
      throw error;
    }
  }

  return (
    <>
      <AdminListPage
        title="Education"
        description="Schools and degrees shown on the public site."
        actionLabel="New education"
        onAction={() => setDialog({ mode: "create" })}
        status={status}
        isEmpty={items.length === 0}
        emptyTitle="No education yet"
        emptyDescription="Add your first school and it will appear on the public site."
        onRetry={retry}
      >
        {items.map((item) => (
          <EducationAdminCard
            key={item.id}
            education={item}
            onEdit={() => setDialog({ mode: "edit", item })}
            onDelete={() => setPendingDelete(item)}
          />
        ))}
      </AdminListPage>

      {dialog && (
        <EducationFormDialog
          key={dialog.mode === "edit" ? dialog.item.id : "new"}
          open
          onOpenChange={(next) => !next && setDialog(null)}
          editing={dialog.mode === "edit" ? dialog.item : null}
          onSaved={reload}
        />
      )}

      <DeleteEntityDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => !next && setPendingDelete(null)}
        title="Delete this education entry?"
        description={
          pendingDelete
            ? `"${pendingDelete.degree}" at ${pendingDelete.school} will be permanently removed from the public site.`
            : ""
        }
        onConfirm={confirmDelete}
      />
    </>
  );
}
