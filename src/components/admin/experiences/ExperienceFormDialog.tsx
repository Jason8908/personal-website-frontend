"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
import { BulletPointsEditor } from "@/components/admin/BulletPointsEditor";
import { TagInput } from "@/components/admin/TagInput";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isNotFound, isUnauthorized, isValidationError, messagesFor, toFieldErrors } from "@/lib/http/apiErrors";
import { MONTH_VALUE_PATTERN, monthValueToUtcIso, utcIsoToMonthValue } from "@/lib/date/month";
import { ROUTES } from "@/lib/routes";
import { experienceService } from "@/services";
import type { Experience } from "@/services/experience/types";

const SERVER_FIELDS = ["company", "position", "startDate", "endDate", "bulletPoints", "skills"] as const;

const experienceSchema = z
  .object({
    company: z.string().trim().min(1, "Company is required"),
    position: z.string().trim().min(1, "Position is required"),
    startMonth: z.string().regex(MONTH_VALUE_PATTERN, "Start month is required"),
    current: z.boolean(),
    endMonth: z.string(),
    bulletPoints: z.array(z.string()),
    skills: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    if (values.current) return;
    if (!MONTH_VALUE_PATTERN.test(values.endMonth)) {
      ctx.addIssue({ code: "custom", path: ["endMonth"], message: "End month is required" });
      return;
    }
    // "YYYY-MM" strings compare correctly as strings.
    if (values.endMonth < values.startMonth) {
      ctx.addIssue({
        code: "custom",
        path: ["endMonth"],
        message: "End month must be on or after the start month",
      });
    }
  });

type ExperienceValues = z.infer<typeof experienceSchema>;
type FieldErrors = Partial<Record<keyof ExperienceValues | (typeof SERVER_FIELDS)[number], string[]>>;

function initialValues(experience: Experience | null): ExperienceValues {
  if (!experience) {
    return {
      company: "",
      position: "",
      startMonth: "",
      current: false,
      endMonth: "",
      bulletPoints: [],
      skills: [],
    };
  }
  return {
    company: experience.company,
    position: experience.position,
    startMonth: utcIsoToMonthValue(experience.startDate),
    current: experience.endDate === null,
    endMonth: experience.endDate ? utcIsoToMonthValue(experience.endDate) : "",
    bulletPoints: experience.bulletPoints,
    skills: experience.skills,
  };
}

