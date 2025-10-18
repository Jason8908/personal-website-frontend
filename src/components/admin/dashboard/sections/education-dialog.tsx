"use client";

import { useEffect, useMemo, useState } from "react";
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
import type { Education } from "@/services";
import { formatDate } from "@/lib/date/format";
import { XIcon, CalendarIcon } from "lucide-react";
import { Field, FieldContent, FieldError, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";
import { educationService } from "@/services";
import { toast } from "sonner";

type EducationDialogProps = {
  education: Education;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EducationDialog({ education, open, onOpenChange }: EducationDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // editable state
  const [school, setSchool] = useState(education.school);
  const [degree, setDegree] = useState(education.degree);
  const [fieldOfStudy, setFieldOfStudy] = useState(education.fieldOfStudy);
  const [description, setDescription] = useState(education.description);
  const [startDate, setStartDate] = useState<Date | undefined>(
    education.startDate ? new Date(education.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    education.endDate ? new Date(education.endDate) : undefined
  );

  // baseline for diff
  const [base, setBase] = useState(() => ({
    school: education.school,
    degree: education.degree,
    fieldOfStudy: education.fieldOfStudy,
    description: education.description,
    startDate: education.startDate ? new Date(education.startDate) : undefined as Date | undefined,
    endDate: education.endDate ? new Date(education.endDate) : undefined as Date | undefined,
  }));

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      setIsSaving(false);
      setShowErrors(false);
      setSchool(education.school);
      setDegree(education.degree);
      setFieldOfStudy(education.fieldOfStudy);
      setDescription(education.description);
      setStartDate(education.startDate ? new Date(education.startDate) : undefined);
      setEndDate(education.endDate ? new Date(education.endDate) : undefined);
      setBase({
        school: education.school,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        description: education.description,
        startDate: education.startDate ? new Date(education.startDate) : undefined,
        endDate: education.endDate ? new Date(education.endDate) : undefined,
      });
    }
  }, [open, education]);

  const errors = useMemo(() => {
    return {
      school: school.trim() ? undefined : "School is required",
      degree: degree.trim() ? undefined : "Degree is required",
      fieldOfStudy: fieldOfStudy.trim() ? undefined : "Field of study is required",
      description: description.trim() ? undefined : "Description is required",
      startDate: startDate ? undefined : "Start date is required",
      endDate: endDate ? undefined : "End date is required",
    } as const;
  }, [school, degree, fieldOfStudy, description, startDate, endDate]);

  const isInvalid = useMemo(() => {
    return Boolean(
      errors.school || errors.degree || errors.fieldOfStudy || errors.description || errors.startDate || errors.endDate
    );
  }, [errors]);

  function datesEqual(a?: Date, b?: Date): boolean {
    if (!a && !b) return true;
    if (!!a !== !!b) return false;
    return (a as Date).getTime() === (b as Date).getTime();
  }

  async function onSave() {
    setShowErrors(true);
    if (isInvalid) return;
    setIsSaving(true);
    try {
      const changes: Record<string, unknown> = {};
      if (school.trim() !== base.school) changes.school = school.trim();
      if (degree.trim() !== base.degree) changes.degree = degree.trim();
      if (fieldOfStudy.trim() !== base.fieldOfStudy) changes.fieldOfStudy = fieldOfStudy.trim();
      if (description.trim() !== base.description) changes.description = description.trim();
      if (!datesEqual(startDate, base.startDate) && startDate) changes.startDate = startDate;
      if (!datesEqual(endDate, base.endDate) && endDate) changes.endDate = endDate;

      if (Object.keys(changes).length === 0) {
        toast.info("No changes to save");
        setIsSaving(false);
        return;
      }

      await educationService.updateEducation(education.id, changes as {
        school?: string;
        degree?: string;
        fieldOfStudy?: string;
        description?: string;
        startDate?: Date;
        endDate?: Date;
      });
      toast.success("Education updated");
      onOpenChange(false);
      window.dispatchEvent(new Event("education:refresh"));
      setIsEditing(false);
    } catch {
      toast.error("Failed to update education");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (isSaving) return;
        onOpenChange(o);
      }}
    >
      <DialogContent onInteractOutside={(e) => { if (isSaving) e.preventDefault(); }}>
        <div className="absolute right-3 top-3">
          <DialogClose className="h-8 w-8 p-0" aria-label="Close" disabled={isSaving}>
            <XIcon className="size-4" />
          </DialogClose>
        </div>

        {!isEditing ? (
          <>
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-semibold leading-tight">
                {education.school}
              </DialogTitle>
              <DialogDescription className="text-foreground">
                {education.degree}
                {education.fieldOfStudy ? ` • ${education.fieldOfStudy}` : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="text-sm text-muted-foreground">
                {formatDate(education.startDate, "MM/dd/yyyy", { timeZone: "local" })} - {education.endDate ? formatDate(education.endDate, "MM/dd/yyyy", { timeZone: "local" }) : "Present"}
              </div>
              {education.description ? (
                <p className="text-sm leading-6 text-foreground">{education.description}</p>
              ) : null}
            </div>
            <DialogFooter>
              <div className="flex w-full items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-semibold leading-tight">Edit Education</DialogTitle>
              <div className="text-muted-foreground text-sm">Update fields below and save.</div>
            </DialogHeader>
            <FieldSet>
              <Field data-invalid={showErrors && !!errors.school}>
                <FieldLabel>
                  <FieldTitle>School</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="State University" disabled={isSaving} aria-invalid={showErrors && !!errors.school} />
                  <FieldError errors={showErrors && errors.school ? [{ message: errors.school }] : undefined} />
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.degree}>
                <FieldLabel>
                  <FieldTitle>Degree</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="B.Sc." disabled={isSaving} aria-invalid={showErrors && !!errors.degree} />
                  <FieldError errors={showErrors && errors.degree ? [{ message: errors.degree }] : undefined} />
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.fieldOfStudy}>
                <FieldLabel>
                  <FieldTitle>Field of Study</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Input value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} placeholder="Computer Science" disabled={isSaving} aria-invalid={showErrors && !!errors.fieldOfStudy} />
                  <FieldError errors={showErrors && errors.fieldOfStudy ? [{ message: errors.fieldOfStudy }] : undefined} />
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
                    placeholder="Summary of your studies"
                    disabled={isSaving}
                    aria-invalid={showErrors && !!errors.description}
                    className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/40"
                  />
                  <FieldError errors={showErrors && errors.description ? [{ message: errors.description }] : undefined} />
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.startDate}>
                <FieldLabel>
                  <FieldTitle>Start Date</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start" disabled={isSaving}>
                        <CalendarIcon className="mr-2 size-4" />
                        {startDate ? formatDate(startDate, "MM/dd/yyyy", { timeZone: "local" }) : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar mode="single" selected={startDate} onSelect={(d) => setStartDate(d || undefined)} />
                    </PopoverContent>
                  </Popover>
                  <FieldError errors={showErrors && errors.startDate ? [{ message: errors.startDate }] : undefined} />
                </FieldContent>
              </Field>

              <Field data-invalid={showErrors && !!errors.endDate}>
                <FieldLabel>
                  <FieldTitle>End Date</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start" disabled={isSaving}>
                        <CalendarIcon className="mr-2 size-4" />
                        {endDate ? formatDate(endDate, "MM/dd/yyyy", { timeZone: "local" }) : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar mode="single" selected={endDate} onSelect={(d) => setEndDate(d || undefined)} />
                    </PopoverContent>
                  </Popover>
                  <FieldError errors={showErrors && errors.endDate ? [{ message: errors.endDate }] : undefined} />
                </FieldContent>
              </Field>
            </FieldSet>

            <DialogFooter>
              <div className="flex w-full items-center justify-end gap-2">
                <Button
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => {
                    setSchool(base.school);
                    setDegree(base.degree);
                    setFieldOfStudy(base.fieldOfStudy);
                    setDescription(base.description);
                    setStartDate(base.startDate);
                    setEndDate(base.endDate);
                    setShowErrors(false);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={onSave} disabled={isSaving}>
                  {isSaving && <Spinner className="mr-2" />} Save
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}


