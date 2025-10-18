"use client";

import { useMemo, useState } from "react";
import { XIcon, PlusIcon, CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/date/format";
import { experienceService } from "@/services";

type CreateExperienceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateExperienceDialog({ open, onOpenChange }: CreateExperienceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [bulletInput, setBulletInput] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const errors = useMemo(() => {
    return {
      company: company.trim() ? undefined : "Company is required",
      position: position.trim() ? undefined : "Position is required",
      startDate: startDate ? undefined : "Start date is required",
      bullets: bullets.length > 0 ? undefined : "Add at least one bullet point",
      skills: skills.length > 0 ? undefined : "Add at least one skill",
    } as const;
  }, [company, position, startDate, bullets, skills]);

  const isInvalid = useMemo(() => {
    return Boolean(
      errors.company || errors.position || errors.startDate || errors.bullets || errors.skills
    );
  }, [errors]);

  function resetForm() {
    setCompany("");
    setPosition("");
    setStartDate(undefined);
    setEndDate(undefined);
    setBullets([]);
    setBulletInput("");
    setSkills([]);
    setSkillInput("");
    setShowErrors(false);
  }

  async function onSubmit() {
    setShowErrors(true);
    if (isInvalid) return;
    setLoading(true);
    try {
      await experienceService.createExperience({
        company: company.trim(),
        position: position.trim(),
        bulletPoints: bullets,
        skills,
        startDate: startDate!,
        endDate: endDate,
      });
      onOpenChange(false);
      window.dispatchEvent(new Event("experiences:refresh"));
    } catch {
      toast.error("Failed to create experience");
    } finally {
      setLoading(false);
    }
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

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (loading) return;
        onOpenChange(o);
        if (o) {
          setShowErrors(false);
        } else {
          // Reset all fields when closing so next open starts clean
          resetForm();
        }
      }}
    >
      <DialogContent onInteractOutside={(e) => { if (loading) e.preventDefault(); }}>
        <div className="absolute right-3 top-3">
          <DialogClose className="h-8 w-8 p-0" aria-label="Close" disabled={loading}>
            <XIcon className="size-4" />
          </DialogClose>
        </div>

        <DialogHeader>
          <DialogTitle>Create Experience</DialogTitle>
          <DialogDescription>
            Fill out the fields below to add a new experience.
          </DialogDescription>
        </DialogHeader>

        <FieldSet>
          <Field data-invalid={showErrors && !!errors.company}>
            <FieldLabel>
              <FieldTitle>Company</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                disabled={loading}
                aria-invalid={showErrors && !!errors.company}
              />
              <FieldError errors={showErrors && errors.company ? [{ message: errors.company }] : undefined} />
            </FieldContent>
          </Field>

          <Field data-invalid={showErrors && !!errors.position}>
            <FieldLabel>
              <FieldTitle>Position</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Senior Engineer"
                disabled={loading}
                aria-invalid={showErrors && !!errors.position}
              />
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
                    <Button variant="outline" className="justify-start" disabled={loading}>
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
                    <Button variant="outline" className="justify-start" disabled={loading}>
                      <CalendarIcon className="mr-2 size-4" />
                      {endDate ? formatDate(endDate, "MM/dd/yyyy", { timeZone: "local" }) : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar mode="single" selected={endDate} onSelect={(d) => setEndDate(d || undefined)} />
                  </PopoverContent>
                </Popover>
                {endDate && (
                  <Button variant="ghost" onClick={() => setEndDate(undefined)} disabled={loading}>
                    Clear
                  </Button>
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
                  disabled={loading}
                  aria-invalid={showErrors && !!errors.bullets}
                />
                <Button type="button" onClick={addBullet} disabled={loading || !bulletInput.trim()}>
                  <PlusIcon className="mr-1 size-4" /> Add
                </Button>
              </div>
              {bullets.length > 0 && (
                <ul className="mt-2 flex flex-col gap-2">
                  {bullets.map((bp, idx) => (
                    <li key={`${bp}-${idx}`} className="flex items-start justify-between gap-2">
                      <span className="text-sm leading-6">{bp}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBullet(idx)}
                        disabled={loading}
                        aria-label="Remove bullet point"
                      >
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