export function ExperienceFormDialog({
  open,
  onOpenChange,
  editing,
  suggestions,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Experience | null;
  suggestions: string[];
  onSaved: () => Promise<void>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ExperienceValues>(() => initialValues(editing));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof ExperienceValues>(key: K, value: ExperienceValues[K]) {
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const parsed = experienceSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    const { company, position, startMonth, current, endMonth, bulletPoints, skills } = parsed.data;
    const cleanBullets = bulletPoints.map((point) => point.replace(/\n/g, " ").trim()).filter(Boolean);

    setSubmitting(true);
    try {
      const response = editing
        ? await experienceService.updateExperience(editing.id, {
            company,
            position,
            startDate: monthValueToUtcIso(startMonth),
            // null reopens the role to "Present".
            endDate: current ? null : monthValueToUtcIso(endMonth),
            bulletPoints: cleanBullets,
            skills,
          })
        : await experienceService.createExperience({
            company,
            position,
            startDate: monthValueToUtcIso(startMonth),
            // On create, omitting endDate is how "Present" is expressed.
            ...(current ? {} : { endDate: monthValueToUtcIso(endMonth) }),
            bulletPoints: cleanBullets,
            skills,
          });

      if (isValidationError(response)) {
        const serverErrors = toFieldErrors(response.data, SERVER_FIELDS);
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors);
        } else {
          setFormError(response.message || "Couldn't save this experience.");
        }
        return;
      }

      // Refresh before closing so the list is never stale behind a closed dialog.
      await onSaved();
      onOpenChange(false);
      toast.success(editing ? "Experience updated" : "Experience created");
    } catch (error: unknown) {
      if (isUnauthorized(error)) {
        toast.error("Your session expired. Please sign in again.");
        router.replace(ROUTES.admin.login);
        return;
      }
      if (isNotFound(error)) {
        toast.error("That experience no longer exists.");
        await onSaved();
        onOpenChange(false);
        return;
      }
      console.error("Saving experience failed", error);
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
      title={editing ? "Edit experience" : "New experience"}
      description={
        editing ? "Update this role and what you did there." : "Add a role to your experience timeline."
      }
      submitLabel={editing ? "Save changes" : "Create experience"}
      submitting={submitting}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <Field data-invalid={fieldErrors.company?.length ? true : undefined}>
          <FieldLabel htmlFor="exp-company">Company</FieldLabel>
          <Input
            id="exp-company"
            value={values.company}
            onChange={(event) => setField("company", event.target.value)}
            disabled={submitting}
            autoFocus
            aria-invalid={fieldErrors.company?.length ? true : undefined}
            aria-describedby={fieldErrors.company?.length ? "exp-company-error" : undefined}
          />
          <FieldError id="exp-company-error" errors={messagesFor(fieldErrors.company)} />
        </Field>

        <Field data-invalid={fieldErrors.position?.length ? true : undefined}>
          <FieldLabel htmlFor="exp-position">Position</FieldLabel>
          <Input
            id="exp-position"
            value={values.position}
            onChange={(event) => setField("position", event.target.value)}
            disabled={submitting}
            aria-invalid={fieldErrors.position?.length ? true : undefined}
            aria-describedby={fieldErrors.position?.length ? "exp-position-error" : undefined}
          />
          <FieldError id="exp-position-error" errors={messagesFor(fieldErrors.position)} />
        </Field>

        <div className="grid gap-7 sm:grid-cols-2">
          <Field data-invalid={fieldErrors.startMonth?.length ? true : undefined}>
            <FieldLabel htmlFor="exp-start">Start month</FieldLabel>
            <Input
              id="exp-start"
              type="month"
              value={values.startMonth}
              onChange={(event) => setField("startMonth", event.target.value)}
              disabled={submitting}
              aria-invalid={fieldErrors.startMonth?.length ? true : undefined}
              aria-describedby={fieldErrors.startMonth?.length ? "exp-start-error" : undefined}
            />
            <FieldError id="exp-start-error" errors={messagesFor(fieldErrors.startMonth)} />
          </Field>

          <Field data-invalid={fieldErrors.endMonth?.length ? true : undefined}>
            <FieldLabel htmlFor="exp-end">End month</FieldLabel>
            <Input
              id="exp-end"
              type="month"
              value={values.endMonth}
              onChange={(event) => setField("endMonth", event.target.value)}
              disabled={submitting || values.current}
              aria-invalid={fieldErrors.endMonth?.length ? true : undefined}
              aria-describedby={fieldErrors.endMonth?.length ? "exp-end-error" : undefined}
            />
            <FieldError id="exp-end-error" errors={messagesFor(fieldErrors.endMonth)} />
          </Field>
        </div>

        <Field orientation="horizontal">
          <Checkbox
            id="exp-current"
            checked={values.current}
            // Keep endMonth in state so unchecking restores what was typed.
            onCheckedChange={(checked) => {
              setField("current", checked === true);
              // Ticking this makes endMonth optional, so drop a stale requirement error.
              setFieldErrors((current) => {
                if (!current.endMonth) return current;
                const next = { ...current };
                delete next.endMonth;
                return next;
              });
            }}
            disabled={submitting}
          />
          <FieldLabel htmlFor="exp-current" className="font-normal">
            I currently work here
          </FieldLabel>
        </Field>

        <FieldSet>
          <FieldLegend variant="label">Bullet points</FieldLegend>
          <FieldDescription>
            What you did in this role. These render as a list on the public site.
          </FieldDescription>
          <BulletPointsEditor
            value={values.bulletPoints}
            onChange={(next) => setField("bulletPoints", next)}
            disabled={submitting}
          />
        </FieldSet>

        <Field>
          <FieldLabel htmlFor="exp-skills">Skills</FieldLabel>
          <TagInput
            id="exp-skills"
            value={values.skills}
            onChange={(next) => setField("skills", next)}
            suggestions={suggestions}
            disabled={submitting}
            placeholder="e.g. TypeScript"
          />
        </Field>

        {formError && <FieldError>{formError}</FieldError>}
      </FieldGroup>
    </AdminFormDialog>
  );
}
