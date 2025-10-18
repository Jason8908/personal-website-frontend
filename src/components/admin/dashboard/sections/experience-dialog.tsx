"use client";

import { useEffect, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Field, FieldContent, FieldError, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/date/format";
import type { Experience } from "@/services";
import { experienceService } from "@/services";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { CalendarIcon, XIcon } from "lucide-react";

type ExperienceDialogProps = {
  experience: Experience;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ExperienceDialog({ experience, open, onOpenChange }: ExperienceDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Local editable state
  const [company, setCompany] = useState(experience.company);
  const [position, setPosition] = useState(experience.position);
  const [startDate, setStartDate] = useState<Date | undefined>(
    experience.startDate ? new Date(experience.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    experience.endDate ? new Date(experience.endDate) : undefined
  );
  const [bulletInput, setBulletInput] = useState("");
  const [bullets, setBullets] = useState<string[]>(experience.bulletPoints || []);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(experience.skills || []);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setCompany(experience.company);
      setPosition(experience.position);
      setStartDate(experience.startDate ? new Date(experience.startDate) : undefined);
      setEndDate(experience.endDate ? new Date(experience.endDate) : undefined);
      setBullets(experience.bulletPoints || []);
      setBulletInput("");
      setSkills(experience.skills || []);
      setSkillInput("");
      setIsSaving(false);
      setShowErrors(false);
    }
  }, [open, experience]);

  function resetFromExperience() {
    setCompany(experience.company);
    setPosition(experience.position);
    setStartDate(experience.startDate ? new Date(experience.startDate) : undefined);
    setEndDate(experience.endDate ? new Date(experience.endDate) : undefined);
    setBullets(experience.bulletPoints || []);
    setBulletInput("");
    setSkills(experience.skills || []);
    setSkillInput("");
  }

  function addBullet() {
    const v = bulletInput.trim();
    if (!v) return;
    setBullets((prev) => [...prev, v]);
    setBulletInput("");
  }

  function removeBullet(idx: number) {
    setBullets((prev) => prev.filter((_, i) => i !== idx));
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

  // Helpers for change tracking
  function datesEqual(a?: Date, b?: Date): boolean {
    if (!a && !b) return true;
    if (!!a !== !!b) return false;
    return (a as Date).getTime() === (b as Date).getTime();
  }

  function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Baseline values captured on entering edit mode
  const [base, setBase] = useState(() => ({
    company: experience.company,
    position: experience.position,
    startDate: experience.startDate ? new Date(experience.startDate) : undefined as Date | undefined,
    endDate: experience.endDate ? new Date(experience.endDate) : undefined as Date | undefined,
    bullets: experience.bulletPoints || [] as string[],
    skills: experience.skills || [] as string[],
  }));

  // Update baseline when experience changes (and not editing)
  useEffect(() => {
    if (!isEditing) {
      setBase({
        company: experience.company,
        position: experience.position,
        startDate: experience.startDate ? new Date(experience.startDate) : undefined,
        endDate: experience.endDate ? new Date(experience.endDate) : undefined,
        bullets: experience.bulletPoints || [],
        skills: experience.skills || [],
      });
    }
  }, [experience, isEditing]);

  const errors = {
    company: company.trim() ? undefined : "Company is required",
    position: position.trim() ? undefined : "Position is required",
    startDate: startDate ? undefined : "Start date is required",
    bullets: bullets.length > 0 ? undefined : "Add at least one bullet point",
    skills: skills.length > 0 ? undefined : "Add at least one skill",
  } as const;
  const isInvalid = Boolean(
    errors.company || errors.position || errors.startDate || errors.bullets || errors.skills
  );

  async function onSave() {
    setShowErrors(true);
    if (isInvalid) return;
    setIsSaving(true);
    try {
      const changes: Record<string, unknown> = {};
      if (company.trim() !== base.company) changes.company = company.trim();
      if (position.trim() !== base.position) changes.position = position.trim();
      if (!datesEqual(startDate, base.startDate) && startDate) changes.startDate = startDate;
      if (!datesEqual(endDate, base.endDate)) {
        if (!endDate && base.endDate) changes.endDate = null;
        else if (endDate) changes.endDate = endDate;
      }
      if (!arraysEqual(bullets, base.bullets)) changes.bulletPoints = bullets;
      if (!arraysEqual(skills, base.skills)) changes.skills = skills;

      if (Object.keys(changes).length === 0) {
        toast.info("No changes to save");
        setIsSaving(false);
        return;
      }

      await experienceService.updateExperience(experience.id, changes as unknown as {
        company?: string;
        position?: string;
        bulletPoints?: string[];
        skills?: string[];
        startDate?: Date;
        endDate?: Date | null;
      });
      toast.success("Experience updated");
      onOpenChange(false);
      window.dispatchEvent(new Event("experiences:refresh"));
      setIsEditing(false);
    } catch {
      toast.error("Failed to update experience");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDeleteConfirm() {
    setIsDeleting(true);
    try {
      await experienceService.deleteExperience(experience.id);
      toast.success("Experience deleted");
      setConfirmOpen(false);
      onOpenChange(false);
      window.dispatchEvent(new Event("experiences:refresh"));
    } catch {
      toast.error("Failed to delete experience");
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
                <AlertDialog open={confirmOpen} onOpenChange={(o) => { if (!(isSaving || isDeleting)) setConfirmOpen(o); }}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isSaving || isDeleting}>
                      {isDeleting && <Spinner className="mr-2" />} Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete experience?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Are you sure you want to delete this experience?
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
              <DialogTitle className="text-xl font-semibold leading-tight">
                Edit Experience
              </DialogTitle>
              <div className="text-muted-foreground text-sm">Update fields below and save.</div>
            </DialogHeader>

            <FieldSet>
              <Field data-invalid={showErrors && !!errors.company}>
                <FieldLabel>
                  <FieldTitle>Company</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" disabled={isSaving || isDeleting} aria-invalid={showErrors && !!errors.company} />
                  <FieldError errors={showErrors && errors.company ? [{ message: errors.company }] : undefined} />
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.position}>
                <FieldLabel>
                  <FieldTitle>Position</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Senior Engineer" disabled={isSaving || isDeleting} aria-invalid={showErrors && !!errors.position} />
                  <FieldError errors={showErrors && errors.position ? [{ message: errors.position }] : undefined} />
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.startDate}>
                <FieldLabel>
                  <FieldTitle>Start Date</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start" aria-invalid={showErrors && !!errors.startDate}>
                          <CalendarIcon className="mr-2 size-4" />
                          {startDate ? formatDate(startDate, "MM/dd/yyyy", { timeZone: "local" }) : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Calendar mode="single" selected={startDate} onSelect={(d) => setStartDate(d || undefined)} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FieldError errors={showErrors && errors.startDate ? [{ message: errors.startDate }] : undefined} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <FieldTitle>End Date (optional)</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start">
                          <CalendarIcon className="mr-2 size-4" />
                          {endDate ? formatDate(endDate, "MM/dd/yyyy", { timeZone: "local" }) : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Calendar mode="single" selected={endDate} onSelect={(d) => setEndDate(d || undefined)} />
                      </PopoverContent>
                    </Popover>
                    {endDate && (
                      <Button variant="ghost" onClick={() => setEndDate(undefined)}>Clear</Button>
                    )}
                  </div>
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.bullets}>
                <FieldLabel>
                  <FieldTitle>Bullet Points</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <div className="flex items-center gap-2">
                    <Input
                      value={bulletInput}
                      onChange={(e) => setBulletInput(e.target.value)}
                      placeholder="What did you accomplish?"
                      aria-invalid={showErrors && !!errors.bullets}
                    />
                    <Button type="button" onClick={addBullet} disabled={!bulletInput.trim()}>
                      Add
                    </Button>
                  </div>
                  {bullets.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-2">
                      {bullets.map((bp, idx) => (
                        <li key={`${bp}-${idx}`} className="flex items-start justify-between gap-2">
                          <span className="text-sm leading-6">{bp}</span>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeBullet(idx)} aria-label="Remove bullet point">
                            <XIcon className="size-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <FieldError errors={showErrors && errors.bullets ? [{ message: errors.bullets }] : undefined} />
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
                      aria-invalid={showErrors && !!errors.skills}
                    />
                    <Button type="button" onClick={addSkill} disabled={!skillInput.trim()}>
                      Add
                    </Button>
                  </div>
                  {skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span key={`${skill}-${idx}`} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs">
                          {skill}
                          <button type="button" onClick={() => removeSkill(idx)} aria-label="Remove skill" className="text-muted-foreground hover:text-foreground">
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
                <Button variant="outline" disabled={isSaving} onClick={() => { resetFromExperience(); setShowErrors(false); setIsEditing(false); }}>Cancel</Button>
                <Button onClick={onSave} disabled={isSaving}>
                  {isSaving && <Spinner className="mr-2" />} Save
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


