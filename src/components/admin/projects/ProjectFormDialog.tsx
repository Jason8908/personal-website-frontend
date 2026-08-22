"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { TagInput } from "@/components/admin/TagInput";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isNotFound, isUnauthorized, isValidationError, messagesFor, toFieldErrors } from "@/lib/http/apiErrors";
import { ROUTES } from "@/lib/routes";
import { projectService } from "@/services";
import type { Project } from "@/services/project/types";

const SERVER_FIELDS = ["name", "description", "githubUrl", "websiteUrl", "imageUrl", "skills"] as const;

// The API's isURL() accepts scheme-less values, but imageUrl feeds next/image,
// which needs an absolute URL — so require the scheme here.
const optionalUrl = z.union([z.literal(""), z.url("Enter a valid URL, including https://")]);

const projectSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  githubUrl: optionalUrl,
  websiteUrl: optionalUrl,
  imageUrl: optionalUrl,
  skills: z.array(z.string()),
});

type ProjectValues = z.infer<typeof projectSchema>;
type FieldErrors = Partial<Record<keyof ProjectValues, string[]>>;

/** Blank means "clear this column" — send null, never "" (which fails isURL). */
function toNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function initialValues(project: Project | null): ProjectValues {
  return {
    name: project?.name ?? "",
    description: project?.description ?? "",
    githubUrl: project?.githubUrl ?? "",
    websiteUrl: project?.websiteUrl ?? "",
    imageUrl: project?.imageUrl ?? "",
    skills: project?.skills ?? [],
  };
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  editing,
  suggestions,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Project | null;
  suggestions: string[];
  onSaved: () => Promise<void>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProjectValues>(() => initialValues(editing));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof ProjectValues>(key: K, value: ProjectValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear this field's error as soon as it's edited, rather than leaving a
    // stale "required" message under a field the user has already filled in.
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  const previewUrl = optionalUrl.safeParse(values.imageUrl).success ? values.imageUrl.trim() : "";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const parsed = projectSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    const { name, description, githubUrl, websiteUrl, imageUrl, skills } = parsed.data;

    setSubmitting(true);
    try {
      const response = editing
        ? await projectService.updateProject(editing.id, {
            name,
            description,
            skills,
            githubUrl: toNullable(githubUrl),
            websiteUrl: toNullable(websiteUrl),
            imageUrl: toNullable(imageUrl),
          })
        : await projectService.createProject({
            name,
            description,
            skills,
            githubUrl: toNullable(githubUrl),
            websiteUrl: toNullable(websiteUrl),
            imageUrl: toNullable(imageUrl),
          });

      if (isValidationError(response)) {
        const serverErrors = toFieldErrors(response.data, SERVER_FIELDS);
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors);
        } else {
          setFormError(response.message || "Couldn't save this project.");
        }
        return;
      }

      await onSaved();
      onOpenChange(false);
      toast.success(editing ? "Project updated" : "Project created");
    } catch (error: unknown) {
      if (isUnauthorized(error)) {
        toast.error("Your session expired. Please sign in again.");
        router.replace(ROUTES.admin.login);
        return;
      }
      if (isNotFound(error)) {
        toast.error("That project no longer exists.");
        await onSaved();
        onOpenChange(false);
        return;
      }
      console.error("Saving project failed", error);
      setFormError("We couldn't reach the server. Check your connection and try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? "Edit project" : "New project"}
      description={
        editing ? "Update how this project appears publicly." : "Add a project to the public site."
      }
      submitLabel={editing ? "Save changes" : "Create project"}
      submitting={submitting}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <Field data-invalid={fieldErrors.name?.length ? true : undefined}>
          <FieldLabel htmlFor="proj-name">Name</FieldLabel>
          <Input
            id="proj-name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            disabled={submitting}
            autoFocus
            aria-invalid={fieldErrors.name?.length ? true : undefined}
            aria-describedby={fieldErrors.name?.length ? "proj-name-error" : undefined}
          />
          <FieldError id="proj-name-error" errors={messagesFor(fieldErrors.name)} />
        </Field>

        <Field data-invalid={fieldErrors.description?.length ? true : undefined}>
          <FieldLabel htmlFor="proj-description">Description</FieldLabel>
          <Textarea
            id="proj-description"
            value={values.description}
            onChange={(event) => setField("description", event.target.value)}
            disabled={submitting}
            aria-invalid={fieldErrors.description?.length ? true : undefined}
            aria-describedby={fieldErrors.description?.length ? "proj-description-error" : undefined}
          />
          <FieldError id="proj-description-error" errors={messagesFor(fieldErrors.description)} />
        </Field>

        <Field data-invalid={fieldErrors.githubUrl?.length ? true : undefined}>
          <FieldLabel htmlFor="proj-github">GitHub URL</FieldLabel>
          <Input
            id="proj-github"
            type="url"
            placeholder="https://github.com/…"
            value={values.githubUrl}
            onChange={(event) => setField("githubUrl", event.target.value)}
            disabled={submitting}
            aria-invalid={fieldErrors.githubUrl?.length ? true : undefined}
            aria-describedby={fieldErrors.githubUrl?.length ? "proj-github-error" : undefined}
          />
          <FieldError id="proj-github-error" errors={messagesFor(fieldErrors.githubUrl)} />
        </Field>

        <Field data-invalid={fieldErrors.websiteUrl?.length ? true : undefined}>
          <FieldLabel htmlFor="proj-website">Website URL</FieldLabel>
          <Input
            id="proj-website"
            type="url"
            placeholder="https://…"
            value={values.websiteUrl}
            onChange={(event) => setField("websiteUrl", event.target.value)}
            disabled={submitting}
            aria-invalid={fieldErrors.websiteUrl?.length ? true : undefined}
            aria-describedby={fieldErrors.websiteUrl?.length ? "proj-website-error" : undefined}
          />
          <FieldError id="proj-website-error" errors={messagesFor(fieldErrors.websiteUrl)} />
        </Field>

        <Field data-invalid={fieldErrors.imageUrl?.length ? true : undefined}>
          <FieldLabel htmlFor="proj-image">Image URL</FieldLabel>
          <Input
            id="proj-image"
            type="url"
            placeholder="https://…"
            value={values.imageUrl}
            onChange={(event) => setField("imageUrl", event.target.value)}
            disabled={submitting}
            aria-invalid={fieldErrors.imageUrl?.length ? true : undefined}
            aria-describedby={fieldErrors.imageUrl?.length ? "proj-image-error" : undefined}
          />
          <FieldDescription>Leave blank to remove the image.</FieldDescription>
          <FieldError id="proj-image-error" errors={messagesFor(fieldErrors.imageUrl)} />
          {previewUrl && (
            <div className="relative mt-1 aspect-video w-40 overflow-hidden rounded-md border border-border">
              <Image src={previewUrl} alt="" fill className="object-cover" sizes="160px" unoptimized />
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="proj-skills">Skills</FieldLabel>
          <TagInput
            id="proj-skills"
            value={values.skills}
            onChange={(next) => setField("skills", next)}
            suggestions={suggestions}
            disabled={submitting}
            placeholder="e.g. Next.js"
          />
        </Field>

        {formError && <FieldError>{formError}</FieldError>}
      </FieldGroup>
    </AdminFormDialog>
  );
}
