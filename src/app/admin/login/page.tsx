import Link from "next/link";

import { LoginForm } from "@/components/admin/LoginForm";
import { ROUTES } from "@/lib/routes";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      <Link
        href={ROUTES.home}
        className="text-4xl font-bold tracking-tight transition-colors hover:text-foreground/70"
      >
        JS
      </Link>
      <LoginForm />
    </main>
  );
}
