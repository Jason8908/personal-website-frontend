"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { authService } from "@/services";
import { HTTP_STATUS_CODES } from "@/lib/http/types";
import { ROUTES } from "@/lib/routes";
import { HttpError } from "@/lib/http";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input, PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
  email: z
    .email({ message: "Enter a valid email address" })
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});

type FormState = {
  email: string;
  password: string;
};

function LoginForm({ className }: { className?: string }) {
  const [state, setState] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string[]>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function setField<K extends keyof FormState>(key: K) {
    return (value: string) => setState((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setErrors({});

    const parsed = schema.safeParse(state);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string[]>> = {};
      const tree = z.treeifyError(parsed.error);

      for (const [field, errs] of Object.entries(
        tree.properties?.email?.errors ??
          tree.properties?.password?.errors ??
          {}
      )) {
        fieldErrors[field as keyof FormState] = Array.isArray(errs)
          ? (errs as string[])
          : [errs as string];
      }

      setErrors(fieldErrors);
      setSubmitting(false);

      return;
    }

    try {
      const response = await authService.login({
        email: state.email,
        password: state.password
      });

      if (
        response.statusCode === HTTP_STATUS_CODES.CREATED &&
        response.success
      ) {
        toast.success("Logged in successfully");

        router.push(ROUTES.admin.dashboard);
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
          toast.error("Invalid email or password");
        } else {
          toast.error("Login failed. Please try again later");
        }
      } else {
        toast.error("Login failed. Please try again later");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card
      className={cn(
        "w-full max-w-md border-0 shadow-none md:border md:shadow-sm",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-2xl">Admin login</CardTitle>
        <CardDescription>Enter login credentials to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel asChild>
                  <Label htmlFor="email">
                    <FieldTitle>Email</FieldTitle>
                  </Label>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={state.email}
                    onChange={(e) => setField("email")(e.target.value)}
                    autoComplete="email"
                    required
                    aria-invalid={errors.email?.length ? true : undefined}
                    aria-describedby={
                      errors.email?.length ? "email-error" : undefined
                    }
                    disabled={submitting}
                  />
                  <FieldError
                    id="email-error"
                    errors={errors.email?.map((m) => ({ message: m }))}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel asChild>
                  <Label htmlFor="password">
                    <FieldTitle>Password</FieldTitle>
                  </Label>
                </FieldLabel>
                <FieldContent>
                  <PasswordInput
                    id="password"
                    placeholder="••••••••"
                    value={state.password}
                    onChange={(e) => setField("password")(e.target.value)}
                    autoComplete="current-password"
                    required
                    aria-invalid={errors.password?.length ? true : undefined}
                    aria-describedby={
                      errors.password?.length ? "password-error" : undefined
                    }
                    disabled={submitting}
                  />
                  <FieldError
                    id="password-error"
                    errors={errors.password?.map((m) => ({ message: m }))}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting && <Spinner className="size-4" />} Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { LoginForm };
