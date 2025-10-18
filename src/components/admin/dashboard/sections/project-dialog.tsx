"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Field, FieldContent, FieldError, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { projectService } from "@/services";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ProjectDialogProps = {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProjectDialog({ project, open, onOpenChange }: ProjectDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Editable state
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [githubUrl, setGithubUrl] = useState<string | null>(project.githubUrl);
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(project.websiteUrl);
  const [imageUrl, setImageUrl] = useState<string | null>(project.imageUrl);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(project.skills || []);

  // Baseline for change tracking
  const [base, setBase] = useState(() => ({
    name: project.name,
    description: project.description,
    githubUrl: project.githubUrl,
    websiteUrl: project.websiteUrl,
    imageUrl: project.imageUrl,
    skills: project.skills || [],
  }));

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setIsSaving(false);
      setShowErrors(false);
      // reset to project when closing
      setName(project.name);
      setDescription(project.description);
      setGithubUrl(project.githubUrl);
      setWebsiteUrl(project.websiteUrl);
      setImageUrl(project.imageUrl);
      setSkills(project.skills || []);
      setSkillInput("");
      setBase({
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        websiteUrl: project.websiteUrl,
        imageUrl: project.imageUrl,
        skills: project.skills || [],
      });
    }
  }, [open, project]);

  const errors = useMemo(() => {
    return {
      name: name.trim() ? undefined : "Name is required",
      description: description.trim() ? undefined : "Description is required",
      skills: skills.length > 0 ? undefined : "Add at least one skill",
    } as const;
  }, [name, description, skills]);

  const isInvalid = useMemo(() => {
    return Boolean(errors.name || errors.description || errors.skills);
  }, [errors]);

  function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function addSkill() {
    const v = skillInput.trim();
    if (!v) return;
    setSkills((prev) => [...prev, v]);
    setSkillInput("");
  }

  function removeSkill(idx: number) {
    setSkills((prev) => prev.filter((_, i) => i !== idx));
  }

  async function onSave() {
    setShowErrors(true);
    if (isInvalid) return;
    setIsSaving(true);
    try {
      const changes: Record<string, unknown> = {};
      if (name.trim() !== base.name) changes.name = name.trim();
      if (description.trim() !== base.description) changes.description = description.trim();
      if ((githubUrl || null) !== (base.githubUrl || null)) changes.githubUrl = githubUrl || null;
      if ((websiteUrl || null) !== (base.websiteUrl || null)) changes.websiteUrl = websiteUrl || null;
      if ((imageUrl || null) !== (base.imageUrl || null)) changes.imageUrl = imageUrl || null;
      if (!arraysEqual(skills, base.skills)) changes.skills = skills;

      if (Object.keys(changes).length === 0) {
        toast.info("No changes to save");
        setIsSaving(false);
        return;
      }

      await projectService.updateProject(project.id, changes as {
        name?: string;
        description?: string;
        skills?: string[];
        githubUrl?: string | null;
        websiteUrl?: string | null;
        imageUrl?: string | null;
      });
      toast.success("Project updated");
      onOpenChange(false);
      window.dispatchEvent(new Event("projects:refresh"));
      setIsEditing(false);
    } catch {
      toast.error("Failed to update project");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDeleteConfirm() {
    setIsDeleting(true);
    try {
      await projectService.deleteProject(project.id);
      toast.success("Project deleted");
      setConfirmOpen(false);
      onOpenChange(false);
      window.dispatchEvent(new Event("projects:refresh"));
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (isSaving || isDeleting) return;
        onOpenChange(o);
      }}
    >
      <DialogContent onInteractOutside={(e) => { if (isSaving || isDeleting) e.preventDefault(); }}>
        <div className="absolute right-3 top-3">
          <DialogClose className="h-8 w-8 p-0" aria-label="Close" disabled={isSaving || isDeleting}>
            <XIcon className="size-4" />
          </DialogClose>
        </div>

        {!isEditing ? (
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
                <AlertDialog open={confirmOpen} onOpenChange={(o) => { if (!(isSaving || isDeleting)) setConfirmOpen(o); }}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isSaving || isDeleting}>
                      {isDeleting && <Spinner className="mr-2" />} Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete project?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Are you sure you want to delete this project?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={onDeleteConfirm} disabled={isDeleting}>
                          {isDeleting && <Spinner className="mr-2" />} Delete
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" onClick={() => setIsEditing(true)} disabled={isSaving || isDeleting}>Edit</Button>
              </div>
            </DialogFooter>
          </div>
        ) : (
          <div className="grid gap-6">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-semibold leading-tight">Edit Project</DialogTitle>
              <div className="text-muted-foreground text-sm">Update fields below and save.</div>
            </DialogHeader>

            <FieldSet>
              <Field data-invalid={showErrors && !!errors.name}>
                <FieldLabel>
                  <FieldTitle>Name</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Project" disabled={isSaving} aria-invalid={showErrors && !!errors.name} />
                  <FieldError errors={showErrors && errors.name ? [{ message: errors.name }] : undefined} />
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.description}>
                <FieldLabel>
                  <FieldTitle>Description</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your project"
                    disabled={isSaving}
                    aria-invalid={showErrors && !!errors.description}
                    className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/40"
                  />
                  <FieldError errors={showErrors && errors.description ? [{ message: errors.description }] : undefined} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <FieldTitle>GitHub URL (optional)</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={githubUrl ?? ""} onChange={(e) => setGithubUrl(e.target.value || "") } placeholder="https://github.com/username/repo" disabled={isSaving} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <FieldTitle>Website URL (optional)</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={websiteUrl ?? ""} onChange={(e) => setWebsiteUrl(e.target.value || "") } placeholder="https://example.com" disabled={isSaving} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <FieldTitle>Image URL (optional)</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={imageUrl ?? ""} onChange={(e) => setImageUrl(e.target.value || "") } placeholder="https://example.com/cover.jpg" disabled={isSaving} />
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.skills}>
                <FieldLabel>
                  <FieldTitle>Skills</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-2">
                    <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g. TypeScript" disabled={isSaving} aria-invalid={showErrors && !!errors.skills} />
                    <Button type="button" onClick={addSkill} disabled={isSaving || !skillInput.trim()}>Add</Button>
                  </div>
                  {skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span key={`${skill}-${idx}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
                          {skill}
                          <button type="button" onClick={() => removeSkill(idx)} disabled={isSaving} aria-label="Remove skill" className="text-muted-foreground hover:text-foreground">
                            <XIcon className="size-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <FieldError errors={showErrors && errors.skills ? [{ message: errors.skills }] : undefined} />
                </FieldContent>
              </Field>
            </FieldSet>

            <DialogFooter>
              <div className="flex w-full items-center justify-end gap-2">
                <Button variant="outline" disabled={isSaving} onClick={() => { setName(base.name); setDescription(base.description); setGithubUrl(base.githubUrl); setWebsiteUrl(base.websiteUrl); setImageUrl(base.imageUrl); setSkills(base.skills); setSkillInput(""); setShowErrors(false); setIsEditing(false); }}>Cancel</Button>
                <Button onClick={onSave} disabled={isSaving}>{isSaving && <Spinner className="mr-2" />} Save</Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


