"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";
import { authService } from "@/services";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await authService.logout();
      router.replace(ROUTES.admin.login);
      // Deliberately not clearing `loading`: this unmounts on navigation, and
      // staying disabled prevents a second click mid-navigation.
    } catch (error: unknown) {
      // The endpoint is idempotent and unguarded, so a failure means the network
      // or a 5xx — the session may still be live. Stay put rather than sending
      // them to a login page that would bounce them straight back.
      console.error("Logout request failed", error);
      toast.error("Could not sign you out. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLogout}
      disabled={loading}
      aria-busy={loading}
      className="border-border bg-transparent hover:bg-foreground/5 hover:text-foreground dark:bg-transparent dark:hover:bg-foreground/5"
    >
      {loading && <Spinner />}
      {loading ? "Signing out…" : "Log out"}
    </Button>
  );
}
