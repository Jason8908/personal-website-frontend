"use client";

import { useMemo, useState } from "react";
import { XIcon, CalendarIcon } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/date/format";
import { Spinner } from "@/components/ui/spinner";
import { educationService } from "@/services";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateEducationDialog({ open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const errors = useMemo(() => {
    return {
      school: school.trim() ? undefined : "School is required",
      degree: degree.trim() ? undefined : "Degree is required",
      fieldOfStudy: fieldOfStudy.trim() ? undefined : "Field of study is required",
      description: description.trim() ? undefined : "Description is required",
      startDate: startDate ? undefined : "Start date is required",
      endDate: endDate ? undefined : "End date is required",
      bullets: undefined, // no bullets for education display yet; keep for consistency if we later add items
    } as const;
  }, [school, degree, fieldOfStudy, description, startDate, endDate]);

  const isInvalid = useMemo(() => {
    return Boolean(
      errors.school || errors.degree || errors.fieldOfStudy || errors.description || errors.startDate || errors.endDate
    );
  }, [errors]);

  function resetForm() {
    setSchool("");
    setDegree("");
    setFieldOfStudy("");
    setDescription("");
    setStartDate(undefined);
    setEndDate(undefined);
    setShowErrors(false);
  }

  async function onSubmit() {
    setShowErrors(true);
    if (isInvalid) return;
    setLoading(true);
    try {
      await educationService.createEducation({
        school: school.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        description: description.trim(),
        startDate: startDate!,
        endDate: endDate!,
      });
      toast.success("Education entry created");
      onOpenChange(false);
      window.dispatchEvent(new Event("education:refresh"));
      resetForm();
    } catch {
      toast.error("Failed to create education entry");
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
          <DialogTitle className="text-xl font-semibold leading-tight">Create Education</DialogTitle>
          <DialogDescription>Fill out the fields below to add a new education entry.</DialogDescription>
        </DialogHeader>

        <FieldSet>
          <Field data-invalid={showErrors && !!errors.school}>
            <FieldLabel>
              <FieldTitle>School</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="State University"
                disabled={loading}
                aria-invalid={showErrors && !!errors.school}
              />
              <FieldError errors={showErrors && errors.school ? [{ message: errors.school }] : undefined} />
            </FieldContent>
          </Field>

          <Field data-invalid={showErrors && !!errors.degree}>
            <FieldLabel>
              <FieldTitle>Degree</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="B.Sc."
                disabled={loading}
                aria-invalid={showErrors && !!errors.degree}
              />
              <FieldError errors={showErrors && errors.degree ? [{ message: errors.degree }] : undefined} />
            </FieldContent>
          </Field>

          <Field data-invalid={showErrors && !!errors.fieldOfStudy}>
            <FieldLabel>
              <FieldTitle>Field of Study</FieldTitle>
            </FieldLabel>
            <FieldContent>
              <Input
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="Computer Science"
                disabled={loading}
                aria-invalid={showErrors && !!errors.fieldOfStudy}
              />
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
                disabled={loading}
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
                  <Button variant="outline" className="justify-start" disabled={loading}>
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
                  <Button variant="outline" className="justify-start" disabled={loading}>
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