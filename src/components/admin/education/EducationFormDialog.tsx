"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { AdminFormDialog } from "@/components/admin/AdminFormDialog";
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
import { MONTH_VALUE_PATTERN, monthValueToUtcIso, utcIsoToMonthValue } from "@/lib/date/month";
import { ROUTES } from "@/lib/routes";
import { educationService } from "@/services";
import type { Education } from "@/services/education/types";

const SERVER_FIELDS = ["school", "degree", "fieldOfStudy", "description", "startDate", "endDate"] as const;

const educationSchema = z
  .object({
    school: z.string().trim().min(1, "School is required"),
    degree: z.string().trim().min(1, "Degree is required"),
    fieldOfStudy: z.string().trim().min(1, "Field of study is required"),
    description: z.string().trim().min(1, "Description is required"),
    startMonth: z.string().regex(MONTH_VALUE_PATTERN, "Start month is required"),
    // The API requires a non-null endDate, so there is no "present" option here.
    endMonth: z.string().regex(MONTH_VALUE_PATTERN, "End month is required"),
  })
  .superRefine((values, ctx) => {
    if (values.endMonth < values.startMonth) {
      ctx.addIssue({
        code: "custom",
        path: ["endMonth"],
        message: "End month must be on or after the start month",
      });
    }
  });

type EducationValues = z.infer<typeof educationSchema>;
type FieldErrors = Partial<Record<keyof EducationValues | (typeof SERVER_FIELDS)[number], string[]>>;

function initialValues(education: Education | null): EducationValues {
  return {
    school: education?.school ?? "",
    degree: education?.degree ?? "",
    fieldOfStudy: education?.fieldOfStudy ?? "",
    description: education?.description ?? "",
    startMonth: education ? utcIsoToMonthValue(education.startDate) : "",
    endMonth: education ? utcIsoToMonthValue(education.endDate) : "",
  };
}

export function EducationFormDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Education | null;
  onSaved: () => Promise<void>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<EducationValues>(() => initialValues(editing));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof EducationValues>(key: K, value: EducationValues[K]) {
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

    const parsed = educationSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    const { school, degree, fieldOfStudy, description, startMonth, endMonth } = parsed.data;
    const payload = {
      school,
      degree,
      fieldOfStudy,
      description,
      startDate: monthValueToUtcIso(startMonth),
      endDate: monthValueToUtcIso(endMonth),
    };

    setSubmitting(true);
    try {
      const response = editing
        ? await educationService.updateEducation(editing.id, payload)
        : await educationService.createEducation(payload);

      if (isValidationError(response)) {
        const serverErrors = toFieldErrors(response.data, SERVER_FIELDS);
        if (Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors);
        } else {
          setFormError(response.message || "Couldn't save this education entry.");
        }
        return;
      }

      await onSaved();
      onOpenChange(false);
      toast.success(editing ? "Education updated" : "Education created");
    } catch (error: unknown) {
      if (isUnauthorized(error)) {
        toast.error("Your session expired. Please sign in again.");
        router.replace(ROUTES.admin.login);
        return;
      }
      if (isNotFound(error)) {
        toast.error("That education entry no longer exists.");
        await onSaved();
        onOpenChange(false);
        return;
      }
      console.error("Saving education failed", error);
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
      title={editing ? "Edit education" : "New education"}
      description={
        editing ? "Update this education entry." : "Add a school to your education history."
      }
      submitLabel={editing ? "Save changes" : "Create education"}
      submitting={submitting}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <Field data-invalid={fieldErrors.school?.length ? true : undefined}>
          <FieldLabel htmlFor="edu-school">School</FieldLabel>
          <Input
            id="edu-school"
            value={values.school}
            onChange={(event) => setField("school", event.target.value)}
            disabled={submitting}
            autoFocus
            aria-invalid={fieldErrors.school?.length ? true : undefined}
            aria-describedby={fieldErrors.school?.length ? "edu-school-error" : undefined}
          />
          <FieldError id="edu-school-error" errors={messagesFor(fieldErrors.school)} />
        </Field>

        <div className="grid gap-7 sm:grid-cols-2">
          <Field data-invalid={fieldErrors.degree?.length ? true : undefined}>
            <FieldLabel htmlFor="edu-degree">Degree</FieldLabel>
            <Input
              id="edu-degree"
              value={values.degree}
              onChange={(event) => setField("degree", event.target.value)}
              disabled={submitting}
              aria-invalid={fieldErrors.degree?.length ? true : undefined}
              aria-describedby={fieldErrors.degree?.length ? "edu-degree-error" : undefined}
            />
            <FieldError id="edu-degree-error" errors={messagesFor(fieldErrors.degree)} />
          </Field>

          <Field data-invalid={fieldErrors.fieldOfStudy?.length ? true : undefined}>
            <FieldLabel htmlFor="edu-field">Field of study</FieldLabel>
            <Input
              id="edu-field"
              value={values.fieldOfStudy}
              onChange={(event) => setField("fieldOfStudy", event.target.value)}
              disabled={submitting}
              aria-invalid={fieldErrors.fieldOfStudy?.length ? true : undefined}
              aria-describedby={fieldErrors.fieldOfStudy?.length ? "edu-field-error" : undefined}
            />
            <FieldError id="edu-field-error" errors={messagesFor(fieldErrors.fieldOfStudy)} />
          </Field>
        </div>

        <div className="grid gap-7 sm:grid-cols-2">
          <Field data-invalid={fieldErrors.startMonth?.length ? true : undefined}>
            <FieldLabel htmlFor="edu-start">Start month</FieldLabel>
            <Input
              id="edu-start"
              type="month"
              value={values.startMonth}
              onChange={(event) => setField("startMonth", event.target.value)}
              disabled={submitting}
              aria-invalid={fieldErrors.startMonth?.length ? true : undefined}
              aria-describedby={fieldErrors.startMonth?.length ? "edu-start-error" : undefined}
            />
            <FieldError id="edu-start-error" errors={messagesFor(fieldErrors.startMonth)} />
          </Field>

          <Field data-invalid={fieldErrors.endMonth?.length ? true : undefined}>
            <FieldLabel htmlFor="edu-end">End month</FieldLabel>
            <Input
              id="edu-end"
              type="month"
              value={values.endMonth}
              onChange={(event) => setField("endMonth", event.target.value)}
              disabled={submitting}
              aria-invalid={fieldErrors.endMonth?.length ? true : undefined}
              aria-describedby={
                fieldErrors.endMonth?.length ? "edu-end-error" : "edu-end-description"
              }
            />
            <FieldDescription id="edu-end-description">
              Graduation or expected graduation month.
            </FieldDescription>
            <FieldError id="edu-end-error" errors={messagesFor(fieldErrors.endMonth)} />
          </Field>
        </div>

        <Field data-invalid={fieldErrors.description?.length ? true : undefined}>
          <FieldLabel htmlFor="edu-description">Description</FieldLabel>
          <Textarea
            id="edu-description"
            value={values.description}
            onChange={(event) => setField("description", event.target.value)}
            disabled={submitting}
            aria-invalid={fieldErrors.description?.length ? true : undefined}
            aria-describedby={fieldErrors.description?.length ? "edu-description-error" : undefined}
          />
          <FieldError id="edu-description-error" errors={messagesFor(fieldErrors.description)} />
        </Field>

        {formError && <FieldError>{formError}</FieldError>}
      </FieldGroup>
    </AdminFormDialog>
  );
}
