"use client";

import { useMemo, useState } from "react";
import { XIcon, PlusIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { projectService } from "@/services";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateProjectDialog({ open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

  function resetForm() {
    setName("");
    setDescription("");
    setSkillInput("");
    setSkills([]);
    setGithubUrl("");
    setWebsiteUrl("");
    setImageUrl("");
    setShowErrors(false);
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

  async function onSubmit() {
    setShowErrors(true);
    if (isInvalid) return;
    setLoading(true);
    try {
      await projectService.createProject({
        name: name.trim(),
        description: description.trim(),
        skills,
        githubUrl: githubUrl.trim() || undefined,
        websiteUrl: websiteUrl.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      });
      toast.success("Project created");
      onOpenChange(false);
      window.dispatchEvent(new Event("projects:refresh"));
      resetForm();
    } catch {
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!loading) {
          onOpenChange(o);
          if (!o) resetForm();
        }
      }}
    >
      <DialogContent onInteractOutside={(e) => { if (loading) e.preventDefault(); }}>
        <div className="absolute right-3 top-3">
          <DialogClose className="h-8 w-8 p-0" aria-label="Close" disabled={loading}>
            <XIcon className="size-4" />
          </DialogClose>
        </div>

        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold leading-tight">Create Project</DialogTitle>
          <DialogDescription>Fill out the fields below to add a new project.</DialogDescription>
        </DialogHeader>

        <FieldSet>
          <Field data-invalid={showErrors && !!errors.name}>
            <FieldLabel>
              <FieldTitle>Name</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Project"
                disabled={loading}
                aria-invalid={showErrors && !!errors.name}
              />
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
                disabled={loading}
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
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                disabled={loading}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Website URL (optional)</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={loading}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Image URL (optional)</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/cover.jpg"
                disabled={loading}
              />
            </FieldContent>
          </Field>

          <Field data-invalid={showErrors && !!errors.skills}>
            <FieldLabel>
              <FieldTitle>Skills</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g. TypeScript"
                  disabled={loading}
                  aria-invalid={showErrors && !!errors.skills}
                />
                <Button type="button" onClick={addSkill} disabled={loading || !skillInput.trim()}>
                  <PlusIcon className="mr-1 size-4" /> Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={`${skill}-${idx}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        disabled={loading}
                        aria-label="Remove skill"
                        className="text-muted-foreground hover:text-foreground"
                      >
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
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={loading}>
            {loading && <Spinner className="mr-2" />} Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


