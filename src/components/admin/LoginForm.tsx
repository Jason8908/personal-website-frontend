"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input, PasswordInput } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { HttpError } from "@/lib/http";
import { HTTP_STATUS_CODES } from "@/lib/http/types";
import { ROUTES } from "@/lib/routes";
import { authService, userService } from "@/services";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;
type FieldErrors = Partial<Record<keyof LoginValues, string[]>>;

type ValidationErrorData = {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
};

/**
 * The API reports validation failures with HTTP 200 and a `statusCode: 400`
 * envelope, so they resolve instead of throwing. Pull out the per-field
 * messages when they map onto a field we render.
 */
function toFieldErrors(data: unknown): FieldErrors {
  const errors = (data as ValidationErrorData | null)?.errors;
  if (!Array.isArray(errors)) return {};

  const result: FieldErrors = {};
  for (const { field, message } of errors) {
    if (field === "email" || field === "password") {
      (result[field] ??= []).push(message);
    }
  }
  return result;
}

function messagesFor(messages: string[] | undefined) {
  return messages?.map((message) => ({ message }));
}

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Someone already signed in has no use for this form. Non-blocking: the form
  // renders immediately and only gets replaced if the session turns out valid.
  useEffect(() => {
    let active = true;
    userService
      .getCurrentUser()
      .then(() => {
        if (active) router.replace(ROUTES.admin.dashboard);
      })
      .catch(() => {
        // A 401 is the expected case here — render the form.
      });
    return () => {
      active = false;
    };
  }, [router]);

  function setField<K extends keyof LoginValues>(key: K, value: LoginValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.login(parsed.data);

      // Success. Note the API answers 201, not 200.
      if (response.success && response.statusCode === HTTP_STATUS_CODES.CREATED) {
        toast.success("Signed in");
        router.replace(ROUTES.admin.dashboard);
        return;
      }

      // Server-side validation: arrived as a 200 carrying a 400 envelope.
      const serverFieldErrors = toFieldErrors(response.data);
      if (Object.keys(serverFieldErrors).length > 0) {
        setFieldErrors(serverFieldErrors);
      } else {
        setFormError(response.message || "Sign in failed. Please try again.");
      }
    } catch (error: unknown) {
      if (error instanceof HttpError && error.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        setFormError("Invalid email or password.");
      } else {
        console.error("Login request failed", error);
        setFormError("We couldn't reach the server. Check your connection and try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border-transparent p-0 md:border md:border-border md:bg-card md:p-8">
      <div className="mb-7 space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to continue.</p>
      </div>
      <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={fieldErrors.email?.length ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                disabled={submitting}
                aria-invalid={fieldErrors.email?.length ? true : undefined}
                aria-describedby={fieldErrors.email?.length ? "email-error" : undefined}
              />
              <FieldError id="email-error" errors={messagesFor(fieldErrors.email)} />
            </Field>

            <Field data-invalid={fieldErrors.password?.length ? true : undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={(event) => setField("password", event.target.value)}
                disabled={submitting}
                aria-invalid={fieldErrors.password?.length ? true : undefined}
                aria-describedby={fieldErrors.password?.length ? "password-error" : undefined}
              />
              <FieldError id="password-error" errors={messagesFor(fieldErrors.password)} />
            </Field>

            {formError && <FieldError>{formError}</FieldError>}

            <Button
              type="submit"
              className="mt-2 w-full bg-foreground text-background hover:bg-foreground/85"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting && <Spinner />}
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </FieldGroup>
      </form>
    </div>
  );
}
