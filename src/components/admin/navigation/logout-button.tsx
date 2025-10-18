"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/routes";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    try {
      setLoading(true);
      await authService.logout();
      router.replace(ROUTES.admin.login);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={onLogout} disabled={loading}>
      {loading && <Spinner className="mr-2" />}
      Logout
    </Button>
  );
}