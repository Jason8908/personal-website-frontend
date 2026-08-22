"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminListPage } from "@/components/admin/AdminListPage";
import { DeleteEntityDialog } from "@/components/admin/DeleteEntityDialog";
import { ProjectAdminCard } from "@/components/admin/projects/ProjectAdminCard";
import { ProjectFormDialog } from "@/components/admin/projects/ProjectFormDialog";
import { useAdminCollection } from "@/components/admin/useAdminCollection";
import { isNotFound, isUnauthorized } from "@/lib/http/apiErrors";
import { ROUTES } from "@/lib/routes";
import { projectService } from "@/services";
import type { Project } from "@/services/project/types";

// Module scope: a changing identity would re-fire the collection's effect.
const loadProjects = () => projectService.getAllProjects();
// The API returns no order at all; alphabetical is easiest to scan when editing.
const byName = (a: Project, b: Project) => a.name.localeCompare(b.name);

export default function AdminProjectsPage() {
  const router = useRouter();
  const { status, items, reload, retry } = useAdminCollection(loadProjects, byName);
  const [dialog, setDialog] = useState<{ mode: "create" } | { mode: "edit"; item: Project } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const suggestions = useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.skills))).sort(),
    [items]
  );

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await projectService.deleteProject(pendingDelete.id);
      await reload();
      toast.success("Project deleted");
    } catch (error) {
      if (isUnauthorized(error)) {
        toast.error("Your session expired. Please sign in again.");
        router.replace(ROUTES.admin.login);
        return;
      }
      if (isNotFound(error)) {
        toast.success("Project deleted");
        await reload();
        return;
      }
      console.error("Deleting project failed", error);
      toast.error("Couldn't delete this project. Please try again.");
      throw error;
    }
  }

  return (
    <>
      <AdminListPage
        title="Projects"
        description="Work shown in the projects section of the public site."
        actionLabel="New project"
        onAction={() => setDialog({ mode: "create" })}
        status={status}
        isEmpty={items.length === 0}
        emptyTitle="No projects yet"
        emptyDescription="Add your first project and it will appear on the public site."
        onRetry={retry}
      >
        {items.map((item) => (
          <ProjectAdminCard
            key={item.id}
            project={item}
            onEdit={() => setDialog({ mode: "edit", item })}
            onDelete={() => setPendingDelete(item)}
          />
        ))}
      </AdminListPage>

      {dialog && (
        <ProjectFormDialog
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
        title="Delete this project?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed from the public site.`
            : ""
        }
        onConfirm={confirmDelete}
      />
    </>
  );
}
