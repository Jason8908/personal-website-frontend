import { HttpError } from "@/lib/http/httpClient";
import { HTTP_STATUS_CODES } from "@/lib/http/types";
import type { ApiResponse } from "@/lib/http/types";

type ValidationErrorData = {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
};

/**
 * The API reports validation failures with HTTP 200 and a `statusCode: 400`
 * envelope, so they resolve through HttpClient instead of throwing. Every form
 * has to check for this explicitly before treating a response as success.
 */
export function isValidationError(response: ApiResponse<unknown>): boolean {
  return !response.success && response.statusCode === HTTP_STATUS_CODES.BAD_REQUEST;
}

/**
 * Pull per-field messages out of a validation envelope, keeping only fields the
 * caller actually renders. Anything unrecognised is dropped here so the caller
 * can fall back to a form-level error rather than silently losing the message.
 */
export function toFieldErrors<K extends string>(
  data: unknown,
  fields: readonly K[]
): Partial<Record<K, string[]>> {
  const errors = (data as ValidationErrorData | null)?.errors;
  if (!Array.isArray(errors)) return {};

  const result: Partial<Record<K, string[]>> = {};
  for (const { field, message } of errors) {
    const known = fields.find((candidate) => candidate === field);
    if (known) (result[known] ??= []).push(message);
  }
  return result;
}

export function isUnauthorized(error: unknown): error is HttpError {
  return error instanceof HttpError && error.status === HTTP_STATUS_CODES.UNAUTHORIZED;
}

export function isNotFound(error: unknown): error is HttpError {
  return error instanceof HttpError && error.status === HTTP_STATUS_CODES.NOT_FOUND;
}

/** Adapts a plain string[] into the shape FieldError expects. */
export function messagesFor(messages: string[] | undefined) {
  return messages?.map((message) => ({ message }));
}
