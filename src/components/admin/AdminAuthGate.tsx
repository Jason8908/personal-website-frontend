"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { HttpError } from "@/lib/http";
import { HTTP_STATUS_CODES } from "@/lib/http/types";
import { ROUTES } from "@/lib/routes";
import { userService, type User } from "@/services";

type Status = "checking" | "ready" | "error";

const AdminUserContext = createContext<User | null>(null);

/** Read the signed-in admin. Only valid inside <AdminAuthGate>. */
export function useAdminUser(): User {
  const user = useContext(AdminUserContext);
  if (!user) throw new Error("useAdminUser must be used within <AdminAuthGate>");
  return user;
}

/**
 * Authoritative auth check for the admin area.
 *
 * The API's session cookie is HttpOnly and signed, so the only way to know
 * whether a session is real is to ask the API. Middleware handles the cheap
 * "no cookie at all" case; this handles expired and invalid ones.
 */
export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [user, setUser] = useState<User | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus("checking");

    userService
      .getCurrentUser()
      .then((response) => {
        if (!active) return;
        if (!response.success || !response.data) {
          setStatus("error");
          return;
        }
        setUser(response.data);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (!active) return;

        if (error instanceof HttpError && error.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
          // Hold on "checking" so the spinner stays up until the navigation
          // lands. Switching to another state first would flash an error screen.
          router.replace(ROUTES.admin.login);
          return;
        }

        // Network failure or a 5xx. The session may well be fine, so offer a
        // retry rather than signing the user out over a transient problem.
        console.error("Failed to verify admin session", error);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [router, attempt]);

  if (status === "ready" && user) {
    return <AdminUserContext.Provider value={user}>{children}</AdminUserContext.Provider>;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t verify your session. Check your connection and try again.
        </p>
        <Button
          variant="outline"
          onClick={() => setAttempt((n) => n + 1)}
          className="border-border bg-transparent hover:bg-foreground/5 hover:text-foreground dark:bg-transparent dark:hover:bg-foreground/5"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  );
}
