"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services";
import { ROUTES } from "@/lib/routes";
import { Spinner } from "@/components/ui/spinner";
import type { User } from "@/services";
import { HttpError } from "@/lib/http/httpClient";

type RequireAuthProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function RequireAuth({ children, redirectTo = ROUTES.admin.login }: RequireAuthProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await userService.getCurrentUser();
        if (!isMounted) return;
        setCurrentUser(res.data);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        setLoading(false);
        if (err instanceof HttpError && err.status === 401) {
          router.replace(redirectTo);
          return;
        }
        // For other errors, also route to login as a safe default.
        router.replace(redirectTo);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [redirectTo, router]);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!currentUser) return null;
  return <>{children}</>;
}


